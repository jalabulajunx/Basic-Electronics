document.addEventListener('DOMContentLoaded', () => {
    // Electron Flow Animation
    const electronContainer = document.querySelector('.electron-container');
    const voltageSlider = document.getElementById('voltage');
    const currentSlider = document.getElementById('current');
    const voltageValue = document.getElementById('voltage-value');
    const currentValue = document.getElementById('current-value');

    function createElectron() {
        const electron = document.createElement('div');
        electron.className = 'electron';
        electron.style.animationDuration = `${2 / voltageSlider.value}s`;
        electronContainer.appendChild(electron);
        
        electron.addEventListener('animationend', () => {
            electron.remove();
        });
    }

    function updateElectronFlow() {
        const voltage = parseFloat(voltageSlider.value);
        const current = parseFloat(currentSlider.value);
        
        // Update display values
        voltageValue.textContent = `${voltage} V`;
        currentValue.textContent = `${current} A`;
        
        // Clear existing electrons
        electronContainer.innerHTML = '';
        
        // Create new electrons based on current
        const electronCount = Math.floor(current * 10);
        for (let i = 0; i < electronCount; i++) {
            setTimeout(() => {
                createElectron();
            }, i * (2000 / electronCount));
        }
    }

    voltageSlider.addEventListener('input', updateElectronFlow);
    currentSlider.addEventListener('input', updateElectronFlow);
    updateElectronFlow();

    // Interactive Circuit
    const circuitVoltage = document.getElementById('circuit-voltage');
    const circuitResistance = document.getElementById('circuit-resistance');
    const circuitVoltageValue = document.getElementById('circuit-voltage-value');
    const circuitResistanceValue = document.getElementById('circuit-resistance-value');
    const circuitCurrent = document.getElementById('circuit-current');
    const brightnessLevel = document.querySelector('.brightness-level');
    const bulb = document.querySelector('.bulb');

    function updateCircuit() {
        const voltage = parseFloat(circuitVoltage.value);
        const resistance = parseFloat(circuitResistance.value);
        
        // Update display values
        circuitVoltageValue.textContent = `${voltage} V`;
        circuitResistanceValue.textContent = `${resistance} Ω`;
        
        // Calculate current using Ohm's Law (I = V/R)
        const current = voltage / resistance;
        circuitCurrent.textContent = `${current.toFixed(2)} A`;
        
        // Update bulb brightness
        const brightness = Math.min(10000, (current * 10000));
        brightnessLevel.style.width = `${brightness}%`;
        
        // Update bulb emoji opacity
        bulb.style.opacity = brightness / 100;
        
        // Add glow effect to bulb
        if (brightness > 0) {
            bulb.style.textShadow = `0 0 ${brightness/10}px #ffd700`;
        } else {
            bulb.style.textShadow = 'none';
        }
    }

    circuitVoltage.addEventListener('input', updateCircuit);
    circuitResistance.addEventListener('input', updateCircuit);
    updateCircuit();

    // Add particle effects to the wire
    const wire = document.querySelector('.wire');
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${1 + Math.random()}s`;
        wire.appendChild(particle);
        
        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    }

    setInterval(createParticle, 100);
}); 