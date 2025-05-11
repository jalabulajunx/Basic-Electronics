// KiCAD-inspired Circuit Library
class CircuitSchematic {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      this.svg.setAttribute("width", "100%");
      this.svg.setAttribute("height", "100%");
      this.svg.setAttribute("viewBox", "0 0 600 300");
      this.container.appendChild(this.svg);
      
      this.components = [];
      this.wires = [];
      this.electrons = [];
      this.animationFrameId = null;
      this.voltageValue = 9;
      this.resistor1Value = 200;
      this.resistor2Value = 300;
      this.resistor3Value = 400;
      this.capacitorValue = 10;
    }
    
    // Add component to schematic
    addComponent(component) {
      this.components.push(component);
      component.render(this.svg);
      return component;
    }
    
    // Add wire connection
    addWire(x1, y1, x2, y2) {
      const wire = {
        x1, y1, x2, y2,
        element: document.createElementNS("http://www.w3.org/2000/svg", "line")
      };
      
      wire.element.setAttribute("x1", x1);
      wire.element.setAttribute("y1", y1);
      wire.element.setAttribute("x2", x2);
      wire.element.setAttribute("y2", y2);
      wire.element.setAttribute("stroke", "#666");
      wire.element.setAttribute("stroke-width", "3");
      
      this.wires.push(wire);
      this.svg.appendChild(wire.element);
      return wire;
    }
    
    // Add a junction point (for parallel circuits)
    addJunction(x, y) {
      const junction = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      junction.setAttribute("cx", x);
      junction.setAttribute("cy", y);
      junction.setAttribute("r", "4");
      junction.setAttribute("fill", "#666");
      
      this.svg.appendChild(junction);
      return junction;
    }
    
    // Create electron animation
    addElectron(wire, delay = 0, duration = 2000) {
      const electron = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      electron.setAttribute("r", "4");
      electron.setAttribute("fill", "#ffd700");
      
      // Set initial position
      electron.setAttribute("cx", wire.x1);
      electron.setAttribute("cy", wire.y1);
      
      this.electrons.push({
        element: electron,
        wire,
        delay,
        duration,
        progress: 0,
        startTime: performance.now() + delay
      });
      
      this.svg.appendChild(electron);
      return electron;
    }
    
    // Animate electrons
    animateElectrons(timestamp) {
      for (const electron of this.electrons) {
        if (timestamp < electron.startTime) continue;
        
        const elapsed = timestamp - electron.startTime;
        electron.progress = (elapsed % electron.duration) / electron.duration;
        
        // Linear interpolation between wire endpoints
        const x = electron.wire.x1 + (electron.wire.x2 - electron.wire.x1) * electron.progress;
        const y = electron.wire.y1 + (electron.wire.y2 - electron.wire.y1) * electron.progress;
        
        electron.element.setAttribute("cx", x);
        electron.element.setAttribute("cy", y);
      }
      
      this.animationFrameId = requestAnimationFrame(this.animateElectrons.bind(this));
    }
    
    // Calculate circuit values and update UI
    updateCircuit(circuitType) {
      let totalResistance = 0;
      let current = 0;
      
      // Calculate based on circuit type
      if (circuitType === 'series') {
        totalResistance = this.resistor1Value + this.resistor2Value;
      } else if (circuitType === 'parallel') {
        totalResistance = (this.resistor1Value * this.resistor2Value) / (this.resistor1Value + this.resistor2Value);
      } else if (circuitType === 'mixed') {
        const parallelResistance = (this.resistor2Value * this.resistor3Value) / 
                                   (this.resistor2Value + this.resistor3Value);
        totalResistance = this.resistor1Value + parallelResistance;
      }
      
      // Calculate current using Ohm's Law (I = V/R)
      current = this.voltageValue / totalResistance;
      
      // Update display values in the UI
      document.getElementById(`${circuitType}-total-resistance`).textContent = 
        `${Math.round(totalResistance)}Ω`;
      document.getElementById(`${circuitType}-current`).textContent = 
        `${current.toFixed(3)}A`;
      
      // Calculate LED brightness (scale for visual effect)
      const brightness = Math.min(100, current * 1000);
      document.getElementById(`${circuitType}-brightness`).style.width = `${brightness}%`;
      
      // Find and update LED component
      const led = this.components.find(c => c.type === 'led');
      if (led) {
        led.setBrightness(brightness / 100);
      }
      
      // Update electron animation speed based on current
      for (const electron of this.electrons) {
        electron.duration = 2000 / (current * 5); // Faster flow with higher current
        if (electron.duration < 200) electron.duration = 200; // Set minimum speed
      }
    }
    
    // Start the animation
    start() {
      if (!this.animationFrameId) {
        this.animationFrameId = requestAnimationFrame(this.animateElectrons.bind(this));
      }
    }
    
    // Stop the animation
    stop() {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
    }
    
    // Clear the schematic
    clear() {
      this.stop();
      while (this.svg.firstChild) {
        this.svg.removeChild(this.svg.firstChild);
      }
      this.components = [];
      this.wires = [];
      this.electrons = [];
    }
  }
  
  // Circuit component classes
  class CircuitComponent {
    constructor(x, y, value = '') {
      this.x = x;
      this.y = y;
      this.value = value;
      this.element = null;
    }
    
    render(svg) {
      // Implemented by subclasses
    }
  }
  
  class Battery extends CircuitComponent {
    constructor(x, y, value = '9V') {
      super(x, y, value);
      this.type = 'battery';
    }
    
    render(svg) {
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("transform", `translate(${this.x},${this.y})`);
      
      // Battery symbol
      const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line1.setAttribute("x1", "0");
      line1.setAttribute("y1", "-30");
      line1.setAttribute("x2", "0");
      line1.setAttribute("y2", "30");
      line1.setAttribute("stroke", "#666");
      line1.setAttribute("stroke-width", "3");
      
      const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line2.setAttribute("x1", "10");
      line2.setAttribute("y1", "-20");
      line2.setAttribute("x2", "10");
      line2.setAttribute("y2", "20");
      line2.setAttribute("stroke", "#666");
      line2.setAttribute("stroke-width", "6");
      
      // Value label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", "25");
      text.setAttribute("y", "0");
      text.setAttribute("dominant-baseline", "middle");
      text.setAttribute("font-size", "12");
      text.textContent = this.value;
      
      group.appendChild(line1);
      group.appendChild(line2);
      group.appendChild(text);
      
      svg.appendChild(group);
      this.element = group;
      return group;
    }
  }
  
  class Resistor extends CircuitComponent {
    constructor(x, y, value = '100Ω') {
      super(x, y, value);
      this.type = 'resistor';
    }
    
    render(svg) {
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("transform", `translate(${this.x},${this.y})`);
      
      // Resistor rectangle
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", "-40");
      rect.setAttribute("y", "-10");
      rect.setAttribute("width", "80");
      rect.setAttribute("height", "20");
      rect.setAttribute("fill", "white");
      rect.setAttribute("stroke", "#666");
      rect.setAttribute("stroke-width", "2");
      rect.setAttribute("rx", "4");
      
      // Value label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", "0");
      text.setAttribute("y", "0");
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "middle");
      text.setAttribute("font-size", "12");
      text.textContent = this.value;
      
      group.appendChild(rect);
      group.appendChild(text);
      
      svg.appendChild(group);
      this.element = group;
      return group;
    }
    
    // Update the resistor value
    setValue(value) {
      this.value = value;
      const text = this.element.querySelector("text");
      text.textContent = `${value}Ω`;
    }
  }
  
  class Capacitor extends CircuitComponent {
    constructor(x, y, value = '10µF') {
      super(x, y, value);
      this.type = 'capacitor';
    }
    
    render(svg) {
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("transform", `translate(${this.x},${this.y})`);
      
      // Capacitor plates
      const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line1.setAttribute("x1", "-5");
      line1.setAttribute("y1", "-20");
      line1.setAttribute("x2", "-5");
      line1.setAttribute("y2", "20");
      line1.setAttribute("stroke", "#666");
      line1.setAttribute("stroke-width", "3");
      
      const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line2.setAttribute("x1", "5");
      line2.setAttribute("y1", "-20");
      line2.setAttribute("x2", "5");
      line2.setAttribute("y2", "20");
      line2.setAttribute("stroke", "#666");
      line2.setAttribute("stroke-width", "3");
      
      // Value label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", "20");
      text.setAttribute("y", "0");
      text.setAttribute("dominant-baseline", "middle");
      text.setAttribute("font-size", "12");
      text.textContent = this.value;
      
      group.appendChild(line1);
      group.appendChild(line2);
      group.appendChild(text);
      
      svg.appendChild(group);
      this.element = group;
      return group;
    }
    
    // Update the capacitor value
    setValue(value) {
      this.value = value;
      const text = this.element.querySelector("text");
      text.textContent = `${value}µF`;
    }
  }
  
  class LED extends CircuitComponent {
    constructor(x, y) {
      super(x, y);
      this.type = 'led';
      this.brightness = 0.3; // Default dim
    }
    
    render(svg) {
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("transform", `translate(${this.x},${this.y})`);
      
      // LED glow effect (behind bulb)
      const glow = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      glow.setAttribute("cx", "0");
      glow.setAttribute("cy", "0");
      glow.setAttribute("r", "25");
      glow.setAttribute("fill", "#ffd700");
      glow.setAttribute("opacity", "0");
      glow.setAttribute("filter", "blur(8px)");
      
      // LED bulb
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", "0");
      circle.setAttribute("cy", "0");
      circle.setAttribute("r", "15");
      circle.setAttribute("fill", "#fffbe6");
      circle.setAttribute("stroke", "#666");
      circle.setAttribute("stroke-width", "2");
      circle.setAttribute("opacity", this.brightness);
      
      // LED symbol
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", "0");
      text.setAttribute("y", "0");
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "middle");
      text.setAttribute("font-size", "16");
      text.textContent = "💡";
      
      group.appendChild(glow);
      group.appendChild(circle);
      group.appendChild(text);
      
      svg.appendChild(group);
      this.element = group;
      return group;
    }
    
    // Update the LED brightness with glow effect
    setBrightness(value) {
      this.brightness = 0.3 + (value * 0.7); // Minimum brightness of 0.3
      const circle = this.element.querySelector("circle:nth-child(2)");
      const glow = this.element.querySelector("circle:first-child");
      
      // Update bulb opacity
      circle.setAttribute("opacity", this.brightness);
      
      // Update glow intensity based on brightness
      // Only show glow when brightness is significant
      const glowIntensity = value > 0.2 ? value * 0.8 : 0;
      glow.setAttribute("opacity", glowIntensity);
      glow.setAttribute("r", 15 + (value * 20)); // Glow radius increases with brightness
    }
  }
  
  // Create circuit diagrams
  function initializeCircuitDiagrams() {
    createSeriesCircuit();
    createParallelCircuit();
    createMixedCircuit();
    
    // Set up event handlers for sliders
    setupSliderEvents();
  }
  
  // Create series circuit
  function createSeriesCircuit() {
    const seriesSchematic = new CircuitSchematic("series-circuit-diagram");
    window.seriesSchematic = seriesSchematic; // Store for global access
    
    // Add components
    const battery = seriesSchematic.addComponent(new Battery(30, 150, "9V"));
    const resistor1 = seriesSchematic.addComponent(new Resistor(140, 150, "200Ω"));
    const resistor2 = seriesSchematic.addComponent(new Resistor(250, 150, "300Ω"));
    const capacitor = seriesSchematic.addComponent(new Capacitor(360, 150, "10µF"));
    const led = seriesSchematic.addComponent(new LED(450, 150));
    
    // Add wires
    const wire1 = seriesSchematic.addWire(40, 150, 100, 150);
    const wire2 = seriesSchematic.addWire(180, 150, 210, 150);
    const wire3 = seriesSchematic.addWire(290, 150, 340, 150);
    const wire4 = seriesSchematic.addWire(375, 150, 435, 150);
    const wire5 = seriesSchematic.addWire(465, 150, 520, 150);
    const wire6 = seriesSchematic.addWire(520, 150, 520, 80);
    const wire7 = seriesSchematic.addWire(520, 80, 30, 80);
    const wire8 = seriesSchematic.addWire(30, 80, 30, 120);
    
    // Add some electrons with different delays for natural flow
    for (let i = 0; i < 8; i++) {
      const wireIndex = i % 5; // Use first 5 wires for electrons
      let wire;
      
      switch(wireIndex) {
        case 0: wire = wire1; break;
        case 1: wire = wire2; break;
        case 2: wire = wire3; break;
        case 3: wire = wire4; break;
        case 4: wire = wire5; break;
      }
      
      seriesSchematic.addElectron(wire, i * 250, 2000); // Stagger timing
    }
    
    // Start animation
    seriesSchematic.start();
    
    // Calculate and update circuit values
    seriesSchematic.updateCircuit('series');
  }
  
  // Create parallel circuit
  function createParallelCircuit() {
    const parallelSchematic = new CircuitSchematic("parallel-circuit-diagram");
    window.parallelSchematic = parallelSchematic; // Store for global access
    
    // Add components
    const battery = parallelSchematic.addComponent(new Battery(30, 150, "9V"));
    const resistor1 = parallelSchematic.addComponent(new Resistor(250, 100, "200Ω"));
    const resistor2 = parallelSchematic.addComponent(new Resistor(250, 200, "300Ω"));
    const led = parallelSchematic.addComponent(new LED(450, 150));
    
    // Add junctions
    parallelSchematic.addJunction(150, 150);
    parallelSchematic.addJunction(350, 150);
    
    // Add wires
    const wire1 = parallelSchematic.addWire(40, 150, 150, 150);
    const wire2 = parallelSchematic.addWire(150, 150, 150, 100);
    const wire3 = parallelSchematic.addWire(150, 150, 150, 200);
    const wire4 = parallelSchematic.addWire(150, 100, 210, 100);
    const wire5 = parallelSchematic.addWire(290, 100, 350, 100);
    const wire6 = parallelSchematic.addWire(150, 200, 210, 200);
    const wire7 = parallelSchematic.addWire(290, 200, 350, 200);
    const wire8 = parallelSchematic.addWire(350, 100, 350, 150);
    const wire9 = parallelSchematic.addWire(350, 150, 350, 200);
    const wire10 = parallelSchematic.addWire(350, 150, 435, 150);
    const wire11 = parallelSchematic.addWire(465, 150, 520, 150);
    const wire12 = parallelSchematic.addWire(520, 150, 520, 80);
    const wire13 = parallelSchematic.addWire(520, 80, 30, 80);
    const wire14 = parallelSchematic.addWire(30, 80, 30, 120);
    
    // Add some electrons with different delays
    for (let i = 0; i < 12; i++) {
      // Distribute electrons across main path and branches
      let wire;
      if (i < 4) {
        wire = wire1; // Main input
      } else if (i < 6) {
        wire = wire4; // Top branch
      } else if (i < 8) {
        wire = wire6; // Bottom branch
      } else if (i < 10) {
        wire = wire10; // Output to LED
      } else {
        wire = wire11; // Return path
      }
      
      parallelSchematic.addElectron(wire, i * 200, 1800); // Stagger timing
    }
    
    // Start animation
    parallelSchematic.start();
    
    // Calculate and update circuit values
    parallelSchematic.updateCircuit('parallel');
  }
  
  // Create mixed circuit
  function createMixedCircuit() {
    const mixedSchematic = new CircuitSchematic("mixed-circuit-diagram");
    window.mixedSchematic = mixedSchematic; // Store for global access
    
    // Add components
    const battery = mixedSchematic.addComponent(new Battery(30, 150, "9V"));
    const resistor1 = mixedSchematic.addComponent(new Resistor(120, 150, "200Ω"));
    const resistor2 = mixedSchematic.addComponent(new Resistor(275, 100, "300Ω"));
    const resistor3 = mixedSchematic.addComponent(new Resistor(275, 200, "400Ω"));
    const led = mixedSchematic.addComponent(new LED(450, 150));
    
    // Add junctions
    mixedSchematic.addJunction(200, 150);
    mixedSchematic.addJunction(350, 150);
    
    // Add wires
    const wire1 = mixedSchematic.addWire(40, 150, 80, 150);
    const wire2 = mixedSchematic.addWire(160, 150, 200, 150);
    const wire3 = mixedSchematic.addWire(200, 150, 200, 100);
    const wire4 = mixedSchematic.addWire(200, 150, 200, 200);
    const wire5 = mixedSchematic.addWire(200, 100, 235, 100);
    const wire6 = mixedSchematic.addWire(315, 100, 350, 100);
    const wire7 = mixedSchematic.addWire(200, 200, 235, 200);
    const wire8 = mixedSchematic.addWire(315, 200, 350, 200);
    const wire9 = mixedSchematic.addWire(350, 100, 350, 150);
    const wire10 = mixedSchematic.addWire(350, 150, 350, 200);
    const wire11 = mixedSchematic.addWire(350, 150, 435, 150);
    const wire12 = mixedSchematic.addWire(465, 150, 520, 150);
    const wire13 = mixedSchematic.addWire(520, 150, 520, 80);
    const wire14 = mixedSchematic.addWire(520, 80, 30, 80);
    const wire15 = mixedSchematic.addWire(30, 80, 30, 120);
    
    // Add some electrons with different delays
    for (let i = 0; i < 15; i++) {
      // Distribute electrons across main path and branches
      let wire;
      if (i < 4) {
        wire = wire1; // Main input
      } else if (i < 6) {
        wire = wire2; // Series resistor output
      } else if (i < 8) {
        wire = wire5; // Top branch
      } else if (i < 10) {
        wire = wire7; // Bottom branch
      } else if (i < 12) {
        wire = wire11; // Output to LED
      } else {
        wire = wire12; // Return path
      }
      
      mixedSchematic.addElectron(wire, i * 180, 1600); // Stagger timing
    }
    
    // Start animation
    mixedSchematic.start();
    
    // Calculate and update circuit values
    mixedSchematic.updateCircuit('mixed');
  }
  
  // Set up slider event handlers
  function setupSliderEvents() {
    // Series circuit sliders
    document.getElementById('series-voltage').addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      document.getElementById('series-voltage-value').textContent = `${value}V`;
      window.seriesSchematic.voltageValue = value;
      window.seriesSchematic.updateCircuit('series');
    });
    
    document.querySelector('[data-component="resistor1"][data-circuit="series"]').addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      e.target.nextElementSibling.textContent = `${value}Ω`;
      window.seriesSchematic.resistor1Value = value;
      window.seriesSchematic.components.find(c => c.type === 'resistor').setValue(`${value}Ω`);
      window.seriesSchematic.updateCircuit('series');
    });
    
    document.querySelector('[data-component="resistor2"][data-circuit="series"]').addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      e.target.nextElementSibling.textContent = `${value}Ω`;
      window.seriesSchematic.resistor2Value = value;
      window.seriesSchematic.components.filter(c => c.type === 'resistor')[1].setValue(`${value}Ω`);
      window.seriesSchematic.updateCircuit('series');
    });
    
    document.querySelector('[data-component="capacitor"][data-circuit="series"]').addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      e.target.nextElementSibling.textContent = `${value}µF`;
      window.seriesSchematic.capacitorValue = value;
      window.seriesSchematic.components.find(c => c.type === 'capacitor').setValue(`${value}µF`);
      window.seriesSchematic.updateCircuit('series');
    });
    
    // Parallel circuit sliders
    document.getElementById('parallel-voltage').addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      document.getElementById('parallel-voltage-value').textContent = `${value}V`;
      window.parallelSchematic.voltageValue = value;
      window.parallelSchematic.updateCircuit('parallel');
    });
    
    document.querySelector('[data-component="resistor1"][data-circuit="parallel"]').addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      e.target.nextElementSibling.textContent = `${value}Ω`;
      window.parallelSchematic.resistor1Value = value;
      window.parallelSchematic.components.find(c => c.type === 'resistor').setValue(`${value}Ω`);
      window.parallelSchematic.updateCircuit('parallel');
    });
    
    document.querySelector('[data-component="resistor2"][data-circuit="parallel"]').addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      e.target.nextElementSibling.textContent = `${value}Ω`;
      window.parallelSchematic.resistor2Value = value;
      window.parallelSchematic.components.filter(c => c.type === 'resistor')[1].setValue(`${value}Ω`);
      window.parallelSchematic.updateCircuit('parallel');
    });
    
    // Mixed circuit sliders
    document.getElementById('mixed-voltage').addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      document.getElementById('mixed-voltage-value').textContent = `${value}V`;
      window.mixedSchematic.voltageValue = value;
      window.mixedSchematic.updateCircuit('mixed');
    });
    
    document.querySelector('[data-component="resistor1"][data-circuit="mixed"]').addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      e.target.nextElementSibling.textContent = `${value}Ω`;
      window.mixedSchematic.resistor1Value = value;
      window.mixedSchematic.components.find(c => c.type === 'resistor').setValue(`${value}Ω`);
      window.mixedSchematic.updateCircuit('mixed');
    });
    
    document.querySelector('[data-component="resistor2"][data-circuit="mixed"]').addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      e.target.nextElementSibling.textContent = `${value}Ω`;
      window.mixedSchematic.resistor2Value = value;
      window.mixedSchematic.components.filter(c => c.type === 'resistor')[1].setValue(`${value}Ω`);
      window.mixedSchematic.updateCircuit('mixed');
    });
    
    document.querySelector('[data-component="resistor3"][data-circuit="mixed"]').addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      e.target.nextElementSibling.textContent = `${value}Ω`;
      window.mixedSchematic.resistor3Value = value;
      window.mixedSchematic.components.filter(c => c.type === 'resistor')[2].setValue(`${value}Ω`);
      window.mixedSchematic.updateCircuit('mixed');
    });
  }
  
  // Handle tab switching
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
  
  // Init everything when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    initializeCircuitTabs();
    initializeCircuitDiagrams();
    createExampleCircuit();
  });
  
  // Create the example circuit for the "Reading Circuit Diagrams" section
  function createExampleCircuit() {
    const schematic = new CircuitSchematic("example-circuit");
    
    // Add components
    const battery = schematic.addComponent(new Battery(30, 150, "9V"));
    const switch1 = schematic.addComponent(new CircuitComponent(120, 150));
    switch1.render = (svg) => {
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("transform", `translate(${switch1.x},${switch1.y})`);
      
      // Switch lines
      const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line1.setAttribute("x1", "-20");
      line1.setAttribute("y1", "0");
      line1.setAttribute("x2", "0");
      line1.setAttribute("y2", "0");
      line1.setAttribute("stroke", "#666");
      line1.setAttribute("stroke-width", "3");
      
      const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line2.setAttribute("x1", "0");
      line2.setAttribute("y1", "0");
      line2.setAttribute("x2", "20");
      line2.setAttribute("y2", "-15");
      line2.setAttribute("stroke", "#666");
      line2.setAttribute("stroke-width", "3");
      
      const line3 = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line3.setAttribute("x1", "20");
      line3.setAttribute("y1", "0");
      line3.setAttribute("x2", "40");
      line3.setAttribute("y2", "0");
      line3.setAttribute("stroke", "#666");
      line3.setAttribute("stroke-width", "3");
      
      group.appendChild(line1);
      group.appendChild(line2);
      group.appendChild(line3);
      
      svg.appendChild(group);
      return group;
    };
    switch1.render(schematic.svg);
    
    const resistor = schematic.addComponent(new Resistor(210, 150, "220Ω"));
    const led = schematic.addComponent(new LED(300, 150));
    
    // Add wires
    const wire1 = schematic.addWire(60, 150, 100, 150);
    const wire2 = schematic.addWire(140, 150, 170, 150);
    const wire3 = schematic.addWire(250, 150, 285, 150);
    const wire4 = schematic.addWire(315, 150, 350, 150);
    const wire5 = schematic.addWire(350, 150, 350, 80);
    const wire6 = schematic.addWire(350, 80, 30, 80);
    const wire7 = schematic.addWire(30, 80, 30, 120);
    
    // Add electrons with different delays
    for (let i = 0; i < 6; i++) {
      const wireIndex = i % 4;
      let wire;
      
      switch(wireIndex) {
        case 0: wire = wire1; break;
        case 1: wire = wire2; break;
        case 2: wire = wire3; break;
        case 3: wire = wire4; break;
      }
      
      schematic.addElectron(wire, i * 300, 2000);
    }
    
    // Set LED brightness
    led.setBrightness(0.7);
    
    // Start animation
    schematic.start();
  }