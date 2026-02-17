const speeds = [10, 30, 100, 200, 500, 1000];
const tariffs = [
    { name: 'Старт', speed: 10, price: 199 },
    { name: 'Старт', speed: 30, price: 299 },
    { name: 'Оптимальный', speed: 100, price: 499 },
    { name: 'Оптимальный', speed: 200, price: 599 },
    { name: 'Премиум', speed: 500, price: 799 },
    { name: 'Бизнес', speed: 1000, price: 1499 }
];

let selectedSpeed = speeds[3];
let connectionType = 'ethernet';
let extraServices = 0;
let recommendedTariff = null;

const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');
const resultSpeed = document.getElementById('resultSpeed');
const recommendedTariffEl = document.getElementById('recommendedTariff');
const totalPriceEl = document.getElementById('totalPrice');
const typeBtns = document.querySelectorAll('.type-btn');
const checkboxes = document.querySelectorAll('.checkbox-item input');

if (speedSlider) {
    speedSlider.addEventListener('input', function() {
        selectedSpeed = speeds[this.value];
        speedValue.textContent = selectedSpeed;
        updateCalculator();
    });
}

if (typeBtns.length > 0) {
    typeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            typeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            connectionType = this.dataset.type;
        });
    });
}

if (checkboxes.length > 0) {
    checkboxes.forEach(cb => {
        cb.addEventListener('change', function() {
            let total = 0;
            checkboxes.forEach(c => {
                if (c.checked) total += parseInt(c.value);
            });
            extraServices = total;
            updateCalculator();
        });
    });
}

function updateCalculator() {
    const suitableTariffs = tariffs.filter(t => t.speed >= selectedSpeed);
    recommendedTariff = suitableTariffs[0];
    
    if (!recommendedTariff) {
        recommendedTariff = tariffs[tariffs.length - 1];
    }

    recommendedTariffEl.textContent = recommendedTariff.name;
    resultSpeed.textContent = recommendedTariff.speed;
    totalPriceEl.textContent = recommendedTariff.price + extraServices;
}

function selectTariff() {
    if (recommendedTariff) {
        const select = document.getElementById('tariff');
        const tariffMap = {
            'Старт': 'start',
            'Оптимальный': 'optimal',
            'Премиум': 'premium',
            'Бизнес': 'business'
        };
        select.value = tariffMap[recommendedTariff.name];
    }
}

function setTariff(name, speed, price) {
    const select = document.getElementById('tariff');
    if (select) {
        const tariffMap = {
            'Старт': 'start',
            'Оптимальный': 'optimal',
            'Премиум': 'premium',
            'Бизнес': 'business'
        };
        select.value = tariffMap[name];
    }
}

const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.slider-dot');
let currentSlide = 0;
let slideInterval;

if (slides.length > 0) {
    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        showSlide((currentSlide + 1) % slides.length);
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            clearInterval(slideInterval);
            showSlide(parseInt(this.dataset.slide));
            startSlider();
        });
    });

    startSlider();
}

window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

const form = document.getElementById('connectionForm');
const modal = document.getElementById('successModal');

function closeModal() {
    if (modal) {
        modal.classList.remove('active');
    }
}

if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], select[required]');
        
        inputs.forEach(input => {
            input.classList.remove('error');
            if (!input.value.trim()) {
                input.classList.add('error');
                isValid = false;
            }
        });

        if (isValid) {
            const formData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                tariff: document.getElementById('tariff').value,
                date: new Date().toISOString()
            };

            localStorage.setItem('dialan_application', JSON.stringify(formData));
            
            if (modal) {
                modal.classList.add('active');
            }
            form.reset();
        }
    });
}

if (modal) {
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            value = '+' + value;
        }
        if (value.length > 1) {
            value = value.substring(0, 2) + ' (' + value.substring(2);
        }
        if (value.length > 7) {
            value = value.substring(0, 7) + ') ' + value.substring(7);
        }
        if (value.length > 12) {
            value = value.substring(0, 12) + '-' + value.substring(12);
        }
        if (value.length > 15) {
            value = value.substring(0, 15) + '-' + value.substring(15);
        }
        if (value.length > 17) {
            value = value.substring(0, 17);
        }
        e.target.value = value;
    });
}

const currentYearEl = document.getElementById('currentYear');
if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}

if (speedSlider) {
    updateCalculator();
}
