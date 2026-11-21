
/* =================================================
   KEN ROQUERO | PORTFOLIO JAVASCRIPT
   Interactive | Animated | Responsive
================================================= */


/* =================================================
   1. AUTOMATIC COPYRIGHT YEAR
================================================= */

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


/* =================================================
   2. NAVIGATION SCROLL EFFECT
================================================= */

const navbar = document.querySelector(".nav");

window.addEventListener("scroll", () => {
    if (navbar) {
        navbar.classList.toggle("scrolled", window.scrollY > 50);
    }
});


/* =================================================
   3. MOBILE NAVIGATION
================================================= */

const nav = document.querySelector(".nav nav");
const menuButton = document.querySelector(".menu-toggle");

if (navbar && nav && menuButton) {

    menuButton.addEventListener("click", () => {

        const isOpen = nav.classList.toggle("active");

        menuButton.textContent = isOpen ? "✕" : "☰";

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

    });

    nav.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            nav.classList.remove("active");

            menuButton.textContent = "☰";

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });

}


/* =================================================
   4. SCROLL REVEAL ANIMATION
================================================= */

const revealElements = document.querySelectorAll(
    "section, .projects article, .skill-grid article, .sport-grid article, .timeline article"
);

const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if ("IntersectionObserver" in window && !reduceMotion) {

    revealElements.forEach(element => {
        element.classList.add("reveal");
    });

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

}


/* =================================================
   5. ACTIVE NAVIGATION LINK
================================================= */

const sections = document.querySelectorAll("main section");
const navLinks = document.querySelectorAll(".nav nav a");

function updateActiveNavigation() {

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

}

window.addEventListener("scroll", updateActiveNavigation);

updateActiveNavigation();


/* =================================================
   6. SMOOTH SCROLLING
================================================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", event => {

        const targetId = anchor.getAttribute("href");

        if (!targetId || targetId === "#") return;

        const target = document.querySelector(targetId);

        if (target) {

            event.preventDefault();

            target.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "start"
            });

        }

    });

});


/* =================================================
   7. PROJECT CARD HOVER EFFECT
================================================= */

const projectCards = document.querySelectorAll(".projects article");

projectCards.forEach(card => {

    card.addEventListener("mouseenter", () => {
        card.classList.add("hovered");
    });

    card.addEventListener("mouseleave", () => {
        card.classList.remove("hovered");
    });

});


/* =================================================
   8. ANIMATED TECHNOLOGY CIRCUIT BACKGROUND
================================================= */

const canvas = document.getElementById("circuit-background");

if (canvas && !reduceMotion) {

    const ctx = canvas.getContext("2d");

    let width = 0;
    let height = 0;
    let circuits = [];
    let animationFrame;

    const colors = [
        "#00d9ff",
        "#168bff",
        "#637dff",
        "#a66cff"
    ];

    /* RESIZE CANVAS */

    function resizeCanvas() {

        const dpr = Math.min(
            window.devicePixelRatio || 1,
            2
        );

        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = width * dpr;
        canvas.height = height * dpr;

        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        createCircuits();

    }


    /* CREATE CIRCUIT PATHS */

    function createCircuits() {

        circuits = [];

        const count = Math.max(
            18,
            Math.floor(width / 35)
        );

        for (let i = 0; i < count; i++) {

            const startX = Math.random() * width;
            const startY = Math.random() * height;

            const direction = Math.random() > 0.5 ? 1 : -1;

            const length = 100 + Math.random() * 250;

            const points = [
                { x: startX, y: startY }
            ];

            let x = startX;
            let y = startY;

            for (let j = 0; j < 3; j++) {

                y += length / 3;

                points.push({
                    x: x,
                    y: y
                });

                x += (30 + Math.random() * 70) * direction;

                points.push({
                    x: x,
                    y: y
                });

            }

            circuits.push({

                points: points,

                progress: Math.random(),

                speed: 0.0015 + Math.random() * 0.0025,

                color: colors[
                    Math.floor(Math.random() * colors.length)
                ]

            });

        }

    }


    /* DRAW CIRCUIT LINES */

    function drawCircuit(circuit) {

        const points = circuit.points;

        ctx.beginPath();

        ctx.moveTo(
            points[0].x,
            points[0].y
        );

        for (let i = 1; i < points.length; i++) {

            ctx.lineTo(
                points[i].x,
                points[i].y
            );

        }

        ctx.strokeStyle = "rgba(0, 180, 255, 0.25)";
        ctx.lineWidth = 1.5;

        ctx.stroke();


        /* MOVING LIGHT */

        const total = points.length - 1;

        const position = circuit.progress * total;

        const index = Math.min(
            Math.floor(position),
            total - 1
        );

        const fraction = position - index;

        const start = points[index];
        const end = points[index + 1];

        const x = start.x + (end.x - start.x) * fraction;
        const y = start.y + (end.y - start.y) * fraction;

        ctx.beginPath();

        ctx.arc(x, y, 3, 0, Math.PI * 2);

        ctx.fillStyle = circuit.color;

        ctx.shadowBlur = 18;
        ctx.shadowColor = circuit.color;

        ctx.fill();

        ctx.shadowBlur = 0;


        /* CIRCUIT ENDPOINT */

        const last = points[points.length - 1];

        ctx.beginPath();

        ctx.arc(
            last.x,
            last.y,
            2.5,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = circuit.color;
        ctx.fill();

    }


    /* ANIMATION LOOP */

    function animateCircuits() {

        ctx.clearRect(0, 0, width, height);

        circuits.forEach(circuit => {

            drawCircuit(circuit);

            circuit.progress += circuit.speed;

            if (circuit.progress >= 1) {
                circuit.progress = 0;
            }

        });

        animationFrame = requestAnimationFrame(
            animateCircuits
        );

    }


    /* START BACKGROUND */

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    animateCircuits();


    /* PAUSE WHEN TAB IS HIDDEN */

    document.addEventListener("visibilitychange", () => {

        if (document.hidden) {

            cancelAnimationFrame(animationFrame);

        } else {

            cancelAnimationFrame(animationFrame);

            animateCircuits();

        }

    });

}


/* =================================================
   9. CONSOLE MESSAGE
================================================= */

console.log(
    "%cWELCOME TO KEN ROQUERO'S PORTFOLIO!",
    "color: #00d9ff; font-size: 18px; font-weight: bold;"
);

console.log(
    "%cBSIT STUDENT | FUTURE IT PROFESSIONAL",
    "color: #a66cff; font-size: 13px;"
);
