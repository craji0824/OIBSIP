# Personal Portfolio - Rajashree C

A modern, responsive, and highly polished personal portfolio website designed to showcase academic achievements, certifications, technical skills, and development projects.

##  Features

- **Responsive Design**: Fluid layout optimized for mobile, tablet, and desktop viewports.
- **Dark/Light Theme Toggle**: Seamless transition between light and dark modes with system settings detection and state persistence (`localStorage`).
- **Interactive Animations**:
  - Smooth typing effect in the hero subtitle cycling through key developer roles.
  - Scroll-triggered reveal animations on sections and grid items.
  - Interactive skill progress indicators that animate to their target value on scroll.
- **Contact Form**: An interactive client-side form with visual loading and submission feedback.
- **Consistent Branding**: A curated color palette utilizing glassmorphism and modern gradient accents.

##  Tech Stack

- **HTML5**: Semantic structure.
- **CSS3 (Vanilla)**: Layout (Flexbox & Grid), styling, theme custom variables, keyframe animations, and custom scrollbars.
- **JavaScript (Vanilla)**: Interaction logic, theme state managers, andIntersection Observer API events.
- **Assets & Icons**: FontAwesome icons and custom circular vector avatar.

##  Project Structure

```text
WebDev-L1-PersonalPortfolio/
├── assets/
│   └── avatar.png       # Generated circular vector profile avatar
├── index.html           # Main semantic structure and HTML tags
├── styles.css           # Custom stylesheets, layouts, and theme properties
├── script.js            # Typing effect, scroll reveals, and form handlers
└── README.md            # Project documentation (this file)
```

##  Quick Start

To view the website locally:

1. Open [index.html](index.html) in any modern web browser.
2. Alternatively, serve it via a local web server (e.g., Python's HTTP module):
   ```bash
   python -m http.server 8000
   ```
   Then open `http://localhost:8000` in your browser.
