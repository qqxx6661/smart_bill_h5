// Main application class
class App {
    constructor() {
        this.selectedUsers = [];
        this.selectedPayer = null;
        this.selectedSplitUsers = [];
        this.currentBookId = null;
        this.currentExpenseId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        // Initialize router will handle the initial page load
    }

    // Bind event listeners
    bindEvents() {
        // Home page events
        const createBookBtn = document.getElementById('createBookBtn');
        const manageUsersBtn = document.getElementById('manageUsersBtn');

        if (createBookBtn) {
            createBookBtn.addEventListener('click', () => {
                router.navigate('create-book');
            });
        }

        if (manageUsersBtn) {
            manageUsersBtn.addEventListener('click', () => {
                router.navigate('users');
            });
        }

        // User management events
        const addUserBtn = document.getElementById('addUserBtn');
        if (addUserBtn) {
            addUserBtn.addEventListener('click', () => {
                router.navigate('create-user');
            });
        }

        // Forms
        this.bindFormEvents();
    }

    // Bind form events
    bindFormEvents() {
        // Create user form
        const createUserForm = document.getElementById('createUserForm');
        if (createUserForm) {
            createUserForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCreateUser(e);
            });
        }

        const cancelUserBtn = document.getElementById('cancelUserBtn');
        if (cancelUserBtn) {
            cancelUserBtn.addEventListener('click', () => {
                router.navigate('users');
            });
        }

        // Avatar selection
        const avatarSelector = document.getElementById('avatarSelector');
        if (avatarSelector) {
            avatarSelector.addEventListener('click', (e) => {
                if (e.target.classList.contains('avatar-option')) {
                    this.selectAvatar(e.target);
                }
            });
        }

        // Create book form
        const createBookForm = document.getElementById('createBookForm');
        if (createBookForm) {
            createBookForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCreateBook(e);
            });
        }

        const cancelBookBtn = document.getElementById('cancelBookBtn');
        if (cancelBookBtn) {
            cancelBookBtn.addEventListener('click', () => {
                router.navigate('home');
            });
        }

        // Create expense form
        const createExpenseForm = document.getElementById('createExpenseForm');
        if (createExpenseForm) {
            createExpenseForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCreateExpense(e);
            });
        }

        const cancelExpenseBtn = document.getElementById('cancelExpenseBtn');
        if (cancelExpenseBtn) {
            cancelExpenseBtn.addEventListener('click', () => {
                if (this.currentBookId) {
                    router.navigate('book-detail', { id: this.currentBookId });
                } else {
                    router.navigate('home');
                }
            });
        }

        // Expense form buttons
        const selectAllBtn = document.getElementById('selectAllBtn');
        const equalSplitBtn = document.getElementById('equalSplitBtn');

        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', () => {
                this.selectAllUsers();
            });
        }

        if (equalSplitBtn) {
            equalSplitBtn.addEventListener('click', () => {
                this.calculateEqualSplit();
            });
        }

        // Book detail events
        const addExpenseBtn = document.getElementById('addExpenseBtn');
        if (addExpenseBtn) {
            addExpenseBtn.addEventListener('click', () => {
                if (this.currentBookId) {
                    router.navigate('create-expense', { bookId: this.currentBookId });
                }
            });
        }
    }

    // Load home page
    loadHomePage() {
        const accountBooks = storage.getAccountBooks();
        const accountBooksList = document.getElementById('accountBooksList');
        const emptyState = document.getElementById('emptyState');

        if (!accountBooksList) return;

        if (accountBooks.length === 0) {
            accountBooksList.innerHTML = '';
            if (emptyState) {
                emptyState.style.display = 'block';
            }
        } else {
            if (emptyState) {
                emptyState.style.display = 'none';
            }

            const booksHTML = accountBooks.map(book => {
                const stats = storage.getBookStatistics(book.id);
                return Components.renderAccountBookCard(book, stats);
            }).join('');

            accountBooksList.innerHTML = booksHTML;
        }
    }

    // Load users page
    loadUsersPage() {
        const users = storage.getUsers();
        const usersList = document.getElementById('usersList');
        const usersEmptyState = document.getElementById('usersEmptyState');

        if (!usersList) return;

        if (users.length === 0) {
            usersList.innerHTML = '';
            if (usersEmptyState) {
                usersEmptyState.style.display = 'block';
            }
        } else {
            if (usersEmptyState) {
                usersEmptyState.style.display = 'none';
            }

            const usersHTML = users.map(user => 
                Components.renderUserItem(user, true)
            ).join('');

            usersList.innerHTML = usersHTML;
        }
    }

    // Load create user page
    loadCreateUserPage() {
        // Reset form
        const form = document.getElementById('createUserForm');
        if (form) {
            form.reset();
        }

        // Reset avatar selection
        const avatarOptions = document.querySelectorAll('.avatar-option');
        avatarOptions.forEach(option => {
            option.classList.remove('selected');
        });

        // Select default avatar
        const defaultAvatar = document.querySelector('.avatar-option[data-avatar="👤"]');
        if (defaultAvatar) {
            defaultAvatar.classList.add('selected');
        }
    }

    // Load create book page
    loadCreateBookPage() {
        const users = storage.getUsers();
        const usersSelector = document.getElementById('usersSelector');

        if (!usersSelector) return;

        this.selectedUsers = [];

        if (users.length === 0) {
            usersSelector.innerHTML = Components.renderEmptyState('👥', '还没有用户，请先添加用户');
        } else {
            const usersHTML = users.map(user => 
                Components.renderUserCheckbox(user, false)
            ).join('');

            usersSelector.innerHTML = usersHTML;
        }

        // Reset form
        const form = document.getElementById('createBookForm');
        if (form) {
            form.reset();
        }
    }

    // Load book detail page
    loadBookDetailPage(bookId) {
        this.currentBookId = bookId;
        const book = storage.getAccountBookById(bookId);

        if (!book) {
            Utils.showToast('账本不存在');
            router.navigate('home');
            return;
        }

        // Load book summary
        const bookSummary = document.getElementById('bookSummary');
        if (bookSummary) {
            const stats = storage.getBookStatistics(bookId);
            bookSummary.innerHTML = Components.renderBookSummary(book, stats);
        }

        // Load balance overview
        this.loadBalanceOverview(bookId);

        // Load expenses
        this.loadExpensesList(bookId);
    }

    // Load balance overview
    loadBalanceOverview(bookId) {
        const balanceOverview = document.getElementById('balanceOverview');
        if (!balanceOverview) return;

        const balances = storage.calculateBalances(bookId);
        const users = storage.getUsers();

        const balanceItems = Object.keys(balances).map(userId => {
            const user = users.find(u => u.id === userId);
            if (user) {
                return Components.renderBalanceItem(user, balances[userId]);
            }
            return '';
        }).filter(Boolean).join('');

        balanceOverview.innerHTML = `
            <h3 class="section-title">账目结算</h3>
            <div class="balance-list">
                ${balanceItems || Components.renderEmptyState('💰', '暂无结算信息')}
            </div>
        `;
    }

    // Load expenses list
    loadExpensesList(bookId) {
        const expenses = storage.getExpensesByBookId(bookId);
        const expensesList = document.getElementById('expensesList');
        const expensesEmptyState = document.getElementById('expensesEmptyState');

        if (!expensesList) return;

        if (expenses.length === 0) {
            expensesList.innerHTML = '';
            if (expensesEmptyState) {
                expensesEmptyState.style.display = 'block';
            }
        } else {
            if (expensesEmptyState) {
                expensesEmptyState.style.display = 'none';
            }

            const expensesHTML = expenses.map(expense => 
                Components.renderExpenseItem(expense)
            ).join('');

            expensesList.innerHTML = expensesHTML;
        }
    }

    // Load create expense page
    loadCreateExpensePage(bookId) {
        this.currentBookId = bookId;
        const book = storage.getAccountBookById(bookId);

        if (!book) {
            Utils.showToast('账本不存在');
            router.navigate('home');
            return;
        }

        // Reset form and selections
        const form = document.getElementById('createExpenseForm');
        if (form) {
            form.reset();
        }

        this.selectedPayer = null;
        this.selectedSplitUsers = [];

        // Load participants for payer selection
        this.loadPayerSelector(book.participants);

        // Load participants for split selection
        this.loadSplitUsers(book.participants);
    }

    // Load payer selector
    loadPayerSelector(participantIds) {
        const payerSelector = document.getElementById('payerSelector');
        if (!payerSelector) return;

        const users = storage.getUsers().filter(user => 
            participantIds.includes(user.id)
        );

        const payerHTML = users.map(user => 
            Components.renderPayerOption(user, false)
        ).join('');

        payerSelector.innerHTML = payerHTML;
    }

    // Load split users
    loadSplitUsers(participantIds) {
        const splitUsers = document.getElementById('splitUsers');
        if (!splitUsers) return;

        const users = storage.getUsers().filter(user => 
            participantIds.includes(user.id)
        );

        const splitHTML = users.map(user => 
            Components.renderSplitUser(user, 0, false)
        ).join('');

        splitUsers.innerHTML = splitHTML;
    }

    // Load expense detail page
    loadExpenseDetailPage(expenseId) {
        this.currentExpenseId = expenseId;
        const expense = storage.getExpenseById(expenseId);

        if (!expense) {
            Utils.showToast('账目不存在');
            router.back();
            return;
        }

        // Load expense info
        const expenseInfo = document.getElementById('expenseInfo');
        if (expenseInfo) {
            expenseInfo.innerHTML = Components.renderExpenseInfo(expense);
        }

        // Load split details
        const splitDetails = document.getElementById('splitDetails');
        if (splitDetails) {
            splitDetails.innerHTML = Components.renderSplitDetails(expense);
        }
    }

    // Handle avatar selection
    selectAvatar(avatarElement) {
        // Remove previous selection
        document.querySelectorAll('.avatar-option').forEach(option => {
            option.classList.remove('selected');
        });

        // Add selection to clicked avatar
        avatarElement.classList.add('selected');
    }

    // Handle user selection for book creation
    toggleUserSelection(userId) {
        const checkbox = document.querySelector(`input[type="checkbox"][onchange*="${userId}"]`);
        const userCheckbox = checkbox.closest('.user-checkbox');

        if (checkbox.checked) {
            this.selectedUsers.push(userId);
            userCheckbox.classList.add('selected');
        } else {
            this.selectedUsers = this.selectedUsers.filter(id => id !== userId);
            userCheckbox.classList.remove('selected');
        }
    }

    // Handle payer selection
    selectPayer(userId) {
        this.selectedPayer = userId;
        
        // Update UI
        document.querySelectorAll('.payer-option').forEach(option => {
            option.classList.remove('selected');
        });

        const selectedOption = document.querySelector(`.payer-option[data-user-id="${userId}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
    }

    // Handle split user selection
    toggleSplitUser(userId) {
        const checkbox = document.querySelector(`.split-user[data-user-id="${userId}"] input[type="checkbox"]`);
        const splitUser = document.querySelector(`.split-user[data-user-id="${userId}"]`);
        const amountInput = splitUser.querySelector('input[type="number"]');

        if (checkbox.checked) {
            if (!this.selectedSplitUsers.includes(userId)) {
                this.selectedSplitUsers.push(userId);
            }
            splitUser.classList.add('selected');
            amountInput.disabled = false;
        } else {
            this.selectedSplitUsers = this.selectedSplitUsers.filter(id => id !== userId);
            splitUser.classList.remove('selected');
            amountInput.disabled = true;
            amountInput.value = '0.00';
        }
    }

    // Update split amount
    updateSplitAmount(userId, amount) {
        // Validation will be done on form submission
        console.log(`Updated split amount for ${userId}: ${amount}`);
    }

    // Select all users for splitting
    selectAllUsers() {
        const splitUserElements = document.querySelectorAll('.split-user');
        
        splitUserElements.forEach(element => {
            const userId = element.dataset.userId;
            const checkbox = element.querySelector('input[type="checkbox"]');
            
            if (!checkbox.checked) {
                checkbox.checked = true;
                this.toggleSplitUser(userId);
            }
        });
    }

    // Calculate equal split
    calculateEqualSplit() {
        const amountInput = document.getElementById('expenseAmount');
        const amount = parseFloat(amountInput.value) || 0;

        if (amount <= 0) {
            Utils.showToast('请先输入金额');
            return;
        }

        if (this.selectedSplitUsers.length === 0) {
            Utils.showToast('请选择分摊用户');
            return;
        }

        const splitAmounts = Utils.calculateEqualSplit(amount, this.selectedSplitUsers.length);

        this.selectedSplitUsers.forEach((userId, index) => {
            const amountInput = document.querySelector(`.split-user[data-user-id="${userId}"] input[type="number"]`);
            if (amountInput) {
                amountInput.value = splitAmounts[index].toFixed(2);
            }
        });
    }

    // Handle create user form submission
    handleCreateUser(event) {
        const formData = new FormData(event.target);
        const selectedAvatar = document.querySelector('.avatar-option.selected');
        
        const userData = {
            name: formData.get('userName').trim(),
            avatar: selectedAvatar ? selectedAvatar.dataset.avatar : '👤'
        };

        // Validation
        const validation = Utils.validateForm(userData, {
            name: { required: true, message: '用户名不能为空' }
        });

        if (!validation.isValid) {
            Utils.showToast(Object.values(validation.errors)[0]);
            return;
        }

        // Check for duplicate names
        const existingUsers = storage.getUsers();
        if (existingUsers.some(user => user.name === userData.name)) {
            Utils.showToast('用户名已存在');
            return;
        }

        Utils.showLoading();

        try {
            const newUser = storage.addUser(userData);
            Utils.hideLoading();
            Utils.showToast('用户创建成功');
            router.navigate('users');
        } catch (error) {
            Utils.hideLoading();
            Utils.showToast('创建用户失败，请重试');
            console.error('Error creating user:', error);
        }
    }

    // Handle create book form submission
    handleCreateBook(event) {
        const formData = new FormData(event.target);
        
        const bookData = {
            name: formData.get('bookName').trim(),
            participants: this.selectedUsers
        };

        // Validation
        const validation = Utils.validateForm(bookData, {
            name: { required: true, message: '账本名称不能为空' }
        });

        if (!validation.isValid) {
            Utils.showToast(Object.values(validation.errors)[0]);
            return;
        }

        if (bookData.participants.length === 0) {
            Utils.showToast('请至少选择一个参与用户');
            return;
        }

        Utils.showLoading();

        try {
            const newBook = storage.addAccountBook(bookData);
            Utils.hideLoading();
            Utils.showToast('账本创建成功');
            router.navigate('home');
        } catch (error) {
            Utils.hideLoading();
            Utils.showToast('创建账本失败，请重试');
            console.error('Error creating book:', error);
        }
    }

    // Handle create expense form submission
    handleCreateExpense(event) {
        const formData = new FormData(event.target);
        
        const amount = parseFloat(formData.get('amount')) || 0;
        const description = formData.get('description') ? formData.get('description').trim() : '';

        // Collect split data
        const splits = [];
        this.selectedSplitUsers.forEach(userId => {
            const amountInput = document.querySelector(`.split-user[data-user-id="${userId}"] input[type="number"]`);
            const splitAmount = parseFloat(amountInput.value) || 0;
            
            if (splitAmount > 0) {
                splits.push({
                    userId: userId,
                    amount: splitAmount
                });
            }
        });

        const expenseData = {
            bookId: this.currentBookId,
            amount: amount,
            description: description,
            payerId: this.selectedPayer,
            splits: splits
        };

        // Validation
        if (amount <= 0) {
            Utils.showToast('请输入有效金额');
            return;
        }

        if (!this.selectedPayer) {
            Utils.showToast('请选择付款人');
            return;
        }

        if (splits.length === 0) {
            Utils.showToast('请选择分摊用户');
            return;
        }

        // Check if split amounts add up to total amount
        const totalSplit = splits.reduce((sum, split) => sum + split.amount, 0);
        if (Math.abs(totalSplit - amount) > 0.01) {
            Utils.showToast(`分摊总额(${Utils.formatCurrency(totalSplit)})与支出金额(${Utils.formatCurrency(amount)})不符`);
            return;
        }

        Utils.showLoading();

        try {
            const newExpense = storage.addExpense(expenseData);
            Utils.hideLoading();
            Utils.showToast('账目添加成功');
            router.navigate('book-detail', { id: this.currentBookId });
        } catch (error) {
            Utils.hideLoading();
            Utils.showToast('添加账目失败，请重试');
            console.error('Error creating expense:', error);
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});