// ===== Smooth anchor scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== Fade-in on scroll =====
const faders = document.querySelectorAll('.fade-in');
const appearOptions = { threshold: 0.2, rootMargin: "0px 0px -50px 0px" };

const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('appear');
        observer.unobserve(entry.target);
    });
}, appearOptions);

faders.forEach(fader => appearOnScroll.observe(fader));

// ===== Form validation =====
const form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const name = form.querySelector('input[type="text"]').value.trim();
        const email = form.querySelector('input[type="email"]').value.trim();
        const message = form.querySelector('textarea').value.trim();

        if (!name || !email || !message) {
            alert("Please fill in all fields before submitting.");
        } else {
            alert("Thank you for your message, " + name + "! We'll get back to you soon.");
            form.reset();
        }
    });
}

// ===== Back to top button =====
const backToTop = document.createElement('button');
backToTop.innerText = "↑ Top";
backToTop.id = "backToTop";
document.body.appendChild(backToTop);

Object.assign(backToTop.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    padding: "10px 15px",
    background: "#e63946",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    display: "none"
});

window.addEventListener("scroll", () => {
    backToTop.style.display = window.scrollY > 300 ? "block" : "none";
});

backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===== Gallery Carousel =====
document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('galleryWrapper');
    const track = document.getElementById('galleryTrack');
    const images = Array.from(track.querySelectorAll('img'));
    const leftBtn = document.querySelector('.gallery-arrow.left');
    const rightBtn = document.querySelector('.gallery-arrow.right');

    let currentIndex = 0;
    let autoSlideInterval;

    // Scroll instantly to the exact image position (no smooth)
    function scrollToImage(index) {
        const target = images[index];
        wrapper.scrollLeft = target.offsetLeft;
        currentIndex = index;
    }

    function next() {
        const newIndex = (currentIndex + 1) % images.length;
        scrollToImage(newIndex);
    }

    function prev() {
        const newIndex = (currentIndex - 1 + images.length) % images.length;
        scrollToImage(newIndex);
    }

    // Keep index in sync with snap after manual scroll/drag
    let scrollTimeout;
    wrapper.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Find the nearest image to current scrollLeft
            const left = wrapper.scrollLeft;
            let nearest = 0;
            let minDist = Infinity;
            images.forEach((img, i) => {
                const dist = Math.abs(img.offsetLeft - left);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = i;
                }
            });
            currentIndex = nearest;
        }, 100); // wait for snap to settle
    });

    // Wire arrows
    leftBtn.addEventListener('click', () => {
        prev();
        restartAutoSlide();
    });

    rightBtn.addEventListener('click', () => {
        next();
        restartAutoSlide();
    });

    // Auto‑slideshow (no smooth)
    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(next, 4000); // every 4s
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    function restartAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    // Pause on hover
    wrapper.addEventListener('mouseenter', stopAutoSlide);
    wrapper.addEventListener('mouseleave', startAutoSlide);

    // Init
    scrollToImage(0);
    startAutoSlide();
});
