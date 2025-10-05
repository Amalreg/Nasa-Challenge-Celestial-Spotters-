// ISS Experience Interactive Website
class ISSExperience {
    constructor() {
        this.currentSection = 'home';
        this.isDayTime = true;
        this.isTrainingActive = false;
        this.currentTrainingStep = 1;
        
        // NBL specific properties
        this.currentWeight = 0;
        this.currentFloaties = 0;
        this.buoyancyLevel = 'neutral';
        this.astronautPosition = 'floating';
        this.collectedRocks = 0;
        this.toolsUsed = 0;
        this.hatchOpen = false;
        this.handlesReached = 0;
        this.isOnLunarSurface = false;
        
        // Cupola 360 specific properties
        this.currentRotation = 0;
        this.isAutoRotating = false;
        this.autoRotateInterval = null;
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupCupolaControls();
        this.setupNBLControls();
        this.setupAnimations();
        this.startDataUpdates();
        this.loadNASAImages();
        this.setupNBLGameEvents();
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.section');
        const cards = document.querySelectorAll('.card');

        // Navigation button handlers
        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetSection = button.dataset.section;
                this.switchSection(targetSection);
            });
        });

        // Card click handlers
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const targetSection = card.dataset.section;
                this.switchSection(targetSection);
            });
        });
    }

    switchSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionName).classList.add('active');

        this.currentSection = sectionName;

        // Section-specific initialization
        if (sectionName === 'cupola') {
            this.initializeCupola();
        } else if (sectionName === 'nbl') {
            this.initializeNBL();
        }
    }

    setupCupolaControls() {
        // Setup video controls only
        this.setupVideoControls();
    }


    setupNBLControls() {
        // Weight and buoyancy controls
        const weightSlider = document.getElementById('weightSlider');
        const floatieSlider = document.getElementById('floatieSlider');
        
        if (weightSlider) {
            weightSlider.addEventListener('input', (e) => {
                this.currentWeight = parseInt(e.target.value);
                this.updateWeightDisplay();
                this.calculateBuoyancy();
            });
        }
        
        if (floatieSlider) {
            floatieSlider.addEventListener('input', (e) => {
                this.currentFloaties = parseInt(e.target.value);
                this.updateFloatieDisplay();
                this.calculateBuoyancy();
            });
        }

        // Task controls
        const startTrainingBtn = document.getElementById('startTraining');
        const enterHatchBtn = document.getElementById('enterHatch');
        const collectRocksBtn = document.getElementById('collectRocks');
        const useToolsBtn = document.getElementById('useTools');
        const navigateHandlesBtn = document.getElementById('navigateHandles');

        if (startTrainingBtn) {
            startTrainingBtn.addEventListener('click', () => {
                this.startTraining();
            });
        }

        if (enterHatchBtn) {
            enterHatchBtn.addEventListener('click', () => {
                this.enterHatch();
            });
        }

        if (collectRocksBtn) {
            collectRocksBtn.addEventListener('click', () => {
                this.collectRocks();
            });
        }

        if (useToolsBtn) {
            useToolsBtn.addEventListener('click', () => {
                this.useTools();
            });
        }

        if (navigateHandlesBtn) {
            navigateHandlesBtn.addEventListener('click', () => {
                this.navigateHandles();
            });
        }

        // Interactive elements
        const rockSamples = document.querySelectorAll('.rock-sample');
        rockSamples.forEach(rock => {
            rock.addEventListener('click', () => {
                this.collectRockSample(rock);
            });
        });

        const tools = document.querySelectorAll('.tool');
        tools.forEach(tool => {
            tool.addEventListener('click', () => {
                this.useTool(tool);
            });
        });

        const hatch = document.getElementById('hatch');
        if (hatch) {
            hatch.addEventListener('click', () => {
                this.toggleHatch();
            });
        }

        const handles = document.querySelectorAll('.handle');
        handles.forEach(handle => {
            handle.addEventListener('click', () => {
                this.reachHandle(handle);
            });
        });

        // Training step progression
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            step.addEventListener('click', () => {
                this.setTrainingStep(index + 1);
            });
        });
    }

    setupAnimations() {
        // Add floating animation to astronaut
        const astronaut = document.getElementById('astronaut');
        if (astronaut) {
            setInterval(() => {
                if (this.isTrainingActive) {
                    astronaut.classList.add('moving');
                    setTimeout(() => {
                        astronaut.classList.remove('moving');
                    }, 2000);
                }
            }, 5000);
        }

        // Add continuous bubble animation
        this.createBubbles();
    }

    createBubbles() {
        const bubblesContainer = document.querySelector('.bubbles');
        if (!bubblesContainer) return;

        setInterval(() => {
            const bubble = document.createElement('div');
            bubble.style.position = 'absolute';
            bubble.style.width = Math.random() * 10 + 5 + 'px';
            bubble.style.height = bubble.style.width;
            bubble.style.background = 'rgba(255, 255, 255, 0.6)';
            bubble.style.borderRadius = '50%';
            bubble.style.left = Math.random() * 100 + '%';
            bubble.style.bottom = '0';
            bubble.style.animation = 'bubble 4s linear forwards';
            
            bubblesContainer.appendChild(bubble);

            setTimeout(() => {
                bubble.remove();
            }, 4000);
        }, 1000);
    }

    initializeCupola() {
        // Initialize cupola video
        console.log('Cupola initialized with video');
    }

    initializeNBL() {
        // Initialize NBL game
        this.initializeNBLGame();
    }

    initializeNBLGame() {
        // NBL Game variables
        this.astronaut = null;
        this.userWeight = 70;
        this.buoyancy = 0;
        this.taskComplete = false;
        this.gameStarted = false;
        
        // Get canvas and context
        this.canvas = document.getElementById('gameCanvas');
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
        }
        
        // Reset game state
        this.resetGameState();
    }

    resetGameState() {
        this.taskComplete = false;
        this.gameStarted = false;
        const status = document.getElementById('status');
        if (status) {
            status.textContent = 'Click "Start Training" to begin!';
        }
    }


    setupVideoControls() {
        const nasaVideo = document.getElementById('nasaVideo');
        const youtubeVideo = document.getElementById('youtubeVideo');
        const nasaPlayPauseBtn = document.getElementById('nasaPlayPause');
        const nasaMuteToggleBtn = document.getElementById('nasaMuteToggle');
        
        // NASA Video Controls
        if (nasaVideo) {
            nasaVideo.addEventListener('loadeddata', () => {
                console.log('NASA video loaded successfully');
            });
            
            nasaVideo.addEventListener('error', (e) => {
                console.log('NASA video failed to load');
            });
        }
        
        // NASA Play/Pause button
        if (nasaPlayPauseBtn) {
            nasaPlayPauseBtn.addEventListener('click', () => {
                this.toggleNasaVideoPlayback();
            });
        }
        
        // NASA Mute/Unmute button
        if (nasaMuteToggleBtn) {
            nasaMuteToggleBtn.addEventListener('click', () => {
                this.toggleNasaVideoMute();
            });
        }
        
        // YouTube Video
        if (youtubeVideo) {
            console.log('YouTube video iframe ready');
        }
    }
    
    toggleNasaVideoPlayback() {
        const nasaVideo = document.getElementById('nasaVideo');
        const nasaPlayPauseBtn = document.getElementById('nasaPlayPause');
        
        if (nasaVideo) {
            if (nasaVideo.paused) {
                nasaVideo.play();
                if (nasaPlayPauseBtn) nasaPlayPauseBtn.textContent = '⏸️';
            } else {
                nasaVideo.pause();
                if (nasaPlayPauseBtn) nasaPlayPauseBtn.textContent = '▶️';
            }
        }
    }
    
    toggleNasaVideoMute() {
        const nasaVideo = document.getElementById('nasaVideo');
        const nasaMuteToggleBtn = document.getElementById('nasaMuteToggle');
        
        if (nasaVideo) {
            nasaVideo.muted = !nasaVideo.muted;
            if (nasaMuteToggleBtn) {
                nasaMuteToggleBtn.textContent = nasaVideo.muted ? '🔇' : '🔊';
            }
        }
    }




    startTraining() {
        this.isTrainingActive = !this.isTrainingActive;
        const astronaut = document.getElementById('astronaut');
        const startBtn = document.getElementById('startTraining');
        
        if (astronaut) {
            astronaut.classList.toggle('moving', this.isTrainingActive);
        }
        
        if (startBtn) {
            startBtn.textContent = this.isTrainingActive ? 'Stop Training' : 'Start Training';
            startBtn.classList.toggle('active', this.isTrainingActive);
        }
        
        if (this.isTrainingActive) {
            this.progressTrainingSteps();
        }
    }

    adjustBuoyancy() {
        const astronaut = document.getElementById('astronaut');
        const buoyancyBtn = document.getElementById('adjustBuoyancy');
        
        if (astronaut) {
            // Simulate buoyancy adjustment with rotation
            astronaut.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
            setTimeout(() => {
                astronaut.style.transform = 'rotate(0deg)';
            }, 1000);
        }
        
        if (buoyancyBtn) {
            buoyancyBtn.classList.add('active');
            setTimeout(() => {
                buoyancyBtn.classList.remove('active');
            }, 1000);
        }
    }

    showEquipment() {
        const equipmentItems = document.querySelectorAll('.equipment-item');
        const equipmentBtn = document.getElementById('showEquipment');
        
        equipmentItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.animation = 'fadeIn 0.5s ease-in';
                item.style.opacity = '1';
            }, index * 200);
        });
        
        if (equipmentBtn) {
            equipmentBtn.classList.toggle('active');
        }
    }

    setTrainingStep(step) {
        this.currentTrainingStep = step;
        this.updateTrainingDisplay();
    }

    updateTrainingDisplay() {
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            step.classList.toggle('active', index + 1 === this.currentTrainingStep);
        });
    }

    progressTrainingSteps() {
        if (!this.isTrainingActive) return;
        
        const steps = document.querySelectorAll('.step');
        let currentStep = 1;
        
        const progressInterval = setInterval(() => {
            if (!this.isTrainingActive) {
                clearInterval(progressInterval);
                return;
            }
            
            steps.forEach(step => step.classList.remove('active'));
            steps[currentStep - 1].classList.add('active');
            
            currentStep = currentStep >= steps.length ? 1 : currentStep + 1;
        }, 3000);
    }

    // NBL Weight and Buoyancy Methods
    updateWeightDisplay() {
        const weightValue = document.getElementById('weightValue');
        if (weightValue) {
            weightValue.textContent = `${this.currentWeight} kg`;
        }
    }

    updateFloatieDisplay() {
        const floatieValue = document.getElementById('floatieValue');
        if (floatieValue) {
            floatieValue.textContent = `${this.currentFloaties} floaties`;
        }
    }

    calculateBuoyancy() {
        const netWeight = this.currentWeight - (this.currentFloaties * 2); // Each floatie provides 2kg buoyancy
        
        if (netWeight > 10) {
            this.buoyancyLevel = 'sinking';
            this.astronautPosition = 'descending';
        } else if (netWeight < -5) {
            this.buoyancyLevel = 'floating';
            this.astronautPosition = 'ascending';
        } else {
            this.buoyancyLevel = 'neutral';
            this.astronautPosition = 'floating';
        }
        
        this.updateBuoyancyDisplay();
        this.updateAstronautPosition();
    }

    updateBuoyancyDisplay() {
        const buoyancyValue = document.getElementById('buoyancyValue');
        if (buoyancyValue) {
            buoyancyValue.textContent = this.buoyancyLevel.charAt(0).toUpperCase() + this.buoyancyLevel.slice(1);
            
            // Update color based on buoyancy level
            const buoyancyStatus = document.getElementById('buoyancyStatus');
            if (buoyancyStatus) {
                buoyancyStatus.className = 'buoyancy-status';
                if (this.buoyancyLevel === 'sinking') {
                    buoyancyStatus.classList.add('sinking');
                } else if (this.buoyancyLevel === 'floating') {
                    buoyancyStatus.classList.add('floating');
                } else {
                    buoyancyStatus.classList.add('neutral');
                }
            }
        }
    }

    updateAstronautPosition() {
        const astronaut = document.getElementById('astronaut');
        if (!astronaut) return;
        
        // Remove existing position classes
        astronaut.classList.remove('descending', 'ascending', 'moving');
        
        if (this.astronautPosition === 'descending') {
            astronaut.classList.add('descending');
            this.isOnLunarSurface = true;
            this.updateObjectives();
        } else if (this.astronautPosition === 'ascending') {
            astronaut.classList.add('ascending');
            this.isOnLunarSurface = false;
        } else {
            astronaut.classList.add('moving');
        }
    }

    resetAstronautPosition() {
        const astronaut = document.getElementById('astronaut');
        if (astronaut) {
            astronaut.classList.remove('descending', 'ascending', 'moving');
            astronaut.style.top = '30%';
        }
    }

    // NBL Task Methods
    enterHatch() {
        const hatch = document.getElementById('hatch');
        if (hatch) {
            this.hatchOpen = !this.hatchOpen;
            hatch.classList.toggle('open', this.hatchOpen);
            hatch.textContent = this.hatchOpen ? '🚪' : '🚪';
            
            // Show feedback
            this.showTaskFeedback('Hatch ' + (this.hatchOpen ? 'opened' : 'closed') + ' successfully!');
        }
    }

    toggleHatch() {
        this.enterHatch();
    }

    collectRocks() {
        if (!this.isOnLunarSurface) {
            this.showTaskFeedback('You need to descend to the lunar surface first!');
            return;
        }
        
        const rocks = document.querySelectorAll('.rock-sample:not(.collected)');
        if (rocks.length > 0) {
            const rock = rocks[0];
            this.collectRockSample(rock);
        } else {
            this.showTaskFeedback('All rock samples have been collected!');
        }
    }

    collectRockSample(rock) {
        if (!this.isOnLunarSurface) {
            this.showTaskFeedback('You need to descend to the lunar surface first!');
            return;
        }
        
        if (rock.dataset.collected === 'false') {
            rock.dataset.collected = 'true';
            rock.classList.add('collected');
            this.collectedRocks++;
            this.updateObjectives();
            this.showTaskFeedback(`Rock sample collected! (${this.collectedRocks}/3)`);
        }
    }

    useTools() {
        if (!this.isOnLunarSurface) {
            this.showTaskFeedback('You need to descend to the lunar surface first!');
            return;
        }
        
        const tools = document.querySelectorAll('.tool:not(.used)');
        if (tools.length > 0) {
            const tool = tools[0];
            this.useTool(tool);
        } else {
            this.showTaskFeedback('All tools have been used!');
        }
    }

    useTool(tool) {
        if (!this.isOnLunarSurface) {
            this.showTaskFeedback('You need to descend to the lunar surface first!');
            return;
        }
        
        if (!tool.classList.contains('used')) {
            tool.classList.add('used');
            this.toolsUsed++;
            this.updateObjectives();
            this.showTaskFeedback(`Tool used: ${tool.dataset.tool}!`);
        }
    }

    navigateHandles() {
        const handles = document.querySelectorAll('.handle:not(.reached)');
        if (handles.length > 0) {
            const handle = handles[0];
            this.reachHandle(handle);
        } else {
            this.showTaskFeedback('All handles have been reached!');
        }
    }

    reachHandle(handle) {
        if (!handle.classList.contains('reached')) {
            handle.classList.add('reached');
            this.handlesReached++;
            this.showTaskFeedback(`Handle ${handle.dataset.handle} reached!`);
        }
    }

    updateObjectives() {
        // Update descend objective
        const descendStatus = document.getElementById('descendStatus');
        if (descendStatus) {
            descendStatus.textContent = this.isOnLunarSurface ? '✅' : '❌';
        }
        
        // Update rocks objective
        const rocksStatus = document.getElementById('rocksStatus');
        if (rocksStatus) {
            rocksStatus.textContent = `${this.collectedRocks}/3`;
            if (this.collectedRocks >= 3) {
                rocksStatus.textContent = '✅';
            }
        }
        
        // Update tools objective
        const toolsStatus = document.getElementById('toolsStatus');
        if (toolsStatus) {
            toolsStatus.textContent = this.toolsUsed > 0 ? '✅' : '❌';
        }
    }

    showTaskFeedback(message) {
        // Create or update feedback element
        let feedback = document.getElementById('taskFeedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.id = 'taskFeedback';
            feedback.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 212, 255, 0.9);
                color: #000;
                padding: 1rem 2rem;
                border-radius: 10px;
                font-family: 'Orbitron', monospace;
                font-weight: bold;
                z-index: 10000;
                pointer-events: none;
            `;
            document.body.appendChild(feedback);
        }
        
        feedback.textContent = message;
        feedback.style.display = 'block';
        
        // Hide after 3 seconds
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 3000);
    }

    // Enhanced NBL Game Methods
    startGame() {
        const userWeightInput = document.getElementById('userWeight');
        if (userWeightInput) {
            this.userWeight = parseInt(userWeightInput.value) || 70;
        }
        
        // Initialize game state
        this.buoyancy = 0;
        this.astronaut = { 
            x: 100, 
            y: 250, 
            size: 30, // Increased size for human shape
            vx: 0,
            vy: 0,
            oxygen: 100,
            maxOxygen: 100,
            targetBuoyancy: 0, // For smooth buoyancy transitions
            currentBuoyancy: 0
        };
        this.gameStarted = true;
        this.gameTime = 0;
        this.score = 0;
        this.samplesCollected = 0;
        this.toolsUsed = 0;
        this.repairStationReached = false;
        this.gameStartTime = Date.now();
        
        // Initialize game objects
        this.initializeGameObjects();
        this.startGameLoop();
        this.updateStatus('Game started! Adjust your buoyancy to move freely.', 'success');
    }

    initializeGameObjects() {
        // Space samples (collectibles)
        this.samples = [
            { x: 200, y: 150, size: 15, collected: false, id: 1 },
            { x: 400, y: 100, size: 15, collected: false, id: 2 },
            { x: 600, y: 300, size: 15, collected: false, id: 3 }
        ];
        
        // Tools
        this.tools = [
            { x: 300, y: 400, size: 20, used: false, id: 1 },
            { x: 500, y: 350, size: 20, used: false, id: 2 }
        ];
        
        // Repair station
        this.repairStation = { x: 700, y: 200, width: 60, height: 60 };
        
        // Obstacles
        this.obstacles = [
            { x: 250, y: 200, width: 30, height: 30 },
            { x: 450, y: 250, width: 30, height: 30 },
            { x: 350, y: 150, width: 30, height: 30 }
        ];
        
        // Bubbles for visual effect
        this.bubbles = [];
        for (let i = 0; i < 20; i++) {
            this.bubbles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 8 + 2,
                speed: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }

    addWeight() {
        if (!this.gameStarted) return;
        this.astronaut.targetBuoyancy += 5; // Positive = more weight = sinks more
        this.updateBuoyancyDisplay();
        this.updateStatus(`Weight added! Target buoyancy: ${this.astronaut.targetBuoyancy}`);
    }

    addFloat() {
        if (!this.gameStarted) return;
        this.astronaut.targetBuoyancy -= 5; // Negative = more float = floats more
        this.updateBuoyancyDisplay();
        this.updateStatus(`Floatie added! Target buoyancy: ${this.astronaut.targetBuoyancy}`);
    }

    resetBuoyancy() {
        if (!this.gameStarted) return;
        this.astronaut.targetBuoyancy = 0;
        this.updateBuoyancyDisplay();
        this.updateStatus('Buoyancy reset to neutral!');
    }

    updateBuoyancyDisplay() {
        const buoyancyDisplay = document.getElementById('buoyancyDisplay');
        if (buoyancyDisplay) {
            buoyancyDisplay.textContent = this.buoyancy;
            
            // Color code the buoyancy
        if (this.buoyancy > 20) {
                buoyancyDisplay.style.color = '#ff6b6b'; // Red for too floaty
        } else if (this.buoyancy < -20) {
                buoyancyDisplay.style.color = '#ff6b6b'; // Red for too heavy
            } else {
                buoyancyDisplay.style.color = '#00d4ff'; // Blue for good
            }
        }
    }

    updateStatus(message, type = 'info') {
        const status = document.getElementById('status');
        if (status) {
            status.textContent = message;
            status.className = 'game-status';
            
            // Add type-specific styling
            if (type === 'success') {
                status.classList.add('success');
            } else if (type === 'error') {
                status.classList.add('error');
            }
            
            // Remove styling after animation
            setTimeout(() => {
                status.classList.remove('success', 'error');
            }, 2000);
        }
    }

    startGameLoop() {
        if (!this.gameStarted) return;
        
        this.gameLoop = setInterval(() => {
            this.updateGame();
            this.draw();
        }, 1000 / 60); // 60 FPS
    }

    updateGame() {
        if (!this.gameStarted) return;
        
        // Update game time
        this.gameTime = Math.floor((Date.now() - this.gameStartTime) / 1000);
        this.updateTimeDisplay();
        
        // Update astronaut physics
        this.updateAstronautPhysics();
        
        // Update bubbles
        this.updateBubbles();
        
        // Check collisions
        this.checkCollisions();
        
        // Update oxygen
        this.updateOxygen();
        
        // Check game over conditions
        this.checkGameOver();
    }

    updateAstronautPhysics() {
        if (!this.astronaut) return;
        
        // Gradually transition current buoyancy to target buoyancy
        const buoyancyTransitionSpeed = 0.05; // Slower transition
        this.astronaut.currentBuoyancy += (this.astronaut.targetBuoyancy - this.astronaut.currentBuoyancy) * buoyancyTransitionSpeed;
        this.buoyancy = this.astronaut.currentBuoyancy;
        
        // Apply buoyancy force (smoother) - positive buoyancy = floats up, negative = sinks down
        const buoyancyForce = -this.buoyancy * 0.08; // Inverted: positive buoyancy pushes up, negative pulls down
        this.astronaut.vy += buoyancyForce;
        
        // Apply gravity (reduced in water)
        this.astronaut.vy += 0.15; // Reduced gravity for smoother movement
        
        // Apply drag (increased for more realistic water resistance)
        this.astronaut.vx *= 0.92;
        this.astronaut.vy *= 0.92;
        
        // Update position
        this.astronaut.x += this.astronaut.vx;
        this.astronaut.y += this.astronaut.vy;
        
        // Keep astronaut in bounds (adjusted for human shape)
        const margin = this.astronaut.size + 10;
        this.astronaut.x = Math.max(margin, Math.min(this.canvas.width - margin, this.astronaut.x));
        this.astronaut.y = Math.max(margin, Math.min(this.canvas.height - margin, this.astronaut.y));
    }

    updateBubbles() {
        this.bubbles.forEach(bubble => {
            bubble.y -= bubble.speed;
            bubble.x += Math.sin(Date.now() * 0.001 + bubble.x) * 0.5;
            
            if (bubble.y < -bubble.size) {
                bubble.y = this.canvas.height + bubble.size;
                bubble.x = Math.random() * this.canvas.width;
            }
        });
    }

    checkCollisions() {
        // Check sample collection
        this.samples.forEach(sample => {
            if (!sample.collected) {
                const distance = Math.sqrt(
                    Math.pow(this.astronaut.x - sample.x, 2) + 
                    Math.pow(this.astronaut.y - sample.y, 2)
                );
                
                if (distance < this.astronaut.size + sample.size) {
                    sample.collected = true;
                    this.samplesCollected++;
                    this.score += 100;
                    this.updateScoreDisplay();
                    this.updateObjectives();
                    this.updateStatus(`Sample collected! (${this.samplesCollected}/3)`, 'success');
                }
            }
        });
        
        // Check tool usage
        this.tools.forEach(tool => {
            if (!tool.used) {
                const distance = Math.sqrt(
                    Math.pow(this.astronaut.x - tool.x, 2) + 
                    Math.pow(this.astronaut.y - tool.y, 2)
                );
                
                if (distance < this.astronaut.size + tool.size) {
                    tool.used = true;
                    this.toolsUsed++;
                    this.score += 150;
                    this.updateScoreDisplay();
                    this.updateObjectives();
                    this.updateStatus(`Tool used! (${this.toolsUsed}/2)`, 'success');
                }
            }
        });
        
        // Check repair station
        if (!this.repairStationReached) {
            const distance = Math.sqrt(
                Math.pow(this.astronaut.x - (this.repairStation.x + this.repairStation.width/2), 2) + 
                Math.pow(this.astronaut.y - (this.repairStation.y + this.repairStation.height/2), 2)
            );
            
            if (distance < this.astronaut.size + 30) {
                this.repairStationReached = true;
                this.score += 500;
                this.updateScoreDisplay();
                this.updateObjectives();
                this.updateStatus('🎉 Mission Complete! You reached the repair station!', 'success');
                this.completeMission();
            }
        }
        
        // Check obstacle collisions
        this.obstacles.forEach(obstacle => {
            if (this.astronaut.x < obstacle.x + obstacle.width &&
                this.astronaut.x + this.astronaut.size > obstacle.x &&
                this.astronaut.y < obstacle.y + obstacle.height &&
                this.astronaut.y + this.astronaut.size > obstacle.y) {
                
                // Bounce off obstacle
                this.astronaut.vx *= -0.5;
                this.astronaut.vy *= -0.5;
                this.astronaut.oxygen -= 5;
            }
        });
    }

    updateOxygen() {
        // Oxygen depletes over 30 seconds (100 oxygen / 30 seconds = 3.33 per second)
        // At 60 FPS: 3.33 / 60 = 0.0555 per frame
        this.astronaut.oxygen -= 0.0555;
        if (this.astronaut.oxygen < 0) {
            this.astronaut.oxygen = 0;
        }
    }

    checkGameOver() {
        if (this.astronaut.oxygen <= 0) {
            this.gameOver('Oxygen depleted! Mission failed.');
        }
    }

    completeMission() {
        setTimeout(() => {
            this.gameOver('Mission completed successfully!', true);
        }, 2000);
    }

    gameOver(message, success = false) {
        this.gameStarted = false;
        clearInterval(this.gameLoop);
        
            const status = document.getElementById('status');
            if (status) {
            status.textContent = message;
            status.style.color = success ? '#00ff00' : '#ff6b6b';
        }
        
        // Show final score
        setTimeout(() => {
            alert(`${message}\n\nFinal Score: ${this.score}\nTime: ${this.formatTime(this.gameTime)}\nSamples: ${this.samplesCollected}/3\nTools: ${this.toolsUsed}/2`);
        }, 1000);
    }

    moveAstronaut(e) {
        if (!this.gameStarted || !this.astronaut) return;
        
        // Only allow movement if buoyancy is within acceptable range (now positive = heavy, negative = light)
        if (this.buoyancy >= -20 && this.buoyancy <= 20) {
            const moveSpeed = 2.5; // Reduced for smoother movement
            
            switch(e.key) {
                case 'ArrowRight':
                    this.astronaut.vx += moveSpeed;
                    break;
                case 'ArrowLeft':
                    this.astronaut.vx -= moveSpeed;
                    break;
                case 'ArrowUp':
                    this.astronaut.vy -= moveSpeed;
                    break;
                case 'ArrowDown':
                    this.astronaut.vy += moveSpeed;
                    break;
                case 'r':
                case 'R':
                    this.restartGame();
                    break;
            }
        } else {
            this.updateStatus('Adjust buoyancy to move! (Keep between -20 and +20)', 'error');
        }
        
        // Handle buoyancy controls (always available, regardless of movement state)
        switch(e.key.toLowerCase()) {
            case 'f':
                e.preventDefault(); // Prevent default browser behavior
                this.addWeight();
                break;
            case 'w':
                e.preventDefault(); // Prevent default browser behavior
                this.addFloat();
                break;
            case 'q':
                e.preventDefault(); // Prevent default browser behavior
                this.resetBuoyancy();
                break;
        }
    }

    restartGame() {
        this.gameStarted = false;
        clearInterval(this.gameLoop);
        this.startGame();
    }

    updateScoreDisplay() {
        const scoreDisplay = document.getElementById('scoreDisplay');
        if (scoreDisplay) {
            scoreDisplay.textContent = this.score;
        }
    }

    updateTimeDisplay() {
        const timeDisplay = document.getElementById('timeDisplay');
        if (timeDisplay) {
            timeDisplay.textContent = this.formatTime(this.gameTime);
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    updateObjectives() {
        // Update samples status
        const samplesStatus = document.getElementById('samplesStatus');
        if (samplesStatus) {
            if (this.samplesCollected >= 3) {
                samplesStatus.textContent = '✅';
                this.addObjectiveCompleteEffect(samplesStatus);
            } else {
                samplesStatus.textContent = `${this.samplesCollected}/3`;
            }
        }
        
        // Update tools status
        const toolsStatus = document.getElementById('toolsStatus');
        if (toolsStatus) {
            if (this.toolsUsed >= 2) {
                toolsStatus.textContent = '✅';
                this.addObjectiveCompleteEffect(toolsStatus);
            } else {
                toolsStatus.textContent = `${this.toolsUsed}/2`;
            }
        }
        
        // Update repair status
        const repairStatus = document.getElementById('repairStatus');
        if (repairStatus) {
            if (this.repairStationReached) {
                repairStatus.textContent = '✅';
                this.addObjectiveCompleteEffect(repairStatus);
            } else {
                repairStatus.textContent = '❌';
            }
        }
    }

    addObjectiveCompleteEffect(element) {
        // Add visual effect when objective is completed
        element.classList.add('success');
        setTimeout(() => {
            element.classList.remove('success');
        }, 1000);
        
        // Create particle effect
        this.createParticleEffect(element);
    }

    createParticleEffect(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.animationDelay = (i * 0.1) + 's';
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 3000);
        }
    }

    draw() {
        if (!this.ctx || !this.gameStarted) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        this.drawBackground();
        
        // Draw bubbles
        this.drawBubbles();
        
        // Draw obstacles
        this.drawObstacles();
        
        // Draw samples
        this.drawSamples();
        
        // Draw tools
        this.drawTools();
        
        // Draw repair station
        this.drawRepairStation();
        
        // Draw astronaut
        this.drawAstronaut();
        
        // Draw UI
        this.drawUI();
    }

    drawBackground() {
        // Water gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#001122');
        gradient.addColorStop(0.3, '#003366');
        gradient.addColorStop(1, '#001a33');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Add some water texture
        this.ctx.fillStyle = 'rgba(0, 150, 255, 0.1)';
        for (let i = 0; i < 50; i++) {
            this.ctx.beginPath();
            this.ctx.arc(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                Math.random() * 3 + 1,
                0, Math.PI * 2
            );
            this.ctx.fill();
        }
    }

    drawBubbles() {
        this.bubbles.forEach(bubble => {
            this.ctx.save();
            this.ctx.globalAlpha = bubble.opacity;
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            this.ctx.beginPath();
            this.ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    drawObstacles() {
        this.obstacles.forEach(obstacle => {
            this.ctx.fillStyle = '#666';
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            this.ctx.strokeStyle = '#999';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }

    drawSamples() {
        this.samples.forEach(sample => {
            if (!sample.collected) {
                this.ctx.fillStyle = '#00d4ff';
                this.ctx.beginPath();
                this.ctx.arc(sample.x, sample.y, sample.size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                
                // Add glow effect
                this.ctx.shadowColor = '#00d4ff';
                this.ctx.shadowBlur = 10;
                this.ctx.beginPath();
                this.ctx.arc(sample.x, sample.y, sample.size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            }
        });
    }

    drawTools() {
        this.tools.forEach(tool => {
            if (!tool.used) {
                this.ctx.fillStyle = '#ffd700';
                this.ctx.fillRect(tool.x - tool.size/2, tool.y - tool.size/2, tool.size, tool.size);
                this.ctx.strokeStyle = '#ffaa00';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(tool.x - tool.size/2, tool.y - tool.size/2, tool.size, tool.size);
                
                // Add glow effect
                this.ctx.shadowColor = '#ffd700';
                this.ctx.shadowBlur = 10;
                this.ctx.fillRect(tool.x - tool.size/2, tool.y - tool.size/2, tool.size, tool.size);
                this.ctx.shadowBlur = 0;
            }
        });
    }

    drawRepairStation() {
        this.ctx.fillStyle = this.repairStationReached ? '#00ff00' : '#ff4444';
        this.ctx.fillRect(this.repairStation.x, this.repairStation.y, this.repairStation.width, this.repairStation.height);
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(this.repairStation.x, this.repairStation.y, this.repairStation.width, this.repairStation.height);
        
        // Add station details
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('REPAIR', this.repairStation.x + this.repairStation.width/2, this.repairStation.y + this.repairStation.height/2 - 5);
        this.ctx.fillText('STATION', this.repairStation.x + this.repairStation.width/2, this.repairStation.y + this.repairStation.height/2 + 10);
    }

    drawAstronaut() {
        if (!this.astronaut) return;
        
        this.ctx.save();
        this.ctx.translate(this.astronaut.x, this.astronaut.y);
        
        // Astronaut helmet (outer)
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(0, -8, 18, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#00d4ff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Helmet reflection
        this.ctx.fillStyle = 'rgba(0, 212, 255, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(-5, -12, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Astronaut face
        this.ctx.fillStyle = '#ffdbac';
        this.ctx.beginPath();
        this.ctx.arc(0, -8, 12, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Eyes
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(-4, -10, 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(4, -10, 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Nose
        this.ctx.fillStyle = '#e6c29a';
        this.ctx.beginPath();
        this.ctx.arc(0, -6, 1.5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Mouth
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(0, -2, 3, 0, Math.PI);
        this.ctx.stroke();
        
        // Body (torso)
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(-12, 8, 24, 20);
        this.ctx.strokeStyle = '#00d4ff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(-12, 8, 24, 20);
        
        // Body details
        this.ctx.fillStyle = '#cccccc';
        this.ctx.fillRect(-8, 12, 16, 8);
        this.ctx.fillRect(-6, 20, 12, 4);
        
        // Arms
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(-20, 10, 8, 16);
        this.ctx.fillRect(12, 10, 8, 16);
        this.ctx.strokeStyle = '#00d4ff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(-20, 10, 8, 16);
        this.ctx.strokeRect(12, 10, 8, 16);
        
        // Hands
        this.ctx.fillStyle = '#ffdbac';
        this.ctx.beginPath();
        this.ctx.arc(-16, 28, 4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(16, 28, 4, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Legs
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(-10, 28, 8, 20);
        this.ctx.fillRect(2, 28, 8, 20);
        this.ctx.strokeStyle = '#00d4ff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(-10, 28, 8, 20);
        this.ctx.strokeRect(2, 28, 8, 20);
        
        // Feet
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(-12, 48, 12, 6);
        this.ctx.fillRect(0, 48, 12, 6);
        
        // Backpack
        this.ctx.fillStyle = '#666';
        this.ctx.fillRect(-8, 8, 16, 20);
        this.ctx.strokeStyle = '#999';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(-8, 8, 16, 20);
        
        // Backpack details
        this.ctx.fillStyle = '#00d4ff';
        this.ctx.fillRect(-6, 12, 4, 4);
        this.ctx.fillRect(2, 12, 4, 4);
        this.ctx.fillRect(-6, 18, 4, 4);
        this.ctx.fillRect(2, 18, 4, 4);
        
        this.ctx.restore();
        
        // Oxygen indicator
        const oxygenBarWidth = 50;
        const oxygenBarHeight = 8;
        const oxygenX = this.astronaut.x - oxygenBarWidth/2;
        const oxygenY = this.astronaut.y - 35;
        
        // Background
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(oxygenX, oxygenY, oxygenBarWidth, oxygenBarHeight);
        
        // Oxygen level
        const oxygenPercent = this.astronaut.oxygen / this.astronaut.maxOxygen;
        this.ctx.fillStyle = oxygenPercent > 0.3 ? '#00ff00' : oxygenPercent > 0.1 ? '#ffff00' : '#ff0000';
        this.ctx.fillRect(oxygenX, oxygenY, oxygenBarWidth * oxygenPercent, oxygenBarHeight);
        
        // Border
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(oxygenX, oxygenY, oxygenBarWidth, oxygenBarHeight);
        
        // Oxygen label
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('O2', this.astronaut.x, oxygenY - 5);
    }

    drawUI() {
        // Buoyancy indicator
        const buoyancyX = 20;
        const buoyancyY = 20;
        const buoyancyWidth = 200;
        const buoyancyHeight = 20;
        
        // Background
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(buoyancyX, buoyancyY, buoyancyWidth, buoyancyHeight);
        
        // Buoyancy level
        const buoyancyPercent = (this.buoyancy + 50) / 100; // Convert -50 to +50 range to 0-1
        const buoyancyColor = this.buoyancy > 20 ? '#ff6b6b' : this.buoyancy < -20 ? '#ff6b6b' : '#00d4ff';
        this.ctx.fillStyle = buoyancyColor;
        this.ctx.fillRect(buoyancyX, buoyancyY, buoyancyWidth * buoyancyPercent, buoyancyHeight);
        
        // Border
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(buoyancyX, buoyancyY, buoyancyWidth, buoyancyHeight);
        
        // Label
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Buoyancy', buoyancyX, buoyancyY - 5);
    }

    setupNBLGameEvents() {
        // Add keyboard event listener for astronaut movement
        document.addEventListener('keydown', (e) => {
            this.moveAstronaut(e);
        });
        
        // Make game functions global so they can be called from HTML onclick
        window.startGame = () => this.startGame();
        window.addWeight = () => this.addWeight();
        window.addFloat = () => this.addFloat();
        window.resetBuoyancy = () => this.resetBuoyancy();
    }

    startDataUpdates() {
        // Simulate real-time ISS data updates
        setInterval(() => {
            this.updateISSData();
        }, 5000);
    }

    updateISSData() {
        // Simulate altitude changes
        const altitudeElement = document.getElementById('altitude');
        if (altitudeElement) {
            const baseAltitude = 408;
            const variation = (Math.random() - 0.5) * 10;
            altitudeElement.textContent = `${(baseAltitude + variation).toFixed(0)} km`;
        }

        // Simulate speed changes
        const speedElement = document.getElementById('speed');
        if (speedElement) {
            const baseSpeed = 28000;
            const variation = (Math.random() - 0.5) * 100;
            speedElement.textContent = `${(baseSpeed + variation).toFixed(0)} km/h`;
        }

        // Simulate orbit time
        const orbitTimeElement = document.getElementById('orbitTime');
        if (orbitTimeElement) {
            const baseTime = 90;
            const variation = (Math.random() - 0.5) * 2;
            orbitTimeElement.textContent = `${(baseTime + variation).toFixed(0)} minutes`;
        }
    }

    loadNASAImages() {
        // This would typically load real NASA images
        // For demo purposes, we'll simulate the loading
        console.log('Loading NASA imagery assets...');
        
        // Simulate loading NASA Earth images
        setTimeout(() => {
            this.addNASAImageCredits();
        }, 2000);
    }

    addNASAImageCredits() {
        // Add NASA image credits to the page
        const credits = document.createElement('div');
        credits.className = 'nasa-credits';
        credits.innerHTML = `
            <div style="position: fixed; bottom: 10px; right: 10px; background: rgba(0,0,0,0.8); padding: 10px; border-radius: 5px; font-size: 12px; color: #ccc;">
                Images courtesy of NASA
            </div>
        `;
        document.body.appendChild(credits);
    }

    // Educational content methods
    showEducationalContent(topic) {
        const content = this.getEducationalContent(topic);
        this.displayModal(content);
    }

    getEducationalContent(topic) {
        const content = {
            cupola: {
                title: "The Cupola: Earth's Window",
                description: "The Cupola is a 360-degree observation deck on the International Space Station that provides astronauts with an unobstructed view of Earth. It serves as both a scientific observation platform and a psychological benefit for crew members.",
                benefits: [
                    "Earth observation and photography",
                    "Weather pattern monitoring",
                    "Aurora observation",
                    "Psychological well-being for astronauts",
                    "Scientific research platform"
                ]
            },
            nbl: {
                title: "Neutral Buoyancy Laboratory Training",
                description: "The NBL is a massive pool where astronauts train for spacewalks in a weightless environment. The 6.2 million gallon pool contains a full-scale replica of the ISS modules.",
                benefits: [
                    "Realistic spacewalk training",
                    "Equipment familiarization",
                    "Procedure practice",
                    "Team coordination",
                    "Emergency response training"
                ]
            }
        };
        
        return content[topic] || content.cupola;
    }

    displayModal(content) {
        // Create and display educational modal
        const modal = document.createElement('div');
        modal.className = 'educational-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>${content.title}</h2>
                <p>${content.description}</p>
                <ul>
                    ${content.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                </ul>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        modal.querySelector('.modal-content').style.cssText = `
            background: #1a1a2e;
            padding: 2rem;
            border-radius: 15px;
            border: 2px solid #00d4ff;
            max-width: 500px;
            position: relative;
        `;
        
        modal.querySelector('.close-modal').style.cssText = `
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            cursor: pointer;
            color: #00d4ff;
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}

// Touch screen support for mobile devices
class TouchSupport {
    constructor() {
        this.setupTouchEvents();
    }

    setupTouchEvents() {
        // Add touch event listeners for mobile interaction
        document.addEventListener('touchstart', this.handleTouchStart.bind(this));
        document.addEventListener('touchmove', this.handleTouchMove.bind(this));
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }

    handleTouchStart(e) {
        // Handle touch start events
        const target = e.target;
        if (target.classList.contains('card') || target.classList.contains('nav-btn')) {
            target.style.transform = 'scale(0.95)';
        }
    }

    handleTouchMove(e) {
        // Handle touch move events
        e.preventDefault();
    }

    handleTouchEnd(e) {
        // Handle touch end events
        const target = e.target;
        if (target.classList.contains('card') || target.classList.contains('nav-btn')) {
            target.style.transform = 'scale(1)';
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const issExperience = new ISSExperience();
    const touchSupport = new TouchSupport();
    
    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close any open modals
            const modals = document.querySelectorAll('.educational-modal');
            modals.forEach(modal => modal.remove());
        }
    });
    
    // Add accessibility features
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            // Ensure proper tab navigation
            const focusableElements = document.querySelectorAll('button, [tabindex]');
            const focusedElement = document.activeElement;
            const focusedIndex = Array.from(focusableElements).indexOf(focusedElement);
            
            if (e.shiftKey) {
                // Shift + Tab (backward)
                if (focusedIndex === 0) {
                    focusableElements[focusableElements.length - 1].focus();
                }
            } else {
                // Tab (forward)
                if (focusedIndex === focusableElements.length - 1) {
                    focusableElements[0].focus();
                }
            }
        }
    });
    
    console.log('ISS Experience application initialized successfully!');
});

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}


