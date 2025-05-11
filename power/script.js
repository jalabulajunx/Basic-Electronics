document.addEventListener('DOMContentLoaded', () => {
    // Initialize all interactive elements
    initializePowerDemo();
    initializeFormulaCalculators();
    initializeDevicesVisualization();
    initializeEnergyCalculator();
    initializeQuiz();
  });
  
  // Power Demo Section
  function initializePowerDemo() {
    const voltageSlider = document.getElementById('voltage');
    const resistanceSlider = document.getElementById('resistance');
    const currentDisplay = document.getElementById('current');
    const powerDisplay = document.getElementById('power');
    const brightnessDisplay = document.getElementById('brightness');
    const bulbBody = document.querySelector('.bulb-body');
    const heatWaves = document.querySelector('.heat-waves');
    const wires = document.querySelectorAll('.wire');
  
    // Update the resistor bands based on resistance value
    function updateResistorBands(resistance) {
      const resistorBody = document.querySelector('.resistor-body');
      resistorBody.innerHTML = ''; // Clear existing bands
      
      // Convert resistance to color bands (simplified)
      const bands = calculateColorBands(resistance);
      
      // Add bands to resistor
      bands.forEach(color => {
        const band = document.createElement('div');
        band.className = `band ${color}`;
        resistorBody.appendChild(band);
      });
    }
  
    function calculateColorBands(resistance) {
      const colors = ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'gray'];
      const bands = [];
      
      // Simplify for visualization (just show the first two digits and multiplier)
      const value = resistance.toString();
      
      // First two bands (significant digits)
      for (let i = 0; i < 2 && i < value.length; i++) {
        bands.push(colors[parseInt(value[i])]);
      }
      
      // Multiplier band (simplified)
      const multiplier = value.length - 2;
      bands.push(multiplier >= 0 ? colors[multiplier] : 'gold');
      
      // Tolerance band (gold for 5%)
      bands.push('gold');
      
      return bands;
    }
  
    function updateCircuit() {
      const voltage = parseFloat(voltageSlider.value);
      const resistance = parseFloat(resistanceSlider.value);
      
      // Calculate current using Ohm's Law (I = V/R)
      const current = voltage / resistance;
      
      // Calculate power (P = V * I)
      const power = voltage * current;
      
      // Update displays
      currentDisplay.textContent = `${current.toFixed(2)} A`;
      powerDisplay.textContent = `${power.toFixed(2)} W`;
      
      // Update bulb brightness based on power
      let brightness;
      if (power < 0.5) brightness = 'Very Dim';
      else if (power < 1) brightness = 'Dim';
      else if (power < 2) brightness = 'Medium';
      else if (power < 4) brightness = 'Bright';
      else brightness = 'Very Bright';
      
      brightnessDisplay.textContent = brightness;
      
      // Visual updates
      const brightnessLevel = Math.min(power / 5, 1); // Cap at 5W for max brightness
      bulbBody.style.opacity = 0.5 + brightnessLevel * 0.5;
      
      if (brightnessLevel > 0.2) {
        bulbBody.classList.add('bright');
        heatWaves.classList.add('active');
      } else {
        bulbBody.classList.remove('bright');
        heatWaves.classList.remove('active');
      }
      
      // Update electron flow speed based on current
      wires.forEach(wire => {
        const speed = Math.max(0.5, Math.min(3, current * 10));
        wire.style.setProperty('--animation-speed', `${3/speed}s`);
      });
      
      // Update resistor
      updateResistorBands(resistance);
    }
  
    // Set up event listeners
    voltageSlider.addEventListener('input', () => {
      document.querySelector('.voltage-label').textContent = `${voltageSlider.value}V`;
      updateCircuit();
    });
    
    resistanceSlider.addEventListener('input', () => {
      document.querySelector('.value-display').textContent = `${resistanceSlider.value} Ω`;
      updateCircuit();
    });
    
    // Initialize with default values
    updateResistorBands(resistanceSlider.value);
    updateCircuit();
  }
  
  // Formula Calculator Section
  function initializeFormulaCalculators() {
    // Formula 1: P = V * I
    document.getElementById('formula1-calculate').addEventListener('click', () => {
      const voltage = parseFloat(document.getElementById('formula1-voltage').value);
      const current = parseFloat(document.getElementById('formula1-current').value);
      const power = voltage * current;
      document.getElementById('formula1-result').textContent = `${power.toFixed(2)} W`;
    });
    
    // Formula 2: P = I² * R
    document.getElementById('formula2-calculate').addEventListener('click', () => {
      const current = parseFloat(document.getElementById('formula2-current').value);
      const resistance = parseFloat(document.getElementById('formula2-resistance').value);
      const power = current * current * resistance;
      document.getElementById('formula2-result').textContent = `${power.toFixed(2)} W`;
    });
    
    // Formula 3: P = V² / R
    document.getElementById('formula3-calculate').addEventListener('click', () => {
      const voltage = parseFloat(document.getElementById('formula3-voltage').value);
      const resistance = parseFloat(document.getElementById('formula3-resistance').value);
      const power = (voltage * voltage) / resistance;
      document.getElementById('formula3-result').textContent = `${power.toFixed(2)} W`;
    });
  }
  
  // Device Power Visualization
  function initializeDevicesVisualization() {
    const deviceItems = document.querySelectorAll('.device-item');
    
    deviceItems.forEach(item => {
      const power = parseInt(item.getAttribute('data-power'));
      const maxPower = 1000; // Scale max (for visualization)
      const percentage = Math.min(100, (power / maxPower) * 100);
      
      setTimeout(() => {
        item.querySelector('.power-fill').style.width = `${percentage}%`;
      }, 300); // Small delay for animation effect
      
      // Add hover effect to highlight where it falls on the scale
      item.addEventListener('mouseenter', () => {
        // Scale positioning (simplistic)
        const scalePosition = Math.min(100, (power / maxPower) * 100);
        const highlight = document.createElement('div');
        highlight.className = 'scale-highlight';
        highlight.style.position = 'absolute';
        highlight.style.top = '-10px';
        highlight.style.left = `${scalePosition}%`;
        highlight.style.width = '10px';
        highlight.style.height = '10px';
        highlight.style.background = '#ffd700';
        highlight.style.borderRadius = '50%';
        highlight.style.transform = 'translateX(-50%)';
        highlight.style.zIndex = '2';
        document.querySelector('.scale-line').appendChild(highlight);
      });
      
      item.addEventListener('mouseleave', () => {
        const highlight = document.querySelector('.scale-highlight');
        if (highlight) highlight.remove();
      });
    });
  }
  
  // Energy Calculator
  function initializeEnergyCalculator() {
    const powerInput = document.getElementById('device-power');
    const hoursInput = document.getElementById('usage-hours');
    const costInput = document.getElementById('electricity-cost');
    const calculateBtn = document.getElementById('calculate-energy');
    
    calculateBtn.addEventListener('click', () => {
      const power = parseFloat(powerInput.value); // watts
      const hours = parseFloat(hoursInput.value); // hours
      const cost = parseFloat(costInput.value); // $ per kWh
      
      // Calculate energy
      const dailyEnergy = (power * hours) / 1000; // kWh
      const monthlyEnergy = dailyEnergy * 30; // kWh for 30 days
      const monthlyCost = monthlyEnergy * cost; // $
      
      // Update results
      document.getElementById('daily-energy').textContent = `${dailyEnergy.toFixed(2)} kWh`;
      document.getElementById('monthly-energy').textContent = `${monthlyEnergy.toFixed(2)} kWh`;
      document.getElementById('monthly-cost').textContent = `$${monthlyCost.toFixed(2)}`;
      
      // LED bulb equivalence (assume 10W per LED bulb)
      const equivalentBulbs = Math.round(dailyEnergy * 1000 / 10);
      document.getElementById('equivalent-bulbs').textContent = equivalentBulbs;
      
      // Visual representation - show lightbulbs
      const container = document.querySelector('.lightbulb-container');
      container.innerHTML = '';
      
      // Show up to 50 bulbs max (visual representation)
      const bulbsToShow = Math.min(50, equivalentBulbs);
      for (let i = 0; i < bulbsToShow; i++) {
        const bulb = document.createElement('div');
        bulb.className = 'bulb';
        bulb.textContent = '💡';
        container.appendChild(bulb);
      }
      
      // If there are more than 50, show an indicator
      if (equivalentBulbs > 50) {
        const moreIndicator = document.createElement('div');
        moreIndicator.textContent = `+${equivalentBulbs - 50} more`;
        moreIndicator.style.fontSize = '0.8rem';
        moreIndicator.style.color = '#666';
        container.appendChild(moreIndicator);
      }
    });
    
    // Trigger calculation on load with default values
    calculateBtn.click();
  }
  
  // Quiz Section
  function initializeQuiz() {
    const questions = [
      {
        text: "What is the formula for calculating electric power using voltage and current?",
        options: ["P = V × I", "P = V + I", "P = V - I", "P = V ÷ I"],
        correctIndex: 0
      },
      {
        text: "What unit is electrical power measured in?",
        options: ["Ampere", "Volt", "Watt", "Ohm"],
        correctIndex: 2
      },
      {
        text: "If a device uses 2 amps of current at 120 volts, what is its power?",
        options: ["60 watts", "122 watts", "240 watts", "360 watts"],
        correctIndex: 2
      },
      {
        text: "What happens to power if voltage is doubled, but resistance stays the same?",
        options: ["Power doubles", "Power halves", "Power increases 4 times", "Power stays the same"],
        correctIndex: 2
      },
      {
        text: "Which device typically uses the most electrical power?",
        options: ["Smartphone", "LED lightbulb", "Laptop", "Space heater"],
        correctIndex: 3
      }
    ];
    
    let currentQuestion = 0;
    let score = 0;
    let questionAnswered = false;
    
    const questionText = document.getElementById('question-text');
    const options = document.querySelectorAll('.quiz-option');
    const feedback = document.getElementById('quiz-feedback');
    const nextButton = document.getElementById('next-question');
    const progressBar = document.getElementById('progress-bar');
    const scoreDisplay = document.getElementById('score');
    const questionNumber = document.getElementById('question-number');
    const questionTotal = document.getElementById('question-total');
    
    function loadQuestion() {
      const question = questions[currentQuestion];
      questionText.textContent = question.text;
      
      // Update question number and total
      questionNumber.textContent = currentQuestion + 1;
      questionTotal.textContent = questions.length;
      
      // Update options
      options.forEach((option, index) => {
        option.textContent = question.options[index];
        option.className = 'quiz-option';
        option.disabled = false;
      });
      
      // Reset states
      feedback.className = 'quiz-feedback';
      feedback.textContent = '';
      nextButton.disabled = true;
      questionAnswered = false;
      
      // Update progress bar
      progressBar.style.width = `${((currentQuestion) / questions.length) * 100}%`;
    }
    
    // Add event listeners to options
    options.forEach((option, index) => {
      option.addEventListener('click', () => {
        if (questionAnswered) return;
        
        questionAnswered = true;
        const correctIndex = questions[currentQuestion].correctIndex;
        
        // Mark selected option
        option.classList.add('selected');
        
        // Check if answer is correct
        if (index === correctIndex) {
          option.classList.add('correct');
          feedback.textContent = "Correct! Great job! ⭐";
          feedback.className = 'quiz-feedback correct';
          score++;
          scoreDisplay.textContent = score;
        } else {
          option.classList.add('incorrect');
          options[correctIndex].classList.add('correct');
          feedback.textContent = "Not quite. The correct answer is highlighted.";
          feedback.className = 'quiz-feedback incorrect';
        }
        
        // Disable all options after answering
        options.forEach(opt => {
          opt.disabled = true;
        });
        
        // Enable next button
        nextButton.disabled = false;
      });
    });
    
    // Next button event listener
    nextButton.addEventListener('click', () => {
      currentQuestion++;
      
      if (currentQuestion < questions.length) {
        loadQuestion();
      } else {
        // Quiz completed
        questionText.textContent = `Quiz Complete! Your score: ${score} out of ${questions.length}`;
        
        options.forEach(option => {
          option.style.display = 'none';
        });
        
        feedback.className = 'quiz-feedback';
        feedback.textContent = score === questions.length ? 
          "Perfect score! You're a power expert! ⚡" : 
          "Good job! Try again to improve your score.";
        
        nextButton.textContent = "Restart Quiz";
        nextButton.addEventListener('click', () => {
          // Reset quiz
          currentQuestion = 0;
          score = 0;
          scoreDisplay.textContent = 0;
          options.forEach(option => {
            option.style.display = 'block';
          });
          nextButton.textContent = "Next Question";
          loadQuestion();
        }, { once: true });
      }
    });
    
    // Initialize the first question
    loadQuestion();
  }