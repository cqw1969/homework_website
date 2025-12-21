// 用户注册
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const username = document.getElementById('reg-username').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;
            
            // 清除之前的错误信息
            clearErrors();
            
            // 表单验证
            let isValid = true;
            
            if (username.length < 3 || username.length > 20) {
                showError('reg-username-error', '用户名长度应为3-20个字符');
                isValid = false;
            }
            
            if (!isValidEmail(email)) {
                showError('reg-email-error', '请输入有效的邮箱地址');
                isValid = false;
            }
            
            if (password.length < 6) {
                showError('reg-password-error', '密码长度至少6位');
                isValid = false;
            }
            
            if (password !== confirmPassword) {
                showError('reg-confirm-error', '两次输入的密码不一致');
                isValid = false;
            }
            
            if (isValid) {
                // 获取现有用户数据
                const users = JSON.parse(localStorage.getItem('users')) || [];
                
                // 检查用户名和邮箱是否已存在
                if (users.some(user => user.username === username)) {
                    showError('reg-username-error', '该用户名已被注册');
                    return;
                }
                
                if (users.some(user => user.email === email)) {
                    showError('reg-email-error', '该邮箱已被注册');
                    return;
                }
                
                // 创建新用户
                const newUser = {
                    id: Date.now(),
                    username: username,
                    email: email,
                    password: password, // 注意：实际项目中应该加密存储
                    registerDate: new Date().toISOString(),
                    level: '普通会员'
                };
                
                // 保存用户数据
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                
                // 自动登录
                localStorage.setItem('currentUser', JSON.stringify(newUser));
                
                // 显示成功消息并跳转
                alert('注册成功！');
                window.location.href = 'index.html';
            }
        });
    }
    
    // 登录功能
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            clearErrors();
            
            // 验证登录信息
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => 
                (u.username === username || u.email === username) && 
                u.password === password
            );
            
            if (user) {
                // 登录成功
                localStorage.setItem('currentUser', JSON.stringify(user));
                alert('登录成功！');
                window.location.href = 'index.html';
            } else {
                showError('password-error', '用户名或密码错误');
            }
        });
    }
    
    // 更新页面上的登录状态
    updateLoginStatus();
});

// 显示错误信息
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// 清除错误信息
function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => el.textContent = '');
}

// 邮箱格式验证
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 更新登录状态
function updateLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    
    if (currentUser && loginBtn) {
        loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.username}`;
        loginBtn.href = 'user.html';
        
        if (registerBtn) {
            registerBtn.style.display = 'none';
        }
    }
}