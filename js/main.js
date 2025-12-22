// ==================== 全局变量 ====================
let searchTimeout;

// ==================== 数据初始化 ====================
function initializeData() {
    const defaultProducts = [
        { id: 1, name: '智能手机 X1', price: 2999, category: 'electronics', stock: 100, rating: 4.5, description: '高性能智能手机', image: '/images/phone.png' },
        { id: 2, name: '无线蓝牙耳机', price: 399, category: 'electronics', stock: 150, rating: 4.2, description: '真无线蓝牙耳机', image: '/images/headphones.png' },
        { id: 3, name: '男士休闲衬衫', price: 199, category: 'clothing', stock: 80, rating: 4.0, description: '纯棉材质', image: '/images/shirt.png' },
        { id: 4, name: 'JavaScript高级程序设计', price: 89, category: 'books', stock: 200, rating: 4.8, description: '前端经典书籍', image: '/images/book.png' },
        { id: 5, name: '咖啡礼盒套装', price: 159, category: 'food', stock: 60, rating: 4.3, description: '精选咖啡豆', image: '/images/coffee.png' },
    ];

    if (!localStorage.getItem('products')) localStorage.setItem('products', JSON.stringify(defaultProducts));
    if (!localStorage.getItem('cart')) localStorage.setItem('cart', JSON.stringify([]));
    if (!localStorage.getItem('users')) localStorage.setItem('users', JSON.stringify([]));
}

// ==================== Ajax模拟 ====================
function ajaxRequest(url, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const products = JSON.parse(localStorage.getItem('products')) || [];

            if (method === 'GET' && url === '/api/products') {
                resolve({ success: true, data: products });
            }
            else if (method === 'POST' && url === '/api/search') {
                const term = data.searchTerm.toLowerCase();
                const results = products.filter(p => p.name.toLowerCase().includes(term));
                resolve({ success: true, data: results, message: `找到${results.length}个商品` });
            }
            else {
                reject({ success: false, message: '请求失败' });
            }
        }, 800);
    });
}

// ==================== 商品展示 ====================
function displayProducts(category = 'all') {
    const grid = document.getElementById('product-list');
    if (!grid) return;

    grid.innerHTML = '<div class="loading">加载中...</div>';

    ajaxRequest('/api/products', 'GET')
        .then(res => {
            const products = res.data;
            const filtered = category === 'all' ? products : products.filter(p => p.category === category);
            renderProductGrid(filtered);
            showNotification('商品加载完成', 'success');
        })
        .catch(err => grid.innerHTML = `<div class="error">${err.message}</div>`);
}

function renderProductGrid(products) {
    const grid = document.getElementById('product-list');
    if (!grid) return;

    // 调试：查看商品数据中的图片路径
    console.log('商品数据：', products);
    products.forEach(p => {
        console.log(`商品 ${p.name}: 图片路径 = ${p.image}`);
    });

    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <div class="product-image">
                <img src="${p.image || 'images/default.png'}" alt="${p.name}">
            </div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <div class="product-rating">${generateStars(p.rating)}</div>
                <div class="product-price">¥${p.price.toFixed(2)}</div>
                <p>${p.description.substring(0, 50)}...</p>
                <div class="product-actions">
                    <button class="btn add-to-cart" data-id="${p.id}">
                        <i class="fas fa-cart-plus"></i> 加入购物车
                    </button>
                    <a href="detail.html?id=${p.id}" class="btn btn-secondary">
                        <i class="fas fa-eye"></i> 查看详情
                    </a>
                </div>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function () {
            addToCart(parseInt(this.getAttribute('data-id')));
        });
    });
}

// ==================== 搜索功能 ====================
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', function () {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const term = this.value.trim();
            if (!term) return displayProducts();

            const grid = document.getElementById('product-list');
            if (!grid) return;

            grid.innerHTML = '<div class="loading">搜索中...</div>';

            ajaxRequest('/api/search', 'POST', { searchTerm: term })
                .then(res => {
                    renderProductGrid(res.data);
                    showNotification(res.message, 'success');
                })
                .catch(err => grid.innerHTML = `<div class="error">${err.message}</div>`);
        }, 500);
    });
}

// ==================== 分类功能 ====================
function setupCategories() {
    document.querySelectorAll('.category').forEach(cat => {
        cat.addEventListener('click', function () {
            document.querySelectorAll('.category').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            displayProducts(this.getAttribute('data-category'));
        });
    });
}

// ==================== 轮播图 ====================
function setupCarousel() {
    const slides = document.querySelectorAll('.banner .slide');
    const dots = document.querySelectorAll('.banner .dot');
    let currentIndex = 0;

    if (slides.length === 0) return;

    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));

        currentIndex = (index + slides.length) % slides.length;
        slides[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
    }

    dots.forEach((dot, idx) => dot.addEventListener('click', () => showSlide(idx)));
    setInterval(() => showSlide(currentIndex + 1), 5000);
}

// ==================== 购物车功能 ====================
function addToCart(productId, quantity = 1) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);

    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ id: productId, name: product.name, price: product.price, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${product.name}已加入购物车`, 'success');
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = total);
}

function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-items');
    const empty = document.getElementById('cart-empty');

    if (!container) return;

    container.innerHTML = '';

    if (cart.length === 0) {
        if (empty) empty.style.display = 'block';
        updateCartSummary();
        return;
    }

    if (empty) empty.style.display = 'none';

    const products = JSON.parse(localStorage.getItem('products')) || [];

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        const productImage = product ? (product.image || 'images/default.png') : 'images/default.png';

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-image">
                <img src="${productImage}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px;">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <div>单价：¥${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" data-id="${item.id}" data-change="-1">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" data-id="${item.id}" data-change="1">+</button>
                <button class="btn" data-id="${item.id}">删除</button>
            </div>
            <div class="cart-item-total">
                ¥${(item.price * item.quantity).toFixed(2)}
            </div>
        `;
        container.appendChild(div);
    });

    bindCartEvents();
    updateCartSummary();
}

function bindCartEvents() {
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = parseInt(this.getAttribute('data-id'));
            const change = parseInt(this.getAttribute('data-change'));
            updateCartQuantity(id, change);
        });
    });

    document.querySelectorAll('.btn[data-id]').forEach(btn => {
        btn.addEventListener('click', function () {
            removeFromCart(parseInt(this.getAttribute('data-id')));
        });
    });
}

function updateCartQuantity(productId, change) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === productId);

    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
            updateCartCount();
        }
    }
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
    showNotification('商品已移除', 'success');
}

function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 15 : 0;
    const discount = subtotal > 500 ? 50 : 0;
    const total = subtotal + shipping - discount;

    ['subtotal', 'shipping', 'discount', 'total'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = `¥${eval(id).toFixed(2)}`;
    });
}

function setupCheckout() {
    const btn = document.getElementById('checkout-btn');
    if (!btn) return;

    btn.addEventListener('click', function () {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const user = JSON.parse(localStorage.getItem('currentUser'));

        if (cart.length === 0) {
            showNotification('购物车为空', 'error');
            return;
        }

        if (!user) {
            showNotification('请先登录', 'error');
            setTimeout(() => location.href = 'login.html', 1500);
            return;
        }

        // 模拟Ajax
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 处理中...';

        setTimeout(() => {
            const order = {
                id: Date.now(),
                items: cart,
                total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                date: new Date().toLocaleString()
            };

            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));
            localStorage.setItem('cart', JSON.stringify([]));

            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-credit-card"></i> 去结算';

            showNotification(`订单#${order.id}创建成功`, 'success');
            setTimeout(() => {
                displayCart();
                updateCartCount();
                setTimeout(() => location.href = 'user.html', 1000);
            }, 500);
        }, 1500);
    });
}

// ==================== 用户认证 ====================
function setupRegister() {
    const form = document.getElementById('register-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('reg-username').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;

        // 表单验证
        const errors = [];
        if (username.length < 3) errors.push('用户名至少3位');
        if (!isValidEmail(email)) errors.push('邮箱格式不正确');
        if (password.length < 6) errors.push('密码至少6位');
        if (password !== confirmPassword) errors.push('两次密码不一致');

        if (errors.length > 0) {
            errors.forEach(error => showNotification(error, 'error'));
            return;
        }

        // 检查用户是否存在
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(u => u.username === username)) {
            showNotification('用户名已存在', 'error');
            return;
        }
        if (users.some(u => u.email === email)) {
            showNotification('邮箱已注册', 'error');
            return;
        }

        // 创建用户
        const user = {
            id: Date.now(),
            username,
            email,
            password,
            registerDate: new Date().toLocaleString(),
            level: '普通会员'
        };

        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(user));

        showNotification('注册成功，已自动登录', 'success');
        setTimeout(() => location.href = 'index.html', 1500);
    });
}

function setupLogin() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u =>
            (u.username === username || u.email === username) &&
            u.password === password
        );

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            showNotification('登录成功', 'success');
            setTimeout(() => location.href = 'index.html', 1500);
        } else {
            showNotification('用户名或密码错误', 'error');
        }
    });
}

function updateLoginStatus() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');

    if (user && loginBtn) {
        loginBtn.innerHTML = `<i class="fas fa-user"></i> ${user.username}`;
        loginBtn.href = 'user.html';
        if (registerBtn) registerBtn.style.display = 'none';
    }
}

function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        showNotification('已退出登录', 'success');
        setTimeout(() => location.href = 'index.html', 1500);
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ==================== 工具函数 ====================
function generateStars(rating) {
    let html = '';
    for (let i = 0; i < 5; i++) {
        html += i < rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    }
    return html;
}

function showNotification(msg, type = 'info') {
    const div = document.createElement('div');
    div.className = `notification notification-${type}`;
    div.innerHTML = `<span>${msg}</span><button>&times;</button>`;

    document.body.appendChild(div);

    setTimeout(() => div.classList.add('show'), 10);

    setTimeout(() => {
        div.classList.remove('show');
        setTimeout(() => div.remove(), 300);
    }, 3000);

    div.querySelector('button').addEventListener('click', () => div.remove());
}

// ==================== 页面初始化 ====================
document.addEventListener('DOMContentLoaded', function () {
    initializeData();
    updateCartCount();
    updateLoginStatus();

    const path = window.location.pathname;

    if (path.includes('cart.html')) {
        displayCart();
        setupCheckout();
    } else if (path.includes('index.html') || path === '/') {
        displayProducts();
        setupSearch();
        setupCategories();
        setupCarousel();
    } else if (path.includes('detail.html')) {
        setupProductDetail();
    } else if (path.includes('user.html')) {
        setupUserProfile();
        setupLogout();
    } else if (path.includes('login.html')) {
        setupLogin();
    } else if (path.includes('register.html')) {
        setupRegister();
    }

    showStudentInfo();
});

// 商品详情页初始化
function setupProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || '1';

    setTimeout(() => {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const product = products.find(p => p.id == productId);

        if (product) {
            // 设置商品图片
            const mainImg = document.getElementById('main-img');
            if (mainImg && product.image) {
                mainImg.src = product.image;
            }

            const elements = {
                'detail-product-name': product.name,
                'detail-price': '¥' + product.price.toFixed(2),
                'brand': product.brand || 'XYZ',
                'stock': product.stock + '件',
                'category': getCategoryName(product.category)
            };

            Object.keys(elements).forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = elements[id];
            });

            // 设置商品描述
            const descEl = document.getElementById('product-description');
            if (descEl) {
                descEl.innerHTML = `<p>${product.description}</p>`;
            }

            // 绑定数量按钮事件
            const minusBtn = document.querySelector('.quantity-btn.minus');
            const plusBtn = document.querySelector('.quantity-btn.plus');
            const quantityInput = document.getElementById('quantity');

            if (minusBtn && plusBtn && quantityInput) {
                minusBtn.addEventListener('click', function () {
                    let quantity = parseInt(quantityInput.value);
                    if (quantity > 1) {
                        quantityInput.value = quantity - 1;
                    }
                });

                plusBtn.addEventListener('click', function () {
                    let quantity = parseInt(quantityInput.value);
                    if (quantity < 100) {
                        quantityInput.value = quantity + 1;
                    }
                });
            }

            // 绑定加入购物车按钮
            document.getElementById('add-to-cart')?.addEventListener('click', function () {
                const quantity = parseInt(document.getElementById('quantity')?.value || 1);
                addToCart(productId, quantity);
                showNotification('已添加到购物车！', 'success');
            });
        }
    }, 800);
}

// 添加这个辅助函数
function getCategoryName(category) {
    const categoryNames = {
        'electronics': '电子产品',
        'clothing': '服装服饰',
        'books': '图书音像',
        'food': '食品饮料'
    };
    return categoryNames[category] || category;
}

// 用户个人中心初始化
function setupUserProfile() {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (user) {
        const elements = {
            'user-name': user.username,
            'user-email': user.email,
            'info-username': user.username,
            'info-email': user.email,
            'info-reg-date': user.registerDate,
            'info-level': user.level
        };

        Object.keys(elements).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = elements[id];
        });
    }
}

// 显示学号姓名
function showStudentInfo() {
    if (!document.querySelector('.student-info')) {
        const info = document.createElement('div');
        info.className = 'student-info';
        info.textContent = '学号：25216950414 | 姓名：陈庆炜';
        document.body.appendChild(info);
    }
}