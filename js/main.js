// 初始化商品数据
function initializeProducts() {
    const defaultProducts = [
        {
            id: 1,
            name: '智能手机 X1',
            price: 2999.00,
            brand: 'XYZ',
            category: 'electronics',
            stock: 100,
            description: '高性能智能手机，6.5英寸屏幕，后置三摄像头'
        },
        {
            id: 2,
            name: '无线蓝牙耳机',
            price: 399.00,
            brand: 'SoundPlus',
            category: 'electronics',
            stock: 150,
            description: '真无线蓝牙耳机，续航24小时'
        },
        {
            id: 3,
            name: '男士休闲衬衫',
            price: 199.00,
            brand: 'FashionWear',
            category: 'clothing',
            stock: 80,
            description: '纯棉材质，舒适透气'
        },
        {
            id: 4,
            name: 'JavaScript高级程序设计',
            price: 89.00,
            brand: '人民邮电出版社',
            category: 'books',
            stock: 200,
            description: '前端开发经典书籍'
        },
        {
            id: 5,
            name: '咖啡礼盒套装',
            price: 159.00,
            brand: 'CoffeeTime',
            category: 'food',
            stock: 60,
            description: '精选咖啡豆，浓郁香醇'
        }
    ];

    // 如果localStorage中没有商品数据，则存入默认数据
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
    
    // 初始化购物车
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
}

// 显示商品列表
function displayProducts(category = 'all') {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productGrid = document.getElementById('product-list');
    
    if (!productGrid) return;
    
    // 清空当前列表
    productGrid.innerHTML = '';
    
    // 筛选商品
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    
    // 生成商品卡片
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="https://via.placeholder.com/250x200" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-rating">★★★★☆</div>
                <div class="product-price">¥${product.price.toFixed(2)}</div>
                <p>${product.description.substring(0, 50)}...</p>
                <div class="product-actions">
                    <button class="btn" onclick="addToCart(${product.id}, 1)">加入购物车</button>
                    <a href="detail.html?id=${product.id}" class="btn" style="background-color: #6c757d;">查看详情</a>
                </div>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// 添加到购物车
function addToCart(productId, quantity = 1) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // 检查商品是否已在购物车
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// 更新购物车数量显示
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

// 搜索功能
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }
}

function performSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productGrid = document.getElementById('product-list');
    
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm)
    );
    
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = '<div class="no-results">没有找到相关商品</div>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="https://via.placeholder.com/250x200" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">¥${product.price.toFixed(2)}</div>
                <p>${product.description.substring(0, 50)}...</p>
                <button class="btn" onclick="addToCart(${product.id}, 1)">加入购物车</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// 轮播图功能
function setupCarousel() {
    const slides = document.querySelectorAll('.banner .slide');
    const dots = document.querySelectorAll('.banner .dot');
    let currentSlide = 0;
    let slideInterval;
    
    if (slides.length === 0) return;
    
    function showSlide(n) {
        // 隐藏所有幻灯片
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // 计算当前幻灯片索引
        currentSlide = (n + slides.length) % slides.length;
        
        // 显示当前幻灯片
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    // 为每个控制点添加点击事件
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval); // 暂停自动轮播
            showSlide(index);
            // 重新开始自动轮播
            slideInterval = setInterval(nextSlide, 5000);
        });
    });
    
    // 自动轮播
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    // 当鼠标悬停在轮播图上时暂停自动轮播
    const carousel = document.querySelector('.banner');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            startAutoSlide();
        });
    }
    
    // 开始自动轮播
    startAutoSlide();
}

// 移除之前的复杂Ajax轮播图函数，直接使用上面的setupCarousel

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeProducts();
    displayProducts();
    updateCartCount();
    setupSearch();
    setupCarousel();
    
    // 商品分类点击事件
    const categories = document.querySelectorAll('.category');
    categories.forEach(category => {
        category.addEventListener('click', function() {
            const categoryType = this.getAttribute('data-category');
            displayProducts(categoryType);
        });
    });
});

// 新增：Ajax模拟函数
function ajaxRequest(url, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        // 模拟网络延迟
        setTimeout(() => {
            if (method === 'GET' && url === '/api/products') {
                // 模拟从服务器获取商品数据
                const products = JSON.parse(localStorage.getItem('products')) || [];
                resolve({
                    success: true,
                    data: products,
                    message: '获取商品列表成功'
                });
            } 
            else if (method === 'POST' && url === '/api/search') {
                // 模拟搜索请求
                const products = JSON.parse(localStorage.getItem('products')) || [];
                const searchTerm = data.searchTerm.toLowerCase();
                const results = products.filter(product => 
                    product.name.toLowerCase().includes(searchTerm) || 
                    product.description.toLowerCase().includes(searchTerm)
                );
                resolve({
                    success: true,
                    data: results,
                    message: `找到${results.length}个相关商品`
                });
            }
            else if (method === 'GET' && url.startsWith('/api/product/')) {
                // 模拟获取单个商品详情
                const productId = parseInt(url.split('/').pop());
                const products = JSON.parse(localStorage.getItem('products')) || [];
                const product = products.find(p => p.id === productId);
                
                if (product) {
                    resolve({
                        success: true,
                        data: product,
                        message: '获取商品详情成功'
                    });
                } else {
                    reject({
                        success: false,
                        message: '商品不存在'
                    });
                }
            }
            else {
                reject({
                    success: false,
                    message: '请求失败，请检查网络连接'
                });
            }
        }, 800); // 800ms延迟，模拟网络请求
    });
}

// 修改：使用Ajax获取商品列表
function displayProductsWithAjax(category = 'all') {
    const productGrid = document.getElementById('product-list');
    
    if (!productGrid) return;
    
    // 显示加载状态
    productGrid.innerHTML = '<div class="loading">正在加载商品...</div>';
    
    // 使用Ajax获取数据
    ajaxRequest('/api/products', 'GET')
        .then(response => {
            if (response.success) {
                const products = response.data;
                const filteredProducts = category === 'all' 
                    ? products 
                    : products.filter(p => p.category === category);
                
                renderProductGrid(filteredProducts);
                showNotification('商品加载完成', 'success');
            }
        })
        .catch(error => {
            productGrid.innerHTML = `<div class="error">${error.message}</div>`;
            showNotification('加载失败，请重试', 'error');
        });
}

// 修改搜索功能，使用Ajax
function performSearchWithAjax() {
    const searchTerm = document.getElementById('search-input').value.trim();
    const productGrid = document.getElementById('product-list');
    
    if (!searchTerm) {
        displayProductsWithAjax();
        return;
    }
    
    if (!productGrid) return;
    
    // 显示加载状态
    productGrid.innerHTML = '<div class="loading">正在搜索...</div>';
    
    // 使用Ajax发送搜索请求
    ajaxRequest('/api/search', 'POST', { searchTerm: searchTerm })
        .then(response => {
            if (response.success) {
                renderProductGrid(response.data);
                showNotification(response.message, 'success');
            }
        })
        .catch(error => {
            productGrid.innerHTML = `<div class="error">${error.message}</div>`;
            showNotification('搜索失败', 'error');
        });
}

// 辅助函数：渲染商品网格
function renderProductGrid(products) {
    const productGrid = document.getElementById('product-list');
    
    if (!productGrid) return;
    
    if (products.length === 0) {
        productGrid.innerHTML = '<div class="no-results">没有找到相关商品</div>';
        return;
    }
    
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="https://via.placeholder.com/250x200" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-rating">★★★★☆</div>
                <div class="product-price">¥${product.price.toFixed(2)}</div>
                <p>${product.description.substring(0, 50)}...</p>
                <div class="product-actions">
                    <button class="btn add-to-cart-btn" data-id="${product.id}">加入购物车</button>
                    <a href="detail.html?id=${product.id}" class="btn btn-secondary">查看详情</a>
                </div>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
    
    // 为每个"加入购物车"按钮添加事件
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId, 1);
        });
    });
}

// 新增：显示通知
function showNotification(message, type = 'info') {
    // 移除现有的通知
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-notification">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 自动隐藏
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
    
    // 点击关闭
    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
}

// 修改：页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeProducts();
    displayProductsWithAjax(); // 使用Ajax版本
    updateCartCount();
    
    // 修改搜索按钮事件
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearchWithAjax);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearchWithAjax();
        });
    }
    
    // 商品分类点击事件
    const categories = document.querySelectorAll('.category');
    categories.forEach(category => {
        category.addEventListener('click', function() {
            const categoryType = this.getAttribute('data-category');
            displayProductsWithAjax(categoryType);
        });
    });
    
    setupCarousel();
});


// 更新轮播图显示
function updateCarouselWithAjax() {
    const carouselContainer = document.querySelector('.banner .slides');
    const dotsContainer = document.querySelector('.banner .slide-controls');
    
    if (!carouselContainer || !dotsContainer) return;
    
    // 显示加载状态
    carouselContainer.innerHTML = '<div class="loading">正在加载轮播图...</div>';
    
    loadCarouselWithAjax()
        .then(response => {
            if (response.success) {
                renderCarousel(response.data);
                setupCarousel(); // 初始化轮播图交互
                showNotification('轮播图加载完成', 'success');
            }
        })
        .catch(error => {
            carouselContainer.innerHTML = `<div class="error">轮播图加载失败</div>`;
            showNotification('轮播图加载失败，将显示默认内容', 'error');
            // 加载默认轮播图
            setupCarousel();
        });
}

// 渲染轮播图
function renderCarousel(carouselData) {
    const carouselContainer = document.querySelector('.banner .slides');
    const dotsContainer = document.querySelector('.banner .slide-controls');
    
    if (!carouselContainer || !dotsContainer) return;
    
    // 清空内容
    carouselContainer.innerHTML = '';
    dotsContainer.innerHTML = '';
    
    // 生成轮播图
    carouselData.forEach((item, index) => {
        const slide = document.createElement('div');
        slide.className = `slide ${index === 0 ? 'active' : ''}`;
        slide.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${item.image}')`;
        slide.innerHTML = `
            <div class="slide-content">
                <h2>${item.title}</h2>
                <p>${item.description}</p>
                <a href="${item.link}" class="btn">立即查看</a>
            </div>
        `;
        carouselContainer.appendChild(slide);
        
        // 生成控制点
        const dot = document.createElement('span');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dotsContainer.appendChild(dot);
    });
}

// 搜索防抖功能（防止频繁请求）
let searchTimeout;
function setupSearchWithDebounce() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (!searchInput) return;
    
    // 实时搜索（防抖）
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        
        // 如果输入框为空，显示所有商品
        if (this.value.trim() === '') {
            displayProductsWithAjax();
            return;
        }
        
        searchTimeout = setTimeout(() => {
            performSearchWithAjax();
        }, 500); // 500ms延迟
    });
    
    // 按钮点击搜索
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearchWithAjax);
    }
    
    // Enter键搜索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearchWithAjax();
        }
    });
}

// 分类筛选功能
function setupCategoryFilter() {
    const categories = document.querySelectorAll('.category');
    
    categories.forEach(category => {
        category.addEventListener('click', function() {
            // 移除其他分类的active状态
            categories.forEach(cat => cat.classList.remove('active'));
            
            // 添加当前分类的active状态
            this.classList.add('active');
            
            const categoryType = this.getAttribute('data-category');
            filterProductsByCategory(categoryType);
        });
    });
}

// Ajax分类筛选
function filterProductsByCategory(category) {
    const productGrid = document.getElementById('product-list');
    if (!productGrid) return;
    
    // 显示加载状态
    productGrid.innerHTML = '<div class="loading">正在筛选商品...</div>';
    
    // 模拟Ajax请求
    setTimeout(() => {
        ajaxRequest('/api/products', 'GET')
            .then(response => {
                if (response.success) {
                    const allProducts = response.data;
                    const filteredProducts = category === 'all' 
                        ? allProducts 
                        : allProducts.filter(p => p.category === category);
                    
                    renderProductGrid(filteredProducts);
                    
                    // 显示筛选结果提示
                    const categoryNames = {
                        'electronics': '电子产品',
                        'clothing': '服装服饰',
                        'books': '图书音像',
                        'food': '食品饮料',
                        'all': '全部'
                    };
                    
                    showNotification(`已显示${categoryNames[category] || category}类商品`, 'info');
                }
            })
            .catch(error => {
                productGrid.innerHTML = `<div class="error">筛选失败：${error.message}</div>`;
            });
    }, 800);
}

// 搜索历史功能
function setupSearchHistory() {
    const searchInput = document.getElementById('search-input');
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    
    // 显示搜索历史
    const showSearchHistory = () => {
        const historyContainer = document.getElementById('search-history');
        if (!historyContainer || searchHistory.length === 0) return;
        
        historyContainer.innerHTML = `
            <div class="search-history-title">
                <span>搜索历史</span>
                <button onclick="clearSearchHistory()">清空</button>
            </div>
            <div class="search-history-items">
                ${searchHistory.slice(0, 5).map(item => `
                    <span class="history-item" onclick="searchFromHistory('${item}')">${item}</span>
                `).join('')}
            </div>
        `;
    };
    
    // 保存搜索历史
    const saveToSearchHistory = (keyword) => {
        if (!keyword.trim()) return;
        
        // 移除重复的关键词
        const filteredHistory = searchHistory.filter(item => item !== keyword);
        
        // 添加到最前面
        filteredHistory.unshift(keyword);
        
        // 最多保存10个
        if (filteredHistory.length > 10) {
            filteredHistory.pop();
        }
        
        localStorage.setItem('searchHistory', JSON.stringify(filteredHistory));
        showSearchHistory();
    };
    
    // 搜索框中显示历史
    searchInput.addEventListener('focus', showSearchHistory);
    
    // 点击其他地方隐藏历史
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-box')) {
            const historyContainer = document.getElementById('search-history');
            if (historyContainer) {
                historyContainer.innerHTML = '';
            }
        }
    });
    
    // 修改搜索函数，保存历史
    const originalSearch = performSearchWithAjax;
    window.performSearchWithAjax = function() {
        const keyword = searchInput.value.trim();
        if (keyword) {
            saveToSearchHistory(keyword);
        }
        originalSearch();
    };
}

// 从历史记录搜索
function searchFromHistory(keyword) {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = keyword;
        performSearchWithAjax();
    }
}

// 清空搜索历史
function clearSearchHistory() {
    localStorage.removeItem('searchHistory');
    const historyContainer = document.getElementById('search-history');
    if (historyContainer) {
        historyContainer.innerHTML = '';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initializeProducts();
    displayProductsWithAjax(); // 商品列表
    updateCartCount();
    setupSearchWithDebounce(); // 搜索功能
    setupCategoryFilter(); // 分类功能
    setupCarousel(); // 轮播图功能 - 现在直接调用
});