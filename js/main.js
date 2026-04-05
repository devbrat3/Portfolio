// ================= INIT =================

document.addEventListener("DOMContentLoaded", initPortfolio);

function initPortfolio() {
    cacheDOM();
    loadProjects();
    setupFilters();
    setupNavbar();
    setupTypingEffect();
    setupRevealObserver();
    setupModal();

    setupMasterScroll(); // ✅ optimized scroll
    setupTilt();         // ✅ optimized tilt
    initParticles();     // ✅ optimized particles
    setupCursor();       // ✅ smooth cursor
}


// ================= DOM CACHE =================

let container, modal, modalTitle, modalDesc, modalTech, modalGithub, modalLive;

function cacheDOM() {
    container = document.getElementById("project-container");

    modal = document.getElementById("project-modal");
    modalTitle = document.getElementById("modal-title");
    modalDesc = document.getElementById("modal-description");
    modalTech = document.getElementById("modal-tech");
    modalGithub = document.getElementById("modal-github");
    modalLive = document.getElementById("modal-live");
}


// ================= PROJECT RENDER =================

function loadProjects(filter = "all") {

    if (!container) return;

    container.innerHTML = "";

    const filtered = filter === "all"
        ? [...projects]
        : projects.filter(p => p.category.includes(filter));

    filtered.sort((a, b) => b.year - a.year);

    const fragment = document.createDocumentFragment();

    filtered.forEach(project => {

        const card = document.createElement("div");
        card.className = "project-card";
        card.dataset.id = project.id;

        card.innerHTML = `
            <img src="${project.image}" loading="lazy" class="project-img" />

            <div class="project-top">
                <h3>${project.title}</h3>
                ${project.featured ? `<span class="badge">★ Featured</span>` : ""}
            </div>

            <p>${project.description}</p>

            <div class="tech">
                ${project.tech.map(t => `<span>${t}</span>`).join("")}
            </div>

            <div class="project-footer">
                <span class="year">${project.year}</span>
                <div class="links">
                    <a href="${project.github}" target="_blank">GitHub</a>
                    <a href="${project.live}" target="_blank">Live</a>
                </div>
            </div>
        `;

        fragment.appendChild(card);
    });

    container.appendChild(fragment);

    setupTilt(); // reapply
}


// ================= FILTER =================

function setupFilters() {
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelector(".filter-btn.active")?.classList.remove("active");
            btn.classList.add("active");
            loadProjects(btn.dataset.filter);
        });
    });
}


// ================= NAVBAR =================

function setupNavbar() {
    const toggle = document.getElementById("menu-toggle");
    const nav = document.getElementById("nav-links");

    toggle?.addEventListener("click", () => nav.classList.toggle("active"));
}


// ================= MASTER SCROLL (OPTIMIZED) =================

function setupMasterScroll() {

    const navbar = document.querySelector(".navbar");
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");
    const scrollBtn = document.getElementById("scrollTopBtn");
    const hero = document.querySelector(".hero");
    const particles = document.getElementById("particles");

    window.addEventListener("scroll", debounce(() => {

        const y = window.scrollY;

        navbar?.classList.toggle("scrolled", y > 50);

        if (scrollBtn) {
            scrollBtn.style.display = y > 300 ? "block" : "none";
        }

        let current = "";
        sections.forEach(section => {
            if (y >= section.offsetTop - 120) current = section.id;
        });

        navLinks.forEach(link => {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${current}`
            );
        });

        if (hero) hero.style.transform = `translateY(${y * 0.15}px)`;
        if (particles) particles.style.transform = `translateY(${y * 0.08}px)`;

    }, 10));
}


// ================= TYPING =================

function setupTypingEffect() {

    const el = document.getElementById("typing-text");
    if (!el) return;

    const roles = [
        "Full Stack Developer (.NET & Java)",
        "Machine Learning & NLP Engineer",
        "Backend & API Developer",
        "Data Analytics Enthusiast"
    ];

    let i = 0, j = 0, deleting = false;

    function type() {
        const current = roles[i];
        el.textContent = current.substring(0, j);

        if (!deleting && j < current.length) j++;
        else if (deleting && j > 0) j--;
        else {
            deleting = !deleting;
            if (!deleting) i = (i + 1) % roles.length;
        }

        setTimeout(type, deleting ? 40 : 80);
    }

    type();
}


// ================= REVEAL =================

function setupRevealObserver() {

    const reveals = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    reveals.forEach(el => observer.observe(el));
}


// ================= MODAL =================

function setupModal() {

    if (!container || !modal) return;

    container.addEventListener("click", e => {

        const card = e.target.closest(".project-card");
        if (!card) return;

        const project = projects.find(p => p.id == card.dataset.id);
        if (!project) return;

        modalTitle.textContent = project.title;
        modalDesc.textContent = project.description;
        modalTech.innerHTML = project.tech.map(t => `<span>${t}</span>`).join("");

        modalGithub.href = project.github;
        modalLive.href = project.live;

        modal.style.display = "flex";
    });

    document.getElementById("close-modal")?.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", e => {
        if (e.target === modal) modal.style.display = "none";
    });
}


// ================= TILT (OPTIMIZED) =================

function setupTilt() {

    document.querySelectorAll(".project-card").forEach(card => {

        let frame;

        card.addEventListener("mousemove", e => {

            if (frame) cancelAnimationFrame(frame);

            frame = requestAnimationFrame(() => {

                const rect = card.getBoundingClientRect();

                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const rx = -(y - rect.height / 2) / 25;
                const ry = (x - rect.width / 2) / 25;

                card.style.transform =
                    `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
            });

        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "rotateX(0) rotateY(0)";
        });

    });
}


// ================= PARTICLES (OPTIMIZED) =================

function initParticles() {

    const canvas = document.getElementById("particles");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let particles = [];
    let lastTime = 0;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.fillStyle = "rgba(59,130,246,0.6)";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < 70; i++) {
            particles.push(new Particle());
        }
    }

    function animate(time = 0) {

        if (time - lastTime < 16) {
            requestAnimationFrame(animate);
            return;
        }

        lastTime = time;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    init();
    animate();
}


// ================= CURSOR (RAF SMOOTH) =================

function setupCursor() {

    const cursor = document.querySelector(".cursor");
    const follower = document.querySelector(".cursor-follower");

    let x = 0, y = 0;

    document.addEventListener("mousemove", e => {
        x = e.clientX;
        y = e.clientY;
    });

    function animate() {
        if (cursor && follower) {
            cursor.style.transform = `translate(${x}px, ${y}px)`;
            follower.style.transform = `translate(${x}px, ${y}px)`;
        }
        requestAnimationFrame(animate);
    }

    animate();
}


// ================= UTIL =================

function debounce(func, wait = 10) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}


// ================= LOADER =================

window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.style.opacity = "0";
        setTimeout(() => loader.style.display = "none", 500);
    }
});

// ================= THEME TOGGLE =================

const themeBtn = document.getElementById("theme-toggle");

// Load saved theme
if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
}

themeBtn?.addEventListener("click", () => {
    document.body.classList.toggle("light");

    // Save preference
    if (document.body.classList.contains("light")) {
        localStorage.setItem("theme", "light");
    } else {
        localStorage.setItem("theme", "dark");
    }
});

// HERO IMAGE 3D TILT
const heroImg = document.querySelector(".hero-img");

heroImg?.addEventListener("mousemove", (e) => {
    const rect = heroImg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = -(y - rect.height / 2) / 20;
    const rotateY = (x - rect.width / 2) / 20;

    heroImg.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

heroImg?.addEventListener("mouseleave", () => {
    heroImg.style.transform = "rotateX(0) rotateY(0)";
});