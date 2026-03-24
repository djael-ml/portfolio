/**
 * Main JavaScript for Portfolio
 * Optimized for Performance
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Initialize AOS (Check if loaded first)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 600,
            once: true,
            offset: 30,
            easing: 'ease-out-cubic'
        });
    } else {
        // Fallback if deferred loading puts AOS after this script
        window.addEventListener('load', () => {
            if (typeof AOS !== 'undefined') AOS.init();
        });
    }

    // 2. Initialize Features
    initTheme();
    initLazyImages();
    initSmoothScroll();
    initContactForm();

    // 3. Dynamic Experience Calculation (Depuis 2019)
    const expYearsEl = document.getElementById('expYears');
    if (expYearsEl) {
        expYearsEl.textContent = new Date().getFullYear() - 2019;
    }

    // 3. Non-Critical: Fetch Dynamic Data
    // Use requestIdleCallback to not block main thread interactiveness
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            fetchGithubRepos();
        });
    } else {
        setTimeout(fetchGithubRepos, 100);
    }
});

// --- Theme Logic ---
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle ? themeToggle.querySelector('i') : null;
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('theme');
    
    // Appliquer le thème sauvegardé, ou détecter le thème système par défaut
    if (savedTheme) {
        if (savedTheme === 'dark') {
            setTheme('dark');
        }
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    }

    // Écouter les changements de thème système en direct
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }

    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        html.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
        if (icon) {
            updateIcon(theme);
        }
    }

    function updateIcon(theme) {
        if (theme === 'dark') {
            icon.classList.remove('bi-moon-stars');
            icon.classList.add('bi-sun-fill');
        } else {
            icon.classList.remove('bi-sun-fill');
            icon.classList.add('bi-moon-stars');
        }
    }
}

// --- Image Lazy Loading Fallback ---
function initLazyImages() {
    const lazyImages = document.querySelectorAll('img.lazy-img');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.onload = () => img.classList.add('loaded');
                }
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => observer.observe(img));
}

// --- GitHub API Calls ---
async function fetchGithubRepos() {
    const container = document.getElementById('repos-container');
    if (!container) return;

    const user = 'djael-ml';
    const cacheKey = `gh_repos_${user}`;
    const cacheTimeKey = `gh_time_${user}`;

    // Simple LocalStorage Cache (1 hour)
    const cached = localStorage.getItem(cacheKey);
    const cacheTime = localStorage.getItem(cacheTimeKey);
    const now = new Date().getTime();

    if (cached && cacheTime && (now - cacheTime < 3600000)) {
        renderRepos(JSON.parse(cached), container);
        return;
    }

    try {
        const response = await fetch(`https://api.github.com/users/${user}/repos?sort=stargazers_count&direction=desc&per_page=6`);
        if (!response.ok) throw new Error('API Error');

        const repos = await response.json();

        // Save to cache
        localStorage.setItem(cacheKey, JSON.stringify(repos));
        localStorage.setItem(cacheTimeKey, now);

        renderRepos(repos, container);

    } catch (error) {
        console.warn('GitHub Repos Error:', error);
        container.innerHTML = `
            <div class="col-12 text-center py-5 glass">
                <p class="text-muted small">Impossible d'accéder aux dépôts pour le moment.</p>
                <a href="https://github.com/${user}" target="_blank" class="btn btn-sm btn-outline-primary rounded-pill">Voir sur GitHub</a>
            </div>`;
    }
}

function renderRepos(repos, container) {
    if (repos.length === 0) {
        container.innerHTML = '<div class="col-12 text-center py-4 glass"><p class="text-muted">Aucun dépôt public trouvé.</p></div>';
        return;
    }

    const html = repos.map((repo, index) => `
        <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="${index * 50}">
            <div class="card project-card repo-card glass-card border-0">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <i class="bi bi-journal-code fs-5 text-primary"></i>
                    <span class="badge bg-warning text-dark rounded-pill shadow-sm" style="font-weight:600; font-size:0.75rem;">
                        <i class="bi bi-star-fill" style="font-size:0.7em"></i> ${repo.stargazers_count}
                    </span>
                </div>
                <h5 class="fw-bold text-truncate w-100 mb-2" style="font-size:1rem;">${repo.name}</h5>
                <p class="small text-muted flex-grow-1 mb-3 card-text">
                    ${repo.description ? (repo.description.length > 80 ? repo.description.substring(0, 80) + '...' : repo.description) : 'Aucune description disponible.'}
                </p>
                <div class="d-flex justify-content-between align-items-center mt-auto pt-3 border-top border-secondary border-opacity-10">
                    <small class="fw-semibold text-muted" style="font-size:0.75rem">
                        ${repo.language ? `<span class="repo-lang-dot" style="background-color: #f1c40f;"></span> ${repo.language}` : ''}
                    </small>
                    <a href="${repo.html_url}" target="_blank" class="btn btn-sm btn-link text-decoration-none stretched-link p-0 small">
                        Voir <i class="bi bi-arrow-right"></i>
                    </a>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

// --- Smooth Scroll ---
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// --- Contact Form Logic ---
function initContactForm() {
    const typeSelect = document.getElementById('contactType');
    const dynamicFields = document.getElementById('dynamicFields');
    const collabFields = document.getElementById('collabFields');
    const stageInfo = document.getElementById('stageInfo');
    const contactForm = document.getElementById('contactForm');
    
    if (!typeSelect || !contactForm) return;

    // Force reset form on page load (pour que "Choisissez une option" soit sélectionné par défaut)
    contactForm.reset();
    dynamicFields.classList.add('d-none');

    typeSelect.addEventListener('change', (e) => {
        dynamicFields.classList.remove('d-none');
        const val = e.target.value;
        
        if (val === 'collab') {
            collabFields.classList.remove('d-none');
            stageInfo.classList.add('d-none');
            document.getElementById('contactMessage').setAttribute('required', 'true');
            // Remove required from stage fields
            document.getElementById('companyName').removeAttribute('required');
            document.getElementById('jobTitle').removeAttribute('required');
        } else if (val === 'stage') {
            collabFields.classList.add('d-none');
            stageInfo.classList.remove('d-none');
            document.getElementById('contactMessage').removeAttribute('required');
            // Add required to stage fields
            document.getElementById('companyName').setAttribute('required', 'true');
            document.getElementById('jobTitle').setAttribute('required', 'true');
        }
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const type = typeSelect.value;
        const email = document.getElementById('contactEmail').value;
        
        if (type === 'collab') {
            const message = document.getElementById('contactMessage').value;
            const subject = encodeURIComponent("Demande de collaboration via Portfolio");
            const body = encodeURIComponent(`De: ${email}\n\nMessage:\n${message}`);
            
            // Open default mail client
            window.location.href = `mailto:djaelmola@gmail.com?subject=${subject}&body=${body}`;
            
            // Close modal
            const modalEl = document.getElementById('contactModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
            
        } else if (type === 'stage') {
            const company = document.getElementById('companyName').value;
            const jobTitle = document.getElementById('jobTitle').value;
            const message = document.getElementById('stageMessage').value;
            
            const subject = encodeURIComponent(`Proposition de stage - ${company} - ${jobTitle}`);
            
            let bodyText = `🏢 NOUVELLE PROPOSITION DE STAGE\n`;
            bodyText += `──────────────────────────────────────────\n\n`;
            bodyText += `👤 Email du recruteur : ${email}\n`;
            bodyText += `🏢 Entreprise : ${company}\n`;
            bodyText += `💼 Poste proposé : ${jobTitle}\n\n`;
            if (message) {
                bodyText += `📝 Description ou lien de l'offre :\n`;
                bodyText += `──────────────────────────────────────────\n`;
                bodyText += `${message}\n\n`;
            }
            bodyText += `──────────────────────────────────────────\n`;
            bodyText += `Généré depuis le portfolio de Djaël Mola.\n`;
            
            const body = encodeURIComponent(bodyText);
            
            // Open default mail client temporarily
            window.location.href = `mailto:djaelmola@gmail.com?subject=${subject}&body=${body}`;
            
            // Close modal
            const modalEl = document.getElementById('contactModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
            
            // Optionally reset form
            contactForm.reset();
            dynamicFields.classList.add('d-none');
        }
    });
}
