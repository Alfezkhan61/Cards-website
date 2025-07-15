// ===== AUTHENTICATION SCRIPT =====

// Global variables
let selectedRole = null;
const roleIcons = {
    donor: 'fas fa-utensils',
    volunteer: 'fas fa-user-graduate',
    delivery: 'fas fa-shipping-fast',
    admin: 'fas fa-crown'
};

const roleLabels = {
    donor: 'Donor',
    volunteer: 'Volunteer',
    delivery: 'Delivery Agent',
    admin: 'Admin'
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
    setupFormHandlers();
    setupRoleSelection();
    checkURLParameters();
});

function initializeAuth() {
    // Initialize password toggles
    setupPasswordToggles();
    
    // Initialize form validation
    setupFormValidation();
    
    // Check if user is already logged in
    checkAuthStatus();
}

// ===== URL PARAMETER HANDLING =====
function checkURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role');
    
    if (role && window.location.pathname.includes('register.html')) {
        selectRole(role);
    }
}

// ===== ROLE SELECTION =====
function setupRoleSelection() {
    const roleCards = document.querySelectorAll('.role-card');
    
    roleCards.forEach(card => {
        card.addEventListener('click', function() {
            const role = this.getAttribute('data-role');
            selectRole(role);
        });
    });
}

function selectRole(role) {
    // Remove previous selections
    document.querySelectorAll('.role-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Select new role
    const selectedCard = document.querySelector(`[data-role="${role}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    selectedRole = role;
    updateSelectedRoleDisplay(role);
    showRegistrationForm();
    showRoleSpecificFields(role);
}

function updateSelectedRoleDisplay(role) {
    const selectedRoleIcon = document.getElementById('selectedRoleIcon');
    const selectedRoleText = document.getElementById('selectedRoleText');
    
    if (selectedRoleIcon && selectedRoleText) {
        selectedRoleIcon.className = roleIcons[role];
        selectedRoleText.textContent = roleLabels[role];
    }
}

function showRegistrationForm() {
    const roleSelection = document.getElementById('roleSelection');
    const registerForm = document.getElementById('registerForm');
    
    if (roleSelection && registerForm) {
        roleSelection.style.display = 'none';
        registerForm.style.display = 'block';
    }
}

function showRoleSelection() {
    const roleSelection = document.getElementById('roleSelection');
    const registerForm = document.getElementById('registerForm');
    
    if (roleSelection && registerForm) {
        roleSelection.style.display = 'block';
        registerForm.style.display = 'none';
        
        // Clear form
        registerForm.reset();
        
        // Reset role selection
        document.querySelectorAll('.role-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        selectedRole = null;
    }
}

function showRoleSpecificFields(role) {
    // Hide all role-specific fields
    document.querySelectorAll('.role-fields').forEach(field => {
        field.classList.remove('active');
    });
    
    // Show selected role fields
    const roleFields = document.querySelector(`.${role}-fields`);
    if (roleFields) {
        roleFields.classList.add('active');
    }
}

// ===== PASSWORD TOGGLE =====
function setupPasswordToggles() {
    const toggleButtons = document.querySelectorAll('.password-toggle');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            togglePasswordVisibility(input, this.querySelector('i'));
        });
    });
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    togglePasswordVisibility(input, icon);
}

function togglePasswordVisibility(input, icon) {
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// ===== FORM HANDLING =====
function setupFormHandlers() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Registration form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');
    
    // Validate credentials
    if (validateLoginCredentials(email, password)) {
        performLogin(email, password, remember);
    }
}

function handleRegistration(e) {
    e.preventDefault();
    
    if (!selectedRole) {
        showNotification('Please select a role to continue', 'error');
        return;
    }
    
    const formData = new FormData(e.target);
    
    // Validate form data
    if (validateRegistrationForm(formData)) {
        performRegistration(formData);
    }
}

// ===== VALIDATION =====
function setupFormValidation() {
    // Real-time validation for email
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateEmail(this);
        });
    });
    
    // Real-time validation for password confirmation
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('blur', function() {
            validatePasswordMatch();
        });
    }
    
    // Real-time validation for phone
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    });
}

function validateEmail(input) {
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        showFieldError(input, 'Please enter a valid email address');
        return false;
    } else {
        clearFieldError(input);
        return true;
    }
}

function validatePasswordMatch() {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    
    if (password && confirmPassword) {
        if (password.value !== confirmPassword.value) {
            showFieldError(confirmPassword, 'Passwords do not match');
            return false;
        } else {
            clearFieldError(confirmPassword);
            return true;
        }
    }
    return true;
}

function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length >= 10) {
        value = value.substring(0, 10);
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    
    input.value = value;
}

function validateLoginCredentials(email, password) {
    if (!email || !password) {
        showNotification('Please fill in all required fields', 'error');
        return false;
    }
    
    if (!validateEmailFormat(email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    return true;
}

function validateRegistrationForm(formData) {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'password', 'address'];
    
    for (let field of requiredFields) {
        if (!formData.get(field)) {
            showNotification(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`, 'error');
            return false;
        }
    }
    
    // Validate email format
    if (!validateEmailFormat(formData.get('email'))) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    // Validate password strength
    const password = formData.get('password');
    if (password.length < 8) {
        showNotification('Password must be at least 8 characters long', 'error');
        return false;
    }
    
    // Check password match
    if (password !== formData.get('confirmPassword')) {
        showNotification('Passwords do not match', 'error');
        return false;
    }
    
    // Check terms acceptance
    if (!formData.get('terms')) {
        showNotification('Please accept the terms of service', 'error');
        return false;
    }
    
    // Role-specific validations
    if (!validateRoleSpecificFields(formData)) {
        return false;
    }
    
    return true;
}

function validateRoleSpecificFields(formData) {
    switch (selectedRole) {
        case 'donor':
            if (!formData.get('businessName')) {
                showNotification('Please enter your business name', 'error');
                return false;
            }
            break;
        case 'volunteer':
            if (!formData.get('university')) {
                showNotification('Please enter your university/college', 'error');
                return false;
            }
            break;
        case 'delivery':
            if (!formData.get('vehicleType') || !formData.get('licenseNumber')) {
                showNotification('Please fill in all delivery-related fields', 'error');
                return false;
            }
            break;
        case 'admin':
            if (!formData.get('adminCode')) {
                showNotification('Please enter the admin access code', 'error');
                return false;
            }
            // Validate admin code
            if (formData.get('adminCode') !== 'FOODWISE2024') {
                showNotification('Invalid admin access code', 'error');
                return false;
            }
            break;
    }
    return true;
}

function validateEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== AUTHENTICATION ACTIONS =====
function performLogin(email, password, remember) {
    const loginButton = document.querySelector('.auth-submit');
    const originalText = loginButton.innerHTML;
    
    // Show loading state
    loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
    loginButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Check demo credentials or perform actual authentication
        const userRole = checkDemoCredentials(email, password) || authenticateUser(email, password);
        
        if (userRole) {
            // Store user session
            storeUserSession({
                email,
                role: userRole,
                remember
            });
            
            showNotification('Login successful! Redirecting...', 'success');
            
            // Redirect to appropriate dashboard
            setTimeout(() => {
                redirectToDashboard(userRole);
            }, 1500);
        } else {
            showNotification('Invalid email or password', 'error');
            loginButton.innerHTML = originalText;
            loginButton.disabled = false;
        }
    }, 1000);
}

function performRegistration(formData) {
    const registerButton = document.querySelector('.auth-submit');
    const originalText = registerButton.innerHTML;
    
    // Show loading state
    registerButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    registerButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Store user data (in real app, this would be sent to server)
        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            role: selectedRole,
            address: formData.get('address'),
            businessName: formData.get('businessName'),
            university: formData.get('university'),
            vehicleType: formData.get('vehicleType'),
            department: formData.get('department')
        };
        
        // Store user session
        storeUserSession(userData);
        
        showNotification('Account created successfully! Redirecting...', 'success');
        
        // Redirect to appropriate dashboard
        setTimeout(() => {
            redirectToDashboard(selectedRole);
        }, 1500);
    }, 1500);
}

// ===== DEMO LOGIN =====
function loginAsDemo(role) {
    const demoCredentials = {
        donor: { email: 'demo@donor.com', password: 'demo123' },
        volunteer: { email: 'demo@volunteer.com', password: 'demo123' },
        delivery: { email: 'demo@delivery.com', password: 'demo123' },
        admin: { email: 'demo@admin.com', password: 'demo123' }
    };
    
    const credentials = demoCredentials[role];
    if (credentials) {
        // Fill login form if present
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (emailInput && passwordInput) {
            emailInput.value = credentials.email;
            passwordInput.value = credentials.password;
        }
        
        // Perform login
        performLogin(credentials.email, credentials.password, false);
    }
}

function checkDemoCredentials(email, password) {
    const demoAccounts = {
        'demo@donor.com': 'donor',
        'demo@volunteer.com': 'volunteer',
        'demo@delivery.com': 'delivery',
        'demo@admin.com': 'admin'
    };
    
    if (password === 'demo123' && demoAccounts[email]) {
        return demoAccounts[email];
    }
    
    return null;
}

function authenticateUser(email, password) {
    // This would typically make an API call to your backend
    // For demo purposes, we'll just return null (invalid credentials)
    return null;
}

// ===== SESSION MANAGEMENT =====
function storeUserSession(userData) {
    // Store in localStorage (in production, use secure session management)
    localStorage.setItem('foodwise_user', JSON.stringify(userData));
    localStorage.setItem('foodwise_auth_time', Date.now().toString());
}

function checkAuthStatus() {
    const userData = localStorage.getItem('foodwise_user');
    const authTime = localStorage.getItem('foodwise_auth_time');
    
    if (userData && authTime) {
        const user = JSON.parse(userData);
        const loginTime = parseInt(authTime);
        const currentTime = Date.now();
        const hoursSinceLogin = (currentTime - loginTime) / (1000 * 60 * 60);
        
        // If logged in within last 24 hours, redirect to dashboard
        if (hoursSinceLogin < 24) {
            if (window.location.pathname.includes('login.html') || 
                window.location.pathname.includes('register.html')) {
                redirectToDashboard(user.role);
            }
        } else {
            // Clear expired session
            clearUserSession();
        }
    }
}

function clearUserSession() {
    localStorage.removeItem('foodwise_user');
    localStorage.removeItem('foodwise_auth_time');
}

function redirectToDashboard(role) {
    const dashboardUrls = {
        donor: 'dashboard-donor.html',
        volunteer: 'dashboard-volunteer.html',
        delivery: 'dashboard-delivery.html',
        admin: 'dashboard-admin.html'
    };
    
    const url = dashboardUrls[role];
    if (url) {
        window.location.href = url;
    } else {
        console.error('Invalid role for dashboard redirect:', role);
    }
}

// ===== UTILITY FUNCTIONS =====
function showFieldError(input, message) {
    clearFieldError(input);
    
    input.style.borderColor = '#ef4444';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.75rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    input.parentNode.parentNode.appendChild(errorDiv);
}

function clearFieldError(input) {
    input.style.borderColor = '';
    
    const errorDiv = input.parentNode.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.auth-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `auth-notification auth-notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#22c55e' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                margin-left: 1rem;
                opacity: 0.8;
            ">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== GLOBAL FUNCTIONS =====
window.togglePassword = togglePassword;
window.showRoleSelection = showRoleSelection;
window.loginAsDemo = loginAsDemo;