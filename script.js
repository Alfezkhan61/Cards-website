// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Smooth Scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Counter Animation for Impact Stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // Animation duration in milliseconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += step;
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            
            // Trigger counter animation when stats section is visible
            if (entry.target.classList.contains('impact-stats')) {
                setTimeout(animateCounters, 300);
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.impact-stats, .how-it-works, .testimonials, .join-section');
    animateElements.forEach(el => observer.observe(el));
});

// Navbar scroll effect
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// Form validation functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ''));
}

function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--light-green)' : '#ef4444'};
        color: white;
        padding: 1rem 2rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-medium);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 300);
    }, 3000);
}

// Add CSS for message animations
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

// Utility functions for localStorage
function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function removeFromStorage(key) {
    localStorage.removeItem(key);
}

// Mock data for development
const mockUsers = [
    {
        id: 1,
        email: 'admin@foodwise.org',
        password: 'admin123',
        role: 'admin',
        name: 'Admin User',
        verified: true
    },
    {
        id: 2,
        email: 'donor@restaurant.com',
        password: 'donor123',
        role: 'donor',
        name: 'Restaurant Owner',
        verified: true,
        businessName: 'Green Eats Restaurant'
    },
    {
        id: 3,
        email: 'volunteer@student.edu',
        password: 'volunteer123',
        role: 'volunteer',
        name: 'Sarah Chen',
        verified: true,
        university: 'Local University',
        points: 150
    },
    {
        id: 4,
        email: 'delivery@agent.com',
        password: 'delivery123',
        role: 'delivery',
        name: 'David Kumar',
        verified: true,
        vehicle: 'Motorcycle'
    }
];

// Initialize mock data if not exists
if (!getFromStorage('users')) {
    saveToStorage('users', mockUsers);
}

// Mock donations data
const mockDonations = [
    {
        id: 1,
        donorId: 2,
        foodName: 'Surplus Sandwiches',
        quantity: '50 pieces',
        location: '123 Main St, Downtown',
        pickupTime: '2024-01-15T18:00',
        status: 'pending',
        description: 'Fresh sandwiches from catering event',
        imageUrl: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=300&h=200&fit=crop'
    },
    {
        id: 2,
        donorId: 2,
        foodName: 'Fruit Platters',
        quantity: '20 platters',
        location: '456 Oak Ave, Midtown',
        pickupTime: '2024-01-16T14:00',
        status: 'verified',
        description: 'Assorted fresh fruits',
        imageUrl: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=300&h=200&fit=crop',
        volunteerId: 3
    }
];

if (!getFromStorage('donations')) {
    saveToStorage('donations', mockDonations);
}

// User session management
function getCurrentUser() {
    return getFromStorage('currentUser');
}

function setCurrentUser(user) {
    saveToStorage('currentUser', user);
}

function logout() {
    removeFromStorage('currentUser');
    window.location.href = 'index.html';
}

// Check if user is logged in and redirect accordingly
function checkAuthAndRedirect() {
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.verified) {
        switch (currentUser.role) {
            case 'donor':
                window.location.href = 'donor-dashboard.html';
                break;
            case 'volunteer':
                window.location.href = 'volunteer-dashboard.html';
                break;
            case 'delivery':
                window.location.href = 'delivery-dashboard.html';
                break;
            case 'admin':
                window.location.href = 'admin-panel.html';
                break;
        }
    }
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Generate unique ID
function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}