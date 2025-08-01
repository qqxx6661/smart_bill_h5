// Simple hash-based router
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = '';
        this.init();
    }

    init() {
        // Listen for hash changes
        window.addEventListener('hashchange', () => {
            this.handleRouteChange();
        });

        // Handle initial load
        this.handleRouteChange();
    }

    // Register route
    register(path, handler) {
        this.routes[path] = handler;
    }

    // Navigate to route
    navigate(path, params = {}) {
        if (Object.keys(params).length > 0) {
            const queryString = Object.keys(params)
                .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
                .join('&');
            window.location.hash = `${path}?${queryString}`;
        } else {
            window.location.hash = path;
        }
    }

    // Handle route changes
    handleRouteChange() {
        const hash = window.location.hash.slice(1); // Remove #
        const [path, queryString] = hash.split('?');
        const route = path || 'home';

        // Parse query parameters
        const params = {};
        if (queryString) {
            queryString.split('&').forEach(pair => {
                const [key, value] = pair.split('=');
                if (key && value) {
                    params[decodeURIComponent(key)] = decodeURIComponent(value);
                }
            });
        }

        this.currentRoute = route;

        // Call route handler
        if (this.routes[route]) {
            this.routes[route](params);
        } else {
            // Default to home if route not found
            this.navigate('home');
        }
    }

    // Get current route
    getCurrentRoute() {
        return this.currentRoute;
    }

    // Go back
    back() {
        window.history.back();
    }
}

// Page manager to handle page visibility
class PageManager {
    constructor() {
        this.pages = {
            'home': 'homePage',
            'users': 'usersPage',
            'create-user': 'createUserPage',
            'create-book': 'createBookPage',
            'book-detail': 'bookDetailPage',
            'create-expense': 'createExpensePage',
            'expense-detail': 'expenseDetailPage',
            'membership': 'membershipPage'
        };
    }

    // Show specific page
    showPage(pageName) {
        // Hide all pages
        Object.values(this.pages).forEach(pageId => {
            const page = document.getElementById(pageId);
            if (page) {
                page.style.display = 'none';
            }
        });

        // Show target page
        const targetPageId = this.pages[pageName];
        if (targetPageId) {
            const targetPage = document.getElementById(targetPageId);
            if (targetPage) {
                targetPage.style.display = 'block';
                this.updateHeader(pageName);
                return true;
            }
        }

        return false;
    }

    // Update header based on current page
    updateHeader(pageName) {
        const header = document.getElementById('header');
        const backBtn = document.getElementById('backBtn');
        const headerTitle = document.getElementById('headerTitle');
        const headerRight = document.getElementById('headerRight');

        if (!header || !backBtn || !headerTitle || !headerRight) return;

        // Reset header
        headerRight.innerHTML = '';

        switch (pageName) {
            case 'home':
                backBtn.style.display = 'none';
                headerTitle.textContent = '智能记账';
                break;

            case 'users':
                backBtn.style.display = 'block';
                headerTitle.textContent = '用户管理';
                break;

            case 'create-user':
                backBtn.style.display = 'block';
                headerTitle.textContent = '添加用户';
                break;

            case 'create-book':
                backBtn.style.display = 'block';
                headerTitle.textContent = '创建账本';
                break;

            case 'book-detail':
                backBtn.style.display = 'block';
                headerTitle.textContent = '账本详情';
                break;

            case 'create-expense':
                backBtn.style.display = 'block';
                headerTitle.textContent = '记一笔';
                break;

            case 'expense-detail':
                backBtn.style.display = 'block';
                headerTitle.textContent = '账目详情';
                break;

            case 'membership':
                backBtn.style.display = 'block';
                headerTitle.textContent = '会员中心';
                break;

            default:
                backBtn.style.display = 'block';
                headerTitle.textContent = '智能记账';
        }
    }
}

// Create global instances
window.router = new Router();
window.pageManager = new PageManager();

// Set up router handlers
document.addEventListener('DOMContentLoaded', () => {
    // Home page
    router.register('home', () => {
        pageManager.showPage('home');
        if (window.app && window.app.loadHomePage) {
            window.app.loadHomePage();
        }
    });

    // Users page
    router.register('users', () => {
        pageManager.showPage('users');
        if (window.app && window.app.loadUsersPage) {
            window.app.loadUsersPage();
        }
    });

    // Create user page
    router.register('create-user', () => {
        pageManager.showPage('create-user');
        if (window.app && window.app.loadCreateUserPage) {
            window.app.loadCreateUserPage();
        }
    });

    // Create book page
    router.register('create-book', () => {
        pageManager.showPage('create-book');
        if (window.app && window.app.loadCreateBookPage) {
            window.app.loadCreateBookPage();
        }
    });

    // Book detail page
    router.register('book-detail', (params) => {
        pageManager.showPage('book-detail');
        if (window.app && window.app.loadBookDetailPage) {
            window.app.loadBookDetailPage(params.id);
        }
    });

    // Create expense page
    router.register('create-expense', (params) => {
        pageManager.showPage('create-expense');
        if (window.app && window.app.loadCreateExpensePage) {
            window.app.loadCreateExpensePage(params.bookId);
        }
    });

    // Expense detail page
    router.register('expense-detail', (params) => {
        pageManager.showPage('expense-detail');
        if (window.app && window.app.loadExpenseDetailPage) {
            window.app.loadExpenseDetailPage(params.id);
        }
    });

    // Membership page
    router.register('membership', () => {
        pageManager.showPage('membership');
        if (window.app && window.app.loadMembershipPage) {
            window.app.loadMembershipPage();
        }
    });

    // Back button handler
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            router.back();
        });
    }
});