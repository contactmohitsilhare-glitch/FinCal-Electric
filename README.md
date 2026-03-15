# ⚡ FinCal Electric — Scientific Financial Calculator

A premium, single-page financial calculator with a stunning **Electric Theme**, built entirely with vanilla HTML, CSS, and JavaScript.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## ✨ Features

### 🧮 Scientific Calculator
- Full arithmetic operations (+, −, ×, ÷)
- Trigonometric functions (sin, cos, tan) — degree mode
- Logarithmic functions (log₁₀, ln)
- Power, square root, factorial, absolute value, inverse
- Constants: **π**, **e**
- Memory: **MC**, **MR**, **M+**, **M−**, **MS**
- Parentheses and sign toggle

### 📊 Financial Modes
| Mode | Description |
|------|-------------|
| **SIP** | Systematic Investment Plan — calculates the future value of regular monthly investments with compound interest |
| **Lumpsum** | One-time investment growth projection |
| **Target** | Goal-based planning |

### 📈 Interactive Visualizations (Chart.js)
- **Growth Trajectory** — Line/Bar chart showing invested vs. portfolio value over time
- **Portfolio Mix** — Doughnut chart showing principal vs. returns breakdown
- **Efficiency Gauge** — Earnings ratio progress bar
- **Velocity Gauge** — Semicircular gauge for annual return rate
- **Opportunity Cost** — Visual comparison of *Invest Now* vs. *5 Years Later*
- **Milestone Timeline** — Tracks when your portfolio hits ₹10L, ₹50L, and ₹1Cr

### 🎨 Dual Themes
| Theme | Aesthetic |
|-------|-----------|
| ☀️ **Light** | Sky & Clouds — pastel gradient (`#e0c3fc → #8ec5fc`) |
| 🌙 **Dark** | Midnight Cyberpunk — deep navy with neon cyan & violet accents |

Smooth animated gradient background and glassmorphism card design in both modes.

### 🔗 Calculator ↔ Finance Integration
Transfer calculator results directly into the financial sliders:
- **Use as Monthly Investment →**
- **Use as Years →**
- **Use as Interest Rate →**

Click any stat card to load that value back into the calculator.

---

## 🚀 Getting Started

### Option 1 — Open Directly
Simply open `index.html` in any modern browser. No build step, no dependencies to install.

### Option 2 — Local Server
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```
Then visit `http://localhost:8000`.

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic structure |
| **CSS3** | Custom properties, glassmorphism, animations, responsive grid |
| **JavaScript (ES6)** | Calculator logic, SIP/Lumpsum formulas, DOM manipulation |
| **[Chart.js](https://www.chartjs.org/)** | Growth trajectory & portfolio doughnut charts (via CDN) |
| **[Font Awesome 6](https://fontawesome.com/)** | Icon library (via CDN) |
| **[Google Fonts](https://fonts.google.com/)** | Inter (UI) + JetBrains Mono (display/code) |

> **Zero build tools required** — everything runs in the browser via CDN links.

---

## 📁 Project Structure

```
FinCal-Electric/
├── index.html    # Entire application (HTML + CSS + JS)
└── README.md     # This file
```

---

## 📸 Screenshots

### Light Mode
> Open `index.html` and experience the pastel Sky & Clouds gradient theme.

### Dark Mode
> Toggle with the 🌙 button in the top-right corner for the Midnight Cyberpunk experience.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Made with ⚡ by <strong>FinCal Electric</strong>
</p>
