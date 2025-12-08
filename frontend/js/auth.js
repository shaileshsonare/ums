// Check if user is already logged in
if (getToken()) {
    window.location.href = 'dashboard.html';
}

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const toggleRegisterLink = document.getElementById('toggleRegister');
const toggleLoginLink = document.getElementById('toggleLogin');
const alertContainer = document.getElementById('alertContainer');
const registerToggle = document.getElementById('registerToggle');

// Show alert message
const showAlert = (message, type = 'error') => {
    alertContainer.innerHTML = `
        <div class="alert alert-${type}">
            ${message}
        </div>
    `;

    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 5000);
};

// Toggle between login and register forms
toggleRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    toggleRegisterLink.parentElement.parentElement.style.display = 'none';
    registerToggle.style.display = 'block';
    alertContainer.innerHTML = '';
});

toggleLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
    registerToggle.style.display = 'none';
    toggleRegisterLink.parentElement.parentElement.style.display = 'block';
    alertContainer.innerHTML = '';
});

// Handle login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');

    if (!username || !password) {
        showAlert('Please fill in all fields');
        return;
    }

    try {
        loginBtn.disabled = true;
        loginBtn.textContent = 'Signing in...';

        const response = await authAPI.login(username, password);

        if (response.success) {
            setToken(response.token);
            showAlert('Login successful! Redirecting...', 'success');

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        }
    } catch (error) {
        showAlert(error.message || 'Login failed. Please check your credentials.');
        loginBtn.disabled = false;
        loginBtn.textContent = 'Sign In';
    }
});

// Handle registration
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    const registerBtn = document.getElementById('registerBtn');

    if (!username || !password) {
        showAlert('Please fill in all fields');
        return;
    }

    if (password.length < 6) {
        showAlert('Password must be at least 6 characters long');
        return;
    }

    try {
        registerBtn.disabled = true;
        registerBtn.textContent = 'Creating account...';

        const response = await authAPI.register(username, password);

        if (response.success) {
            setToken(response.token);
            showAlert('Account created successfully! Redirecting...', 'success');

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        }
    } catch (error) {
        showAlert(error.message || 'Registration failed. Please try again.');
        registerBtn.disabled = false;
        registerBtn.textContent = 'Create Account';
    }
});
