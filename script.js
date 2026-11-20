
/* ==========================================
   KEN ROQUERO | TECHNOLOGY PORTFOLIO
   Animated Circuit Board Background
   Interactive | Responsive | Futuristic
========================================== */


/* ==========================================
   1. COPYRIGHT YEAR
========================================== */

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


/* ==========================================
   2. ANIMATED TECHNOLOGY BACKGROUND
========================================== */

const canvas = document.createElement("canvas");
canvas.id = "circuit-background";
canvas.setAttribute("aria-hidden", "true");

document.body.prepend(canvas);

const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let circuits = [];
let particles = [];

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


/* CREATE CIRCUIT LINES */

function createCircuits() {
    circuits = [];

    const count = Math.max(15, Math.floor(width / 45));

    for (let i = 0; i < count; i++) {
        let x = Math.random() * width;
        let y = 0;

        const points = [{ x, y }];

        const segments = 3 + Math.floor(Math.random() * 5);

        for (let j = 0; j < segments; j++) {
            const verticalLength = 35 + Math.random() * 90;

            y += verticalLength;
            points.push({ x, y });

            if (Math.random() > 0.35) {
                const direction = Math.random() > 0.5 ? 1 : -1;
                const horizontalLength = 20 + Math.random() * 65;

                x += direction * horizontalLength;

                x = Math.max(5, Math.min(width - 5, x));

                points.push({ x, y });
            }
        }

        circuits.push({
            points,
            progress: Math.random(),
            speed: 0.0015 + Math.random() * 0.003,
            glow: 0.5 + Math.random() * 0.5
        });
    }
}


/* CREATE SMALL LIGHT PARTICLES */

function createParticles() {
    particles = [];

    const count = Math.floor((width * height) / 11000);

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.8 + 0.5,
            alpha: Math.random(),
            speed: 0.003 + Math.random() * 0.008
        });
    }
}


/* RESIZE CANVAS */

function resizeCanvas() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    createCircuits();
    createParticles();

    drawBackground(0);
}


/* DRAW DARK BLUE BACKGROUND */

function drawBackground(time) {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);

    gradient.addColorStop(0, "#061b43");
    gradient.addColorStop(0.55, "#04132f");
    gradient.addColorStop(1, "#020817");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    drawParticles(time);
    drawCircuits(time);
}


/* DRAW CIRCUIT BOARD LINES */

function drawCircuits(time) {
    circuits.forEach(circuit => {
        const points = circuit.points;

        ctx.save();

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }

        ctx.strokeStyle = `rgba(0, 190, 255, ${0.65 * circuit.glow})`;
        ctx.lineWidth = 2;
        ctx.shadowColor = "#00c8ff";
        ctx.shadowBlur = 12;

        ctx.stroke();

        /* CIRCUIT CONNECTION POINTS */

        const lastPoint = points[points.length - 1];

        ctx.beginPath();
        ctx.arc(lastPoint.x, lastPoint.y, 3.5, 0, Math.PI * 2);

        ctx.fillStyle = "#20dfff";
        ctx.shadowColor = "#00c8ff";
        ctx.shadowBlur = 18;

        ctx.fill();

        /* ANIMATED LIGHT TRAVELING THROUGH CIRCUITS */

        const totalSegments = points.length - 1;
        const movingProgress = (time * circuit.speed) % 1;
        const segmentPosition = movingProgress * totalSegments;

        const segmentIndex = Math.floor(segmentPosition);
        const segmentFraction = segmentPosition - segmentIndex;

        if (segmentIndex < totalSegments) {
            const start = points[segmentIndex];
            const end = points[segmentIndex + 1];

            const lightX = start.x + (end.x - start.x) * segmentFraction;
            const lightY = start.y + (end.y - start.y) * segmentFraction;

            ctx.beginPath();
            ctx.arc(lightX, lightY, 3, 0, Math.PI * 2);

            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = "#00eaff";
            ctx.shadowBlur = 20;

            ctx.fill();
        }

        ctx.restore();
    });
}


/* DRAW GLOWING PARTICLES */

function drawParticles(time) {
    particles.forEach(particle => {
        const pulse = Math.sin(time * particle.speed + particle.alpha * 10);

        const opacity = 0.25 + (pulse + 1) * 0.3;

        ctx.beginPath();
        ctx.arc(
            particle.x,
            particle.y,
            particle.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = `rgba(0, 190, 255, ${opacity})`;
        ctx.shadowColor = "#00aaff";
        ctx.shadowBlur = 10;

        ctx.fill();
    });
}


/* ANIMATION LOOP */

let animationFrame;

function animateBackground(time) {
    drawBackground(time);

    if (!prefersReducedMotion) {
        animationFrame = requestAnimationFrame(animateBackground);
    }
}


/* START BACKGROUND */

window.addEventListener("resize", resizeCanvas);

resizeCanvas();

if (prefersReducedMotion) {
    drawBackground(0);
} else {
    animationFrame = requestAnimationFrame(animateBackground);
}


/* ==========================================
   3. NAVIGATION SCROLL EFFECT
========================================== */

const navbar = document.querySelector(".nav");

window.addEventListener("scroll", () => {
    if (navbar) {
        navbar.classList.toggle("scrolled", window.scrollY > 50);
    }
});


/* ==========================================
   4. MOBILE NAVIGATION
========================================== */

const nav = document.querySelector(".nav nav");

if (navbar && nav) {
    const menuButton = document.createElement("button");

    menuButton.className = "menu-toggle";
    menuButton.innerHTML = "☰";
    menuButton.setAttribute("aria-label", "Toggle navigation");
    menuButton.setAttribute("aria-expanded", "false");

    navbar.insertBefore(menuButton, nav);

    menuButton.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("active");

        menuButton.innerHTML = isOpen ? "✕" : "☰";
        menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("active");
            menuButton.innerHTML = "☰";
            menuButton.setAttribute("aria-expanded", "false");
        });
    });
}


/* ==========================================
   5. SCROLL REVEAL ANIMATION
========================================== */

const revealElements = document.querySelectorAll(
    ".hero-text, .portrait, .about, section h2, " +
    ".projects article, .skill-grid article, " +
    ".sport-grid article, .timeline article, .contact"
);

revealElements.forEach(element => {
    element.classList.add("reveal");
});

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach(element => {
        element.classList.add("show");
    });
}


/* ==========================================
   6. ACTIVE NAVIGATION LINK
========================================== */

const sections = document.querySelectorAll("main section");
const navLinks = document.querySelectorAll(".nav nav a");

window.addEventListener("scroll", () => {
    let currentSection = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");

        if (link.getAttribute("href") === `#${currentSection}`) {
            link.classList.add("active");
        }
    });
});


/* ==========================================
   7. SMOOTH SCROLLING
========================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (event) {
        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            event.preventDefault();

            target.scrollIntoView({
                behavior: prefersReducedMotion ? "auto" : "smooth",
                block: "start"
            });
        }
    });
});


/* ==========================================
   8. PROJECT CARD HOVER EFFECT
========================================== */

const projectCards = document.querySelectorAll(".projects article");

projectCards.forEach(card => {
    card.addEventListener("mouseenter", () => {
        card.classList.add("hovered");
    });

    card.addEventListener("mouseleave", () => {
        card.classList.remove("hovered");
    });
});


/* ==========================================
   9. CONSOLE MESSAGE
========================================== */

console.log(
    "%cWELCOME TO KEN ROQUERO'S PORTFOLIO!",
    "color: #00e5ff; font-size: 18px; font-weight: bold;"
);

console.log(
    "%cBSIT STUDENT | FUTURE IT PROFESSIONAL",
    "color: #a855f7; font-size: 13px;"
);
