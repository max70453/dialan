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

function validateField(input) {
    const value = input.value.trim();
    const parent = input.closest('.form-group');
    
    if (!parent) return false;
    
    const wrapper = parent.querySelector('.input-wrapper') || parent.querySelector('.select-wrapper');
    
    if (!value) {
        input.classList.add('error');
        input.classList.remove('valid');
        if (wrapper) {
            wrapper.classList.add('error');
            wrapper.classList.remove('valid');
        }
        return false;
    } else {
        input.classList.remove('error');
        input.classList.add('valid');
        if (wrapper) {
            wrapper.classList.remove('error');
            wrapper.classList.add('valid');
        }
        return true;
    }
}

if (form) {
    const inputs = form.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const formInputs = form.querySelectorAll('input, select');
        
        formInputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            setTimeout(() => {
                const formData = {
                    name: document.getElementById('name').value,
                    phone: document.getElementById('phone').value,
                    address: document.getElementById('address').value,
                    tariff: document.getElementById('tariff').value,
                    date: new Date().toISOString()
                };

                localStorage.setItem('dialan_application', JSON.stringify(formData));
                
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                
                if (modal) {
                    modal.classList.add('active');
                }
                
                formInputs.forEach(input => {
                    input.classList.remove('valid');
                    const wrapper = input.closest('.input-wrapper') || input.closest('.select-wrapper');
                    if (wrapper) {
                        wrapper.classList.remove('valid');
                    }
                });
                
                form.reset();
            }, 1500);
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
        if (value.length > 11) {
            value = value.substring(0, 11);
        }
        
        let formatted = '';
        if (value.length > 0) {
            formatted = '+' + value;
        }
        if (value.length >= 2) {
            formatted = '+' + value.substring(0, 1) + ' (' + value.substring(1);
        }
        if (value.length >= 5) {
            formatted = '+' + value.substring(0, 1) + ' (' + value.substring(1, 4) + ') ' + value.substring(4);
        }
        if (value.length >= 7) {
            formatted = '+' + value.substring(0, 1) + ' (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7);
        }
        if (value.length >= 9) {
            formatted = '+' + value.substring(0, 1) + ' (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7, 9) + '-' + value.substring(9);
        }
        
        e.target.value = formatted;
    });
}

const currentYearEl = document.getElementById('currentYear');
if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}

if (speedSlider) {
    updateCalculator();
}
