// Resistors chapter interactivity will go here 

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all sliders and buttons
    initializeResistorSliders();
    initializeCircuitTabs();
    initializeColorCodeQuiz();
    initializeCircuitSwitch();
    initializeFanDemo();
});

function initializeResistorSliders() {
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
        slider.addEventListener('input', updateCircuitValues);
    });
}

function initializeCircuitTabs() {
    const tabs = document.querySelectorAll('.circuit-tab');
    const circuits = document.querySelectorAll('.circuit');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding circuit
            const circuitType = tab.dataset.circuit;
            circuits.forEach(circuit => {
                circuit.classList.remove('active');
                if (circuit.classList.contains(`${circuitType}-circuit`)) {
                    circuit.classList.add('active');
                }
            });
            
            // Update circuit values
            updateCircuitValues();
        });
    });
}

function initializeColorCodeQuiz() {
    const colorBtns = document.querySelectorAll('.color-btn');
    const bandSelectors = document.querySelectorAll('.band-selector select');
    const checkAnswerBtn = document.getElementById('check-answer');
    const quizFeedback = document.getElementById('quiz-feedback');
    let currentResistance = 0;

    // Generate random resistor value for quiz
    function generateQuizResistor() {
        const bands = [];
        let value = 0;
        
        // First two bands (significant digits)
        for (let i = 0; i < 2; i++) {
            const digit = Math.floor(Math.random() * 10);
            bands.push(digit);
            value = value * 10 + digit;
        }
        
        // Multiplier band
        const multiplier = Math.pow(10, Math.floor(Math.random() * 6));
        value *= multiplier;
        
        // Tolerance band
        const tolerance = Math.random() < 0.5 ? 5 : 10; // 5% or 10%
        
        currentResistance = value;
        updateQuizResistor(bands, multiplier, tolerance);
    }

    function updateQuizResistor(bands, multiplier, tolerance) {
        const resistor = document.querySelector('.quiz-resistor .resistor-body');
        resistor.innerHTML = '';
        
        // Add color bands
        bands.forEach(digit => {
            const band = document.createElement('div');
            band.className = `band ${getColorClass(digit)}`;
            resistor.appendChild(band);
        });
        
        // Add multiplier band
        const multiplierBand = document.createElement('div');
        multiplierBand.className = `band ${getColorClass(Math.log10(multiplier))}`;
        resistor.appendChild(multiplierBand);
        
        // Add tolerance band
        const toleranceBand = document.createElement('div');
        toleranceBand.className = `band ${tolerance === 5 ? 'gold' : 'silver'}`;
        resistor.appendChild(toleranceBand);
    }

    function getColorClass(value) {
        const colors = ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'gray', 'white'];
        return colors[value] || 'black';
    }

    function checkAnswer() {
        const userInput = parseFloat(document.getElementById('resistance-guess').value);
        const tolerance = 0.1; // 10% tolerance for correct answer
        
        if (Math.abs(userInput - currentResistance) / currentResistance <= tolerance) {
            quizFeedback.textContent = 'Correct! Well done!';
            quizFeedback.className = 'quiz-feedback correct';
        } else {
            quizFeedback.textContent = `Incorrect. The correct value is ${currentResistance} ohms.`;
            quizFeedback.className = 'quiz-feedback incorrect';
        }
    }

    // Initialize quiz
    generateQuizResistor();
    checkAnswerBtn.addEventListener('click', checkAnswer);
}

function initializeCircuitSwitch() {
    const switchBtn = document.querySelector('.switch-body');
    switchBtn.addEventListener('click', () => {
        switchBtn.classList.toggle('off');
        updateCircuitValues();
    });
}

function updateCircuitValues() {
    const activeTab = document.querySelector('.circuit-tab.active');
    if (!activeTab) return; // Guard against null
    
    const circuitType = activeTab.dataset.circuit;
    const activeCircuit = document.querySelector(`.${circuitType}-circuit`);
    if (!activeCircuit) return; // Guard against null
    
    // Get resistor values
    const r1Slider = activeCircuit.querySelector('[data-resistor="1"]');
    const r2Slider = activeCircuit.querySelector('[data-resistor="2"]');
    if (!r1Slider || !r2Slider) return; // Guard against null
    
    const r1 = parseFloat(r1Slider.value);
    const r2 = parseFloat(r2Slider.value);
    
    // Calculate total resistance
    let totalResistance;
    if (circuitType === 'series') {
        totalResistance = r1 + r2;
    } else {
        totalResistance = (r1 * r2) / (r1 + r2);
    }
    
    // Calculate current (assuming 9V battery)
    const voltage = 9;
    const current = voltage / totalResistance;
    
    // Update displays
    const totalResistanceDisplay = activeCircuit.querySelector('.total-resistance');
    const currentDisplay = activeCircuit.querySelector('.current-value');
    if (totalResistanceDisplay) totalResistanceDisplay.textContent = `${totalResistance.toFixed(2)} Ω`;
    if (currentDisplay) currentDisplay.textContent = `${current.toFixed(3)} A`;
    
    // Update visual elements
    updateResistorColors(activeCircuit, r1, r2);
    updateBulbBrightness(activeCircuit, current);
    updateCurrentFlow(activeCircuit, current);
}

function updateResistorColors(circuit, r1, r2) {
    const resistors = circuit.querySelectorAll('.resistor-body');
    if (resistors.length < 2) return;
    
    const bands1 = calculateColorBands(r1);
    const bands2 = calculateColorBands(r2);
    
    resistors[0].innerHTML = bands1.map(color => `<div class="band ${color}"></div>`).join('');
    resistors[1].innerHTML = bands2.map(color => `<div class="band ${color}"></div>`).join('');
}

function calculateColorBands(resistance) {
    const colors = ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'gray', 'white'];
    const value = resistance.toString();
    const bands = [];
    
    // First two bands (significant digits)
    for (let i = 0; i < 2; i++) {
        bands.push(colors[parseInt(value[i])]);
    }
    
    // Multiplier band
    const multiplier = Math.log10(resistance) - 1;
    bands.push(colors[Math.floor(multiplier)]);
    
    // Tolerance band (gold for 5%)
    bands.push('gold');
    
    return bands;
}

function updateBulbBrightness(circuit, current) {
    const bulb = circuit.querySelector('.led');
    if (!bulb) return;
    
    const maxCurrent = 0.1; // Maximum current for full brightness
    const brightness = Math.min(current / maxCurrent, 1);
    
    bulb.style.opacity = brightness;
    if (brightness > 0.1) {
        bulb.classList.add('bright');
    } else {
        bulb.classList.remove('bright');
    }
}

function updateCurrentFlow(circuit, current) {
    const wires = circuit.querySelectorAll('.wire');
    const maxCurrent = 0.1;
    const speed = Math.min(current / maxCurrent, 1) * 2;
    
    wires.forEach(wire => {
        wire.style.animationDuration = `${2 / speed}s`;
    });
}

function initializeFanDemo() {
    const resistanceSlider = document.getElementById('demo-resistance');
    const valueDisplay = resistanceSlider.nextElementSibling;
    const currentDisplay = document.getElementById('demo-current');
    const fanSpeedDisplay = document.getElementById('fan-speed');
    const fan = document.querySelector('.fan-blades');
    const resistor = document.querySelector('.fan-demo .resistor-body');

    function updateFanDemo() {
        const resistance = parseFloat(resistanceSlider.value);
        valueDisplay.textContent = `${resistance} Ω`;
        
        // Calculate current (assuming 9V battery)
        const voltage = 9;
        const current = voltage / (resistance || 0.1); // Prevent division by zero
        currentDisplay.textContent = `${current.toFixed(3)} A`;
        
        // Update fan speed with super speed at very low resistance
        const maxCurrent = 0.1;
        let speed;
        if (resistance < 1) {
            // Super speed mode for very low resistance
            speed = 5; // 5x normal speed
            fan.style.animationDuration = '0.4s'; // Very fast rotation
        } else {
            speed = Math.min(current / maxCurrent, 1);
            fan.style.animationDuration = `${2 / speed}s`;
        }
        
        // Update fan speed text
        let speedText;
        if (resistance < 1) speedText = 'SUPER SPEED!';
        else if (speed > 0.8) speedText = 'Very High';
        else if (speed > 0.6) speedText = 'High';
        else if (speed > 0.4) speedText = 'Medium';
        else if (speed > 0.2) speedText = 'Low';
        else speedText = 'Very Low';
        fanSpeedDisplay.textContent = speedText;
        
        // Update resistor colors
        const bands = calculateColorBands(resistance);
        resistor.innerHTML = bands.map(color => `<div class="band ${color}"></div>`).join('');
    }

    resistanceSlider.addEventListener('input', updateFanDemo);
    updateFanDemo(); // Initialize the demo
} 