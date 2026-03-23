// script.js

document.addEventListener('DOMContentLoaded', () => {
    /* --- 1. Navbar Scroll Effect & Active Link --- */
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        // Add Glassmorphism background to navbar on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Link Highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(li => {
            li.classList.remove('active');
            if (li.getAttribute('href').includes(current) && current !== '') {
                li.classList.add('active');
            }
        });
    });

    /* --- Theme Toggle --- */
    const themeBtn = document.getElementById('theme-btn');
    const themeIcon = themeBtn.querySelector('i');
    
    // Check local storage for theme, default to light mode
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        // Apply dark mode and show sun icon (clicking will switch to light)
        document.body.classList.remove('light-mode');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        // Default to light mode and show moon icon (clicking will switch to dark)
        document.body.classList.add('light-mode');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        if (!currentTheme) {
            // If no theme was saved, save light as default
            localStorage.setItem('theme', 'light');
        }
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        if (document.body.classList.contains('light-mode')) {
            // Switched to light mode, show moon icon for next toggle
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            // Switched to dark mode, show sun icon for next toggle
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    });

    /* --- 2. Mobile Menu Toggle --- */
    const menuBtn = document.querySelector('.menu-btn');
    const navMenu = document.querySelector('.nav-links');
    const menuIcon = document.querySelector('.menu-btn i');
    const closeBtn = document.getElementById('close-btn');

    const toggleMenu = () => {
        navMenu.classList.toggle('active');
        
        // Change icon from bars to times (X)
        if(navMenu.classList.contains('active')) {
            menuIcon.classList.replace('fa-bars', 'fa-times');
        } else {
            menuIcon.classList.replace('fa-times', 'fa-bars');
        }
    };

    menuBtn.addEventListener('click', toggleMenu);
    closeBtn.addEventListener('click', toggleMenu);

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuIcon.classList.replace('fa-times', 'fa-bars');
        });
    });

    /* --- 3. Scroll Reveal Animations --- */
    const fadeElements = document.querySelectorAll('.fade-in');

    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible if you want it to trigger only once
                // observer.unobserve(entry.target); 
            }
        });
    }, appearOptions);

    fadeElements.forEach(element => {
        appearOnScroll.observe(element);
    });

    /* --- 4. Smooth Scrolling Logic for Anchor Links (Backup to CSS scroll-behavior) --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#home') {
                 window.scrollTo({
                     top: 0,
                     behavior: 'smooth'
                 });
                 return;
            }
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;
  
                window.scrollTo({
                     top: offsetPosition,
                     behavior: 'smooth'
                });
            }
        });
    });

    // --- 5. Hero Typewriter Effect ---
    const typedElement = document.getElementById('typed-role');
    const cursorElement = document.getElementById('typewriter-cursor');
    const baseText = 'Aspiring Cloud Engineer';
    const accentTargets = ['Cloud', 'Engineer', 'AWS'];

    function formatHighlight(text) {
        return text.replace(/\b(Cloud|Engineer|AWS)\b/g, '<span class="accent-highlight">$1</span>');
    }

    function runTypewriter(loop = true) {
        typedElement.innerHTML = '';
        cursorElement.style.opacity = '1';

        let index = 0;
        const typeSpeed = 90; // medium feel

        const typeInterval = setInterval(() => {
            if (index < baseText.length) {
                typedElement.textContent += baseText.charAt(index);
                index++;
            } else {
                clearInterval(typeInterval);

                // Apply keywords accenting after full text appears
                typedElement.innerHTML = formatHighlight(baseText);

                setTimeout(() => {
                    if (loop) {
                        // Fade-out then restart for loop
                        typedElement.style.transition = 'opacity 0.5s ease';
                        typedElement.style.opacity = '0';
                        cursorElement.style.opacity = '0';
                        setTimeout(() => {
                            typedElement.style.opacity = '1';
                            runTypewriter(loop);
                        }, 500);
                    }
                }, 2000);
            }
        }, typeSpeed);
    }

    runTypewriter(true);

    /* --- 6. Custom Animated Rolling Cursor --- */
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    document.body.appendChild(cursorDot);

    const cursorRing = document.createElement('div');
    cursorRing.classList.add('cursor-ring');
    document.body.appendChild(cursorRing);

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let trailCounter = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Dot follows immediately
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';

        // Spawn trail particles every 3rd move
        trailCounter++;
        if (trailCounter % 3 === 0) {
            spawnTrail(mouseX, mouseY);
        }
    });

    // Ring follows with a smooth lag via requestAnimationFrame
    function animateRing() {
        const speed = 0.15;
        ringX += (mouseX - ringX) * speed;
        ringY += (mouseY - ringY) * speed;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Trail particles
    function spawnTrail(x, y) {
        const trail = document.createElement('div');
        trail.classList.add('cursor-trail');
        trail.style.left = x + 'px';
        trail.style.top = y + 'px';
        document.body.appendChild(trail);
        // Remove after animation ends
        setTimeout(() => trail.remove(), 600);
    }

    // Magnetic hover effect on interactive elements
    const hoverTargets = document.querySelectorAll(
        'a, button, .btn, .project-card, .skill-category, .cert-card, .social-card, .theme-btn, .menu-btn, .timeline-content'
    );

    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            cursorDot.classList.add('cursor-hover');
            cursorRing.classList.add('cursor-hover');
        });
        target.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('cursor-hover');
            cursorRing.classList.remove('cursor-hover');
        });
    });

    // Click animation
    document.addEventListener('mousedown', () => {
        cursorDot.classList.add('cursor-click');
        cursorRing.classList.add('cursor-click');
    });
    document.addEventListener('mouseup', () => {
        cursorDot.classList.remove('cursor-click');
        cursorRing.classList.remove('cursor-click');
    });

    /* --- 7. 3D Card Tilt Effect on Project Cards --- */
    const tiltCards = document.querySelectorAll('.project-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8; // max 8deg tilt
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    /* --- 8. 3D Card Tilt Effect on Skill Cards --- */
    const skillCards = document.querySelectorAll('.skill-category');

    skillCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // max 10deg tilt for skills
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(-15px) scale(1.05)';
        });
    });

    /* --- 9. EmailJS Form Submission & Popups --- */
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formPopup = document.getElementById('form-popup');
    const closePopup = document.getElementById('close-popup');
    const popupIcon = document.getElementById('popup-icon');
    const popupTitle = document.getElementById('popup-title');
    const popupMessage = document.getElementById('popup-message');

    // Initialize EmailJS with your Public Key
    // Note: You need to replace 'YOUR_PUBLIC_KEY' with your actual public key from EmailJS
    emailjs.init("YOUR_PUBLIC_KEY");

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // UI Feedback: Change button state
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';

            // Send form using EmailJS
            // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual IDs
            emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', contactForm)
                .then(() => {
                    // Success
                    showPopup(
                        'success',
                        'Message Sent!',
                        'Thank you for reaching out! I will get back to you as soon as possible.'
                    );
                    contactForm.reset();
                })
                .catch((error) => {
                    // Error
                    console.error('EmailJS Error:', error);
                    showPopup(
                        'error',
                        'Oops!',
                        'Something went wrong. Please try again later or contact me via email directly.'
                    );
                })
                .finally(() => {
                    // Reset button state
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnContent;
                });
        });
    }

    function showPopup(type, title, message) {
        popupIcon.className = `popup-icon fas ${type === 'success' ? 'fa-check-circle success' : 'fa-exclamation-circle error'}`;
        popupTitle.textContent = title;
        popupMessage.textContent = message;
        formPopup.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when popup is open
    }

    closePopup.addEventListener('click', () => {
        formPopup.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Close popup on backdrop click
    formPopup.addEventListener('click', (e) => {
        if (e.target === formPopup) {
            formPopup.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    /* --- 10. Certification Image Modal / Lightbox --- */
    const certModal = document.getElementById('cert-modal');
    const certModalImage = document.getElementById('cert-modal-image');
    const certModalCaption = document.getElementById('cert-modal-caption');
    const certModalClose = document.getElementById('cert-modal-close');
    const certImages = document.querySelectorAll('.cert-image');

    certImages.forEach((img) => {
        img.addEventListener('click', () => {
            certModal.style.display = 'flex';
            certModalImage.src = img.src;
            certModalCaption.textContent = img.alt;
            document.body.style.overflow = 'hidden';
        });
    });

    const closeCertModal = () => {
        certModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        certModalImage.src = '';
        certModalCaption.textContent = '';
    };

    certModalClose.addEventListener('click', closeCertModal);

    certModal.addEventListener('click', (e) => {
        if (e.target === certModal || e.target === certModalImage) {
            closeCertModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && certModal.style.display === 'flex') {
            closeCertModal();
        }
    });
    /* --- 11. Chatbot Logic --- */
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input-field');
    const chatbotSendBtn = document.getElementById('chatbot-send-btn');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');

    const toggleChat = () => {
        chatbotWindow.classList.toggle('active');
        if (chatbotWindow.classList.contains('active')) {
            chatbotInput.focus();
        }
    };

    if (chatbotToggle) chatbotToggle.addEventListener('click', toggleChat);
    if (chatbotClose) chatbotClose.addEventListener('click', toggleChat);

    const addMessage = (text, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    };

    const getBotResponse = (query) => {
        query = query.toLowerCase();
        
        if (query.includes('skill')) {
            return "Sai's skills include: Python, C++, AWS (S3, Lambda, EC2), Docker, Kubernetes, HTML/CSS, and MySQL. He's also skilled in DSA and Linux.";
        } else if (query.includes('project')) {
            return "Some of Sai's key projects are: 1. Serverless File Upload System (AWS Lambda, S3, DynamoDB), 2. Cloud-Based Student Record System (EC2, RDS, VPC).";
        } else if (query.includes('certif')) {
            return "Sai is certified as an AWS Cloud Practitioner, Oracle Associate Architect, and has professional certifications in DevOps and Python from Udemy.";
        } else if (query.includes('contact') || query.includes('hire') || query.includes('reach')) {
            return "You can contact Sai via email at kalakotasaisai@gmail.com or call him at +91 9032900350. You can also find him on LinkedIn and GitHub!";
        } else if (query.includes('hi') || query.includes('hello') || query.includes('hey')) {
            return "Hello! How can I assist you with information about Sai Chandu's portfolio today?";
        } else if (query.includes('education') || query.includes('study')) {
            return "Sai is a B.Tech student at Lovely Professional University, currently in his 3rd year. He previously studied at Krishnaveni Junior College and Abhinav High School.";
        } else {
            return "I'm not sure about that. Try asking about his 'skills', 'projects', 'certifications', or 'contact' info!";
        }
    };

    const handleSendMessage = () => {
        const text = chatbotInput.value.trim();
        if (text) {
            addMessage(text, 'user');
            chatbotInput.value = '';
            
            // Artificial delay for bot response
            setTimeout(() => {
                const response = getBotResponse(text);
                addMessage(response, 'bot');
            }, 500);
        }
    };

    if (chatbotSendBtn) chatbotSendBtn.addEventListener('click', handleSendMessage);
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSendMessage();
        });
    }

    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const query = btn.getAttribute('data-query');
            addMessage(btn.textContent, 'user');
            setTimeout(() => {
                const response = getBotResponse(query);
                addMessage(response, 'bot');
            }, 500);
        });
    });

});
