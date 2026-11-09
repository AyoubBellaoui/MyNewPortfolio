function toggleMenu() {
    const menu = document.querySelector('.navbar-links');
    const burger = document.querySelector('.burger');
    const icon = burger.querySelector('i');

    menu.classList.toggle('active');
    burger.setAttribute('aria-expanded', menu.classList.contains('active'));

    // Toggle icon between bars and X
    if (menu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

// Close menu when any nav link or Download CV button is clicked
document.querySelectorAll('.nav-center a, .nav-btn').forEach(link => {
    link.addEventListener('click', () => {
        const menu = document.querySelector('.navbar-links');
        const burger = document.querySelector('.burger');
        const icon = burger.querySelector('i');

        // Hide menu and reset icon
        menu.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Navbar: transparent over the hero, solid once the page scrolls,
// and the link of the section at the middle of the screen is highlighted
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-center a');
const sections = document.querySelectorAll('section[id]');

const updateNavbar = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);

    // Last section whose top has passed the middle of the screen
    let current = sections[0];
    sections.forEach(section => {
        if (section.getBoundingClientRect().top <= window.innerHeight / 2) {
            current = section;
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current.id}`);
    });
};

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

// Contact form: send through the Web3Forms API so the visitor stays on the page
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const button = contactForm.querySelector('.form-btn');
        const buttonLabel = button.innerHTML;
        const status = contactForm.querySelector('.form-status');
        const fallback = 'Sorry, something went wrong. Please email me directly at ayoubbellaoui@yahoo.com.';

        const showStatus = (type, message) => {
            const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
            status.className = `form-status ${type}`;
            status.innerHTML = `<i class="fas ${icon}"></i>`;
            status.append(message); // plain text, never HTML
        };

        // Email subject in my inbox, e.g. "Portfolio: Job offer"
        const data = Object.fromEntries(new FormData(contactForm));
        data.subject = data.subject ? `Portfolio: ${data.subject}` : 'New message from your portfolio';

        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        status.className = 'form-status';
        status.textContent = '';

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();

            if (result.success === true) {
                showStatus('success', "Thanks! Your message has been sent. I'll get back to you soon.");
                contactForm.reset();
            } else {
                showStatus('error', result.message || fallback);
            }
        } catch (error) {
            showStatus('error', fallback);
        } finally {
            button.disabled = false;
            button.innerHTML = buttonLabel;
        }
    });
}

// Debug: Confirm script runs on load
console.log('main.js loaded. Burger should be visible on screens <= 1024px.');