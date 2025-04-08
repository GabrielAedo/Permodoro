        // Variables
        let timer;
        let isRunning = false;
        let isWorkTime = true;
        let minutes = 25;
        let seconds = 0;
        const workDuration = 25;
        const breakDuration = 5;

        // Elementos del DOM
        const timeDisplay = document.getElementById('time-display');
        const modeDisplay = document.getElementById('current-mode');
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const stopBtn = document.getElementById('stopBtn');
        const skipBtn = document.getElementById('skipBtn');

        // Funciones
        function updateDisplay() {
            timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            modeDisplay.textContent = isWorkTime ? 'Trabajo' : 'Descanso';
            document.body.style.backgroundColor = isWorkTime ? 'rgba(255, 0, 0, 0.582)' : 'rgba(0, 128, 0, 0.582)';
        }

        function startTimer() {
            if (!isRunning) {
                isRunning = true;
                timer = setInterval(() => {
                    if (seconds === 0) {
                        if (minutes === 0) {
                            switchMode();
                            return;
                        }
                        minutes--;
                        seconds = 59;
                    } else {
                        seconds--;
                    }
                    updateDisplay();
                }, 1000);
            }
        }

        function pauseTimer() {
            clearInterval(timer);
            isRunning = false;
        }

        function stopTimer() {
            clearInterval(timer);
            isRunning = false;
            isWorkTime = true;
            minutes = workDuration;
            seconds = 0;
            updateDisplay();
        }

        function switchMode() {
            clearInterval(timer);
            isRunning = false;
            isWorkTime = !isWorkTime;
            
            if (isWorkTime) {
                minutes = workDuration;
            } else {
                minutes = breakDuration;
            }
            seconds = 0;
            
            updateDisplay();
            
            // Notificación de cambio de modo
            const mode = isWorkTime ? 'Tiempo de trabajo!' : 'Tiempo de descanso!';
            if (Notification.permission === 'granted') {
                new Notification(mode);
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        new Notification(mode);
                    }
                });
            }
        }

        function skipCurrent() {
            switchMode();
        }

        // Event Listeners
        startBtn.addEventListener('click', startTimer);
        pauseBtn.addEventListener('click', pauseTimer);
        stopBtn.addEventListener('click', stopTimer);
        skipBtn.addEventListener('click', skipCurrent);

        // Inicialización
        updateDisplay();

        // Solicitar permiso para notificaciones al cargar la página
        document.addEventListener('DOMContentLoaded', () => {
            if ('Notification' in window) {
                Notification.requestPermission();
            }
        });
