// ===== DASHBOARD SCRIPT =====

// Global Variables
let currentUser = null;
let currentSection = 'overview';
let dashboardData = {
    donations: [],
    notifications: [],
    stats: {}
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Load user data
    loadUserData();
    
    // Setup navigation
    setupSidebarNavigation();
    setupFormHandlers();
    setupFileUpload();
    
    // Load dashboard data
    loadDashboardData();
    
    // Initialize charts
    initializeCharts();
    
    // Setup real-time updates
    setupRealTimeUpdates();
    
    // Load initial section
    switchSection('overview');
    
    // Setup responsive behavior
    setupResponsiveHandlers();
}

// ===== USER DATA MANAGEMENT =====
function loadUserData() {
    const userData = localStorage.getItem('foodwise_user');
    if (userData) {
        currentUser = JSON.parse(userData);
        updateUserInterface();
    } else {
        // Redirect to login if no user data
        window.location.href = 'login.html';
    }
}

function updateUserInterface() {
    if (!currentUser) return;
    
    // Update user name display
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        const displayName = currentUser.firstName 
            ? `${currentUser.firstName} ${currentUser.lastName || ''}`
            : currentUser.businessName || currentUser.email;
        userNameElement.textContent = displayName;
    }
    
    // Update user avatar based on role
    const userAvatar = document.querySelector('.user-avatar i');
    if (userAvatar) {
        const roleIcons = {
            donor: 'fas fa-utensils',
            volunteer: 'fas fa-user-graduate',
            delivery: 'fas fa-shipping-fast',
            admin: 'fas fa-crown'
        };
        userAvatar.className = roleIcons[currentUser.role] || 'fas fa-user';
    }
    
    // Pre-fill forms with user data
    prefillUserData();
}

function prefillUserData() {
    // Pre-fill contact information in forms
    const contactPhone = document.getElementById('contactPhone');
    if (contactPhone && currentUser.phone) {
        contactPhone.value = currentUser.phone;
    }
    
    const pickupAddress = document.getElementById('pickupAddress');
    if (pickupAddress && currentUser.address) {
        pickupAddress.value = currentUser.address;
    }
    
    // Pre-fill profile form
    const profileFields = {
        businessNameProfile: currentUser.businessName,
        businessTypeProfile: currentUser.businessType,
        businessAddress: currentUser.address,
        contactEmail: currentUser.email,
        contactPhoneProfile: currentUser.phone
    };
    
    Object.entries(profileFields).forEach(([fieldId, value]) => {
        const field = document.getElementById(fieldId);
        if (field && value) {
            field.value = value;
        }
    });
}

// ===== NAVIGATION =====
function setupSidebarNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            if (section) {
                switchSection(section);
            }
        });
    });
}

function switchSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update navigation
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeMenuItem = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeMenuItem) {
        activeMenuItem.classList.add('active');
    }
    
    currentSection = sectionName;
    
    // Load section-specific data
    loadSectionData(sectionName);
}

function loadSectionData(section) {
    switch (section) {
        case 'overview':
            loadOverviewData();
            break;
        case 'manage':
            loadDonationsData();
            break;
        case 'analytics':
            loadAnalyticsData();
            break;
        default:
            break;
    }
}

// ===== DASHBOARD DATA =====
function loadDashboardData() {
    // Load sample data or fetch from API
    dashboardData = {
        donations: generateSampleDonations(),
        notifications: generateSampleNotifications(),
        stats: generateSampleStats()
    };
}

function generateSampleDonations() {
    return [
        {
            id: 1,
            foodName: 'Fresh Vegetable Surplus',
            foodType: 'raw',
            quantity: '15kg',
            servings: 30,
            status: 'verified',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            expiryTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
            pickupTime: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
            pickupAddress: '123 Food Street, Mumbai'
        },
        {
            id: 2,
            foodName: 'Wedding Buffet Leftovers',
            foodType: 'cooked',
            quantity: '50 plates',
            servings: 50,
            status: 'pending',
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
            expiryTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
            pickupTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
            pickupAddress: 'Wedding Hall, Andheri'
        },
        {
            id: 3,
            foodName: 'Restaurant Daily Surplus',
            foodType: 'cooked',
            quantity: '25 portions',
            servings: 25,
            status: 'delivered',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
            expiryTime: new Date(Date.now() - 20 * 60 * 60 * 1000), // Yesterday
            pickupTime: new Date(Date.now() - 22 * 60 * 60 * 1000), // Yesterday
            pickupAddress: 'Spice Garden Restaurant'
        }
    ];
}

function generateSampleNotifications() {
    return [
        {
            id: 1,
            type: 'success',
            icon: 'fas fa-check-circle',
            title: 'Food Verified',
            message: 'Your fresh vegetable donation has been verified and is ready for pickup.',
            time: new Date(Date.now() - 2 * 60 * 60 * 1000),
            unread: true
        },
        {
            id: 2,
            type: 'info',
            icon: 'fas fa-truck',
            title: 'Pickup Scheduled',
            message: 'Delivery agent will arrive at 3:00 PM today for your wedding buffet donation.',
            time: new Date(Date.now() - 4 * 60 * 60 * 1000),
            unread: false
        },
        {
            id: 3,
            type: 'success',
            icon: 'fas fa-heart',
            title: 'Impact Update',
            message: 'Your donations this month have fed 127 people. Thank you for making a difference!',
            time: new Date(Date.now() - 24 * 60 * 60 * 1000),
            unread: false
        }
    ];
}

function generateSampleStats() {
    return {
        totalDonations: 23,
        pendingVerification: 5,
        successfullyDelivered: 18,
        peopleFed: 127,
        foodRescued: 156, // kg
        mealsProvided: 312,
        taxSavings: 18240 // INR
    };
}

// ===== OVERVIEW DATA =====
function loadOverviewData() {
    updateStatsCards();
    updateRecentActivity();
    updateImpactSummary();
}

function updateStatsCards() {
    const stats = dashboardData.stats;
    
    // Update stat cards if they exist
    const statElements = [
        { selector: '.stat-card:nth-child(1) .stat-content h3', value: stats.totalDonations },
        { selector: '.stat-card:nth-child(2) .stat-content h3', value: stats.pendingVerification },
        { selector: '.stat-card:nth-child(3) .stat-content h3', value: stats.successfullyDelivered },
        { selector: '.stat-card:nth-child(4) .stat-content h3', value: stats.peopleFed }
    ];
    
    statElements.forEach(({ selector, value }) => {
        const element = document.querySelector(selector);
        if (element) {
            animateCounter(element, 0, value, 1000);
        }
    });
}

function updateRecentActivity() {
    const recentDonations = dashboardData.donations.slice(0, 3);
    const activityList = document.querySelector('.activity-list');
    
    if (activityList) {
        activityList.innerHTML = recentDonations.map(donation => {
            const statusInfo = getStatusInfo(donation.status);
            const timeAgo = getTimeAgo(donation.createdAt);
            
            return `
                <div class="activity-item">
                    <div class="activity-icon ${donation.status}">
                        <i class="${statusInfo.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <h4>${donation.foodName}</h4>
                        <p>${statusInfo.message}</p>
                        <span class="activity-time">${timeAgo}</span>
                    </div>
                    <div class="activity-status">
                        <span class="status-badge ${donation.status}">${statusInfo.label}</span>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function updateImpactSummary() {
    const impactElements = [
        { selector: '.impact-item:nth-child(1) .impact-number', value: `${dashboardData.stats.foodRescued}kg` },
        { selector: '.impact-item:nth-child(2) .impact-number', value: dashboardData.stats.mealsProvided },
        { selector: '.impact-item:nth-child(3) .impact-number', value: `₹${dashboardData.stats.taxSavings.toLocaleString()}` }
    ];
    
    impactElements.forEach(({ selector, value }) => {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = value;
        }
    });
}

// ===== DONATIONS MANAGEMENT =====
function loadDonationsData() {
    renderDonationsGrid();
}

function renderDonationsGrid() {
    const donationsGrid = document.getElementById('donationsGrid');
    if (!donationsGrid) return;
    
    const donations = dashboardData.donations;
    
    if (donations.length === 0) {
        donationsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-utensils"></i>
                <h3>No donations yet</h3>
                <p>Create your first food donation to get started.</p>
                <button class="btn btn-primary" onclick="switchSection('donate')">
                    <i class="fas fa-plus"></i>
                    Create Donation
                </button>
            </div>
        `;
        return;
    }
    
    donationsGrid.innerHTML = donations.map(donation => {
        const statusInfo = getStatusInfo(donation.status);
        const timeAgo = getTimeAgo(donation.createdAt);
        const expiryTime = formatDateTime(donation.expiryTime);
        
        return `
            <div class="donation-card" data-donation-id="${donation.id}">
                <div class="donation-header">
                    <div>
                        <h3 class="donation-title">${donation.foodName}</h3>
                        <span class="donation-type">${getFoodTypeLabel(donation.foodType)}</span>
                    </div>
                    <span class="status-badge ${donation.status}">${statusInfo.label}</span>
                </div>
                <div class="donation-info">
                    <div class="info-item">
                        <i class="fas fa-weight"></i>
                        <span>Quantity: ${donation.quantity}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-users"></i>
                        <span>Serves: ${donation.servings} people</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-clock"></i>
                        <span>Best before: ${expiryTime}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${donation.pickupAddress}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-calendar"></i>
                        <span>Created: ${timeAgo}</span>
                    </div>
                </div>
                <div class="donation-actions">
                    <button class="btn btn-outline btn-sm" onclick="viewDonationDetails(${donation.id})">
                        <i class="fas fa-eye"></i>
                        View Details
                    </button>
                    ${getDonationActions(donation)}
                </div>
            </div>
        `;
    }).join('');
}

function getDonationActions(donation) {
    switch (donation.status) {
        case 'pending':
            return `
                <button class="btn btn-secondary btn-sm" onclick="editDonation(${donation.id})">
                    <i class="fas fa-edit"></i>
                    Edit
                </button>
                <button class="btn btn-outline btn-sm" onclick="cancelDonation(${donation.id})">
                    <i class="fas fa-times"></i>
                    Cancel
                </button>
            `;
        case 'verified':
            return `
                <button class="btn btn-primary btn-sm" onclick="trackDonation(${donation.id})">
                    <i class="fas fa-truck"></i>
                    Track Pickup
                </button>
            `;
        case 'delivered':
            return `
                <button class="btn btn-primary btn-sm" onclick="viewImpact(${donation.id})">
                    <i class="fas fa-chart-bar"></i>
                    View Impact
                </button>
            `;
        default:
            return '';
    }
}

function filterDonations() {
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    
    let filteredDonations = [...dashboardData.donations];
    
    // Filter by status
    if (statusFilter !== 'all') {
        filteredDonations = filteredDonations.filter(donation => donation.status === statusFilter);
    }
    
    // Filter by date
    if (dateFilter !== 'all') {
        const now = new Date();
        filteredDonations = filteredDonations.filter(donation => {
            const donationDate = new Date(donation.createdAt);
            switch (dateFilter) {
                case 'today':
                    return donationDate.toDateString() === now.toDateString();
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return donationDate >= weekAgo;
                case 'month':
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    return donationDate >= monthAgo;
                default:
                    return true;
            }
        });
    }
    
    // Update the global data temporarily for rendering
    const originalDonations = dashboardData.donations;
    dashboardData.donations = filteredDonations;
    renderDonationsGrid();
    dashboardData.donations = originalDonations;
}

// ===== FORM HANDLING =====
function setupFormHandlers() {
    // Donation form
    const donationForm = document.getElementById('donationForm');
    if (donationForm) {
        donationForm.addEventListener('submit', handleDonationSubmission);
    }
    
    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
    
    // Set minimum date/time for forms
    setMinimumDateTime();
}

function setMinimumDateTime() {
    const now = new Date();
    const isoString = now.toISOString().slice(0, 16); // Format for datetime-local
    
    const expiryTimeInput = document.getElementById('expiryTime');
    const pickupTimeInput = document.getElementById('pickupTime');
    
    if (expiryTimeInput) {
        expiryTimeInput.min = isoString;
    }
    
    if (pickupTimeInput) {
        pickupTimeInput.min = isoString;
    }
}

function handleDonationSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const donationData = {
        id: Date.now(), // Simple ID generation
        foodName: formData.get('foodName'),
        foodType: formData.get('foodType'),
        quantity: formData.get('quantity'),
        servings: parseInt(formData.get('servings')) || 0,
        expiryTime: new Date(formData.get('expiryTime')),
        pickupTime: new Date(formData.get('pickupTime')),
        pickupAddress: formData.get('pickupAddress'),
        contactPerson: formData.get('contactPerson'),
        contactPhone: formData.get('contactPhone'),
        specialInstructions: formData.get('specialInstructions'),
        urgent: formData.get('urgent') === 'on',
        status: 'pending',
        createdAt: new Date()
    };
    
    // Validate form data
    if (!validateDonationData(donationData)) {
        return;
    }
    
    // Show loading
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        // Add to dashboard data
        dashboardData.donations.unshift(donationData);
        
        // Update stats
        dashboardData.stats.totalDonations++;
        dashboardData.stats.pendingVerification++;
        
        // Hide loading
        hideLoading();
        
        // Show success message
        showNotification('Donation created successfully! Volunteers will be notified for verification.', 'success');
        
        // Clear form and switch to manage section
        e.target.reset();
        removeImage();
        switchSection('manage');
    }, 2000);
}

function validateDonationData(data) {
    if (!data.foodName || !data.foodType || !data.quantity || !data.pickupAddress || !data.contactPhone) {
        showNotification('Please fill in all required fields', 'error');
        return false;
    }
    
    if (data.expiryTime <= new Date()) {
        showNotification('Expiry time must be in the future', 'error');
        return false;
    }
    
    if (data.pickupTime <= new Date()) {
        showNotification('Pickup time must be in the future', 'error');
        return false;
    }
    
    if (data.pickupTime >= data.expiryTime) {
        showNotification('Pickup time must be before expiry time', 'error');
        return false;
    }
    
    return true;
}

function handleProfileUpdate(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    // Update current user data
    const updatedUser = {
        ...currentUser,
        businessName: formData.get('businessName'),
        businessType: formData.get('businessType'),
        address: formData.get('businessAddress'),
        email: formData.get('contactEmail'),
        phone: formData.get('contactPhone')
    };
    
    // Save to localStorage
    localStorage.setItem('foodwise_user', JSON.stringify(updatedUser));
    currentUser = updatedUser;
    
    showNotification('Profile updated successfully!', 'success');
}

function clearForm() {
    const donationForm = document.getElementById('donationForm');
    if (donationForm) {
        donationForm.reset();
        removeImage();
        setMinimumDateTime();
    }
}

// ===== FILE UPLOAD =====
function setupFileUpload() {
    const fileInput = document.getElementById('foodImage');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification('Please select a valid image file', 'error');
        return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Image size must be less than 5MB', 'error');
        return;
    }
    
    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
        showImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
}

function showImagePreview(imageSrc) {
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const uploadArea = document.querySelector('.file-upload');
    
    if (preview && previewImg && uploadArea) {
        previewImg.src = imageSrc;
        preview.style.display = 'block';
        uploadArea.style.display = 'none';
    }
}

function removeImage() {
    const preview = document.getElementById('imagePreview');
    const uploadArea = document.querySelector('.file-upload');
    const fileInput = document.getElementById('foodImage');
    
    if (preview && uploadArea && fileInput) {
        preview.style.display = 'none';
        uploadArea.style.display = 'block';
        fileInput.value = '';
    }
}

// ===== NOTIFICATIONS =====
function toggleNotifications() {
    const panel = document.getElementById('notificationPanel');
    if (panel) {
        panel.classList.toggle('active');
        
        // Mark notifications as read when panel is opened
        if (panel.classList.contains('active')) {
            markNotificationsAsRead();
        }
    }
}

function markNotificationsAsRead() {
    dashboardData.notifications.forEach(notification => {
        notification.unread = false;
    });
    
    // Update notification badge
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.style.display = 'none';
    }
    
    // Remove unread styling
    document.querySelectorAll('.notification-item.unread').forEach(item => {
        item.classList.remove('unread');
    });
}

// ===== USER MENU =====
function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

function editProfile() {
    switchSection('profile');
    toggleUserMenu();
}

function viewSettings() {
    showNotification('Settings panel will be available in the next update', 'info');
    toggleUserMenu();
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('foodwise_user');
        localStorage.removeItem('foodwise_auth_time');
        window.location.href = 'index.html';
    }
    toggleUserMenu();
}

// ===== DONATION ACTIONS =====
function viewDonationDetails(donationId) {
    const donation = dashboardData.donations.find(d => d.id === donationId);
    if (!donation) return;
    
    // Create modal or detailed view
    showNotification(`Viewing details for: ${donation.foodName}`, 'info');
}

function editDonation(donationId) {
    const donation = dashboardData.donations.find(d => d.id === donationId);
    if (!donation) return;
    
    // Switch to donation form and pre-fill data
    switchSection('donate');
    
    // Pre-fill form with donation data
    setTimeout(() => {
        const form = document.getElementById('donationForm');
        if (form) {
            Object.entries(donation).forEach(([key, value]) => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field && value) {
                    if (field.type === 'datetime-local') {
                        field.value = new Date(value).toISOString().slice(0, 16);
                    } else {
                        field.value = value;
                    }
                }
            });
        }
    }, 100);
}

function cancelDonation(donationId) {
    if (confirm('Are you sure you want to cancel this donation?')) {
        dashboardData.donations = dashboardData.donations.filter(d => d.id !== donationId);
        dashboardData.stats.totalDonations--;
        dashboardData.stats.pendingVerification--;
        
        renderDonationsGrid();
        showNotification('Donation cancelled successfully', 'success');
    }
}

function trackDonation(donationId) {
    showNotification('Tracking feature will be available soon', 'info');
}

function viewImpact(donationId) {
    switchSection('analytics');
    showNotification('Showing impact analytics for your donation', 'success');
}

// ===== CHARTS =====
function initializeCharts() {
    // Simple chart implementation without external libraries
    setTimeout(() => {
        drawSimpleCharts();
    }, 500);
}

function drawSimpleCharts() {
    // Impact chart
    drawImpactChart();
    
    // Monthly chart
    drawMonthlyChart();
    
    // Food types chart
    drawFoodTypesChart();
}

function drawImpactChart() {
    const canvas = document.getElementById('impactChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Simple bar chart
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(50, height - 80, 60, 60);
    ctx.fillRect(130, height - 100, 60, 80);
    ctx.fillRect(210, height - 120, 60, 100);
    
    // Labels
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText('Week 1', 80, height - 10);
    ctx.fillText('Week 2', 160, height - 10);
    ctx.fillText('Week 3', 240, height - 10);
}

function drawMonthlyChart() {
    const canvas = document.getElementById('monthlyChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Simple line chart
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(50, height - 50);
    ctx.lineTo(150, height - 80);
    ctx.lineTo(250, height - 60);
    ctx.lineTo(350, height - 90);
    ctx.stroke();
    
    // Points
    ctx.fillStyle = '#22c55e';
    [50, 150, 250, 350].forEach((x, i) => {
        const y = [height - 50, height - 80, height - 60, height - 90][i];
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
}

function drawFoodTypesChart() {
    const canvas = document.getElementById('foodTypesChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 60;
    
    // Simple pie chart
    const data = [40, 30, 20, 10]; // percentages
    const colors = ['#22c55e', '#f97316', '#3b82f6', '#8b5cf6'];
    
    let currentAngle = 0;
    data.forEach((percentage, index) => {
        const sliceAngle = (percentage / 100) * 2 * Math.PI;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = colors[index];
        ctx.fill();
        
        currentAngle += sliceAngle;
    });
}

function loadAnalyticsData() {
    // Refresh charts when analytics section is loaded
    setTimeout(() => {
        drawSimpleCharts();
    }, 100);
}

// ===== UTILITY FUNCTIONS =====
function getStatusInfo(status) {
    const statusMap = {
        pending: {
            icon: 'fas fa-clock',
            label: 'Pending',
            message: 'Awaiting volunteer verification'
        },
        verified: {
            icon: 'fas fa-check',
            label: 'Verified',
            message: 'Verified and ready for pickup'
        },
        picked_up: {
            icon: 'fas fa-truck',
            label: 'Picked Up',
            message: 'Picked up by delivery agent'
        },
        delivered: {
            icon: 'fas fa-check-circle',
            label: 'Delivered',
            message: 'Successfully delivered'
        },
        expired: {
            icon: 'fas fa-times-circle',
            label: 'Expired',
            message: 'Expired without pickup'
        }
    };
    
    return statusMap[status] || statusMap.pending;
}

function getFoodTypeLabel(type) {
    const typeMap = {
        raw: 'Raw Ingredients',
        cooked: 'Cooked Food',
        packaged: 'Packaged Items',
        beverages: 'Beverages',
        dairy: 'Dairy Products',
        bakery: 'Bakery Items'
    };
    
    return typeMap[type] || type;
}

function getTimeAgo(date) {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString();
}

function formatDateTime(date) {
    return new Date(date).toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = Math.floor(start + (end - start) * progress);
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.dashboard-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `dashboard-notification dashboard-notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
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
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
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

// ===== RESPONSIVE HANDLERS =====
function setupResponsiveHandlers() {
    // Close sidebar on mobile when clicking outside
    document.addEventListener('click', function(e) {
        const sidebar = document.getElementById('sidebar');
        const hamburger = document.querySelector('.hamburger');
        
        if (window.innerWidth <= 1024 && sidebar && !sidebar.contains(e.target) && !hamburger?.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        const dropdowns = document.querySelectorAll('.dropdown-menu');
        dropdowns.forEach(dropdown => {
            if (!dropdown.closest('.dropdown').contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
        
        const notificationPanel = document.getElementById('notificationPanel');
        if (notificationPanel && !notificationPanel.contains(e.target) && !e.target.closest('[onclick="toggleNotifications()"]')) {
            notificationPanel.classList.remove('active');
        }
    });
}

// ===== REAL-TIME UPDATES =====
function setupRealTimeUpdates() {
    // Simulate real-time updates every 30 seconds
    setInterval(() => {
        updateDashboardData();
    }, 30000);
}

function updateDashboardData() {
    // Simulate status updates
    dashboardData.donations.forEach(donation => {
        if (donation.status === 'pending' && Math.random() > 0.8) {
            donation.status = 'verified';
            dashboardData.stats.pendingVerification--;
            
            // Add notification
            dashboardData.notifications.unshift({
                id: Date.now(),
                type: 'success',
                icon: 'fas fa-check-circle',
                title: 'Food Verified',
                message: `Your ${donation.foodName} has been verified and is ready for pickup.`,
                time: new Date(),
                unread: true
            });
            
            // Update notification badge
            const badge = document.querySelector('.notification-badge');
            if (badge) {
                badge.style.display = 'flex';
                badge.textContent = dashboardData.notifications.filter(n => n.unread).length;
            }
        }
    });
    
    // Refresh current section
    loadSectionData(currentSection);
}

// ===== GLOBAL FUNCTIONS =====
window.switchSection = switchSection;
window.toggleNotifications = toggleNotifications;
window.toggleUserMenu = toggleUserMenu;
window.editProfile = editProfile;
window.viewSettings = viewSettings;
window.logout = logout;
window.filterDonations = filterDonations;
window.viewDonationDetails = viewDonationDetails;
window.editDonation = editDonation;
window.cancelDonation = cancelDonation;
window.trackDonation = trackDonation;
window.viewImpact = viewImpact;
window.clearForm = clearForm;
window.removeImage = removeImage;