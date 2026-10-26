
console.log("[folkvalleyestablished]: loaded dich");

console.log(`
    .                    .                         .                       .             .          
                     .      . ..:-=++++++++++--:...                                ..               
                   .    .:-+#%%%%##****#%****##%%%@%###**++=-:..                 .                  
   .                  .=%@#***+++++++++*#++++++++##*+++*%***#%@%#+-..                    .  .       
.          .        .-%%%*+++++++++++++*#++++++*#+++++*%++++++++**#@%=..  .              ..         
     .             .*@#+%*++++++++++++++*+++++++*++++%*+++++++++++++#@@%.             .          
                ..%@%*+++**#+++++++++++++*+++++*#+++++%*+++++++++++++*+%@: .  .         
               .*@%+++++++*#+++++++++++*#+++++@+**++++++*%#+++++++++#*++%@:   .      
 .            :#@*++++++++*#++++++++++++##+++#+++##**++++*%****%@%*+**+++@%.                  
            .:#%**++++++++*++++++++++++++#*#%++++++++++++++#*+++++*@#+++++%: .                      
  .         .*@*%++++++**+++++++++++++++++*%**+++++++++++++**+++++#*++++++%+        
    .       -%#+#++**+++*#++++++++++++++++++%++++++++++++++*#*+++++*#+++++@+   
          . =@*+##%+*#++*#*++++++++++++++++++#+++++++++++*%#+++++++*#+++++%#.                  
       .    =@*+++++++*%*+*#*++++++++++++++##++++++++++++*#*+++++++##+++++#%: .                  
   .        =@*++++++++++++++**+++++++++++*#++++++++++++++**++++++*#++++++*@*.                      
            =@*++++++++++++++*#++++++++++++#++++++++++++++**+++++##++***+++##:      
    .     . :##+++++++++++++##*++++++++++++++++++++++++++++#*+*#@@@@@@@@@#+*%-        
            .*%*++++++++++**%%%%%%####*++++++++++++++++++++#%@@@@@@@@@@@@@**%- .                    
  .   .      =@*++++++++*%@@@@@@@@@@@@@@%+++++++++++++++++*@@@@@@@@@@@@@@@**%-              
             :#%++++++++#@@@@@@@@@@@@@@@%*++++++++++++++++#@@@@@@@@@@@@@@@**@+.                     
             .+@*+++++++%@@@@@@@@@@@@@@@%*++++++++++++++++#@@@@@@@@@@@@@@#++%%-                     
              .*@*++++++%@@@@@@@@@@@@@@@%*+++++++++++++++++#@@@@@@@@@@@@@+++*%+.                    
        .      .#@++++++*@@@@@@@@@@@@@@@#++++++++++++++++++++*#%@@@@@@@#+++++##:                    
 .              -@*+++++++*@@@@@@@@@@@@*++++++++++++++++++++++++#*+++++++++++#%-                    
     .          .%%++++++++++**#@@@@@%+++++++++++++++++++++++++++*%**##%*++++#@-                  
            .    -@*++++++++++++++++++++++++++++++++++++++++++++++++++++++%#+#@-                    
            .     @%++++++++++++++++++++++++++++++++++++***++++++++++++++++++#@-                
                  =@*+++++++++++++++++++++++++#@@@@*++++@@@#+++++++++++++++++##: .                  
      .    .      .@%+++++++++++++++++++++++++#@@@@*++++@@@#+++++++++++++++++##:   
                   +@*+++++++++++++++++++++++++#%%*++++++++++++++++++++++++++%#:      
                   .@%++++++++++++++++++++++++++++++++++++++++++++++++++++++#@=.                    
   .         .     .*%++++++++++++++++++++++++++++++++++*##%%%@@@@@@@@@@@@@@@*.               
                   .=@*+++++++++++++++++++++++++*###%%@@%*+*%+:=@:.  .*@:=@=-=     
                   .=@*++++++++++++++++++++*#%@@#%@*-@@.   :#*.=@+.   *@:=%:.. .  
                    -@#++++++++++++++++*%@@%%@:. =@=.%@.    +@-.=@#:  *@-#%:                        
                .   :*%+++++++++++++#%@%+##--@#  =@=.%@.  ...#%..-%=  -#*+-.                        
 .    .             .=@*+++++++++*%@%-. .*@-:#@+.-%%#@@.   . #@*#@#..                  
             .      .:%%*++++*%@@@#:     -%#::=@=.:----.     -#=-.        .       
                     .-%%*++*@#:.*@:     .=@#:%%.                   :#@@:           
                      .:#@++*@%- .-@%     .+@@%.               .  .=@##@:.       :::.        
      .  .             .#@+++%@@%@@@+ :%@@*....                 . -@*:*@-.-*%@@@@@#%@*.             
             .         .+@%++#%-.... .+@**@-                    :+#@@%@@@@@**+++++++#@#:     
         .             .:%#++*@@@*-:.*@= .*@=.-*#%@@@@@@@@@@@@@@@#***++++++++++++++++#@=            
             .          :%%+++++*##%%%%%%%%%%%%**+++++++++++++++++++++++++++++++++++*@*.   
    .    .              .:%@*+++++++++++++++++++++++++++++++++++++++++++++++++++++**@%-             
    .                     .=%@%**++++++++++++++++++++++++++++++++++++++++++++***%@@#-.          
                  .         ..=*%@@%%****++++++++++++++++++++++++++++++***%@@%#+=.   
            .              .     ..:=**#%@@@@@#######*************#%@@%##*=:.                    
  .                                       ...:======+++++++++++++++-..                              
                 .          .             .  .        .         .      .                           
`);

const canvas = document.getElementById("ecg");
const ctx = canvas.getContext("2d");
const statusEl = document.getElementById("status");

let audioContext = null;
let deathOscillator = null;
let deathGain = null;
let width, height;
let lastTime = 0;
let scroll = 0;
let points = [];

const state = {
    bpm: 72,
    alive: true,
    paused: false,
    arrhythmia: false,
    sound: true,
    amplitude: 1,
    nextBeat: 0,
    beatTimer: 0,
    beatDuration: 0.36,
    beatHeight: 1,
    shape: null
};

function getAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === "suspended") audioContext.resume();
    return audioContext;
}

function rand(min, max) { // xd
    return min + Math.random() * (max - min);
}

function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    width = rect.width;
    height = rect.height;
    points = [];
    scroll = 0;

    for (let x = 0; x < width; x += 2) {
        points.push({ x, y: height / 2 });
    }
}

function getInterval() {
    const base = 60 / state.bpm;
    return base * (
        state.arrhythmia ? rand(0.55, 1.55) : rand(0.92, 1.08)
    );
}

function playHeartbeat() {
    if (!state.sound || !state.alive || state.paused) return;

    try {
        const audio = getAudioContext();
        const now = audio.currentTime;

        function thump(start, frequency, duration, volume) {
            const oscillator = audio.createOscillator();
            const gain = audio.createGain();

            oscillator.type = "sine";
            oscillator.frequency.setValueAtTime(frequency, start);
            oscillator.frequency.exponentialRampToValueAtTime(
                Math.max(35, frequency * 0.55),
                start + duration
            );

            gain.gain.setValueAtTime(0.0001, start);
            gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

            oscillator.connect(gain);
            gain.connect(audio.destination);
            oscillator.start(start);
            oscillator.stop(start + duration + 0.02);
        }

        thump(now, 78, 0.16, 0.48);
        thump(now + 0.17, 62, 0.20, 0.34);
    } catch (error) {
        console.warn("Heartbeat sdox:", error);
    }
}

function stopSound() {
    if (deathOscillator) {
        try { deathOscillator.stop(); } catch (_) {}
        deathOscillator.disconnect();
        deathOscillator = null;
    }

    if (deathGain) {
        deathGain.disconnect();
        deathGain = null;
    }
}

function startDeathLoop() {
    stopSound();
    if (!state.sound) return;

    try {
        const audio = getAudioContext();
        deathOscillator = audio.createOscillator();
        deathGain = audio.createGain();

        deathOscillator.type = "sine";
        deathOscillator.frequency.setValueAtTime(950, audio.currentTime);
        deathGain.gain.setValueAtTime(0.0001, audio.currentTime);
        deathGain.gain.linearRampToValueAtTime(0.16, audio.currentTime + 0.08);

        deathOscillator.connect(deathGain);
        deathGain.connect(audio.destination);
        deathOscillator.start();
    } catch (error) {
        console.warn("Asystole sdox:", error);
    }
}

function scheduleBeat() {
    state.beatTimer = 0;
    state.beatDuration = rand(0.28, 0.43);
    state.beatHeight = state.amplitude * rand(height * 0.18, height * 0.40);

    state.shape = {
        p: rand(0.13, 0.22),
        q: rand(0.29, 0.38),
        r: rand(0.38, 0.47),
        s: rand(0.46, 0.55),
        t: rand(0.62, 0.79),
        pAmp: rand(0.04, 0.15),
        qAmp: rand(0.08, 0.22),
        sAmp: rand(0.20, 0.45),
        tAmp: rand(0.08, 0.25),
        pWidth: rand(0.025, 0.065),
        rWidth: rand(0.009, 0.023),
        tWidth: rand(0.04, 0.09)
    };

    state.nextBeat = getInterval();
    playHeartbeat();
}

function gauss(x, center, spread) {
    return Math.exp(-Math.pow((x - center) / spread, 2) * 2);
}

function pulse(t) {
    const b = state.shape;
    if (!b) return 0;

    return (
        b.pAmp * gauss(t, b.p, b.pWidth)
        - b.qAmp * gauss(t, b.q, 0.025)
        + gauss(t, b.r, b.rWidth)
        - b.sAmp * gauss(t, b.s, 0.025)
        + b.tAmp * gauss(t, b.t, b.tWidth)
    );
}

function updateStatus() {
    let rhythm;

    if (!state.alive) {
        rhythm = "ASYSTOLE | DEAD";
    } else if (state.arrhythmia) {
        rhythm = "ARRHYTHMIA | ALIVE";
    } else if (state.bpm >= 100) {
        rhythm = "TACHYCARDIA | ALIVE";
    } else if (state.bpm < 60) {
        rhythm = "BRADYCARDIA | ALIVE";
    } else {
        rhythm = "SINUS RHYTHM | ALIVE";
    }

    statusEl.textContent = !state.alive
        ? `HR: 0 BPM | ${rhythm}`
        : `HR: ${state.bpm} BPM | ${rhythm}`;
}

function draw(timestamp) {
    if (!lastTime) lastTime = timestamp;

    const dt = Math.min((timestamp - lastTime) / 1000, 0.035);
    lastTime = timestamp;

    if (!state.paused) {
        scroll += 180 * dt;

        if (state.alive) {
            state.nextBeat -= dt;

            if (state.nextBeat <= 0) {
                scheduleBeat();
            }

            state.beatTimer += dt;
        }

        const baseline = height / 2;
        let offset = 0;

        if (state.alive && state.beatTimer < state.beatDuration) {
            offset = pulse(state.beatTimer / state.beatDuration)
                * state.beatHeight;
        }

        const noise = state.alive ? rand(-0.35, 0.35) : 0;
        const y = baseline - offset + noise;

        points.push({ x: scroll + width, y });

        while (points.length && points[0].x < scroll) {
            points.shift();
        }

        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, width, height);
        ctx.clip();
        ctx.beginPath();

        for (let i = 0; i < points.length; i++) {
            const px = points[i].x - scroll;
            const py = points[i].y;

            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }

        ctx.strokeStyle = "#ff1717";
        ctx.lineWidth = 1.8;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.shadowColor = "#ff0000";
        ctx.shadowBlur = 5;
        ctx.stroke();
        ctx.restore();
    }

    requestAnimationFrame(draw);
}

function setBpm(value) {
    state.bpm = Math.max(20, Math.min(240, value));
    updateStatus();
}

function death() {
    if (!state.alive) return;

    state.alive = false;
    state.shape = null;
    state.nextBeat = Infinity;
    state.beatTimer = 0;

    startDeathLoop();
    updateStatus();
}

function resurrect() {
    stopSound();
    state.alive = true;
    state.nextBeat = 0;
    state.beatTimer = state.beatDuration;
    updateStatus();
}

function reset() {
    stopSound();

    state.bpm = 72;
    state.alive = true;
    state.paused = false;
    state.arrhythmia = false;
    state.amplitude = 1;
    state.nextBeat = 0;
    state.beatTimer = 0;
    state.shape = null;

    document.getElementById("arrhythmia").textContent = "Arrhythmia: OFF";
    document.getElementById("pause").textContent = "Pause";

    updateStatus();
}

document.getElementById("add").onclick = () => setBpm(state.bpm + 10);
document.getElementById("lower").onclick = () => setBpm(state.bpm - 10);
document.getElementById("death").onclick = death;
document.getElementById("resurrect").onclick = resurrect;

document.getElementById("arrhythmia").onclick = (e) => {
    state.arrhythmia = !state.arrhythmia;
    e.target.textContent = `Arrhythmia: ${state.arrhythmia ? "ON" : "OFF"}`;
    updateStatus();
};

document.getElementById("pause").onclick = (e) => {
    state.paused = !state.paused;
    e.target.textContent = state.paused ? "Resume" : "Pause";
};

document.getElementById("sound").onclick = (e) => {
    state.sound = !state.sound;
    e.target.textContent = `Sound: ${state.sound ? "ON" : "OFF"}`;

    if (!state.sound) {
        stopSound();
    } else if (!state.alive) {
        startDeathLoop();
    }
};

document.getElementById("normal").onclick = () => {
    stopSound();
    state.bpm = 72;
    state.amplitude = 1;
    state.arrhythmia = false;
    state.alive = true;
    state.nextBeat = 0;
    document.getElementById("arrhythmia").textContent = "Arrhythmia: OFF";
    updateStatus();
};

document.getElementById("tachy").onclick = () => setBpm(140);
document.getElementById("brady").onclick = () => setBpm(40);
document.getElementById("weak").onclick = () => state.amplitude = 0.45;
document.getElementById("strong").onclick = () => state.amplitude = 1.5;
document.getElementById("reset").onclick = reset;

function applyScenario({ bpm, amplitude = 1, arrhythmia = false, dead = false }) {
    stopSound();

    state.alive = !dead;
    state.bpm = bpm;
    state.amplitude = amplitude;
    state.arrhythmia = arrhythmia;
    state.nextBeat = dead ? Infinity : 0;
    state.beatTimer = 0;
    state.shape = null;

    document.getElementById("arrhythmia").textContent =
        `Arrhythmia: ${state.arrhythmia ? "ON" : "OFF"}`;

    if (dead) startDeathLoop();

    updateStatus();
}

document.getElementById("fall").onclick = () =>
    applyScenario({ bpm: 145, amplitude: 1.5, arrhythmia: true });

document.getElementById("arm").onclick = () =>
    applyScenario({ bpm: 115, amplitude: 0.7 });

document.getElementById("bloodLoss").onclick = () =>
    applyScenario({ bpm: 155, amplitude: 0.45, arrhythmia: true });

document.getElementById("shock").onclick = () =>
    applyScenario({ bpm: 175, amplitude: 1.25, arrhythmia: true });

document.getElementById("heartAttack").onclick = () =>
    applyScenario({ bpm: 125, amplitude: 1.1, arrhythmia: true });

document.getElementById("drowning").onclick = () =>
    applyScenario({ bpm: 45, amplitude: 0.5, arrhythmia: true });

document.getElementById("electric").onclick = () =>
    applyScenario({ bpm: 210, amplitude: 1.6, arrhythmia: true });

document.getElementById("pain").onclick = () =>
    applyScenario({ bpm: 135, amplitude: 1.25 });

document.getElementById("hypothermia").onclick = () =>
    applyScenario({ bpm: 32, amplitude: 0.45 });

document.getElementById("recover").onclick = () => {
    state.paused = false;
    document.getElementById("pause").textContent = "Pause";
    document.getElementById("normal").click();
};

resize();
updateStatus();
window.addEventListener("resize", resize);
requestAnimationFrame(draw);