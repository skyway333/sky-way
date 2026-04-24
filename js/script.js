function reveal() {
    var reveals = document.querySelectorAll(".reveal");

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 100;

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

window.addEventListener("scroll", reveal);
// Trigger on load
reveal();

// Mobile menu toggle logic
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('a, button');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // ===== Hotel Lightbox =====
    const lightbox = document.getElementById('hotel-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxName = document.getElementById('lightbox-hotel-name');
    const lightboxCurrent = document.getElementById('lightbox-current');
    const lightboxTotal = document.getElementById('lightbox-total');
    const btnClose = document.getElementById('lightbox-close');
    const btnPrev = document.getElementById('lightbox-prev');
    const btnNext = document.getElementById('lightbox-next');
    const backdrop = lightbox ? lightbox.querySelector('.lightbox-backdrop') : null;

    let currentImages = [];
    let currentIndex = 0;

    function openLightbox(hotelName, images, startIndex) {
        currentImages = images;
        currentIndex = startIndex || 0;
        lightboxName.textContent = hotelName;
        lightboxTotal.textContent = images.length;
        showImage(currentIndex);
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
        currentImages = [];
        currentIndex = 0;
    }

    function showImage(index) {
        if (!currentImages.length) return;
        // Fade effect
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = currentImages[index];
            lightboxImg.alt = lightboxName.textContent + ' - Photo ' + (index + 1);
            lightboxCurrent.textContent = index + 1;
            lightboxImg.style.opacity = '1';
        }, 150);
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % currentImages.length;
        showImage(currentIndex);
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        showImage(currentIndex);
    }

    // Attach "View More" buttons
    document.querySelectorAll('.btn-view-more').forEach(btn => {
        btn.addEventListener('click', () => {
            const hotelName = btn.dataset.hotel;
            const images = JSON.parse(btn.dataset.images);
            openLightbox(hotelName, images, 0);
        });
    });

    // Controls
    if (btnClose) btnClose.addEventListener('click', closeLightbox);
    if (btnPrev) btnPrev.addEventListener('click', prevImage);
    if (btnNext) btnNext.addEventListener('click', nextImage);
    if (backdrop) backdrop.addEventListener('click', closeLightbox);

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.style.display === 'flex') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        }
    });

    // ===== Contact Form — FormSubmit.co AJAX =====
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = document.getElementById('contact-submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const formData = {
                name: this.querySelector('[name="name"]').value,
                phone: this.querySelector('[name="phone"]').value,
                message: this.querySelector('[name="message"]').value,
                _subject: 'New Journey Request — Sky Way Dahab',
            };

            fetch('https://formsubmit.co/ajax/rt7002203@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success === 'true' || data.success === true) {
                    submitBtn.textContent = '✓ Message Sent';
                    submitBtn.classList.remove('from-primary', 'to-primary-container');
                    submitBtn.classList.add('bg-[#006877]');
                    contactForm.reset();
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        submitBtn.classList.add('from-primary', 'to-primary-container');
                        submitBtn.classList.remove('bg-[#006877]');
                    }, 3500);
                } else {
                    throw new Error('Submission failed');
                }
            })
            .catch(error => {
                submitBtn.textContent = 'Error — Try Again';
                submitBtn.disabled = false;
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                }, 3000);
            });
        });
    }
});
