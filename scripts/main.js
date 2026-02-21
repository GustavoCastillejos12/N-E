// Smooth scroll para los enlaces de navegación y lógica de cuenta regresiva
document.addEventListener('DOMContentLoaded', function() {
    // Navegación suave
    const navLinks = document.querySelectorAll('.nav-link, .btn');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Efecto de scroll en el header
    let lastScroll = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.background = 'rgba(10, 14, 26, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0, 206, 209, 0.1)';
        } else {
            header.style.background = 'rgba(10, 14, 26, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });

    // Animación de entrada para las tarjetas de características
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Actualizar enlace activo en la navegación al hacer scroll
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
        const scrollPosition = window.pageYOffset + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // ============================================
    // Cuenta regresiva de carreras (sábados 20:00 CDMX)
    // ============================================

    // JSON de rondas de la temporada 7
    const raceSchedule = [
        { round: 'R1',  circuit: 'Silverstone - Great Britain', dateTime: '2026-02-21T20:00:00' },
        { round: 'R2',  circuit: 'Silverstone - Great Britain', dateTime: '2026-02-28T20:00:00' },
        { round: 'R3',  circuit: 'Melbourne - Australia',       dateTime: '2026-03-07T20:00:00' },
        { round: 'R4',  circuit: 'Shangai - China',             dateTime: '2026-03-14T20:00:00' },
        { round: 'R5',  circuit: 'Monza - Italy',               dateTime: '2026-03-21T20:00:00' },
        { round: 'R6',  circuit: 'Spa-Francorchamps - Belgium', dateTime: '2026-03-28T20:00:00' },
        { round: 'R7',  circuit: 'Zandvoort - Netherlands',     dateTime: '2026-04-04T20:00:00' },
        { round: 'R8',  circuit: 'Zandvoort - Netherlands',     dateTime: '2026-04-04T20:00:00' },
        { round: 'R9',  circuit: 'Lusail - Qatar',              dateTime: '2026-04-18T20:00:00' },
        { round: 'R10', circuit: 'Miami - United States',       dateTime: '2026-04-25T20:00:00' },
        { round: 'R11', circuit: 'Yas Marina - Abu Dhabi',      dateTime: '2026-05-02T20:00:00' },
        { round: 'R12', circuit: 'Interlagos - Brazil',         dateTime: '2026-05-16T20:00:00' },
        { round: 'R13', circuit: 'Jeddah - Arabia Saudita',     dateTime: '2026-05-23T20:00:00' },
        { round: 'R14', circuit: 'Red Bull Ring - Austria',     dateTime: '2026-05-30T20:00:00' },
        { round: 'R15', circuit: 'Red Bull Ring - Austria',     dateTime: '2026-06-06T20:00:00' }
    ];

    function initRaceCountdown() {
        const nameEl = document.getElementById('next-race-name');
        const countdownEl = document.getElementById('next-race-countdown');

        if (!nameEl || !countdownEl) return;

        function getNextRace() {
            const now = new Date();
            return raceSchedule.find(race => new Date(race.dateTime) > now) || null;
        }

        function formatTimeDiff(msDiff) {
            if (msDiff <= 0) {
                return 'La carrera está comenzando';
            }

            const totalSeconds = Math.floor(msDiff / 1000);
            const days = Math.floor(totalSeconds / 86400);
            const hours = Math.floor((totalSeconds % 86400) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            const parts = [];

            // Días
            if (days > 0) {
                parts.push(`${days} ${days === 1 ? 'día' : 'días'}`);
            }

            // Horas
            parts.push(
                `${hours.toString().padStart(2, '0')} ${hours === 1 ? 'hora' : 'horas'}`
            );

            // Minutos
            parts.push(
                `${minutes.toString().padStart(2, '0')} ${minutes === 1 ? 'minuto' : 'minutos'}`
            );

            // Segundos
            parts.push(
                `${seconds.toString().padStart(2, '0')} ${seconds === 1 ? 'segundo' : 'segundos'}`
            );

            return parts.join('  ');
        }

        let currentRace = getNextRace();

        if (!currentRace) {
            nameEl.textContent = 'Temporada finalizada';
            countdownEl.textContent = '';
            return;
        }

        nameEl.textContent = `${currentRace.round} · ${currentRace.circuit}`;

        function tick() {
            const now = new Date();
            // Si ya pasó la carrera actual, buscar la siguiente
            if (new Date(currentRace.dateTime) <= now) {
                currentRace = getNextRace();
                if (!currentRace) {
                    nameEl.textContent = 'Temporada finalizada';
                    countdownEl.textContent = '';
                    clearInterval(intervalId);
                    return;
                }
                nameEl.textContent = `${currentRace.round} · ${currentRace.circuit}`;
            }

            const diff = new Date(currentRace.dateTime).getTime() - now.getTime();
            countdownEl.textContent = formatTimeDiff(diff);
        }

        // Primera ejecución inmediata
        tick();
        const intervalId = setInterval(tick, 1000);
    }

    initRaceCountdown();

    // ============================================
    // Team Carousel (compatible con GitHub Pages)
    // ============================================
    try {
        // Base URL para que las rutas funcionen en GitHub Pages (ej: /Seires/)
        var baseUrl = '';
        var pathParts = window.location.pathname.split('/').filter(Boolean);
        if (pathParts.length > 1) {
            baseUrl = '/' + pathParts[0] + '/';
        } else if (pathParts.length === 1 && pathParts[0] !== '' && !/\.(html?|php)$/i.test(pathParts[0])) {
            baseUrl = '/' + pathParts[0] + '/';
        }

        var carouselSlides = document.querySelectorAll('.carousel-slide');
        var carouselIndicators = document.querySelectorAll('.carousel-indicator');
        var prevBtn = document.getElementById('carousel-prev');
        var nextBtn = document.getElementById('carousel-next');
        var teamLogo = document.getElementById('carousel-team-logo');
        var teamName = document.getElementById('carousel-team-name');

        if (carouselSlides.length > 0 && carouselIndicators.length > 0) {
            var currentSlide = 0;
            var totalSlides = carouselSlides.length;

            // Team data for header updates (rutas relativas a baseUrl)
            var teamData = [
                { name: 'Haas', logo: baseUrl + 'images/equipos/haas-logo.png', class: 'team-haas' },
                { name: 'Mercedes', logo: baseUrl + 'images/equipos/mercedes-logo.png', class: 'team-mercedes' },
                { name: 'Red Bull', logo: baseUrl + 'images/equipos/redbull-logo.png', class: 'team-redbull' },
                { name: 'Williams', logo: baseUrl + 'images/equipos/williams-logo.png', class: 'team-williams' },
                { name: 'Sauber', logo: baseUrl + 'images/equipos/sauber-logo.png', class: 'team-sauber' },
                { name: 'Alpine', logo: baseUrl + 'images/equipos/alpine-logo.png', class: 'team-alpine' },
                { name: 'Aston Martin', logo: baseUrl + 'images/equipos/astonmartin-logo.png', class: 'team-astonmartin' },
                { name: 'McLaren', logo: baseUrl + 'images/equipos/mclaren-logo.png', class: 'team-mclaren' },
                { name: 'Ferrari', logo: baseUrl + 'images/equipos/ferrari-logo.png', class: 'team-ferrari' },
                { name: 'Racing Bulls', logo: baseUrl + 'images/equipos/rb-logo.png', class: 'team-racingbulls' }
            ];

            function updateCarousel(slideIndex) {
                carouselSlides.forEach(function(slide) { slide.classList.remove('active', 'prev'); });
                carouselIndicators.forEach(function(indicator) { indicator.classList.remove('active'); });

                carouselSlides[slideIndex].classList.add('active');
                carouselIndicators[slideIndex].classList.add('active');

                var prevIndex = slideIndex === 0 ? totalSlides - 1 : slideIndex - 1;
                carouselSlides[prevIndex].classList.add('prev');

                var team = teamData[slideIndex];
                if (teamName) { teamName.textContent = team.name; }
                if (teamLogo) {
                    teamLogo.src = team.logo;
                    teamLogo.alt = team.name + ' Logo';
                    teamLogo.style.display = 'block';
                }

                var pilotCards = carouselSlides[slideIndex].querySelectorAll('.carousel-pilot-card');
                pilotCards.forEach(function(card) {
                    card.classList.remove('team-haas', 'team-mercedes', 'team-redbull', 'team-williams',
                                         'team-sauber', 'team-alpine', 'team-astonmartin',
                                         'team-mclaren', 'team-ferrari', 'team-racingbulls');
                    card.classList.add(team.class);
                });
            }

            function nextSlide() {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateCarousel(currentSlide);
            }

            function prevSlide() {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                updateCarousel(currentSlide);
            }

            if (nextBtn) nextBtn.addEventListener('click', nextSlide);
            if (prevBtn) prevBtn.addEventListener('click', prevSlide);

            carouselIndicators.forEach(function(indicator, index) {
                indicator.addEventListener('click', function() {
                    currentSlide = index;
                    updateCarousel(currentSlide);
                });
            });

            document.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowLeft') prevSlide();
                if (e.key === 'ArrowRight') nextSlide();
            });

            var autoPlayInterval;
            function startAutoPlay() {
                autoPlayInterval = setInterval(nextSlide, 5000);
            }
            function stopAutoPlay() {
                clearInterval(autoPlayInterval);
            }
            var carousel = document.querySelector('.team-carousel');
            if (carousel) {
                carousel.addEventListener('mouseenter', stopAutoPlay);
                carousel.addEventListener('mouseleave', startAutoPlay);
            }

            updateCarousel(0);
        }
    } catch (err) {
        console.warn('Carousel init:', err);
    }
});
