document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn.querySelector('i');

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        updateIcon(savedTheme);
    } else if (prefersDark) {
        htmlElement.setAttribute('data-theme', 'dark');
        updateIcon('dark');
    } else {
        htmlElement.setAttribute('data-theme', 'light');
        updateIcon('light');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
    });

    function updateIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('ph-moon');
            themeIcon.classList.add('ph-sun');
        } else {
            themeIcon.classList.remove('ph-sun');
            themeIcon.classList.add('ph-moon');
        }
    }

    // --- GitHub Projects Fetching ---
    const projectsContainer = document.getElementById('github-projects');
    const username = 'djael-ml';
    
    // Projets que nous souhaitons mettre en avant
    const selectedRepos = ['RGAAPlus', 'BTRAmazon', 'improver', 'potato-mode', 'muzenza-saintouen'];
    
    const customDescriptions = {
        'RGAAPlus': 'Extension Chrome d\'audit RGAA premium. Interface moderne, détection instantanée et simulation de correctifs (Manifest V3).',
        'BTRAmazon': 'Refonte moderne de l\'interface d\'Amazon inspirée du design épuré d\'Apple.',
        'improver': 'Outil open source d\'optimisation des performances pour systèmes Windows. Écrit en Python.',
        'LSSC': 'Ubuntu storage space cleaner - Scripts Bash d\'optimisation, de nettoyage et de sécurisation pour Linux.',
        'potato-mode': 'Une extension radicale pour transformer n\'importe quel site web en version "Potato" sans animations/images. Optimisée pour les performances extrêmes.',
        'muzenza-saintouen': 'Refonte complète de l\'identité numérique du groupe Capoeira Muzenza Paris. Plateforme interactive et planning dynamique.'
    };

    const liveLinks = {
        'muzenza-saintouen': 'https://muzenza-saintouen.vercel.app',
        'potato-mode': 'https://github.com/djael-ml/potato-mode'
    };

    async function fetchProjects() {
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
            
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des projets');
            }
            
            const repos = await response.json();
            
            const filteredRepos = repos.filter(repo => selectedRepos.includes(repo.name));
            
            if (filteredRepos.length === 0) {
                throw new Error('Aucun dépôt sélectionné trouvé.');
            }

            renderProjects(filteredRepos);
            
        } catch (error) {
            console.error('API rate limit ou erreur:', error);
            renderFallbackProjects();
        }
    }

    function renderProjects(repos) {
        projectsContainer.innerHTML = '';
        
        repos.forEach((repo, index) => {
            const desc = customDescriptions[repo.name] || repo.description || 'Projet open-source réalisé par Djaël.';
            const language = repo.language || 'Code';
            const liveLinkHTML = liveLinks[repo.name] 
                ? `<a href="${liveLinks[repo.name]}" target="_blank" aria-label="Voir le site" title="Site en direct"><i class="ph ph-globe"></i></a>`
                : '';
            
            const card = document.createElement('div');
            card.className = 'glass-card project-card animate-on-scroll';
            card.style.transitionDelay = `${index * 0.1}s`;
            card.innerHTML = `
                <div class="project-header">
                    <i class="ph ph-folder-open"></i>
                    <div class="project-links">
                        ${liveLinkHTML}
                        <a href="${repo.html_url}" target="_blank" aria-label="Voir sur GitHub" title="Code source">
                            <i class="ph ph-github-logo"></i>
                        </a>
                    </div>
                </div>
                <h3 class="project-title">${repo.name}</h3>
                <p class="project-desc">${desc}</p>
                <div class="project-tech">
                    <span class="tech-tag">${language}</span>
                </div>
            `;
            projectsContainer.appendChild(card);
            
            // Add to observer if it exists
            if (typeof observer !== 'undefined') {
                observer.observe(card);
            }
            
            if (typeof VanillaTilt !== 'undefined') {
                VanillaTilt.init(card, { max: 5, speed: 400, glare: true, "max-glare": 0.1 });
            }
        });
    }
    
    function renderFallbackProjects() {
        projectsContainer.innerHTML = '';
        const fallbacks = [
            { name: 'RGAAPlus', desc: customDescriptions['RGAAPlus'], lang: 'JavaScript', url: 'https://github.com/djael-ml/RGAAPlus' },
            { name: 'BTRAmazon', desc: customDescriptions['BTRAmazon'], lang: 'CSS', url: 'https://github.com/djael-ml/BTRAmazon' },
            { name: 'improver', desc: customDescriptions['improver'], lang: 'Python', url: 'https://github.com/djael-ml/improver' },
            { name: 'LSSC', desc: customDescriptions['LSSC'], lang: 'Shell', url: 'https://github.com/djael-ml/LSSC' }
        ];
        
        fallbacks.forEach((repo, index) => {
            const card = document.createElement('div');
            card.className = 'glass-card project-card animate-on-scroll';
            card.style.transitionDelay = `${index * 0.1}s`;
            card.innerHTML = `
                <div class="project-header">
                    <i class="ph ph-folder-open"></i>
                    <div class="project-links">
                        <a href="${repo.url}" target="_blank" aria-label="Voir sur GitHub">
                            <i class="ph ph-github-logo"></i>
                        </a>
                    </div>
                </div>
                <h3 class="project-title">${repo.name}</h3>
                <p class="project-desc">${repo.desc}</p>
                <div class="project-tech">
                    <span class="tech-tag">${repo.lang}</span>
                </div>
            `;
            projectsContainer.appendChild(card);

            if (typeof observer !== 'undefined') {
                observer.observe(card);
            }
            
            if (typeof VanillaTilt !== 'undefined') {
                VanillaTilt.init(card, { max: 5, speed: 400, glare: true, "max-glare": 0.1 });
            }
        });
    }

    if (projectsContainer) {
        fetchProjects();
    }

    // --- Interactive Navbar ---
    let lastScrollY = window.scrollY;
    const navbar = document.querySelector('.glass-nav');

    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            // Scrolling down
            navbar.classList.add('nav-hidden');
        } else {
            // Scrolling up
            navbar.classList.remove('nav-hidden');
        }
        lastScrollY = window.scrollY;
    });

    // --- Scroll Animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    // --- Active Nav Link Highlight ---
    const currentPath = window.location.pathname;
    const navLinksList = document.querySelectorAll('.nav-links a');
    navLinksList.forEach(link => {
        let linkPath = link.getAttribute('href');
        
        const isMatch = currentPath === linkPath || 
                       (currentPath + '/') === linkPath ||
                       currentPath === (linkPath + '/');
                       
        if (isMatch) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // --- Burger Menu ---
    const burgerBtn = document.querySelector('.burger-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (burgerBtn && navLinks) {
        burgerBtn.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            
            // Toggle icon between list and x
            const icon = burgerBtn.querySelector('i');
            if (navLinks.classList.contains('nav-active')) {
                icon.classList.remove('ph-list');
                icon.classList.add('ph-x');
            } else {
                icon.classList.remove('ph-x');
                icon.classList.add('ph-list');
            }
        });
    }

    // --- Vanilla Tilt Initialization (Static cards) ---
    if (typeof VanillaTilt !== 'undefined') {
        const cards = document.querySelectorAll('.timeline-card, .skill-card');
        if (cards.length > 0) {
            VanillaTilt.init(cards, {
                max: 5,
                speed: 400,
                glare: true,
                "max-glare": 0.1
            });
        }
    }

    // --- Custom Cursor ---
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Use event delegation for dynamically loaded elements
        document.addEventListener('mouseover', (e) => {
            const hoverTarget = e.target.closest('a, button, .project-card, .skill-card');
            if (hoverTarget) {
                cursor.classList.add('hover');
            }
        });

        document.addEventListener('mouseout', (e) => {
            const hoverTarget = e.target.closest('a, button, .project-card, .skill-card');
            if (hoverTarget) {
                cursor.classList.remove('hover');
            }
        });
    }

    // --- Contact Modal ---
    const contactModal = document.getElementById('contact-modal');
    const openModalBtn = document.getElementById('open-contact-modal');
    const closeModalBtn = document.getElementById('close-contact-modal');

    if (contactModal && openModalBtn && closeModalBtn) {
        openModalBtn.addEventListener('click', () => {
            contactModal.classList.add('active');
        });
        
        closeModalBtn.addEventListener('click', () => {
            contactModal.classList.remove('active');
        });

        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                contactModal.classList.remove('active');
            }
        });
    }
});
