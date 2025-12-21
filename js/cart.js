// 显示购物车内容
function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    
    if (!cartItems) return;
    
    // 清空购物车显示
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        if (cartEmpty) cartEmpty.style.display = 'block';
        updateCartSummary();
        return;
    }
    
    if (cartEmpty) cartEmpty.style.display = 'none';
    
    // 显示购物车商品
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="https://via.placeholder.com/100x100" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <div class="cart-item-price">单价：¥${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn minus" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn plus" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="btn btn-remove" onclick="removeFromCart(${item.id})">删除</button>
            </div>
            <div class="cart-item-total">
                ¥${(item.price * item.quantity).toFixed(2)}
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    updateCartSummary();
}

// 更新购物车商品数量
function updateQuantity(productId, change) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            // 如果数量为0或负数，移除商品
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
            updateCartCount();
        }
    }
}

// 从购物车移除商品
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

// 更新购物车摘要
function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // 计算总价
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 15 : 0; // 假设运费15元
    const discount = subtotal > 500 ? 50 : 0; // 假设满500减50
    const total = subtotal + shipping - discount;
    
    // 更新显示
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const discountEl = document.getElementById('discount');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = `¥${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = `¥${shipping.toFixed(2)}`;
    if (discountEl) discountEl.textContent = `-¥${discount.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `¥${total.toFixed(2)}`;
}

// 结算功能
function setupCheckout() {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            
            if (cart.length === 0) {
                alert('购物车为空，无法结算');
                return;
            }
            
            if (!currentUser) {
                alert('请先登录再结算');
                window.location.href = 'login.html';
                return;
            }
            
            // 创建订单
            const order = {
                id: Date.now(),
                userId: currentUser.id,
                items: cart,
                total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                date: new Date().toISOString(),
                status: '待付款'
            };
            
            // 保存订单
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));
            
            // 清空购物车
            localStorage.setItem('cart', JSON.stringify([]));
            
            alert('订单创建成功！订单号：' + order.id);
            displayCart();
            updateCartCount();
            
            // 跳转到订单页面或首页
            window.location.href = 'user.html';
        });
    }
}

// 页面加载时初始化购物车
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
        setupCheckout();
    }
});

// 修改：使用Ajax模拟结算
function setupCheckoutWithAjax() {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            
            if (cart.length === 0) {
                showNotification('购物车为空，无法结算', 'error');
                return;
            }
            
            if (!currentUser) {
                showNotification('请先登录再结算', 'error');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
                return;
            }
            
            // 显示加载状态
            checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 处理中...';
            checkoutBtn.disabled = true;
            
            // 模拟Ajax请求
            setTimeout(() => {
                // 创建订单
                const order = {
                    id: Date.now(),
                    userId: currentUser.id,
                    items: cart,
                    total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                    date: new Date().toISOString(),
                    status: '待付款'
                };
                
                // 保存订单
                const orders = JSON.parse(localStorage.getItem('orders')) || [];
                orders.push(order);
                localStorage.setItem('orders', JSON.stringify(orders));
                
                // 清空购物车
                localStorage.setItem('cart', JSON.stringify([]));
                
                // 恢复按钮状态
                checkoutBtn.innerHTML = '<i class="fas fa-credit-card"></i> 去结算';
                checkoutBtn.disabled = false;
                
                // 显示成功消息
                showNotification(`订单创建成功！订单号：${order.id}`, 'success');
                
                // 更新购物车显示
                setTimeout(() => {
                    displayCart();
                    updateCartCount();
                }, 1000);
                
                // 3秒后跳转到用户中心
                setTimeout(() => {
                    window.location.href = 'user.html';
                }, 3000);
                
            }, 1500); // 模拟网络延迟
        });
    }
}

// 修改：页面加载时初始化购物车
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
        setupCheckoutWithAjax(); // 使用Ajax版本
    }
});