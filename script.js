/* ==========================================================================
   D.A.R.W.I.N. Web Shell - Script de Control Principal
   Control de estado global DOM, temporizadores y modulos interactivos
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // Referencias a elementos clave del DOM
    const toggleBtn = document.getElementById("toggleBtn");
    const body = document.body;

    // Estado global del protocolo
    let isDarwinActive = false;

    /* ==========================================================================
       1. INTERRUPTOR GLOBAL DE ESTADO (OVERLOAD VS D.A.R.W.I.N.)
       ========================================================================== */
    toggleBtn.addEventListener("click", () => {
        isDarwinActive = !isDarwinActive;

        if (isDarwinActive) {
            // Activar el refugio D.A.R.W.I.N.
            body.classList.add("darwin-active");
            toggleBtn.textContent = "[ DESACTIVAR PROTOCOLO (MODO CAOS) ]";
        } else {
            // Volver a la sobrecarga sensorial
            body.classList.remove("darwin-active");
            toggleBtn.textContent = "[ INICIAR PROTOCOLO D.A.R.W.I.N. ]";
        }
    });

    /* ==========================================================================
       2. TEMPORIZADORES Y RELOJ EN TIEMPO REAL
       ========================================================================== */
    const systemClockEl = document.getElementById("systemClock");
    const sessionTimerEl = document.getElementById("sessionTimer");
    let sessionSeconds = 0;

    // Actualizador de reloj del sistema
    function updateClock() {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        if (systemClockEl) {
            systemClockEl.textContent = `${hrs}:${mins}:${secs}`;
        }
    }

    setInterval(updateClock, 1000);
    updateClock();

    // Cronometro de sesion activa en refugio
    setInterval(() => {
        if (isDarwinActive) {
            sessionSeconds++;
            const m = String(Math.floor(sessionSeconds / 60)).padStart(2, '0');
            const s = String(sessionSeconds % 60).padStart(2, '0');
            if (sessionTimerEl) {
                sessionTimerEl.textContent = `${m}:${s}`;
            }
        }
    }, 1000);

    /* ==========================================================================
       3. REPRODUCTOR DE AUDIO MINIMALISTA
       ========================================================================== */
    const tracks = [
        { title: "Classic Rock Mix - Tio Jim", duration: "04:30" },
        { title: "Lofi Ambient - Frecuencia Alpha", duration: "03:15" },
        { title: "Ruido Blanco Regulado - 432Hz", duration: "05:00" }
    ];

    let currentTrackIndex = 0;
    let isPlaying = false;

    const currentTrackTitleEl = document.getElementById("currentTrackTitle");
    const trackStatusEl = document.getElementById("trackStatus");
    const totalTimeEl = document.getElementById("totalTime");
    const progressFillEl = document.getElementById("progressFill");
    const btnPlay = document.getElementById("btnPlay");
    const btnPrev = document.getElementById("btnPrev");
    const btnNext = document.getElementById("btnNext");

    function loadTrack(index) {
        currentTrackIndex = index;
        const track = tracks[currentTrackIndex];
        if (currentTrackTitleEl) currentTrackTitleEl.textContent = track.title;
        if (totalTimeEl) totalTimeEl.textContent = track.duration;
        if (progressFillEl) progressFillEl.style.width = "0%";
    }

    if (btnPlay) {
        btnPlay.addEventListener("click", () => {
            isPlaying = !isPlaying;
            if (isPlaying) {
                btnPlay.textContent = "[ PAUSAR ]";
                if (trackStatusEl) trackStatusEl.textContent = "ESTADO: REPRODUCIENDO";
                if (progressFillEl) progressFillEl.style.width = "65%";
            } else {
                btnPlay.textContent = "[ REPRODUCIR ]";
                if (trackStatusEl) trackStatusEl.textContent = "ESTADO: PAUSADO";
            }
        });
    }

    if (btnNext) {
        btnNext.addEventListener("click", () => {
            currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
            loadTrack(currentTrackIndex);
            if (isPlaying && trackStatusEl) trackStatusEl.textContent = "ESTADO: REPRODUCIENDO";
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener("click", () => {
            currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
            loadTrack(currentTrackIndex);
            if (isPlaying && trackStatusEl) trackStatusEl.textContent = "ESTADO: REPRODUCIENDO";
        });
    }

    /* ==========================================================================
       4. GESTOR DE TAREAS Y MENSAJES (TEXTO PLANO)
       ========================================================================== */
    const newTaskInput = document.getElementById("newTaskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");

    function addNewTask() {
        if (!newTaskInput) return;
        const text = newTaskInput.value.trim();
        if (text === "") return;

        const now = new Date();
        const timeStr = `[${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}]`;

        const li = document.createElement("li");
        li.className = "task-item";

        const spanTime = document.createElement("span");
        spanTime.className = "task-time";
        spanTime.textContent = timeStr;

        const spanText = document.createElement("span");
        spanText.className = "task-text";
        spanText.textContent = text;

        const delBtn = document.createElement("button");
        delBtn.className = "task-del-btn";
        delBtn.type = "button";
        delBtn.textContent = "[ X ]";
        delBtn.addEventListener("click", () => li.remove());

        li.appendChild(spanTime);
        li.appendChild(spanText);
        li.appendChild(delBtn);

        taskList.appendChild(li);
        newTaskInput.value = "";
    }

    if (addTaskBtn) {
        addTaskBtn.addEventListener("click", addNewTask);
    }

    if (newTaskInput) {
        newTaskInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                addNewTask();
            }
        });
    }

    // Delegacion de eventos para eliminar elementos preexistentes
    if (taskList) {
        taskList.querySelectorAll(".task-del-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const item = e.target.closest(".task-item");
                if (item) item.remove();
            });
        });
    }

    /* ==========================================================================
       5. REGULADOR DE PARAMETROS VISUALES (SLIDERS)
       ========================================================================== */
    const contrastSlider = document.getElementById("contrastSlider");
    const contrastVal = document.getElementById("contrastVal");
    const fontSizeSlider = document.getElementById("fontSizeSlider");
    const fontVal = document.getElementById("fontVal");
    const resetParamsBtn = document.getElementById("resetParamsBtn");

    if (contrastSlider && contrastVal) {
        contrastSlider.addEventListener("input", (e) => {
            const val = e.target.value;
            contrastVal.textContent = `${val}%`;
            if (isDarwinActive) {
                document.getElementById("darwinMode").style.filter = `contrast(${val}%)`;
            }
        });
    }

    if (fontSizeSlider && fontVal) {
        fontSizeSlider.addEventListener("input", (e) => {
            const val = e.target.value;
            fontVal.textContent = `${val}px`;
            document.documentElement.style.setProperty('--base-font-size', `${val}px`);
        });
    }

    if (resetParamsBtn) {
        resetParamsBtn.addEventListener("click", () => {
            if (contrastSlider) contrastSlider.value = 100;
            if (contrastVal) contrastVal.textContent = "100%";
            if (fontSizeSlider) fontSizeSlider.value = 15;
            if (fontVal) fontVal.textContent = "15px";

            document.documentElement.style.setProperty('--base-font-size', '15px');
            const darwinEl = document.getElementById("darwinMode");
            if (darwinEl) darwinEl.style.filter = "none";
        });
    }
});
