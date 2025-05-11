// Capacitors chapter interactivity will go here 

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all interactive elements
    initializeChargingDemo();
    initializeQuiz();
    initializeCircuitTabs();
    initializeFluorescentDemo();
});

function initializeChargingDemo() {
    const switchElement = document.querySelector('.switch-body');
    const capacitanceSlider = document.getElementById('capacitance');
    const chargeIndicator = document.querySelector('.charge-indicator');
    const voltageDisplay = document.getElementById('capacitor-voltage');
    const chargeDisplay = document.getElementById('charge-level');
    const ledElement = document.querySelector('.led');
    const plates = document.querySelectorAll('.plate');
    const wires = document.querySelectorAll('.wire');

    let isCharging = false;
    let charge = 0;
    let voltage = 0;
    const maxVoltage = 9; // 9V battery
    let chargingInterval;

    // Toggle switch
    switchElement.addEventListener('click', () => {
        switchElement.classList.toggle('off');
        isCharging = !switchElement.classList.contains('off');
        
        if (isCharging) {
            startCharging();
        } else {
            stopCharging();
        }
    });

    // Update capacitance
    capacitanceSlider.addEventListener('input', (e) => {
        const capacitance = parseFloat(e.target.value);
        const valueDisplay = e.target.nextElementSibling;
        valueDisplay.textContent = capacitance + ' µF';
        updateCircuitValues(capacitance);
    });

    function startCharging() {
        const capacitance = parseFloat(capacitanceSlider.value);
        const timeConstant = capacitance * 1000; // RC time constant in ms
        
        chargingInterval = setInterval(() => {
            charge += (maxVoltage - voltage) / timeConstant;
            voltage = charge / capacitance;
            
            updateDisplays();
            updateVisuals();
            
            if (voltage >= maxVoltage) {
                stopCharging();
            }
        }, 50);
    }

    function stopCharging() {
        clearInterval(chargingInterval);
        
        // Start discharging if switch is off
        if (switchElement.classList.contains('off')) {
            const capacitance = parseFloat(capacitanceSlider.value);
            const timeConstant = capacitance * 1000;
            
            chargingInterval = setInterval(() => {
                charge -= voltage / timeConstant;
                voltage = charge / capacitance;
                
                updateDisplays();
                updateVisuals();
                
                if (voltage <= 0) {
                    clearInterval(chargingInterval);
                }
            }, 50);
        }
    }

    function updateDisplays() {
        voltageDisplay.textContent = voltage.toFixed(2) + 'V';
        chargeDisplay.textContent = Math.round((voltage / maxVoltage) * 100) + '%';
        
        // Update LED brightness based on voltage
        const brightness = Math.min(voltage / maxVoltage, 1);
        ledElement.style.opacity = brightness;
        if (brightness > 0.5) {
            ledElement.classList.add('bright');
        } else {
            ledElement.classList.remove('bright');
        }
    }

    function updateVisuals() {
        // Update charge indicator
        const chargePercentage = (voltage / maxVoltage) * 100;
        chargeIndicator.style.setProperty('--charge-level', chargePercentage + '%');
        
        // Update plate animations
        plates.forEach(plate => {
            const speed = isCharging ? 2 : 1;
            plate.style.animationDuration = speed + 's';
        });
        
        // Update wire animations
        wires.forEach(wire => {
            const speed = isCharging ? 1 : 0.5;
            wire.style.animationDuration = speed + 's';
        });
    }

    function updateCircuitValues(capacitance) {
        // Update circuit calculations when capacitance changes
        if (isCharging) {
            stopCharging();
            startCharging();
        }
    }
}

function initializeQuiz() {
    const checkButton = document.getElementById('check-answer');
    const answerInput = document.getElementById('capacitance-answer');
    const feedbackElement = document.getElementById('quiz-feedback');
    
    // Generate random capacitor value for quiz
    const values = [10, 22, 47, 100, 220, 470, 1000];
    const units = ['pF', 'nF', 'µF'];
    const randomValue = values[Math.floor(Math.random() * values.length)];
    const randomUnit = units[Math.floor(Math.random() * units.length)];
    const correctAnswer = randomValue + randomUnit;
    
    // Display the capacitor marking
    const markingElement = document.querySelector('.value-marking');
    markingElement.textContent = correctAnswer;
    
    checkButton.addEventListener('click', () => {
        const userAnswer = answerInput.value.trim();
        
        if (userAnswer === correctAnswer) {
            feedbackElement.textContent = 'Correct! Great job!';
            feedbackElement.className = 'quiz-feedback correct';
        } else {
            feedbackElement.textContent = `Not quite. The correct answer is ${correctAnswer}. Try again!`;
            feedbackElement.className = 'quiz-feedback incorrect';
        }
    });
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
            const circuitType = tab.getAttribute('data-circuit');
            document.querySelector(`.${circuitType}-circuit`).classList.add('active');
        });
    });
    
    // Initialize series and parallel circuit controls
    initializeSeriesCircuit();
    initializeParallelCircuit();
}

function initializeSeriesCircuit() {
    const sliders = document.querySelectorAll('.series-circuit .capacitor-value');
    const totalDisplay = document.querySelector('.series-circuit .total-capacitance');
    
    sliders.forEach(slider => {
        slider.addEventListener('input', () => {
            updateSeriesCircuit();
        });
    });
    
    function updateSeriesCircuit() {
        let totalCapacitance = 0;
        sliders.forEach(slider => {
            const value = parseFloat(slider.value);
            totalCapacitance += 1 / value;
        });
        
        totalCapacitance = 1 / totalCapacitance;
        totalDisplay.textContent = totalCapacitance.toFixed(2) + 'µF';
        
        // Update charge time and brightness
        const chargeTime = (totalCapacitance * 0.01).toFixed(2);
        const brightness = totalCapacitance > 150 ? 'High' : totalCapacitance > 50 ? 'Medium' : 'Low';
        
        document.querySelector('.series-circuit .charge-time').textContent = chargeTime + 's';
        document.querySelector('.series-circuit .brightness-value').textContent = brightness;
    }
}

function initializeParallelCircuit() {
    const sliders = document.querySelectorAll('.parallel-circuit .capacitor-value');
    const totalDisplay = document.querySelector('.parallel-circuit .total-capacitance');
    
    sliders.forEach(slider => {
        slider.addEventListener('input', () => {
            updateParallelCircuit();
        });
    });
    
    function updateParallelCircuit() {
        let totalCapacitance = 0;
        sliders.forEach(slider => {
            const value = parseFloat(slider.value);
            totalCapacitance += value;
        });
        
        totalDisplay.textContent = totalCapacitance.toFixed(2) + 'µF';
        
        // Update charge time and brightness
        const chargeTime = (totalCapacitance * 0.03).toFixed(2);
        const brightness = totalCapacitance > 300 ? 'High' : totalCapacitance > 100 ? 'Medium' : 'Low';
        
        document.querySelector('.parallel-circuit .charge-time').textContent = chargeTime + 's';
        document.querySelector('.parallel-circuit .brightness-value').textContent = brightness;
    }
}

function initializeFluorescentDemo() {
    const startButton = document.getElementById('start-tube');
    const circuitDiagram = document.querySelector('.circuit-diagram.fluorescent');
    const tube = document.querySelector('.tube');
    const starter = document.querySelector('.starter');
    const statusDisplay = document.getElementById('tube-status');
    const currentDisplay = document.getElementById('tube-current');
    const powerFactorDisplay = document.getElementById('power-factor');

    let isTubeOn = false;
    let startSequence;

    startButton.addEventListener('click', () => {
        if (!isTubeOn) {
            startTube();
        } else {
            stopTube();
        }
    });

    function startTube() {
        isTubeOn = true;
        startButton.textContent = 'Stop Tube Light';
        statusDisplay.textContent = 'Starting...';
        
        // Start sequence
        starter.classList.add('active');
        
        // Simulate starter heating up
        setTimeout(() => {
            starter.classList.remove('active');
            tube.classList.add('active');
            circuitDiagram.classList.add('active');
            
            // Update displays
            statusDisplay.textContent = 'On';
            currentDisplay.textContent = '0.3A';
            powerFactorDisplay.textContent = '0.9';
            
            // Simulate flickering during warm-up
            let flickerCount = 0;
            const flickerInterval = setInterval(() => {
                if (flickerCount < 3) {
                    tube.classList.remove('active');
                    setTimeout(() => {
                        tube.classList.add('active');
                    }, 100);
                    flickerCount++;
                } else {
                    clearInterval(flickerInterval);
                }
            }, 500);
        }, 1000);
    }

    function stopTube() {
        isTubeOn = false;
        startButton.textContent = 'Start Tube Light';
        
        // Stop sequence
        tube.classList.remove('active');
        circuitDiagram.classList.remove('active');
        
        // Update displays
        statusDisplay.textContent = 'Off';
        currentDisplay.textContent = '0A';
        powerFactorDisplay.textContent = '0.5';
    }
} 