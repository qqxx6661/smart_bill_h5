// UI Components for rendering data
class Components {
    // Render account book card
    static renderAccountBookCard(book, stats) {
        const participants = storage.getUsers().filter(user => 
            book.participants.includes(user.id)
        );
        
        const participantNames = Utils.formatParticipants(book.participants, storage.getUsers());
        
        return `
            <div class="card" onclick="router.navigate('book-detail', {id: '${book.id}'})">
                <div class="card-header">
                    <div>
                        <div class="card-title">${Utils.escapeHtml(book.name)}</div>
                        <div class="card-subtitle">${participantNames}</div>
                    </div>
                    <div class="card-meta">
                        ${Utils.formatDate(book.createdAt)}
                    </div>
                </div>
                <div class="card-footer">
                    <span>共 ${stats.expenseCount} 笔账目</span>
                    <span>${Utils.formatCurrency(stats.totalAmount)}</span>
                </div>
            </div>
        `;
    }

    // Render user item
    static renderUserItem(user, showActions = false) {
        return `
            <div class="user-item">
                <div class="user-avatar">${user.avatar}</div>
                <div class="user-details">
                    <div class="user-name">${Utils.escapeHtml(user.name)}</div>
                    <div class="user-meta">创建于 ${Utils.formatDate(user.createdAt)}</div>
                </div>
                ${showActions ? `
                    <div class="user-actions">
                        <button class="btn btn-small btn-secondary" onclick="app.editUser('${user.id}')">编辑</button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Render user checkbox for selection
    static renderUserCheckbox(user, isSelected = false) {
        return `
            <label class="user-checkbox ${isSelected ? 'selected' : ''}" data-user-id="${user.id}">
                <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="app.toggleUserSelection('${user.id}')">
                <div class="user-info">
                    <div class="user-avatar">${user.avatar}</div>
                    <div class="user-name">${Utils.escapeHtml(user.name)}</div>
                </div>
            </label>
        `;
    }

    // Render payer radio option
    static renderPayerOption(user, isSelected = false) {
        return `
            <label class="payer-option ${isSelected ? 'selected' : ''}" data-user-id="${user.id}">
                <input type="radio" name="payer" value="${user.id}" ${isSelected ? 'checked' : ''} onchange="app.selectPayer('${user.id}')">
                <div class="user-info">
                    <div class="user-avatar">${user.avatar}</div>
                    <div class="user-name">${Utils.escapeHtml(user.name)}</div>
                </div>
            </label>
        `;
    }

    // Render split user item
    static renderSplitUser(user, splitAmount = 0, isSelected = false) {
        return `
            <div class="split-user ${isSelected ? 'selected' : ''}" data-user-id="${user.id}">
                <div class="split-user-info">
                    <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="app.toggleSplitUser('${user.id}')">
                    <div class="user-avatar">${user.avatar}</div>
                    <div class="user-name">${Utils.escapeHtml(user.name)}</div>
                </div>
                <div class="split-amount">
                    <input type="number" step="0.01" min="0" value="${splitAmount.toFixed(2)}" 
                           onchange="app.updateSplitAmount('${user.id}', this.value)" ${!isSelected ? 'disabled' : ''}>
                    <span>元</span>
                </div>
            </div>
        `;
    }

    // Render expense item
    static renderExpenseItem(expense) {
        const payer = storage.getUserById(expense.payerId);
        const splitUsers = expense.splits.map(split => storage.getUserById(split.userId)).filter(Boolean);
        
        return `
            <div class="expense-item" onclick="router.navigate('expense-detail', {id: '${expense.id}'})">
                <div class="expense-header">
                    <div class="expense-amount">${Utils.formatCurrency(expense.amount)}</div>
                    <div class="expense-date">${Utils.formatDate(expense.createdAt)}</div>
                </div>
                ${expense.description ? `<div class="expense-description">${Utils.escapeHtml(expense.description)}</div>` : ''}
                <div class="expense-participants">
                    <div class="expense-payer">
                        <div class="user-avatar">${payer ? payer.avatar : '❓'}</div>
                        <span>${payer ? Utils.escapeHtml(payer.name) : '未知用户'} 支付</span>
                    </div>
                    <div class="expense-splitters">
                        ${splitUsers.slice(0, 3).map(user => `
                            <div class="user-avatar">${user.avatar}</div>
                        `).join('')}
                        ${splitUsers.length > 3 ? `<span>+${splitUsers.length - 3}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    // Render balance item
    static renderBalanceItem(user, balance) {
        let balanceClass = 'zero';
        let balanceText = '已结清';
        
        if (balance > 0) {
            balanceClass = 'positive';
            balanceText = `应收 ${Utils.formatCurrency(balance)}`;
        } else if (balance < 0) {
            balanceClass = 'negative';
            balanceText = `应付 ${Utils.formatCurrency(Math.abs(balance))}`;
        }

        return `
            <div class="balance-item">
                <div class="balance-user">
                    <div class="user-avatar">${user.avatar}</div>
                    <div class="user-name">${Utils.escapeHtml(user.name)}</div>
                </div>
                <div class="balance-amount ${balanceClass}">${balanceText}</div>
            </div>
        `;
    }

    // Render book summary
    static renderBookSummary(book, stats) {
        const participants = storage.getUsers().filter(user => 
            book.participants.includes(user.id)
        );
        
        const participantNames = Utils.formatParticipants(book.participants, storage.getUsers());

        return `
            <div class="book-title">${Utils.escapeHtml(book.name)}</div>
            <div class="book-participants">参与者：${participantNames}</div>
            <div class="book-stats">
                <div class="stat-item">
                    <div class="stat-value">${stats.expenseCount}</div>
                    <div class="stat-label">笔账目</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${Utils.formatCurrency(stats.totalAmount)}</div>
                    <div class="stat-label">总支出</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${participants.length}</div>
                    <div class="stat-label">参与人</div>
                </div>
            </div>
        `;
    }

    // Render expense detail info
    static renderExpenseInfo(expense) {
        const payer = storage.getUserById(expense.payerId);
        
        return `
            <h3>账目信息</h3>
            <div class="info-row">
                <span class="info-label">金额</span>
                <span class="info-value amount">${Utils.formatCurrency(expense.amount)}</span>
            </div>
            ${expense.description ? `
                <div class="info-row">
                    <span class="info-label">描述</span>
                    <span class="info-value">${Utils.escapeHtml(expense.description)}</span>
                </div>
            ` : ''}
            <div class="info-row">
                <span class="info-label">付款人</span>
                <span class="info-value">
                    ${payer ? payer.avatar : '❓'} ${payer ? Utils.escapeHtml(payer.name) : '未知用户'}
                </span>
            </div>
            <div class="info-row">
                <span class="info-label">创建时间</span>
                <span class="info-value">${Utils.formatRelativeTime(expense.createdAt)}</span>
            </div>
        `;
    }

    // Render split details
    static renderSplitDetails(expense) {
        const splitItems = expense.splits.map(split => {
            const user = storage.getUserById(split.userId);
            return `
                <div class="split-item">
                    <div class="split-user-detail">
                        <div class="user-avatar">${user ? user.avatar : '❓'}</div>
                        <div class="user-name">${user ? Utils.escapeHtml(user.name) : '未知用户'}</div>
                    </div>
                    <div class="split-amount-detail">${Utils.formatCurrency(split.amount)}</div>
                </div>
            `;
        }).join('');

        return `
            <h3>分摊详情</h3>
            ${splitItems}
        `;
    }

    // Render empty state
    static renderEmptyState(icon, message) {
        return `
            <div class="empty-state">
                <div class="empty-icon">${icon}</div>
                <p>${message}</p>
            </div>
        `;
    }

    // Render loading state
    static renderLoadingState() {
        return `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>加载中...</p>
            </div>
        `;
    }

    // Render error state
    static renderErrorState(message) {
        return `
            <div class="error-state">
                <div class="error-icon">⚠️</div>
                <p>${message}</p>
            </div>
        `;
    }
    
    // Render membership status card
    static renderMembershipStatus(membership) {
        const isPremium = membership.type === 'premium';
        
        return `
            <div class="membership-status-card ${isPremium ? 'premium' : 'free'}">
                <div class="status-header">
                    <span class="status-icon">${isPremium ? '👑' : '🆓'}</span>
                    <div>
                        <div class="status-title">${isPremium ? '会员用户' : '免费用户'}</div>
                        <div class="status-subtitle">
                            ${isPremium ? '享受所有高级功能' : '享受基础功能'}
                        </div>
                    </div>
                    ${isPremium ? '<div class="premium-badge">PREMIUM</div>' : ''}
                </div>
            </div>
        `;
    }
    
    // Render limit warning
    static renderLimitWarning(type, checkResult) {
        if (checkResult.allowed) return '';
        
        const { message, currentCount, maxAllowed } = checkResult;
        const warningType = type === 'users' ? 'user' : 'book';
        
        return `
            <div class="limit-warning">
                <div class="limit-warning-icon">⚠️</div>
                <div class="limit-warning-content">
                    <div class="limit-warning-title">已达到${type === 'users' ? '用户' : '账本'}数量上限</div>
                    <p class="limit-warning-text">${message}</p>
                </div>
                <button class="limit-warning-upgrade" onclick="router.navigate('membership')">
                    升级会员
                </button>
            </div>
        `;
    }
    
    // Render usage stats
    static renderUsageStats() {
        const membership = storage.getMembership();
        const isPremium = storage.isPremiumUser();
        const users = storage.getUsers();
        const books = storage.getAccountBooks();
        
        const userLimit = isPremium ? '无限制' : `${users.length}/${storage.limits.FREE.MAX_USERS}`;
        const bookLimit = isPremium ? '无限制' : `${books.length}/${storage.limits.FREE.MAX_ACCOUNT_BOOKS}`;
        
        return `
            <div class="usage-stats">
                <div class="usage-item">
                    <span class="usage-icon">👥</span>
                    <span class="usage-label">用户数量</span>
                    <span class="usage-value">${userLimit}</span>
                </div>
                <div class="usage-item">
                    <span class="usage-icon">📖</span>
                    <span class="usage-label">账本数量</span>
                    <span class="usage-value">${bookLimit}</span>
                </div>
            </div>
        `;
    }
}

// Export Components as global
window.Components = Components;