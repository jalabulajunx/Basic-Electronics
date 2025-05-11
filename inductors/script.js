document.addEventListener('DOMContentLoaded', () => {
    // Initialize all interactive elements
    initializeMagneticFieldDemo();
    initializeCircuitTabs();
    initializeInductorControls();
});

function initializeMagneticFieldDemo() {
    const inductanceSlider = document.getElementById('inductance');
    const currentDisplay = document.getElementById('current');
    const fieldStrengthDisplay = document.getElementById('field-strength');
    const ledBrightnessDisplay = document.getElementById('led-brightness');
    const inductor = document.querySelector('.magnetic-field-demo .inductor');
    const led = document.querySelector('.magnetic-field-demo .led');
    const switchBody = document.querySelector('.magnetic-field-demo .switch-body');
    let isSwitchOn = false;

    // Handle switch toggle
    switchBody.addEventListener('click', () => {
        isSwitchOn = !isSwitchOn;
        switchBody.classList.toggle('off', !isSwitchOn);
        updateCircuit();
    });

    // Handle inductance changes
    inductanceSlider.addEventListener('input', () => {
        updateCircuit();
    });

    function updateCircuit() {
        const inductance = parseInt(inductanceSlider.value);
        const voltage = 9; // 9V battery
        const resistance = 100; // Assume 100 ohms for the circuit

        if (isSwitchOn) {
            // Calculate current based on inductance and time
            const timeConstant = inductance / resistance;
            const current = (voltage / resistance) * (1 - Math.exp(-1 / timeConstant));
            
            // Update displays
            currentDisplay.textContent = `${(current * 1000).toFixed(1)}mA`;
            fieldStrengthDisplay.textContent = `${(current * 100).toFixed(0)}%`;
            
            // Update LED brightness
            const brightness = Math.min(100, (current * 1000));
            ledBrightnessDisplay.textContent = `${brightness.toFixed(0)}%`;
            led.style.opacity = brightness / 100;
            led.classList.toggle('bright', brightness > 50);

            // Activate inductor and magnetic field
            inductor.classList.add('active');
        } else {
            // Reset displays
            currentDisplay.textContent = '0A';
            fieldStrengthDisplay.textContent = 'Off';
            ledBrightnessDisplay.textContent = 'Off';
            led.style.opacity = 0;
            led.classList.remove('bright');
            
            // Deactivate inductor
            inductor.classList.remove('active');
        }
    }
}

function initializeCircuitTabs() {
    const tabs = document.querySelectorAll('.circuit-tab');
    const circuits = document.querySelectorAll('.circuit');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and circuits
            tabs.forEach(t => t.classList.remove('active'));
            circuits.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab and corresponding circuit
            tab.classList.add('active');
            const circuitType = tab.dataset.circuit;
            document.querySelector(`.${circuitType}-circuit`).classList.add('active');
        });
    });
}

function initializeInductorControls() {
    const inductorControls = document.querySelectorAll('.inductor-value');
    
    inductorControls.forEach(control => {
        control.addEventListener('input', () => {
            const value = parseInt(control.value);
            const display = control.nextElementSibling;
            display.textContent = `${value} mH`;
            updateCircuitValues();
        });
    });

    function updateCircuitValues() {
        const seriesCircuit = document.querySelector('.series-circuit');
        const parallelCircuit = document.querySelector('.parallel-circuit');
        
        // Get inductor values
        const l1 = parseInt(document.querySelector('[data-inductor="1"]').value);
        const l2 = parseInt(document.querySelector('[data-inductor="2"]').value);

        // Calculate total inductance
        const seriesTotal = l1 + l2;
        const parallelTotal = 1 / (1/l1 + 1/l2);

        // Update displays
        seriesCircuit.querySelector('.total-inductance').textContent = `${seriesTotal} mH`;
        parallelCircuit.querySelector('.total-inductance').textContent = `${parallelTotal.toFixed(2)} mH`;

        // Calculate and update rise times (simplified)
        const seriesRiseTime = (seriesTotal / 1000).toFixed(2);
        const parallelRiseTime = (parallelTotal / 1000).toFixed(2);

        seriesCircuit.querySelector('.rise-time').textContent = `${seriesRiseTime}s`;
        parallelCircuit.querySelector('.rise-time').textContent = `${parallelRiseTime}s`;

        // Update LED brightness based on total inductance
        updateLEDBrightness(seriesCircuit, seriesTotal);
        updateLEDBrightness(parallelCircuit, parallelTotal);
    }

    function updateLEDBrightness(circuit, totalInductance) {
        const brightness = Math.min(100, (1000 / totalInductance) * 100);
        const brightnessValue = circuit.querySelector('.brightness-value');
        const led = circuit.querySelector('.led');

        brightnessValue.textContent = getBrightnessLevel(brightness);
        led.style.opacity = brightness / 100;
        led.classList.toggle('bright', brightness > 50);
    }

    function getBrightnessLevel(brightness) {
        if (brightness < 25) return 'Dim';
        if (brightness < 50) return 'Medium';
        if (brightness < 75) return 'Bright';
        return 'Very Bright';
    }
}

// Add electron flow animation
function animateElectronFlow() {
    const wires = document.querySelectorAll('.wire');
    
    wires.forEach(wire => {
        const electron = document.createElement('div');
        electron.className = 'electron';
        wire.appendChild(electron);

        // Animate electron
        electron.style.animation = `currentFlow ${2 + Math.random()}s linear infinite`;
    });
}

// Initialize electron flow animation
animateElectronFlow(); 