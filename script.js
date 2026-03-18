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
    
    // Check local storage for theme
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        if (document.body.classList.contains('light-mode')) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'dark');
        }
    });

    /* --- 2. Mobile Menu Toggle --- */
    const menuBtn = document.querySelector('.menu-btn');
    const navMenu = document.querySelector('.nav-links');
    const menuIcon = document.querySelector('.menu-btn i');

    menuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Change icon from bars to times (X)
        if(navMenu.classList.contains('active')) {
            menuIcon.classList.replace('fa-bars', 'fa-times');
        } else {
            menuIcon.classList.replace('fa-times', 'fa-bars');
        }
    });

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
    const baseText = 'Cloud & DevOps Enthusiast';
    const accentTargets = ['Cloud', 'DevOps', 'AWS'];

    function formatHighlight(text) {
        return text.replace(/\b(Cloud|DevOps|AWS)\b/g, '<span class="accent-highlight">$1</span>');
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

});
