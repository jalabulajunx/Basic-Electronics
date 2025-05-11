document.addEventListener('DOMContentLoaded', () => {
    // Initialize all interactive elements
    drawExampleCircuit();
    drawCircuits();
    initializeCircuitTabs();
    initializeComponentControls();
    initializeQuiz();
    animateElectrons();
  });
  
  // Circuit drawing functions
  function drawExampleCircuit() {
    const canvas = document.getElementById('example-circuit');
    
    // Add battery
    const battery = createBattery(30, 150);
    canvas.appendChild(battery);
    
    // Add switch
    const switchEl = createSwitch(120, 150);
    canvas.appendChild(switchEl);
    
    // Add resistor
    const resistor = createResistor(210, 150);
    canvas.appendChild(resistor);
    
    // Add LED
    const led = createLED(300, 150);
    canvas.appendChild(led);
    
    // Add wires
    const wires = [
      createWire(60, 150, 120, 150, 'horizontal'),
      createWire(150, 150, 180, 150, 'horizontal'),
      createWire(240, 150, 300, 150, 'horizontal'),
      createWire(330, 150, 350, 150, 'horizontal'),
      createWire(350, 150, 350, 80, 'vertical'),
      createWire(350, 80, 30, 80, 'horizontal'),
      createWire(30, 80, 30, 150, 'vertical')
    ];
    
    wires.forEach(wire => canvas.appendChild(wire));
  }
  
  function drawCircuits() {
    drawSeriesCircuit();
    drawParallelCircuit();
    drawMixedCircuit();
  }
  
  function drawSeriesCircuit() {
    const canvas = document.getElementById('series-circuit-diagram');
    
    // Add battery
    const battery = createBattery(30, 150);
    canvas.appendChild(battery);
    
    // Add resistor 1
    const resistor1 = createResistor(140, 150);
    resistor1.setAttribute('data-component', 'resistor1');
    canvas.appendChild(resistor1);
    
    // Add resistor 2
    const resistor2 = createResistor(250, 150);
    resistor2.setAttribute('data-component', 'resistor2');
    canvas.appendChild(resistor2);
    
    // Add capacitor
    const capacitor = createCapacitor(360, 150);
    capacitor.setAttribute('data-component', 'capacitor');
    canvas.appendChild(capacitor);
    
    // Add LED
    const led = createLED(450, 150);
    led.id = 'series-led';
    canvas.appendChild(led);
    
    // Add wires
    const wires = [
      createWire(60, 150, 110, 150, 'horizontal'),
      createWire(170, 150, 220, 150, 'horizontal'),
      createWire(280, 150, 345, 150, 'horizontal'),
      createWire(375, 150, 450, 150, 'horizontal'),
      createWire(480, 150, 500, 150, 'horizontal'),
      createWire(500, 150, 500, 80, 'vertical'),
      createWire(500, 80, 30, 80, 'horizontal'),
      createWire(30, 80, 30, 150, 'vertical')
    ];
    
    wires.forEach(wire => canvas.appendChild(wire));
  }
  
  function drawParallelCircuit() {
    const canvas = document.getElementById('parallel-circuit-diagram');
    
    // Add battery
    const battery = createBattery(30, 150);
    canvas.appendChild(battery);
    
    // Add junction points
    const junction1 = createJunction(150, 150);
    canvas.appendChild(junction1);
    
    const junction2 = createJunction(350, 150);
    canvas.appendChild(junction2);
    
    // Add resistor 1 (top branch)
    const resistor1 = createResistor(250, 100);
    resistor1.setAttribute('data-component', 'resistor1');
    canvas.appendChild(resistor1);
    
    // Add resistor 2 (middle branch)
    const resistor2 = createResistor(250, 150);
    resistor2.setAttribute('data-component', 'resistor2');
    canvas.appendChild(resistor2);
    
    // Add capacitor (bottom branch)
    const capacitor = createCapacitor(250, 200);
    capacitor.setAttribute('data-component', 'capacitor');
    canvas.appendChild(capacitor);
    
    // Add LED
    const led = createLED(450, 150);
    led.id = 'parallel-led';
    canvas.appendChild(led);
    
    // Add wires
    const wires = [
      createWire(60, 150, 150, 150, 'horizontal'),
      createWire(150, 150, 150, 100, 'vertical'),
      createWire(150, 150, 150, 200, 'vertical'),
      createWire(150, 100, 220, 100, 'horizontal'),
      createWire(150, 150, 220, 150, 'horizontal'),
      createWire(150, 200, 235, 200, 'horizontal'),
      createWire(280, 100, 350, 100, 'horizontal'),
      createWire(280, 150, 350, 150, 'horizontal'),
      createWire(265, 200, 350, 200, 'horizontal'),
      createWire(350, 100, 350, 150, 'vertical'),
      createWire(350, 150, 350, 200, 'vertical'),
      createWire(350, 150, 450, 150, 'horizontal'),
      createWire(480, 150, 500, 150, 'horizontal'),
      createWire(500, 150, 500, 80, 'vertical'),
      createWire(500, 80, 30, 80, 'horizontal'),
      createWire(30, 80, 30, 150, 'vertical')
    ];
    
    wires.forEach(wire => canvas.appendChild(wire));
  }
  
  function drawMixedCircuit() {
    const canvas = document.getElementById('mixed-circuit-diagram');
    
    // Add battery
    const battery = createBattery(30, 150);
    canvas.appendChild(battery);
    
    // Add resistor 1 (series)
    const resistor1 = createResistor(120, 150);
    resistor1.setAttribute('data-component', 'resistor1');
    canvas.appendChild(resistor1);
    
    // Add junction points
    const junction1 = createJunction(200, 150);
    canvas.appendChild(junction1);
    
    const junction2 = createJunction(350, 150);
    canvas.appendChild(junction2);
    
    // Add resistor 2 (top branch)
    const resistor2 = createResistor(275, 100);
    resistor2.setAttribute('data-component', 'resistor2');
    canvas.appendChild(resistor2);
    
    // Add resistor 3 (bottom branch)
    const resistor3 = createResistor(275, 200);
    resistor3.setAttribute('data-component', 'resistor3');
    canvas.appendChild(resistor3);
    
    // Add LED
    const led = createLED(450, 150);
    led.id = 'mixed-led';
    canvas.appendChild(led);
    
    // Add wires
    const wires = [
      createWire(60, 150, 90, 150, 'horizontal'),
      createWire(150, 150, 200, 150, 'horizontal'),
      createWire(200, 150, 200, 100, 'vertical'),
      createWire(200, 150, 200, 200, 'vertical'),
      createWire(200, 100, 245, 100, 'horizontal'),
      createWire(200, 200, 245, 200, 'horizontal'),
      createWire(305, 100, 350, 100, 'horizontal'),
      createWire(305, 200, 350, 200, 'horizontal'),
      createWire(350, 100, 350, 150, 'vertical'),
      createWire(350, 150, 350, 200, 'vertical'),
      createWire(350, 150, 450, 150, 'horizontal'),
      createWire(480, 150, 500, 150, 'horizontal'),
      createWire(500, 150, 500, 80, 'vertical'),
      createWire(500, 80, 30, 80, 'horizontal'),
      createWire(30, 80, 30, 150, 'vertical')
    ];
    
    wires.forEach(wire => canvas.appendChild(wire));
  }
  
  // Component creation functions
  function createWire(x1, y1, x2, y2, orientation) {
    const wire = document.createElement('div');
    wire.className = `wire ${orientation}`;
    
    if (orientation === 'horizontal') {
      wire.style.left = `${x1}px`;
      wire.style.top = `${y1 - 2}px`;
      wire.style.width = `${x2 - x1}px`;
    } else {
      wire.style.left = `${x1 - 2}px`;
      wire.style.top = `${y1}px`;
      wire.style.height = `${y2 - y1}px`;
    }
    
    return wire;
  }
  
  function createBattery(x, y) {
    const battery = document.createElement('div');
    battery.className = 'component battery-symbol';
    battery.style.left = `${x}px`;
    battery.style.top = `${y - 15}px`;
    return battery;
  }
  
  function createResistor(x, y) {
    const resistor = document.createElement('div');
    resistor.className = 'component resistor-symbol';
    resistor.style.left = `${x - 30}px`;
    resistor.style.top = `${y - 10}px`;
    return resistor;
  }
  
  function createCapacitor(x, y) {
    const capacitor = document.createElement('div');
    capacitor.className = 'component capacitor-symbol';
    capacitor.style.left = `${x - 10}px`;
    capacitor.style.top = `${y - 20}px`;
    return capacitor;
  }
  
  function createLED(x, y) {
    const led = document.createElement('div');
    led.className = 'component led-symbol';
    led.style.left = `${x}px`;
    led.style.top = `${y - 15}px`;
    led.style.opacity = '0.3'; // Start dim
    return led;
  }
  
  function createJunction(x, y) {
    const junction = document.createElement('div');
    junction.className = 'component junction';
    junction.style.width = '8px';
    junction.style.height = '8px';
    junction.style.borderRadius = '50%';
    junction.style.background = '#666';
    junction.style.left = `${x - 4}px`;
    junction.style.top = `${y - 4}px`;
    return junction;
  }
  
  function createSwitch(x, y) {
    const switchEl = document.createElement('div');
    switchEl.className = 'component switch-symbol';
    switchEl.style.left = `${x - 30}px`;
    switchEl.style.top = `${y - 10}px`;
    return switchEl;
  }
  
  // Tab switching
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
  }
  
  // Component controls
  function initializeComponentControls() {
    // Voltage sliders
    const voltageSliders = {
      'series': document.getElementById('series-voltage'),
      'parallel': document.getElementById('parallel-voltage'),
      'mixed': document.getElementById('mixed-voltage')
    };
    
    // Initialize all voltage sliders
    for (const [circuit, slider] of Object.entries(voltageSliders)) {
      slider.addEventListener('input', () => {
        updateVoltageDisplay(circuit);
        updateCircuitValues(circuit);
      });
    }
    
    // Component value sliders
    const componentSliders = document.querySelectorAll('.component-value');
    componentSliders.forEach(slider => {
      slider.addEventListener('input', () => {
        updateComponentValue(slider);
        updateCircuitValues(slider.getAttribute('data-circuit'));
      });
    });
    
    // Initialize starting values
    updateVoltageDisplay('series');
    updateVoltageDisplay('parallel');
    updateVoltageDisplay('mixed');
    updateCircuitValues('series');
    updateCircuitValues('parallel');
    updateCircuitValues('mixed');
  }
  
  function updateVoltageDisplay(circuit) {
    const slider = document.getElementById(`${circuit}-voltage`);
    const display = document.getElementById(`${circuit}-voltage-value`);
    display.textContent = `${slider.value}V`;
  }
  
  function updateComponentValue(slider) {
    const component = slider.getAttribute('data-component');
    const value = slider.value;
    const display = slider.nextElementSibling;
    
    if (component.includes('resistor')) {
      display.textContent = `${value}Ω`;
    } else if (component.includes('capacitor')) {
      display.textContent = `${value}µF`;
    } else if (component.includes('inductor')) {
      display.textContent = `${value}mH`;
    }
  }
  
  function updateCircuitValues(circuit) {
    switch(circuit) {
      case 'series':
        updateSeriesCircuit();
        break;
      case 'parallel':
        updateParallelCircuit();
        break;
      case 'mixed':
        updateMixedCircuit();
        break;
    }
  }
  
  function updateSeriesCircuit() {
    // Get values
    const voltage = parseFloat(document.getElementById('series-voltage').value);
    const r1 = parseInt(document.querySelector('[data-component="resistor1"][data-circuit="series"]').value);
    const r2 = parseInt(document.querySelector('[data-component="resistor2"][data-circuit="series"]').value);
    
    // Calculate total resistance
    const totalResistance = r1 + r2;
    document.getElementById('series-total-resistance').textContent = `${totalResistance}Ω`;
    
    // Calculate current using Ohm's Law
    const current = voltage / totalResistance;
    document.getElementById('series-current').textContent = `${current.toFixed(3)}A`;
    
    // Update LED brightness
    const brightness = Math.min(100, current * 2000);
    document.getElementById('series-brightness').style.width = `${brightness}%`;
    
    // Update LED visual
    const led = document.getElementById('series-led');
    if (led) {
      led.style.opacity = brightness / 100 * 0.7 + 0.3;
    }
  }
  
  function updateParallelCircuit() {
    // Get values
    const voltage = parseFloat(document.getElementById('parallel-voltage').value);
    const r1 = parseInt(document.querySelector('[data-component="resistor1"][data-circuit="parallel"]').value);
    const r2 = parseInt(document.querySelector('[data-component="resistor2"][data-circuit="parallel"]').value);
    
    // Calculate total resistance for parallel
    const totalResistance = (r1 * r2) / (r1 + r2);
    document.getElementById('parallel-total-resistance').textContent = `${totalResistance.toFixed(0)}Ω`;
    
    // Calculate current using Ohm's Law
    const current = voltage / totalResistance;
    document.getElementById('parallel-current').textContent = `${current.toFixed(3)}A`;
    
    // Update LED brightness
    const brightness = Math.min(100, current * 500);
    document.getElementById('parallel-brightness').style.width = `${brightness}%`;
    
    // Update LED visual
    const led = document.getElementById('parallel-led');
    if (led) {
      led.style.opacity = brightness / 100 * 0.7 + 0.3;
    }
  }
  
  function updateMixedCircuit() {
    // Get values
    const voltage = parseFloat(document.getElementById('mixed-voltage').value);
    const r1 = parseInt(document.querySelector('[data-component="resistor1"][data-circuit="mixed"]').value);
    const r2 = parseInt(document.querySelector('[data-component="resistor2"][data-circuit="mixed"]').value);
    const r3 = parseInt(document.querySelector('[data-component="resistor3"][data-circuit="mixed"]').value);
    
    // Calculate parallel section
    const parallelResistance = (r2 * r3) / (r2 + r3);
    
    // Calculate total resistance (series with parallel)
    const totalResistance = r1 + parallelResistance;
    document.getElementById('mixed-total-resistance').textContent = `${totalResistance.toFixed(0)}Ω`;
    
    // Calculate current using Ohm's Law
    const current = voltage / totalResistance;
    document.getElementById('mixed-current').textContent = `${current.toFixed(3)}A`;
    
    // Update LED brightness
    const brightness = Math.min(100, current * 1000);
    document.getElementById('mixed-brightness').style.width = `${brightness}%`;
    
    // Update LED visual
    const led = document.getElementById('mixed-led');
    if (led) {
      led.style.opacity = brightness / 100 * 0.7 + 0.3;
    }
  }
  
  // Electron animation
  function animateElectrons() {
    const circuits = document.querySelectorAll('.circuit-diagram');
    
    circuits.forEach(circuit => {
      setInterval(() => {
        const wires = circuit.querySelectorAll('.wire');
        const shouldAnimate = circuit.parentElement.classList.contains('active');
        
        if (shouldAnimate) {
          const randomWire = wires[Math.floor(Math.random() * wires.length)];
          
          if (randomWire) {
            const electron = document.createElement('div');
            electron.className = 'electron';
            
            // Position the electron
            if (randomWire.classList.contains('horizontal')) {
              electron.style.top = `${parseInt(randomWire.style.top) + 2}px`;
              electron.style.left = `${parseInt(randomWire.style.left)}px`;
              
              // Animate from left to right
              electron.animate([
                { left: `${parseInt(randomWire.style.left)}px`, opacity: 0 },
                { left: `${parseInt(randomWire.style.left) + 20}px`, opacity: 1 },
                { left: `${parseInt(randomWire.style.left) + parseInt(randomWire.style.width) - 20}px`, opacity: 1 },
                { left: `${parseInt(randomWire.style.left) + parseInt(randomWire.style.width)}px`, opacity: 0 }
              ], {
                duration: 1000 + Math.random() * 1000,
                easing: 'linear'
              });
            } else {
              electron.style.left = `${parseInt(randomWire.style.left) + 2}px`;
              electron.style.top = `${parseInt(randomWire.style.top)}px`;
              
              // Animate from top to bottom
              electron.animate([
                { top: `${parseInt(randomWire.style.top)}px`, opacity: 0 },
                { top: `${parseInt(randomWire.style.top) + 20}px`, opacity: 1 },
                { top: `${parseInt(randomWire.style.top) + parseInt(randomWire.style.height) - 20}px`, opacity: 1 },
                { top: `${parseInt(randomWire.style.top) + parseInt(randomWire.style.height)}px`, opacity: 0 }
              ], {
                duration: 1000 + Math.random() * 1000,
                easing: 'linear'
              });
            }
            
            circuit.appendChild(electron);
            
            // Remove the electron after animation
            setTimeout(() => {
              electron.remove();
            }, 2000);
          }
        }
      }, 300);
    });
  }
  
  // Quiz
  function initializeQuiz() {
    const questions = [
      {
        text: "In a series circuit, how does the current compare between components?",
        options: [
          "Current is the same through all components",
          "Current is divided among components",
          "Current depends on the component type",
          "Current is blocked by resistors"
        ],
        correctIndex: 0,
        explanation: "In a series circuit, the current is the same throughout the entire circuit because there's only one path for the electrons to flow."
      },
      {
        text: "In a parallel circuit, how does the voltage compare between branches?",
        options: [
          "Voltage is divided between branches",
          "Voltage is the same across all branches",
          "Voltage increases with each branch",
          "Voltage depends on the component type"
        ],
        correctIndex: 1,
        explanation: "In a parallel circuit, the voltage is the same across all branches because they're all connected directly to the power source."
      },
      {
        text: "What happens to the total resistance when resistors are added in series?",
        options: [
          "Total resistance decreases",
          "Total resistance stays the same",
          "Total resistance increases",
          "Total resistance becomes zero"
        ],
        correctIndex: 2,
        explanation: "When resistors are added in series, their resistances add up, so the total resistance increases."
      },
      {
        text: "What happens to the total resistance when resistors are added in parallel?",
        options: [
          "Total resistance increases",
          "Total resistance stays the same",
          "Total resistance decreases",
          "Total resistance doubles"
        ],
        correctIndex: 2,
        explanation: "When resistors are added in parallel, the total resistance decreases because there are more paths for current to flow."
      },
      {
        text: "Which circuit will have the brightest LED with the same components?",
        options: [
          "Series circuit",
          "Parallel circuit",
          "Both will be equally bright",
          "It depends on the battery voltage"
        ],
        correctIndex: 1,
        explanation: "A parallel circuit will have a brighter LED because it allows more current to flow through the circuit due to lower total resistance."
      }
    ];
    
    let currentQuestion = 0;
    let score = 0;
    
    const questionText = document.getElementById('question-text');
    const questionNumber = document.getElementById('question-number');
    const questionTotal = document.getElementById('question-total');
    const optionsContainer = document.getElementById('quiz-options');
    const feedbackContainer = document.getElementById('quiz-feedback');
    const nextButton = document.getElementById('next-question');
    const progressBar = document.getElementById('progress-bar');
    const scoreDisplay = document.getElementById('score');
    
    // Set up initial values
    questionTotal.textContent = questions.length;
    loadQuestion(currentQuestion);
    
    // Add event listeners
    nextButton.addEventListener('click', () => {
      currentQuestion++;
      if (currentQuestion < questions.length) {
        loadQuestion(currentQuestion);
        updateProgress();
      } else {
        // Quiz completed
        showFinalResults();
      }
    });
    
    function loadQuestion(index) {
      const question = questions[index];
      
      // Update question display
      questionText.textContent = question.text;
      questionNumber.textContent = index + 1;
      
      // Clear previous options and feedback
      optionsContainer.innerHTML = '';
      feedbackContainer.className = 'quiz-feedback';
      feedbackContainer.textContent = '';
      
      // Add options
      question.options.forEach((option, optIndex) => {
        const optionButton = document.createElement('button');
        optionButton.className = 'quiz-option';
        optionButton.textContent = option;
        optionButton.setAttribute('data-index', optIndex);
        
        optionButton.addEventListener('click', () => {
          handleOptionClick(optIndex);
        });
        
        optionsContainer.appendChild(optionButton);
      });
      
      // Reset next button
      nextButton.disabled = true;
    }
    
    function handleOptionClick(selectedIndex) {
      const question = questions[currentQuestion];
      const optionButtons = document.querySelectorAll('.quiz-option');
      
      // Disable all options
      optionButtons.forEach(button => {
        button.disabled = true;
      });
      
      // Add selected class
      optionButtons[selectedIndex].classList.add('selected');
      
      // Check if correct
      const isCorrect = selectedIndex === question.correctIndex;
      
      if (isCorrect) {
        optionButtons[selectedIndex].classList.add('correct');
        feedbackContainer.textContent = `Correct! ${question.explanation}`;
        feedbackContainer.className = 'quiz-feedback correct';
        score++;
        scoreDisplay.textContent = score;
      } else {
        optionButtons[selectedIndex].classList.add('incorrect');
        optionButtons[question.correctIndex].classList.add('correct');
        feedbackContainer.textContent = `Incorrect. ${question.explanation}`;
        feedbackContainer.className = 'quiz-feedback incorrect';
      }
      
      // Enable next button
      nextButton.disabled = false;
    }
    
    function updateProgress() {
      const progress = ((currentQuestion + 1) / questions.length) * 100;
      progressBar.style.width = `${progress}%`;
    }
    
    function showFinalResults() {
      // Clear question display
      questionText.textContent = 'Quiz Completed!';
      optionsContainer.innerHTML = '';
      
      // Show final score
      feedbackContainer.className = 'quiz-feedback correct';
      feedbackContainer.innerHTML = `
        <h3>Your Final Score: ${score}/${questions.length}</h3>
        <p>${getScoreFeedback(score, questions.length)}</p>
      `;
      
      // Disable next button
      nextButton.disabled = true;
    }
    
    function getScoreFeedback(score, total) {
      const percentage = (score / total) * 100;
      
      if (percentage >= 90) {
        return "Amazing! You're a circuits expert!";
      } else if (percentage >= 70) {
        return "Great job! You understand circuits well!";
      } else if (percentage >= 50) {
        return "Good effort! Keep learning about circuits!";
      } else {
        return "Keep practicing! Circuits take time to understand.";
      }
    }
    
    // Initialize progress
    updateProgress();
  }