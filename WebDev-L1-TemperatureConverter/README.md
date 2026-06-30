# Temperature Converter Website

A premium, production-quality Temperature Converter web application built using standard modern HTML5, CSS3, and Vanilla JavaScript. This project was developed as a task for Level 1 of the Oasis Infobyte Web Development Internship.

## 🌟 Features

- **Premium UI**: Beautiful glassmorphism card styled with a moving/pulsing gradient background.
- **Instant Simultaneous Conversions**: Inputting a value and selecting a unit yields conversions in Celsius, Fahrenheit, and Kelvin all at once.
- **Robust Validations**:
  - Rejects alphabetical characters and special character keystrokes, ensuring only valid numeric inputs are entered.
  - Custom absolute zero boundary validations for each unit (Celsius: -273.15, Fahrenheit: -459.67, Kelvin: 0).
  - Validation warning triggers and success flags.
- **Lucide Icons**: Integrates clean Lucide SVG icons.
- **Animations**:
  - Slow animated glowing background shapes.
  - Scale-up/slide-in transition entries for result cards.
  - Interactive hover and scale reactions on CTA buttons.
- **Accessibility & Accessibility (A11y)**:
  - Accessible labels and inputs.
  - Focus indicator indicators on key elements (`:focus-visible`).
  - Screen reader semantic announcements (`aria-live`, `role="alert"`).
  - Pressing the `Enter` key inside the text field triggers the conversion.

## 🛠️ Technologies Used

- **HTML5**: Semantic elements and ARIA accessibility roles.
- **CSS3**: CSS Grid, Flexbox, custom property variables, glassmorphic layout properties, and keyframe animations.
- **Vanilla JavaScript**: DOM handlers, real-time input filtering, conversion formulas, and state validation.
- **Lucide Icons**: Loaded via CDN.

## 📂 Folder Structure

```text
WebDev-L1-TemperatureConverter/
├── index.html           # Main semantic structure and HTML controls
├── style.css            # Animations, glassmorphism variables, and responsive layout
├── script.js            # Input filtering, conversion math, validation, and resets
└── README.md            # Project documentation (this file)
```

## ⚙️ Installation

To run this application locally, you do not need any backend setup or installation processes:

1. Clone or download the repository.
2. Navigate to the project directory.
3. Open `index.html` directly in any modern web browser, or run a local HTTP server:
   ```bash
   python -m http.server 8085
   ```
4. Access the application in your browser at `http://localhost:8085/`.

## 💡 Usage

1. Type a temperature value in the **Degrees** input field (numbers, decimal points, and negative signs are supported; letters are automatically filtered out).
2. Select your starting unit from the **From Unit** dropdown menu.
3. Click the **Convert** button (or press `Enter` in the text field) to see instant, simultaneous conversions across Celsius, Fahrenheit, and Kelvin.
4. Click the **Reset** button to wipe all fields and start over.

## 🛡️ License

This project is open-source and available under the [MIT License](LICENSE).

## 👤 Author

**Rajashree C**
- GitHub: [@craji0824](https://github.com/craji0824)
- LinkedIn: [Rajashree C](https://www.linkedin.com/in/rajashree-c-47a3913a5/)
