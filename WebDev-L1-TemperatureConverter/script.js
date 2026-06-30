document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ==========================================================================
       DOM ELEMENT SELECTORS
       ========================================================================== */
    const converterForm = document.getElementById('converter-form');
    const tempInput = document.getElementById('temp-input');
    const unitSelect = document.getElementById('unit-select');
    const convertBtn = document.getElementById('convert-btn');
    const resetBtn = document.getElementById('reset-btn');
    const swapBtn = document.getElementById('swap-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const statusMessage = document.getElementById('status-message');
    const resultsSection = document.getElementById('results-section');
    
    // Custom cursor elements
    const customCursor = document.getElementById('custom-cursor');
    const customCursorDot = document.getElementById('custom-cursor-dot');
    
    // Result value containers
    const valCelsius = document.getElementById('val-celsius');
    const valFahrenheit = document.getElementById('val-fahrenheit');
    const valKelvin = document.getElementById('val-kelvin');
    const tempStatus = document.getElementById('temp-status');

    // History Panel elements
    const historySection = document.getElementById('history-section');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');

    /* ==========================================================================
       STATE VARIABLES & STORAGE INITIALIZATION
       ========================================================================== */
    let previousValidValue = '';
    let conversionHistory = JSON.parse(localStorage.getItem('converter-history')) || [];

    /* ==========================================================================
       CUSTOM ANIMATED MOUSE CURSOR
       ========================================================================== */
    if (customCursor && customCursorDot) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            
            // Instantly move the inner dot
            customCursorDot.style.left = `${x}px`;
            customCursorDot.style.top = `${y}px`;
            
            // Move outer ring with a slight spring effect (lag)
            customCursor.animate({
                left: `${x}px`,
                top: `${y}px`
            }, { duration: 150, fill: "forwards" });
        });

        // Add hover transitions on all interactive elements
        const updateCursorHover = (isHovering) => {
            if (isHovering) {
                customCursor.classList.add('hover');
                customCursorDot.classList.add('hover');
            } else {
                customCursor.classList.remove('hover');
                customCursorDot.classList.remove('hover');
            }
        };

        const attachCursorHovers = () => {
            const interactives = document.querySelectorAll('a, button, select, input, option, li.history-item');
            interactives.forEach(el => {
                el.addEventListener('mouseenter', () => updateCursorHover(true));
                el.addEventListener('mouseleave', () => updateCursorHover(false));
            });
        };
        
        attachCursorHovers();
        
        // Handle dynamic element additions hover binding
        const observer = new MutationObserver(() => attachCursorHovers());
        observer.observe(document.body, { childList: true, subtree: true });
    }

    /* ==========================================================================
       BUTTON CLICK RIPPLE EFFECT
       ========================================================================== */
    const createRipple = (e) => {
        const btn = e.currentTarget;
        if (btn.disabled) return;
        
        const circle = document.createElement('span');
        const diameter = Math.max(btn.clientWidth, btn.clientHeight);
        const radius = diameter / 2;
        
        circle.style.width = circle.style.height = `${diameter}px`;
        
        // Get click position relative to button
        const rect = btn.getBoundingClientRect();
        circle.style.left = `${e.clientX - rect.left - radius}px`;
        circle.style.top = `${e.clientY - rect.top - radius}px`;
        circle.classList.add('ripple');
        
        // Remove previous ripple span if exists
        const ripple = btn.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }
        
        btn.appendChild(circle);
    };

    // Attach mousedown ripple listener to all buttons
    const attachRipples = () => {
        const rippleButtons = document.querySelectorAll('.btn, .btn-swap, .theme-toggle, .btn-clear-history');
        rippleButtons.forEach(btn => btn.addEventListener('mousedown', createRipple));
    };
    attachRipples();

    /* ==========================================================================
       LIGHT & DARK THEME SYSTEM
       ========================================================================== */
    const getSavedTheme = () => {
        const savedTheme = localStorage.getItem('converter-theme');
        if (savedTheme) return savedTheme;
        
        const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
        return prefersLight ? 'light' : 'dark';
    };

    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('converter-theme', theme);
    };

    // Initialize theme
    applyTheme(getSavedTheme());

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme);
        });
    }

    /* ==========================================================================
       DYNAMIC BACKGROUND THEME BASED ON TEMPERATURE
       ========================================================================== */
    const updateDynamicTheme = (celsiusValue) => {
        let orb1Color, orb2Color, primaryColor, glowColor;
        
        if (celsiusValue < 15) {
            // Cold -> Blue
            orb1Color = 'rgba(59, 130, 246, 0.4)';  // Blue
            orb2Color = 'rgba(6, 182, 212, 0.35)';  // Cyan
            primaryColor = '#3b82f6';
            glowColor = 'rgba(59, 130, 246, 0.25)';
        } else if (celsiusValue >= 15 && celsiusValue < 25) {
            // Normal (Cool) -> Green
            orb1Color = 'rgba(16, 185, 129, 0.4)';  // Green
            orb2Color = 'rgba(34, 197, 94, 0.35)';  // Emerald
            primaryColor = '#10b981';
            glowColor = 'rgba(16, 185, 129, 0.25)';
        } else if (celsiusValue >= 25 && celsiusValue < 38) {
            // Hot (Pleasant) -> Orange
            orb1Color = 'rgba(249, 115, 22, 0.4)';  // Orange
            orb2Color = 'rgba(234, 179, 8, 0.35)';  // Yellow
            primaryColor = '#f97316';
            glowColor = 'rgba(249, 115, 22, 0.25)';
        } else {
            // Very Hot -> Red
            orb1Color = 'rgba(239, 68, 68, 0.4)';   // Red
            orb2Color = 'rgba(236, 72, 153, 0.35)'; // Rose/Pink
            primaryColor = '#ef4444';
            glowColor = 'rgba(239, 68, 68, 0.25)';
        }

        const root = document.documentElement;
        root.style.setProperty('--orb-1-bg', `radial-gradient(circle, ${orb1Color} 0%, transparent 70%)`);
        root.style.setProperty('--orb-2-bg', `radial-gradient(circle, ${orb2Color} 0%, transparent 70%)`);
        root.style.setProperty('--clr-primary', primaryColor);
        root.style.setProperty('--clr-primary-glow', glowColor);
    };

    const resetDynamicTheme = () => {
        const root = document.documentElement;
        root.style.removeProperty('--orb-1-bg');
        root.style.removeProperty('--orb-2-bg');
        root.style.removeProperty('--clr-primary');
        root.style.removeProperty('--clr-primary-glow');
    };

    /* ==========================================================================
       TEMPERATURE STATUS CALCULATOR
       ========================================================================== */
    const getTemperatureStatus = (celsius) => {
        if (celsius <= 0) {
            return { text: 'Freezing', emoji: '🥶' };
        } else if (celsius > 0 && celsius < 15) {
            return { text: 'Cold', emoji: '❄️' };
        } else if (celsius >= 15 && celsius < 25) {
            return { text: 'Cool', emoji: '😊' };
        } else if (celsius >= 25 && celsius < 38) {
            return { text: 'Pleasant', emoji: '☀' };
        } else {
            return { text: 'Very Hot', emoji: '🔥' };
        }
    };

    /* ==========================================================================
       HISTORY PANEL SYSTEM (PERSISTENT IN LOCAL STORAGE)
       ========================================================================== */
    const renderHistory = () => {
        if (!historyList || !historySection) return;

        historyList.innerHTML = '';

        if (conversionHistory.length === 0) {
            historySection.classList.add('hidden');
            return;
        }

        historySection.classList.remove('hidden');

        conversionHistory.forEach(item => {
            const li = document.createElement('li');
            li.className = 'history-item';
            li.innerHTML = `
                <div>
                    <span class="history-item-val">${item.from}</span>
                    <span class="history-item-arrow">&rarr;</span>
                    <span class="history-item-val">${item.to}</span>
                </div>
                <span class="history-item-time">${item.time}</span>
            `;
            historyList.appendChild(li);
        });
    };

    const addHistoryEntry = (sourceVal, sourceUnit, celsius, fahrenheit, kelvin) => {
        let fromStr = '';
        let toStr = '';

        // Format recent text in Celsius <--> Fahrenheit or Kelvin --> Celsius format
        if (sourceUnit === 'C') {
            fromStr = `${sourceVal}°C`;
            toStr = `${roundToTwoDecimals(fahrenheit)}°F`;
        } else if (sourceUnit === 'F') {
            fromStr = `${sourceVal}°F`;
            toStr = `${roundToTwoDecimals(celsius)}°C`;
        } else if (sourceUnit === 'K') {
            fromStr = `${sourceVal} K`;
            toStr = `${roundToTwoDecimals(celsius)}°C`;
        }

        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        const entry = {
            from: fromStr,
            to: toStr,
            time: timeStr
        };

        // Prepend new entry
        conversionHistory.unshift(entry);

        // Cap size to last 5 conversions
        if (conversionHistory.length > 5) {
            conversionHistory.pop();
        }

        // Save state and re-render
        localStorage.setItem('converter-history', JSON.stringify(conversionHistory));
        renderHistory();
    };

    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            conversionHistory = [];
            localStorage.removeItem('converter-history');
            renderHistory();
        });
    }

    // Load initial history on startup
    renderHistory();

    /* ==========================================================================
       INPUT VALIDATION & BUTTON TOGGLING
       ========================================================================== */
    const isValidNumber = (val) => {
        if (val === '' || val === '-' || val === '.' || val === '-.') {
            return false;
        }
        const num = Number(val);
        return !isNaN(num) && isFinite(num);
    };

    tempInput.addEventListener('input', () => {
        const val = tempInput.value;

        if (val === '' || val === '-' || val === '.' || val === '-.' || /^-?\d*\.?\d*$/.test(val)) {
            previousValidValue = val;
        } else {
            tempInput.value = previousValidValue;
        }

        toggleSubmitButton();
    });

    const toggleSubmitButton = () => {
        const hasValidNum = isValidNumber(tempInput.value);
        const hasSelectedUnit = unitSelect.value !== '';
        
        convertBtn.disabled = !(hasValidNum && hasSelectedUnit);
    };

    unitSelect.addEventListener('change', toggleSubmitButton);

    /* ==========================================================================
       ALERTS & MESSAGES SYSTEM
       ========================================================================== */
    const showMessage = (message, type) => {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        statusMessage.style.display = 'flex';
        
        const iconName = type === 'success' ? 'check-circle' : 'alert-circle';
        const iconHTML = `<i data-lucide="${iconName}" style="flex-shrink: 0; width: 18px; height: 18px;"></i>`;
        statusMessage.insertAdjacentHTML('afterbegin', iconHTML);
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    };

    const clearMessage = () => {
        statusMessage.style.display = 'none';
        statusMessage.className = 'status-message';
        statusMessage.textContent = '';
    };

    /* ==========================================================================
       CONVERSION & FORM SUBMISSION
       ========================================================================== */
    const roundToTwoDecimals = (num) => {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    };

    // Absolute Zero Limit Constraints
    const ABSOLUTE_ZERO = {
        C: -273.15,
        F: -459.67,
        K: 0
    };

    const performConversion = () => {
        const rawVal = tempInput.value.trim();
        const sourceUnit = unitSelect.value;

        if (rawVal === '') {
            showMessage('Please enter a temperature value.', 'error');
            return;
        }

        if (!isValidNumber(rawVal)) {
            showMessage('Please enter a valid numeric temperature.', 'error');
            return;
        }

        const value = parseFloat(rawVal);

        // Absolute Zero Checks
        if (sourceUnit === 'C' && value < ABSOLUTE_ZERO.C) {
            showMessage(`Temperature cannot be below absolute zero (${ABSOLUTE_ZERO.C}°C).`, 'error');
            return;
        }
        if (sourceUnit === 'F' && value < ABSOLUTE_ZERO.F) {
            showMessage(`Temperature cannot be below absolute zero (${ABSOLUTE_ZERO.F}°F).`, 'error');
            return;
        }
        if (sourceUnit === 'K' && value < ABSOLUTE_ZERO.K) {
            showMessage(`Temperature cannot be below absolute zero (${ABSOLUTE_ZERO.K} K).`, 'error');
            return;
        }

        clearMessage();

        let celsius, fahrenheit, kelvin;

        switch (sourceUnit) {
            case 'C':
                celsius = value;
                fahrenheit = (value * 9/5) + 32;
                kelvin = value + 273.15;
                break;
            case 'F':
                celsius = (value - 32) * 5/9;
                fahrenheit = value;
                kelvin = ((value - 32) * 5/9) + 273.15;
                break;
            case 'K':
                celsius = value - 273.15;
                fahrenheit = ((value - 273.15) * 9/5) + 32;
                kelvin = value;
                break;
        }

        // Render Outputs rounded to 2 decimal places
        valCelsius.textContent = `${roundToTwoDecimals(celsius)}°C`;
        valFahrenheit.textContent = `${roundToTwoDecimals(fahrenheit)}°F`;
        valKelvin.textContent = `${roundToTwoDecimals(kelvin)} K`;

        // Update status text banner
        const status = getTemperatureStatus(celsius);
        tempStatus.textContent = `${status.emoji} ${status.text}`;

        // Update background theme dynamically based on temperature
        updateDynamicTheme(celsius);

        // Append to local storage history logs
        addHistoryEntry(value, sourceUnit, celsius, fahrenheit, kelvin);

        // Reveal card section
        resultsSection.classList.remove('hidden');
        showMessage('Temperature converted successfully!', 'success');
    };

    converterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        performConversion();
    });

    /* ==========================================================================
       SWAP UNIT FUNCTIONALITY
       ========================================================================== */
    if (swapBtn) {
        swapBtn.addEventListener('click', () => {
            const currentUnit = unitSelect.value;
            const currentValStr = tempInput.value.trim();
            
            if (!currentUnit) {
                unitSelect.value = 'F';
                toggleSubmitButton();
                return;
            }

            let targetUnit = 'C';
            if (currentUnit === 'C') {
                targetUnit = 'F';
            } else if (currentUnit === 'F') {
                targetUnit = 'C';
            } else if (currentUnit === 'K') {
                targetUnit = 'C';
            }

            // Swap value inside input field if numeric
            if (isValidNumber(currentValStr)) {
                const value = parseFloat(currentValStr);
                let swappedValue = value;

                if (currentUnit === 'C' && targetUnit === 'F') {
                    swappedValue = (value * 9/5) + 32;
                } else if (currentUnit === 'F' && targetUnit === 'C') {
                    swappedValue = (value - 32) * 5/9;
                } else if (currentUnit === 'K' && targetUnit === 'C') {
                    swappedValue = value - 273.15;
                }

                tempInput.value = roundToTwoDecimals(swappedValue);
                previousValidValue = tempInput.value;
            }

            unitSelect.value = targetUnit;
            toggleSubmitButton();

            // Auto conversion triggers to update result cards immediately
            if (isValidNumber(tempInput.value)) {
                performConversion();
            }
        });
    }

    /* ==========================================================================
       RESET FUNCTIONALITY
       ========================================================================== */
    const resetConverter = () => {
        tempInput.value = '';
        unitSelect.value = '';
        previousValidValue = '';
        
        resultsSection.classList.add('hidden');
        valCelsius.textContent = '--';
        valFahrenheit.textContent = '--';
        valKelvin.textContent = '--';
        tempStatus.textContent = '--';

        clearMessage();
        resetDynamicTheme();
        convertBtn.disabled = true;
    };

    resetBtn.addEventListener('click', resetConverter);

    // Support keyboard submission on Enter
    tempInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const hasValidNum = isValidNumber(tempInput.value);
            const hasSelectedUnit = unitSelect.value !== '';
            
            if (hasValidNum && hasSelectedUnit) {
                e.preventDefault();
                performConversion();
            }
        }
    });

});
