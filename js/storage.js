// Local Storage Management
class Storage {
    constructor() {
        this.keys = {
            USERS: 'smart_bill_users',
            ACCOUNT_BOOKS: 'smart_bill_account_books',
            EXPENSES: 'smart_bill_expenses',
            MEMBERSHIP: 'smart_bill_membership'
        };
        this.membershipTypes = {
            FREE: 'free',
            PREMIUM: 'premium'
        };
        this.limits = {
            FREE: {
                MAX_USERS: 3,
                MAX_ACCOUNT_BOOKS: 1
            }
        };
        this.initializeData();
    }

    // Initialize with default data if empty
    initializeData() {
        if (!this.getUsers().length) {
            // Create some default users for demo
            this.saveUsers([
                {
                    id: this.generateId(),
                    name: '我',
                    avatar: '👤',
                    createdAt: new Date().toISOString()
                }
            ]);
        }
        
        // Initialize membership data
        if (!this.getMembership()) {
            this.saveMembership({
                type: this.membershipTypes.FREE,
                startDate: new Date().toISOString(),
                endDate: null,
                features: {
                    unlimited_users: false,
                    unlimited_books: false
                }
            });
        }
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Generic storage methods
    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    }

    // Users management
    getUsers() {
        return this.get(this.keys.USERS) || [];
    }

    saveUsers(users) {
        return this.set(this.keys.USERS, users);
    }

    addUser(userData) {
        const users = this.getUsers();
        const newUser = {
            id: this.generateId(),
            name: userData.name,
            avatar: userData.avatar || '👤',
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        this.saveUsers(users);
        return newUser;
    }

    getUserById(id) {
        const users = this.getUsers();
        return users.find(user => user.id === id);
    }

    updateUser(id, userData) {
        const users = this.getUsers();
        const index = users.findIndex(user => user.id === id);
        if (index !== -1) {
            users[index] = { ...users[index], ...userData, updatedAt: new Date().toISOString() };
            this.saveUsers(users);
            return users[index];
        }
        return null;
    }

    deleteUser(id) {
        const users = this.getUsers();
        const filteredUsers = users.filter(user => user.id !== id);
        this.saveUsers(filteredUsers);
        return filteredUsers.length < users.length;
    }

    // Account Books management
    getAccountBooks() {
        return this.get(this.keys.ACCOUNT_BOOKS) || [];
    }

    saveAccountBooks(books) {
        return this.set(this.keys.ACCOUNT_BOOKS, books);
    }

    addAccountBook(bookData) {
        const books = this.getAccountBooks();
        const newBook = {
            id: this.generateId(),
            name: bookData.name,
            participants: bookData.participants || [],
            createdAt: new Date().toISOString()
        };
        books.push(newBook);
        this.saveAccountBooks(books);
        return newBook;
    }

    getAccountBookById(id) {
        const books = this.getAccountBooks();
        return books.find(book => book.id === id);
    }

    updateAccountBook(id, bookData) {
        const books = this.getAccountBooks();
        const index = books.findIndex(book => book.id === id);
        if (index !== -1) {
            books[index] = { ...books[index], ...bookData, updatedAt: new Date().toISOString() };
            this.saveAccountBooks(books);
            return books[index];
        }
        return null;
    }

    deleteAccountBook(id) {
        const books = this.getAccountBooks();
        const filteredBooks = books.filter(book => book.id !== id);
        this.saveAccountBooks(filteredBooks);
        
        // Also delete related expenses
        const expenses = this.getExpenses();
        const filteredExpenses = expenses.filter(expense => expense.bookId !== id);
        this.saveExpenses(filteredExpenses);
        
        return filteredBooks.length < books.length;
    }

    // Expenses management
    getExpenses() {
        return this.get(this.keys.EXPENSES) || [];
    }

    saveExpenses(expenses) {
        return this.set(this.keys.EXPENSES, expenses);
    }

    addExpense(expenseData) {
        const expenses = this.getExpenses();
        const newExpense = {
            id: this.generateId(),
            bookId: expenseData.bookId,
            amount: parseFloat(expenseData.amount),
            description: expenseData.description || '',
            payerId: expenseData.payerId,
            splits: expenseData.splits || [],
            createdAt: new Date().toISOString()
        };
        expenses.push(newExpense);
        this.saveExpenses(expenses);
        return newExpense;
    }

    getExpenseById(id) {
        const expenses = this.getExpenses();
        return expenses.find(expense => expense.id === id);
    }

    getExpensesByBookId(bookId) {
        const expenses = this.getExpenses();
        return expenses.filter(expense => expense.bookId === bookId)
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    updateExpense(id, expenseData) {
        const expenses = this.getExpenses();
        const index = expenses.findIndex(expense => expense.id === id);
        if (index !== -1) {
            expenses[index] = { ...expenses[index], ...expenseData, updatedAt: new Date().toISOString() };
            this.saveExpenses(expenses);
            return expenses[index];
        }
        return null;
    }

    deleteExpense(id) {
        const expenses = this.getExpenses();
        const filteredExpenses = expenses.filter(expense => expense.id !== id);
        this.saveExpenses(filteredExpenses);
        return filteredExpenses.length < expenses.length;
    }

    // Calculate balances for an account book
    calculateBalances(bookId) {
        const book = this.getAccountBookById(bookId);
        if (!book) return {};

        const expenses = this.getExpensesByBookId(bookId);
        const balances = {};

        // Initialize balances for all participants
        book.participants.forEach(userId => {
            balances[userId] = 0;
        });

        // Calculate balances based on expenses
        expenses.forEach(expense => {
            const { payerId, amount, splits } = expense;
            
            // Payer paid the full amount
            if (balances.hasOwnProperty(payerId)) {
                balances[payerId] += amount;
            }

            // Subtract each person's share
            splits.forEach(split => {
                if (balances.hasOwnProperty(split.userId)) {
                    balances[split.userId] -= split.amount;
                }
            });
        });

        return balances;
    }

    // Get statistics for an account book
    getBookStatistics(bookId) {
        const expenses = this.getExpensesByBookId(bookId);
        const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const expenseCount = expenses.length;
        
        return {
            totalAmount,
            expenseCount,
            lastExpenseDate: expenses.length > 0 ? expenses[0].createdAt : null
        };
    }

    // Clear all data (for testing purposes)
    clearAllData() {
        Object.values(this.keys).forEach(key => {
            localStorage.removeItem(key);
        });
        this.initializeData();
    }
    
    // Membership management
    getMembership() {
        return this.get(this.keys.MEMBERSHIP);
    }
    
    saveMembership(membershipData) {
        return this.set(this.keys.MEMBERSHIP, membershipData);
    }
    
    isPremiumUser() {
        const membership = this.getMembership();
        return membership && membership.type === this.membershipTypes.PREMIUM;
    }
    
    upgradeToPremium() {
        const membership = this.getMembership() || {};
        const premiumMembership = {
            ...membership,
            type: this.membershipTypes.PREMIUM,
            startDate: new Date().toISOString(),
            endDate: null, // null means lifetime for now
            features: {
                unlimited_users: true,
                unlimited_books: true
            }
        };
        return this.saveMembership(premiumMembership);
    }
    
    // Check if user can create more users
    canCreateMoreUsers() {
        if (this.isPremiumUser()) {
            return { allowed: true };
        }
        
        const users = this.getUsers();
        const currentCount = users.length;
        const maxAllowed = this.limits.FREE.MAX_USERS;
        
        if (currentCount >= maxAllowed) {
            return { 
                allowed: false, 
                message: `免费用户最多只能创建${maxAllowed}个用户，升级会员享受无限用户数量！`,
                currentCount,
                maxAllowed
            };
        }
        
        return { allowed: true, currentCount, maxAllowed };
    }
    
    // Check if user can create more account books
    canCreateMoreBooks() {
        if (this.isPremiumUser()) {
            return { allowed: true };
        }
        
        const books = this.getAccountBooks();
        const currentCount = books.length;
        const maxAllowed = this.limits.FREE.MAX_ACCOUNT_BOOKS;
        
        if (currentCount >= maxAllowed) {
            return { 
                allowed: false, 
                message: `免费用户最多只能创建${maxAllowed}个账本，升级会员享受无限账本数量！`,
                currentCount,
                maxAllowed
            };
        }
        
        return { allowed: true, currentCount, maxAllowed };
    }
}

// Create global storage instance
window.storage = new Storage();