/**
 * College Tech Fest 2026 - Interactive Script
 * Organised into functions with clear comments for internship interview preparation.
 * 
 * Scope of features:
 * 1. Sticky Navigation & Active Section Highlights
 * 2. Scroll Fade-in Animations
 * 3. Accessibility-focused Form Validation & Dynamic Inline Errors
 * 4. Premium Registration Success Modal
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all page components
    initScrollEffects();
    initScrollAnimations();
    initModal();
    initFormValidation();
});

/**
 * 1. Sticky Navigation & Active Section Highlights
 * Adds background style modifications to the sticky header and uses 
 * IntersectionObserver to track which section is currently active, 
 * updating the active navigation link dynamically.
 */
function initScrollEffects() {
    const header = document.querySelector('header');
    if (!header) return;
    const navLinks = document.querySelectorAll('nav ul a');
    const sections = document.querySelectorAll('section');
    if (sections.length === 0 || navLinks.length === 0) return;

    // Add solid background shadow on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Observer configuration for section visibility in viewport
    // rootMargin offset triggers the highlight when a section occupies the upper-middle region of screen
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');

                // Update active navigation class
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    // Observe each section tag
    sections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * 2. Scroll Fade-in Animations
 * Adds a scroll entrance animation to elements with the `.fade-in-section` class 
 * using IntersectionObserver. The observer disconnects once the animation runs once.
 */
function initScrollAnimations() {
    const fadeSections = document.querySelectorAll('.fade-in-section');
    if (fadeSections.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px', // Animates slightly before scrolling fully into view
        threshold: 0.05
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optimization: stop observing once section has faded in
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeSections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * 3. Custom Success Modal Handler
 * Controls modal toggles, updates aria hidden accessibility properties,
 * and handles keyboard focus restoration for accessibility best practices.
 */
let lastFocusedElement;

function initModal() {
    const modal = document.getElementById('successModal');
    if (!modal) return;
    const closeBtn = document.getElementById('closeModalBtn');
    const okBtn = document.getElementById('modalOkBtn');
    if (!closeBtn || !okBtn) return;

    function openModal() {
        // Save currently focused element (usually the submit button) to restore focus later
        lastFocusedElement = document.activeElement;

        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');

        // Focus the OK button inside modal immediately (Accessibility best practice)
        okBtn.focus();
    }

    function closeModal() {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');

        // Restore focus to original element
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    // Modal close listeners
    closeBtn.addEventListener('click', closeModal);
    okBtn.addEventListener('click', closeModal);

    // Close modal when user clicks on background overlay
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Listen for Escape key to close modal (Accessibility best practice)
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // Make modal function globally accessible
    window.openSuccessModal = openModal;
}

/**
 * 4. Form Validation & Dynamic Inline Errors
 * Manages custom form validation rules. Checks every field, injects error boxes,
 * toggles accessibility indicators (aria-invalid), and displays the success modal.
 */
function initFormValidation() {
    const form = document.querySelector('#register form');
    if (!form) return;

    form.addEventListener('submit', (event) => {
        // Prevent default submission refresh
        event.preventDefault();

        // Step A: Clear previous errors
        clearErrors(form);

        // Step B: Collect values & validate
        let isValid = true;

        // 1. Full Name check
        const fullname = document.getElementById('fullname');
        if (fullname.value.trim() === '') {
            showError(fullname, 'Full Name is required.');
            isValid = false;
        }

        // 2. Email validation
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value.trim() === '') {
            showError(email, 'Email Address is required.');
            isValid = false;
        } else if (!emailRegex.test(email.value.trim())) {
            showError(email, 'Please enter a valid email address.');
            isValid = false;
        }

        // 3. Mobile Number validation
        const phone = document.getElementById('phone');
        const phoneRegex = /^\d{10}$/; // Exactly 10 digits
        // Remove common separators (spaces, dashes, parentheses) to make phone input user-friendly
        const cleanPhone = phone.value.replace(/[\s()-]/g, '');
        if (phone.value.trim() === '') {
            showError(phone, 'Mobile Number is required.');
            isValid = false;
        } else if (!phoneRegex.test(cleanPhone)) {
            showError(phone, 'Mobile Number must be exactly 10 digits.');
            isValid = false;
        }

        // 4. College Name check
        const college = document.getElementById('college');
        if (college.value.trim() === '') {
            showError(college, 'College Name is required.');
            isValid = false;
        }

        // 5. Department check
        const dept = document.getElementById('dept');
        if (dept.value.trim() === '') {
            showError(dept, 'Department is required.');
            isValid = false;
        }

        // 6. Year select check
        const year = document.getElementById('year');
        if (year.value === '') {
            showError(year, 'Please select your Year of Study.');
            isValid = false;
        }

        // 7. Gender radio check
        const genderRadios = document.getElementsByName('gender');
        let genderSelected = false;
        for (const radio of genderRadios) {
            if (radio.checked) {
                genderSelected = true;
                break;
            }
        }
        if (!genderSelected) {
            const genderGroup = document.querySelector('.gender-group');
            showError(genderGroup, 'Please select your Gender.', true);
            isValid = false;
        }

        // 8. Event select check
        const eventSelect = document.getElementById('event');
        if (eventSelect.value === '') {
            showError(eventSelect, 'Please select an Event.');
            isValid = false;
        }

        // Step C: Handle success or failure
        if (isValid) {
            // Trigger custom success modal
            if (typeof window.openSuccessModal === "function") {
                window.openSuccessModal();
            }
            // Reset fields
            form.reset();
        } else {
            // Focus on the first invalid field for better accessibility
            const firstInvalidInput = form.querySelector('.is-invalid, input[type="radio"].is-invalid');
            if (firstInvalidInput) {
                firstInvalidInput.focus();
            }
        }
    });
}

/**
 * Creates and injects an error message below the input field.
 * Adds dynamic CSS classes for visual cues and sets accessibility properties.
 * 
 * @param {HTMLElement} element - Input element to mark invalid
 * @param {string} message - Human-readable error message text
 * @param {boolean} isGroup - Set to true for groups of elements (like radio containers)
 */
function showError(element, message, isGroup = false) {
    // Generate validation error element
    const errorSpan = document.createElement('span');
    errorSpan.className = 'error-message';
    errorSpan.innerText = message;

    // Assign a unique ID for aria-describedby linkage
    const errorId = (isGroup ? 'gender' : element.id) + '-error';
    errorSpan.id = errorId;

    if (isGroup) {
        // Append error box at the end of the container
        element.parentElement.appendChild(errorSpan);
        // Mark all radio options inside the group visually invalid
        const radios = element.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            radio.classList.add('is-invalid');
            radio.setAttribute('aria-invalid', 'true');
            radio.setAttribute('aria-describedby', errorId);
        });
    } else {
        // Style input borders red
        element.classList.add('is-invalid');
        // Tell screen readers this input is invalid
        element.setAttribute('aria-invalid', 'true');
        // Reference the error text description ID
        element.setAttribute('aria-describedby', errorId);
        // Append error box directly underneath input element
        element.parentElement.appendChild(errorSpan);
    }
}

/**
 * Clears styling classes and dynamic error text blocks from previous validations.
 * 
 * @param {HTMLFormElement} form - The form container element
 */
function clearErrors(form) {
    // Remove all dynamically created error messages
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());

    // Restore default borders and remove screen reader invalid declarations
    const invalidInputs = form.querySelectorAll('.is-invalid');
    invalidInputs.forEach(input => {
        input.classList.remove('is-invalid');
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');
    });
}
