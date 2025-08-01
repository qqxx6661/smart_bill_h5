// Utility functions
class Utils {
    // Format currency
    static formatCurrency(amount) {
        return '¥' + parseFloat(amount).toFixed(2);
    }

    // Format date
    static formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return '今天';
        } else if (diffDays === 2) {
            return '昨天';
        } else if (diffDays <= 7) {
            return `${diffDays - 1}天前`;
        } else {
            return date.toLocaleDateString('zh-CN', {
                month: 'short',
                day: 'numeric'
            });
        }
    }

    // Format relative time
    static formatRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffMinutes < 1) {
            return '刚刚';
        } else if (diffMinutes < 60) {
            return `${diffMinutes}分钟前`;
        } else if (diffHours < 24) {
            return `${diffHours}小时前`;
        } else if (diffDays < 30) {
            return `${diffDays}天前`;
        } else {
            return date.toLocaleDateString('zh-CN');
        }
    }

    // Validate form data
    static validateForm(formData, rules) {
        const errors = {};

        Object.keys(rules).forEach(field => {
            const rule = rules[field];
            const value = formData[field];

            if (rule.required && (!value || value.toString().trim() === '')) {
                errors[field] = rule.message || `${field}不能为空`;
                return;
            }

            if (rule.min && value < rule.min) {
                errors[field] = rule.message || `${field}不能小于${rule.min}`;
                return;
            }

            if (rule.max && value > rule.max) {
                errors[field] = rule.message || `${field}不能大于${rule.max}`;
                return;
            }

            if (rule.pattern && !rule.pattern.test(value)) {
                errors[field] = rule.message || `${field}格式不正确`;
                return;
            }
        });

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    // Show toast message
    static showToast(message, duration = 3000) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.style.display = 'block';
            
            setTimeout(() => {
                toast.style.display = 'none';
            }, duration);
        }
    }

    // Show loading
    static showLoading() {
        const loading = document.getElementById('loadingOverlay');
        if (loading) {
            loading.style.display = 'flex';
        }
    }

    // Hide loading
    static hideLoading() {
        const loading = document.getElementById('loadingOverlay');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    // Debounce function
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Generate avatar from name
    static generateAvatar(name) {
        const avatars = ['👤', '👨', '👩', '👦', '👧', '🧑', '👨‍💼', '👩‍💼', '🧔', '👱'];
        const index = name.charCodeAt(0) % avatars.length;
        return avatars[index];
    }

    // Calculate equal split
    static calculateEqualSplit(amount, participantCount) {
        const baseAmount = Math.floor((amount * 100) / participantCount) / 100;
        const remainder = Math.round((amount - (baseAmount * participantCount)) * 100) / 100;
        
        const splits = new Array(participantCount).fill(baseAmount);
        
        // Distribute remainder to first few participants
        if (remainder > 0) {
            const remainderCents = Math.round(remainder * 100);
            for (let i = 0; i < remainderCents; i++) {
                splits[i] += 0.01;
            }
        }
        
        return splits;
    }

    // Format participants list
    static formatParticipants(participants, users) {
        if (!participants || participants.length === 0) {
            return '无参与者';
        }

        const names = participants.map(userId => {
            const user = users.find(u => u.id === userId);
            return user ? user.name : '未知用户';
        });

        if (names.length <= 3) {
            return names.join('、');
        } else {
            return names.slice(0, 2).join('、') + ` 等${names.length}人`;
        }
    }

    // Deep clone object
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        
        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }
        
        if (obj instanceof Array) {
            return obj.map(item => Utils.deepClone(item));
        }
        
        const clonedObj = {};
        Object.keys(obj).forEach(key => {
            clonedObj[key] = Utils.deepClone(obj[key]);
        });
        
        return clonedObj;
    }

    // Create DOM element with attributes
    static createElement(tag, attributes = {}, textContent = '') {
        const element = document.createElement(tag);
        
        Object.keys(attributes).forEach(key => {
            if (key === 'className') {
                element.className = attributes[key];
            } else if (key === 'innerHTML') {
                element.innerHTML = attributes[key];
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });
        
        if (textContent) {
            element.textContent = textContent;
        }
        
        return element;
    }

    // Escape HTML to prevent XSS
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Get query parameters
    static getQueryParams() {
        const params = {};
        const hash = window.location.hash;
        
        if (hash.includes('?')) {
            const queryString = hash.split('?')[1];
            const pairs = queryString.split('&');
            
            pairs.forEach(pair => {
                const [key, value] = pair.split('=');
                if (key && value) {
                    params[decodeURIComponent(key)] = decodeURIComponent(value);
                }
            });
        }
        
        return params;
    }

    // Set query parameters
    static setQueryParams(params) {
        const currentHash = window.location.hash.split('?')[0];
        const queryString = Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
        
        if (queryString) {
            window.location.hash = `${currentHash}?${queryString}`;
        } else {
            window.location.hash = currentHash;
        }
    }

    // Format file size
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Check if mobile device
    static isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Throttle function
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Export Utils as global
window.Utils = Utils;