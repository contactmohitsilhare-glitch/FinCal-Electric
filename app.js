// ═══════════════════════════════════════
// THEME
// ═══════════════════════════════════════
function initTheme() {
    const saved = localStorage.getItem('fincal-theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(saved);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('fincal-theme', next);
    updateThemeIcon(next);
    if (typeof calculateFinancial === 'function') calculateFinancial();
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('theme-icon');
    if (!icon) return;
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ═══════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════
function toggleNav() {
    document.getElementById('nav-links').classList.toggle('open');
}

// Scroll shadow on nav
window.addEventListener('scroll', () => {
    const nav = document.getElementById('main-nav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
});

// Smooth scroll for anchor links
document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (a) {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

// ═══════════════════════════════════════
// SCROLL ANIMATIONS
// ═══════════════════════════════════════
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        scrollObserver.observe(el);
    });
});

// ═══════════════════════════════════════
// CALCULATOR STATE
// ═══════════════════════════════════════
let calcDisplay = '0';
let memory = 0;
let shouldReset = false;

function insert(v) {
    if (shouldReset || calcDisplay === '0') {
        calcDisplay = '';
        shouldReset = false;
    }
    calcDisplay += v;
    updateDisplay();
}

function insertOperator(op) {
    shouldReset = false;
    calcDisplay += ' ' + op + ' ';
    updateDisplay();
}

function insertFunction(f) {
    if (shouldReset) { calcDisplay = ''; shouldReset = false; }
    const funcs = ['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'abs'];
    if (funcs.includes(f)) {
        calcDisplay += f + '(';
    } else if (f === 'pi') { insert('3.14159265'); }
    else if (f === 'e') { insert('2.71828183'); }
    else if (f === 'sq') { calcDisplay += '^2'; }
    else if (f === 'pow') { calcDisplay += '^'; }
    else if (f === 'fact') { calcDisplay += '!'; }
    else if (f === 'inv') {
        calcDisplay = '1/(' + calcDisplay + ')';
        calculate();
        return;
    }
    updateDisplay();
}

function clearAll() {
    calcDisplay = '0';
    const h = document.getElementById('calc-history');
    if (h) h.textContent = '';
    updateDisplay();
}

function clearEntry() {
    calcDisplay = '0';
    updateDisplay();
}

function toggleSign() {
    calcDisplay = calcDisplay.startsWith('-')
        ? calcDisplay.substring(1)
        : '-' + calcDisplay;
    updateDisplay();
}

function updateDisplay() {
    const el = document.getElementById('calc-display');
    if (el) el.textContent = calcDisplay;
}

function flashButton(key) {
    const buttons = document.querySelectorAll('.calc-btn');
    buttons.forEach(btn => {
        if (btn.textContent.trim() === key ||
            (key === 'Enter' && btn.classList.contains('btn-equals')) ||
            (key === 'Backspace' && btn.onclick && btn.onclick.name === 'clearEntry') ||
            (key === 'Escape' && btn.onclick && btn.onclick.name === 'clearAll')) {
            btn.style.filter = 'brightness(1.5)';
            btn.style.transform = 'scale(1.1)';
            setTimeout(() => {
                btn.style.filter = '';
                btn.style.transform = '';
            }, 100);
        }
    });
}

function calculate() {

    try {
        let expr = calcDisplay
            .replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-')
            .replace(/\^/g, '**')
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/abs\(/g, 'Math.abs(');

        // Factorial
        expr = expr.replace(/(\d+)!/g, (match, n) => {
            let r = 1;
            for (let i = 2; i <= parseInt(n); i++) r *= i;
            return r;
        });

        // Trig: convert degrees to radians
        expr = expr.replace(/Math\.(sin|cos|tan)\(([^)]+)\)/g,
            'Math.$1(($2)*Math.PI/180)');

        const result = eval(expr);
        const h = document.getElementById('calc-history');
        if (h) h.textContent = calcDisplay + ' =';

        calcDisplay = parseFloat(result.toPrecision(10)).toString();
        shouldReset = true;
        updateDisplay();
    } catch (e) {
        calcDisplay = 'Error';
        shouldReset = true;
        updateDisplay();
    }
}

// ═══════════════════════════════════════
// MEMORY
// ═══════════════════════════════════════
function memoryClear() { memory = 0; }
function memoryRecall() { if (memory !== 0) insert(memory.toString()); }
function memoryAdd() {
    try { memory += eval(calcDisplay); }
    catch { memory += parseFloat(calcDisplay) || 0; }
}
function memorySubtract() {
    try { memory -= eval(calcDisplay); }
    catch { memory -= parseFloat(calcDisplay) || 0; }
}
function memoryStore() {
    try { memory = eval(calcDisplay); }
    catch { memory = parseFloat(calcDisplay) || 0; }
}

// ═══════════════════════════════════════
// TRANSFER FUNCTIONS
// ═══════════════════════════════════════
function transferToMonthly() {
    const v = parseFloat(calcDisplay);
    if (!isNaN(v) && v >= 1000 && v <= 100000) {
        document.getElementById('amount').value = Math.floor(v);
        updateLabels();
        calculateFinancial();
    }
}
function transferToYears() {
    const v = parseFloat(calcDisplay);
    if (!isNaN(v) && v >= 1 && v <= 40) {
        document.getElementById('years').value = Math.floor(v);
        updateLabels();
        calculateFinancial();
    }
}
function transferToRate() {
    const v = parseFloat(calcDisplay);
    if (!isNaN(v) && v >= 1 && v <= 30) {
        document.getElementById('rate').value = v;
        updateLabels();
        calculateFinancial();
    }
}
function loadInCalculator(type) {
    const el = document.getElementById('stat-' + type);
    if (!el) return;
    const text = el.textContent;
    const num = parseFloat(text.replace(/[₹,CrL]/g, ''));
    if (text.includes('Cr')) calcDisplay = (num * 10000000).toString();
    else if (text.includes('L')) calcDisplay = (num * 100000).toString();
    else calcDisplay = num.toString();
    shouldReset = true;
    updateDisplay();
}

// ═══════════════════════════════════════
// FINANCIAL CALCULATIONS
// ═══════════════════════════════════════
function setupInputs() {
    ['amount', 'years', 'rate'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', () => {
            updateLabels();
            calculateFinancial();
        });
    });
}

function updateLabels() {
    const a = document.getElementById('amount');
    const y = document.getElementById('years');
    const r = document.getElementById('rate');
    if (a) document.getElementById('val-amount').textContent = '₹' + parseInt(a.value).toLocaleString('en-IN');
    if (y) document.getElementById('val-years').textContent = y.value + ' Years';
    if (r) document.getElementById('val-rate').textContent = r.value + '%';
}

let chartInstance, pieInstance, chartType = 'line';

function calculateFinancial() {
    const amountEl = document.getElementById('amount');
    const yearsEl = document.getElementById('years');
    const rateEl = document.getElementById('rate');
    if (!amountEl || !yearsEl || !rateEl) return;

    const P = parseInt(amountEl.value);
    const years = parseInt(yearsEl.value);
    const rate = parseFloat(rateEl.value);

    const months = years * 12;
    const r = rate / 100 / 12;
    const invested = P * months;
    const fv = r === 0 ? P * months : P * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
    const returns = fv - invested;

    // Update stat cards
    setTextSafe('stat-invested', fmt(invested));
    setTextSafe('stat-returns', fmt(returns));
    setTextSafe('stat-total', fmt(fv));

    // Update insights
    updateInsights(invested, returns, fv, years, rate, P);

    // Update charts
    updateCharts(P, years, rate, invested, fv, returns);
}

function updateInsights(inv, ret, tot, y, rate, P) {
    // Efficiency
    const eff = tot > 0 ? (ret / tot) * 100 : 0;
    setTextSafe('efficiency-percent', eff.toFixed(0) + '%');
    const bar = document.getElementById('efficiency-bar');
    if (bar) bar.style.width = eff + '%';
    setTextSafe('eff-inv', fmt(inv));
    setTextSafe('eff-gen', fmt(ret));

    // Velocity gauge
    const angle = -90 + ((rate / 30) * 180);
    const needle = document.getElementById('velocity-needle');
    if (needle) needle.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    setTextSafe('velocity-value', rate + '%');

    // Opportunity cost
    const now = tot;
    const later = sipCalc(P, Math.max(1, y - 5), rate);
    setTextSafe('value-now', fmt(now));
    setTextSafe('value-later', fmt(later));
    setTextSafe('loss-amount', fmt(now - later));

    const barNow = document.getElementById('bar-now');
    const barLater = document.getElementById('bar-later');
    if (barNow) barNow.style.height = '120px';
    if (barLater) barLater.style.height = (later / Math.max(now, 1) * 120) + 'px';

    // Milestones
    updateMilestones(P, y, rate);
}

function sipCalc(monthlyAmount, years, annualRate) {
    const months = years * 12;
    const r = annualRate / 100 / 12;
    if (r === 0) return monthlyAmount * months;
    return monthlyAmount * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
}

function updateMilestones(P, y, rate) {
    const container = document.getElementById('milestone-container');
    if (!container) return;
    let html = '';
    const targets = [1000000, 5000000, 10000000];
    const labels = ['₹10 Lakh', '₹50 Lakh', '₹1 Crore'];

    targets.forEach((target, idx) => {
        for (let k = 1; k <= y; k++) {
            if (sipCalc(P, k, rate) >= target) {
                html += `<div class="milestone-item">
                    <div class="milestone-year">Year ${k}</div>
                    <div class="milestone-value">${labels[idx]}</div>
                </div>`;
                break;
            }
        }
    });

    container.innerHTML = html || '<p style="color:var(--text-muted); font-size:0.88rem;">Adjust values to see milestones</p>';
}

function updateCharts(P, y, rate, inv, fv, ret) {
    const mainCanvas = document.getElementById('mainChart');
    const pieCanvas = document.getElementById('pieChart');
    if (!mainCanvas || !pieCanvas) return;

    const labels = [], invData = [], valData = [];
    const style = getComputedStyle(document.body);
    const colPrimary = style.getPropertyValue('--accent-primary').trim();
    const colSecondary = style.getPropertyValue('--text-muted').trim();
    const colText = style.getPropertyValue('--text-primary').trim();
    const colWarn = style.getPropertyValue('--warning').trim() || '#f5af19';

    for (let k = 1; k <= y; k++) {
        labels.push('Y' + k);
        const km = k * 12;
        const kr = rate / 100 / 12;
        invData.push(P * km);
        valData.push(kr === 0 ? P * km : P * ((Math.pow(1 + kr, km) - 1) / kr) * (1 + kr));
    }

    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(mainCanvas, {
        type: chartType,
        data: {
            labels,
            datasets: [
                {
                    label: 'Invested',
                    data: invData,
                    borderColor: colSecondary,
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.4
                },
                {
                    label: 'Portfolio Value',
                    data: valData,
                    borderColor: colPrimary,
                    backgroundColor: colPrimary + '18',
                    fill: true,
                    borderWidth: 3,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: colText, font: { family: 'Inter' } } } },
            scales: {
                y: { ticks: { callback: fmt, color: colSecondary }, grid: { color: colSecondary + '15' } },
                x: { ticks: { color: colSecondary }, grid: { display: false } }
            }
        }
    });

    if (pieInstance) pieInstance.destroy();
    pieInstance = new Chart(pieCanvas, {
        type: 'doughnut',
        data: {
            labels: ['Principal', 'Returns'],
            datasets: [{
                data: [inv, ret],
                backgroundColor: [colWarn, colPrimary],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '72%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: colText, font: { family: 'Inter' }, padding: 20 }
                }
            }
        }
    });
}

function toggleChartType() {
    chartType = chartType === 'line' ? 'bar' : 'line';
    calculateFinancial();
}

function setFinancialMode(mode, btn) {
    document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
}

// ═══════════════════════════════════════
// FORMATTING
// ═══════════════════════════════════════
function fmt(n) {
    if (typeof n !== 'number') n = Number(n);
    if (isNaN(n)) return '₹0';
    if (n >= 10000000) return '₹' + (n / 10000000).toFixed(2) + 'Cr';
    if (n >= 100000) return '₹' + (n / 100000).toFixed(1) + 'L';
    if (n >= 1000) return '₹' + (n / 1000).toFixed(0) + 'K';
    return '₹' + Math.floor(n);
}

function setTextSafe(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

// ═══════════════════════════════════════
// KEYBOARD SUPPORT
// ═══════════════════════════════════════
document.addEventListener('keydown', (e) => {
    // Only handle if we're not typing in a text input (though we don't have any yet)
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const key = e.key;

    // Numbers
    if (/[0-9]/.test(key)) {
        insert(key);
        flashButton(key);
    }
    // Decimal
    else if (key === '.') {
        insert('.');
        flashButton('.');
    }
    // Operators
    else if (key === '+') {
        insertOperator('+');
        flashButton('+');
    }
    else if (key === '-') {
        insertOperator('-');
        flashButton('−'); // Use existing text in buttons
    }
    else if (key === '*') {
        insertOperator('*');
        flashButton('×');
    }
    else if (key === '/') {
        e.preventDefault();
        insertOperator('/');
        flashButton('÷');
    }
    // Calculate
    else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
        flashButton('Enter');
    }
    // Backspace for Clear Entry
    else if (key === 'Backspace') {
        clearEntry();
        flashButton('Backspace');
    }
    // Escape or Delete for Clear All
    else if (key === 'Escape' || key === 'Delete') {
        clearAll();
        flashButton('Escape');
    }

    // Parentheses
    else if (key === '(') {
        insert('(');
    }
    else if (key === ')') {
        insert(')');
    }
    // Power
    else if (key === '^') {
        insertFunction('pow');
    }
});

// ═══════════════════════════════════════
// INIT
// ═══════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    setupInputs();
    calculateFinancial();
});

