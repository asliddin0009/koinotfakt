document.addEventListener('DOMContentLoaded', () => {

    // --- AOS Animation Init ---
    if(typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }

    // --- Interactive Mouse-Tracking Starfield Canvas ---
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let stars = [];
    const numStars = window.innerWidth < 768 ? 400 : 800;
    
    // Mouse tracking for parallax shift
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - width/2) * 0.05;
        mouseY = (e.clientY - height/2) * 0.05;
    });

    function initCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        
        stars = [];
        for(let i=0; i<numStars; i++) {
            stars.push({
                x: Math.random() * width * 2 - width/2,  // Extrabounds for shift
                y: Math.random() * height * 2 - height/2,
                size: Math.random() * 1.5,
                speed: Math.random() * 0.2 + 0.05,
                alpha: Math.random() * 0.8 + 0.2
            });
        }
    }

    function animateStars() {
        ctx.clearRect(0, 0, width, height);
        
        // Smooth mouse interpolation
        targetX += (mouseX - targetX) * 0.1;
        targetY += (mouseY - targetY) * 0.1;

        ctx.fillStyle = 'white';
        for(let i=0; i<stars.length; i++) {
            let s = stars[i];
            
            // Move stars slowly upwards
            s.y -= s.speed;
            
            // Reset if out of bounds
            if(s.y < -height/2) {
                s.y = height * 1.5;
                s.x = Math.random() * width * 2 - width/2;
            }

            // Apply parallax shift based on mouse
            let posX = s.x - targetX * s.speed * 10;
            let posY = s.y - targetY * s.speed * 10;

            ctx.globalAlpha = s.alpha;
            ctx.beginPath();
            ctx.arc(posX, posY, s.size, 0, Math.PI*2);
            ctx.fill();
        }
        requestAnimationFrame(animateStars);
    }
    
    initCanvas();
    animateStars();
    window.addEventListener('resize', initCanvas);

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.querySelector('.close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.add('open');
    });

    closeBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
        });
    });

    // --- Audio Control ---
    const audioBtn = document.getElementById('audio-btn');
    const bgAudio = document.getElementById('space-audio');
    let isPlaying = false;

    if(audioBtn && bgAudio) {
        bgAudio.volume = 0.2;
        audioBtn.addEventListener('click', () => {
            if(isPlaying) {
                bgAudio.pause();
                audioBtn.innerHTML = '<i class="ph-fill ph-speaker-slash"></i>';
                audioBtn.classList.remove('playing');
            } else {
                bgAudio.play().catch(e => console.log(e));
                audioBtn.innerHTML = '<i class="ph-fill ph-speaker-high"></i>';
                audioBtn.classList.add('playing');
            }
            isPlaying = !isPlaying;
        });
    }

});
