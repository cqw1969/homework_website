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
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    
    if (slides.length === 0) return;
    
    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    // 为每个点添加点击事件
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });
    
    // 自动轮播
    setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);
}

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