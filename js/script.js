// Enhanced Form Validation for Ebbie's Fashion House
document.addEventListener('DOMContentLoaded', function() {
    initLightbox();
    initMobileMenu();
    initSmoothScroll();
    initFormValidation();
});

// Lightbox functionality
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.close');
    
    const productImages = document.querySelectorAll('.collection-img img');
    
    productImages.forEach(img => {
        img.addEventListener('click', function() {
            lightbox.style.display = 'block';
            lightboxImg.src = this.src;
            lightboxCaption.textContent = this.alt;
        });
    });
    
    closeBtn.addEventListener('click', function() {
        lightbox.style.display = 'none';
    });
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'block') {
            lightbox.style.display = 'none';
        }
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Smooth Scrolling
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Enhanced Form Validation
function initFormValidation() {
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        setupFormValidation(contactForm, 'contact');
    }
    
    // Enquiry Form
    const enquiryForm = document.getElementById('enquiryForm');
    if (enquiryForm) {
        setupFormValidation(enquiryForm, 'enquiry');
    }
}

function setupFormValidation(form, formType) {
    const submitBtn = form.querySelector('#submitBtn');
    const successMessage = form.querySelector('#successMessage');
    
    // Real-time validation for all inputs
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        // Validate on input change
        input.addEventListener('input', function() {
            validateField(this);
            updateCharacterCounter(this);
        });
        
        // Validate on blur (when user leaves field)
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.textContent = 'Sending...';
            
            // Simulate API call
            setTimeout(() => {
                // Show success message
                successMessage.style.display = 'block';
                
                // Reset form
                form.reset();
                
                // Reset button
                submitBtn.classList.remove('loading');
                submitBtn.textContent = formType === 'contact' ? 'Send Message' : 'Submit Enquiry';
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
            }, 2000);
        } else {
            // Scroll to first error
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}

function validateField(field) {
    const formGroup = field.closest('.form-group');
    let isValid = true;
    let errorMessage = '';
    
    // Remove previous validation states
    formGroup.classList.remove('success', 'error');
    
    // Check required fields
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    else if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    else if (field.type === 'tel' && field.value.trim()) {
        const phoneRegex = /^[0-9+\-\s()]{10,}$/;
        const digitsOnly = field.value.replace(/\D/g, '');
        if (!phoneRegex.test(field.value) || digitsOnly.length < 10) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number (at least 10 digits)';
        }
    }
    
    // Minimum length validation
    else if (field.hasAttribute('minlength') && field.value.length < parseInt(field.getAttribute('minlength'))) {
        isValid = false;
        errorMessage = `Must be at least ${field.getAttribute('minlength')} characters`;
    }
    
    // Select validation
    else if (field.tagName === 'SELECT' && field.hasAttribute('required') && !field.value) {
        isValid = false;
        errorMessage = 'Please select an option';
    }
    
    // Update UI
    if (field.value.trim() && isValid) {
        formGroup.classList.add('success');
    } else if (!isValid) {
        formGroup.classList.add('error');
    }
    
    // Update error message
    const errorElement = formGroup.querySelector('small');
    if (errorElement) {
        errorElement.textContent = errorMessage;
    }
    
    return isValid;
}

function updateCharacterCounter(field) {
    if (field.tagName === 'TEXTAREA' || (field.type === 'text' && field.id.includes('Name'))) {
        const counter = field.parentElement.querySelector('.char-counter');
        if (counter) {
            const currentLength = field.value.length;
            const maxLength = field.getAttribute('maxlength') || 500;
            
            counter.textContent = `${currentLength}/${maxLength}`;
            
            // Update color based on length
            counter.classList.remove('warning', 'error');
            if (currentLength > maxLength * 0.8) {
                counter.classList.add('warning');
            }
            if (currentLength > maxLength) {
                counter.classList.add('error');
            }
        }
    }
}

// Helper function to check if email is valid
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Initialize animations when page loads
window.addEventListener('load', function() {
    // Add fade-in class to elements for animation
    const animatedElements = document.querySelectorAll('.collection-card, .hero-content, .section-title');
    animatedElements.forEach((element, index) => {
        element.classList.add('fade-in');
        element.style.animationDelay = `${index * 0.1}s`;
    });
});