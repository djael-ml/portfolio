<?php
// ==============================================================================
// 1. CONFIGURATION UTILISATEUR (MODIFIEZ VOS INFOS ICI)
// ==============================================================================

$config = [
    'nom'           => 'Mola',
    'prenom'        => 'Djaël',
    'date_naiss'    => '2008-01-21',
    'date_debut_dev'=> '2019-09-01',
    'ville'         => 'Paris, France',
    'formation'     => 'Développeur Fullstack, Python et Node js',
    'disponibilite' => 'Disponible pour missions freelance',
    'github_user'   => 'djael-ml',
    'email'         => 'djaelmola@gmail.com',
    'linkedin'      => 'https://fr.linkedin.com/in/dja%C3%ABl-mola',
];

// Compétences (Badges)
$competences = [
    'Backend'  => ['PHP 8', 'Symfony', 'MySQL', 'API REST'],
    'Frontend' => ['JavaScript', 'Bootstrap 5', 'Vue.js', 'Tailwind'],
    'Outils'   => ['Git', 'Figma', 'Linux', 'NodeJS']
];

// Tes sites réalisés manuellement (Cards personnalisées)
$mes_sites = [
    [
        'titre' => 'Capoeira Muzenza Saint-Ouen',
        'desc'  => 'Site officiel du groupe de capoeira capoeira muzenza',
        'img'   => 'images/capoeira-muzenza.png', // URL image ou chemin local
        'url'   => 'https://muzenza-saintouen.vercel.app/',
        'tags'  => ['HTML', 'CSS', 'JavaScript']
    ],
];

// ==============================================================================
// 2. LOGIQUE PHP (Ne pas toucher sauf si nécessaire)
// ==============================================================================

// Calculs automatiques
$now = new DateTime();
$age = $now->diff(new DateTime($config['date_naiss']))->y;
$exp = $now->diff(new DateTime($config['date_debut_dev']))->y;

// Fonction API GitHub avec Cache simulé et User-Agent
function getGithubData($url) {
    $opts = [
        'http' => [
            'method' => 'GET',
            'header' => [
                'User-Agent: DjaelMola-Portfolio-v1' // Obligatoire pour GitHub
            ]
        ]
    ];
    $context = stream_context_create($opts);
    $data = @file_get_contents($url, false, $context); // @ pour éviter les warnings php sur l'écran
    
    return $data ? json_decode($data, true) : null;
}

// Récupération Profil
$gh_user = getGithubData("https://api.github.com/users/" . $config['github_user']);

// Fallback si API down ou limite atteinte
if (!$gh_user) {
    $gh_user = [
        'avatar_url' => 'https://github.com/' . $config['github_user'] . '.png',
        'bio' => 'Développeur passionné (Données GitHub momentanément indisponibles)',
        'location' => $config['ville'],
        'blog' => ''
    ];
}

// Récupération Repos (Triés par stars)
$gh_repos = getGithubData("https://api.github.com/users/" . $config['github_user'] . "/repos?sort=stargazers_count&direction=desc&per_page=7");

?>
<!DOCTYPE html>
<html lang="fr" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio - <?php echo $config['prenom'] . ' ' . $config['nom']; ?></title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">

    <style>
        /* * APPLE DESIGN SYSTEM & GLASSMORPHISM 
         */
        :root {
            --bg-body: #f5f5f7;
            --text-main: #1d1d1f;
            --text-muted: #86868b;
            --glass-bg: rgba(255, 255, 255, 0.65);
            --glass-border: rgba(255, 255, 255, 0.4);
            --accent: #0071e3;
            --card-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }

        [data-theme="dark"] {
            --bg-body: #000000;
            --text-main: #f5f5f7;
            --text-muted: #86868b;
            --glass-bg: rgba(28, 28, 30, 0.65);
            --glass-border: rgba(255, 255, 255, 0.1);
            --accent: #2997ff;
            --card-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg-body);
            color: var(--text-main);
            transition: background-color 0.3s ease, color 0.3s ease;
            overflow-x: hidden;
        }

        /* Glassmorphism Utility */
        .glass {
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            box-shadow: var(--card-shadow);
        }

        .btn-apple {
            background-color: var(--accent);
            color: white;
            border-radius: 980px; /* Pill shape */
            padding: 10px 24px;
            border: none;
            font-weight: 500;
            transition: all 0.2s;
        }
        .btn-apple:hover {
            background-color: var(--accent);
            opacity: 0.9;
            transform: scale(1.02);
            color: white;
        }

        .btn-theme {
            background: transparent;
            border: 1px solid var(--text-muted);
            color: var(--text-main);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* Hero Section */
        .hero-avatar {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid var(--bg-body);
            box-shadow: var(--card-shadow);
        }

        /* Badge dispo */
        .status-badge {
            display: inline-flex;
            align-items: center;
            padding: 6px 12px;
            background: rgba(46, 204, 113, 0.15);
            color: #2ecc71;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
        }
        .status-dot {
            width: 8px;
            height: 8px;
            background-color: #2ecc71;
            border-radius: 50%;
            margin-right: 8px;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(46, 204, 113, 0); }
            100% { box-shadow: 0 0 0 0 rgba(46, 204, 113, 0); }
        }

        /* Cards */
        .project-card {
            transition: transform 0.3s ease;
            height: 100%;
            overflow: hidden;
        }
        .project-card:hover {
            transform: translateY(-5px);
        }
        .card-img-top {
            height: 180px;
            object-fit: cover;
        }
        .repo-stats {
            font-size: 0.85rem;
            color: var(--text-muted);
        }

        /* Navbar */
        .navbar-glass {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-width: 1000px;
            z-index: 1000;
            padding: 10px 30px;
            border-radius: 50px;
        }

        .section-title {
            font-weight: 700;
            margin-bottom: 2rem;
            letter-spacing: -0.5px;
        }
    </style>
</head>
<body>

    <nav class="navbar navbar-expand glass navbar-glass">
        <div class="container-fluid">
            <a class="navbar-brand fw-bold" href="#" style="color: var(--text-main)">
                <?php echo substr($config['prenom'],0,1) . substr($config['nom'],0,1); ?>.
            </a>
            <div class="ms-auto d-flex gap-3 align-items-center">
                <a href="#projets" class="text-decoration-none d-none d-sm-block" style="color: var(--text-main)">Projets</a>
                <a href="#contact" class="btn-apple text-decoration-none">Contact</a>
                <button id="themeToggle" class="btn-theme">
                    <i class="bi bi-moon-stars"></i>
                </button>
            </div>
        </div>
    </nav>

    <div class="container" style="margin-top: 140px; padding-bottom: 80px;">
        
        <div class="row align-items-center mb-5" data-aos="fade-up">
            <div class="col-lg-3 text-center text-lg-start mb-4 mb-lg-0">
                <img src="<?php echo $gh_user['avatar_url']; ?>" alt="Avatar" class="hero-avatar">
            </div>
            <div class="col-lg-9 text-center text-lg-start">
                <div class="status-badge mb-3">
                    <span class="status-dot"></span> <?php echo $config['disponibilite']; ?>
                </div>
                <h1 class="display-4 fw-bold mb-2">
                    Bonjour, je suis <?php echo $config['prenom']; ?>.
                </h1>
                <p class="lead" style="color: var(--text-muted)">
                    <?php echo $gh_user['bio'] ?? 'Développeur Fullstack'; ?>
                </p>
                <div class="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start mt-4 text-muted small">
                    <span><i class="bi bi-geo-alt-fill"></i> <?php echo $config['ville']; ?></span>
                    <span><i class="bi bi-cake2-fill"></i> <?php echo $age; ?> ans</span>
                    <span><i class="bi bi-code-slash"></i> <?php echo $exp; ?> ans d'expérience</span>
                    <span><i class="bi bi-mortarboard-fill"></i> <?php echo $config['formation']; ?></span>
                </div>
            </div>
        </div>

        <div class="row mb-5 justify-content-center" data-aos="fade-up" data-aos-delay="100">
            <div class="col-12 glass p-4">
                <div class="row">
                    <?php foreach($competences as $categorie => $skills): ?>
                    <div class="col-md-4 mb-3 mb-md-0 text-center text-md-start">
                        <h6 class="text-uppercase fw-bold text-primary mb-3 small"><?php echo $categorie; ?></h6>
                        <div class="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
                            <?php foreach($skills as $skill): ?>
                                <span class="badge bg-secondary bg-opacity-10 text-body border border-secondary border-opacity-25 rounded-pill px-3 py-2 fw-normal">
                                    <?php echo $skill; ?>
                                </span>
                            <?php endforeach; ?>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>

        <h3 id="projets" class="section-title text-center mt-5" data-aos="fade-up">Réalisations Sélectionnées</h3>
        <div class="row g-4 mb-5">
            <?php foreach($mes_sites as $site): ?>
            <div class="col-md-6" data-aos="fade-up" data-aos-delay="100">
                <div class="card project-card glass border-0 h-100">
                    <img src="<?php echo $site['img']; ?>" class="card-img-top" alt="<?php echo $site['titre']; ?>">
                    <div class="card-body p-4 d-flex flex-column">
                        <h5 class="card-title fw-bold"><?php echo $site['titre']; ?></h5>
                        <p class="card-text small text-muted flex-grow-1"><?php echo $site['desc']; ?></p>
                        
                        <div class="mb-3">
                            <?php foreach($site['tags'] as $tag): ?>
                                <span class="badge bg-primary bg-opacity-10 text-primary me-1"><?php echo $tag; ?></span>
                            <?php endforeach; ?>
                        </div>
                        
                        <a href="<?php echo $site['url']; ?>" class="btn btn-sm btn-light border w-100 rounded-pill fw-bold">
                            Voir le projet <i class="bi bi-arrow-right ms-1"></i>
                        </a>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>

        <div class="d-flex align-items-center justify-content-between mb-4 mt-5">
            <h3 class="section-title mb-0">Code Open Source</h3>
            <a href="<?php echo $gh_user['html_url']; ?>" target="_blank" class="text-decoration-none small">
                Voir tout sur GitHub <i class="bi bi-github"></i>
            </a>
        </div>
        
        <div class="row g-4">
            <?php 
            if($gh_repos):
                foreach($gh_repos as $index => $repo): 
                // Skip les forks si nécessaire, ici on garde tout
            ?>
            <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="<?php echo $index * 50; ?>">
                <div class="card project-card glass border-0 p-3 h-100">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title fw-bold text-truncate" style="max-width: 80%;">
                                <i class="bi bi-journal-code me-2 text-muted"></i>
                                <?php echo $repo['name']; ?>
                            </h5>
                            <span class="badge bg-warning text-dark rounded-pill">
                                <i class="bi bi-star-fill small"></i> <?php echo $repo['stargazers_count']; ?>
                            </span>
                        </div>
                        
                        <p class="card-text small text-muted flex-grow-1">
                            <?php echo $repo['description'] ? substr($repo['description'], 0, 100) . '...' : 'Pas de description fournie.'; ?>
                        </p>
                        
                        <div class="repo-stats mt-3 pt-3 border-top border-secondary border-opacity-10 d-flex justify-content-between align-items-center">
                            <span class="badge bg-secondary bg-opacity-10 text-body">
                                <?php echo $repo['language'] ?? 'Code'; ?>
                            </span>
                            <a href="<?php echo $repo['html_url']; ?>" target="_blank" class="btn btn-sm btn-link text-decoration-none p-0 text-reset stretched-link">
                                Voir le code &rarr;
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <?php 
                endforeach; 
            else: 
            ?>
                <div class="col-12 text-center py-5 glass">
                    <p class="text-muted">Impossible de charger les projets GitHub pour le moment.</p>
                </div>
            <?php endif; ?>
        </div>

        <div class="mt-5 py-5 text-center" id="contact" data-aos="fade-up">
            <h2 class="fw-bold mb-4">Travaillons ensemble</h2>
            <div class="d-flex justify-content-center gap-3 mb-4">
                <a href="mailto:<?php echo $config['email']; ?>" class="btn-apple px-4 py-2 text-decoration-none">
                    <i class="bi bi-envelope-fill me-2"></i> Email
                </a>
                <a href="<?php echo $config['linkedin']; ?>" class="btn glass text-reset px-4 py-2 d-flex align-items-center">
                    <i class="bi bi-linkedin me-2"></i> LinkedIn
                </a>
            </div>
            <p class="small text-muted">&copy; <?php echo date('Y'); ?> <?php echo $config['prenom'] . ' ' . $config['nom']; ?>. Tous droits réservés.</p>
        </div>

    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>
        // Init Animations
        AOS.init({
            duration: 800,
            once: true,
            offset: 50
        });

        // Dark Mode Logic
        const themeToggle = document.getElementById('themeToggle');
        const icon = themeToggle.querySelector('i');
        const html = document.documentElement;
        
        // Check LocalStorage
        const savedTheme = localStorage.getItem('theme') || 'light';
        html.setAttribute('data-theme', savedTheme);
        updateIcon(savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateIcon(newTheme);
        });

        function updateIcon(theme) {
            if(theme === 'dark') {
                icon.classList.remove('bi-moon-stars');
                icon.classList.add('bi-sun-fill');
            } else {
                icon.classList.remove('bi-sun-fill');
                icon.classList.add('bi-moon-stars');
            }
        }
    </script>
</body>
</html>