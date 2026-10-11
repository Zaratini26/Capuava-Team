/**
 * CAPUAVA TEAM — CYBER TACTICAL INTERACTION ENGINE
 * Web Audio Synthesizer, 3D Tilt, Radar Particle Canvas & Dossier System
 */

(function () {
  'use strict';

  // --- 1. PLAYER DATA REGISTRY (DOSSIER & COMPARISONS) ---
  const PLAYERS = {
    luccasramoos: {
      name: 'luccasramoos',
      role: 'Fragger',
      operator: 'Blackbeard',
      image: 'assets/operator-blackbeard.jpg',
      kd: 0.8,
      hs: '34%',
      win: '49%',
      entryRating: 8.2,
      clutchRating: 6.5,
      aimRating: 7.8,
      commsRating: 8.9,
      loadout: {
        primary: 'MK17 CQB / SR-25',
        secondary: 'D-50 Desert Eagle',
        gadget: 'Escudo Balístico Montado'
      },
      quote: '"Quebra meu escudo primeiro antes de tentar me dar headshot."',
      tacticalNotes: 'Especialista em abrir pixels em janelas e rapel no ataque. Absorve dano e cria espaço agressivo para o avanço dos suportes.',
      strengths: ['Segurar ângulos longos', 'Entry breach com escudo', 'Pressão psicológica em janelas']
    },
    xVaral: {
      name: 'xVaral',
      role: 'Suporte',
      operator: 'Bandit',
      image: 'assets/operator-bandit.jpg',
      kd: 1.0,
      hs: '41%',
      win: '49%',
      entryRating: 7.0,
      clutchRating: 8.5,
      aimRating: 8.4,
      commsRating: 9.6,
      loadout: {
        primary: 'MP7 com Mira 1.5x',
        secondary: 'P12 Handgun',
        gadget: 'Fio de Choque CED-1 (Bandit Trick)'
      },
      quote: '"Se a parede abrir no meu plant, a culpa é da operadora de internet."',
      tacticalNotes: 'Mestre no Bandit Trick em garagem do Chalet e CCTV do Clubhouse. Comunicação exemplar de drone e rotações seguras.',
      strengths: ['Bandit Trick com timing milimétrico', 'Negação de breach de Thermite', 'Drone denial e callouts']
    },
    BorisDream: {
      name: 'BorisDream',
      role: 'Fragger',
      operator: 'Lesion',
      image: 'assets/operator-lesion.jpg',
      kd: 1.5,
      hs: '59%',
      win: '49%',
      entryRating: 9.8,
      clutchRating: 9.4,
      aimRating: 9.7,
      commsRating: 8.2,
      loadout: {
        primary: 'T-5 SMG Silenciada',
        secondary: 'Q-929 Pistol',
        gadget: 'Minas Invisíveis Gu'
      },
      quote: '"Pisa na agulha que o clutch tá ganho."',
      tacticalNotes: 'O MVP incontestável do time com 1.5 de K/D e 59% de Headshot. Roamer imprevisível, pune rushers e finaliza rounds solo.',
      strengths: ['Headshot accuracy absurda', 'Late-round clutch conversion', 'Flancos agressivos']
    },
    Sabetinha: {
      name: 'Sabetinha',
      role: 'Intermediário',
      operator: 'Jäger',
      image: 'assets/operator-jager.jpg',
      kd: 1.3,
      hs: '45%',
      win: '49%',
      entryRating: 8.7,
      clutchRating: 8.8,
      aimRating: 8.9,
      commsRating: 9.0,
      loadout: {
        primary: '416-C Carbine',
        secondary: 'P12 Handgun',
        gadget: 'Sistema ADS Magpie Anti-Granadas'
      },
      quote: '"Você já se preocupou com granadas voando hoje?"',
      tacticalNotes: 'Segundo contato de elite. Garante a proteção dos suportes com ADS e tem mira apurada para trocas em meia distância.',
      strengths: ['Posicionamento versátil', 'Controle de projéteis', 'Recuo da 416-C dominado']
    },
    PedroHs: {
      name: 'PedroHs',
      role: 'Suporte',
      operator: 'Smoke',
      image: 'assets/operator-smoke.jpg',
      kd: 0.9,
      hs: '26%',
      win: '49%',
      entryRating: 6.2,
      clutchRating: 9.1,
      aimRating: 7.2,
      commsRating: 9.5,
      loadout: {
        primary: 'M590A1 Shotgun',
        secondary: 'SMG-11 High RoF',
        gadget: 'Granadas de Gás Tóxico Remotas'
      },
      quote: '"Se você entrar no bombsite nos últimos 30 segundos, vai respirar gás."',
      tacticalNotes: 'Coração defensivo da equipe. Constrói rotações no setup inicial com a calibre 12 e nega plants com maestria no final do round.',
      strengths: ['Área denial nos 30s finais', 'Abertura de rotação com shotgun', 'Clutch de C4 e SMG-11']
    }
  };

  // --- 2. TACTICAL WEB AUDIO SYNTHESIZER ---
  class TacticalAudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.init();
    }

    init() {
      const saved = localStorage.getItem('capuava_audio_muted');
      if (saved !== null) {
        this.isMuted = saved === 'true';
      }
    }

    ensureContext() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      localStorage.setItem('capuava_audio_muted', this.isMuted);
      return !this.isMuted;
    }

    play(type) {
      if (this.isMuted) return;
      try {
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        switch (type) {
          case 'blip':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1400, now + 0.04);
            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
            break;

          case 'click':
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(180, now + 0.03);
            gain.gain.setValueAtTime(0.07, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            osc.start(now);
            osc.stop(now + 0.04);
            break;

          case 'ping':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1600, now);
            osc.frequency.exponentialRampToValueAtTime(900, now + 0.12);
            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
            break;

          case 'deploy':
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.start(now);
            osc.stop(now + 0.12);
            break;

          case 'card':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(540, now);
            gain.gain.setValueAtTime(0.02, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
            osc.start(now);
            osc.stop(now + 0.03);
            break;

          default:
            break;
        }
      } catch (e) {
        // Audio policy or unsupported context
      }
    }
  }

  const audio = new TacticalAudioEngine();

  // --- 3. CUSTOM CROSSHAIR CURSOR ---
  const cursor = document.getElementById('cursor');
  const cursorCoords = document.getElementById('cursorCoords');

  if (cursor && cursorCoords) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
      cursorCoords.textContent = `X:${String(mouseX).padStart(3, '0')} Y:${String(mouseY).padStart(3, '0')}`;
    }, { passive: true });

    // Expand crosshair when hovering interactive elements
    const interactables = 'a, button, input, select, .stat-card, .player-card, .map-card, .sponsor-cyber-card, .radar-blip';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactables)) {
        cursor.classList.add('hovering');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactables)) {
        cursor.classList.remove('hovering');
      }
    });
  }

  // Bind sound triggers to data-sound elements
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-sound]');
    if (trigger) {
      const soundType = trigger.getAttribute('data-sound');
      audio.play(soundType);
    }
  });

  document.addEventListener('mouseenter', (e) => {
    const trigger = e.target.closest && e.target.closest('[data-sound="hover"], [data-sound="card"]');
    if (trigger) {
      audio.play('card');
    }
  }, true);

  // Audio Toggle Button in HUD topbar
  const audioToggle = document.getElementById('audioToggle');
  const soundIcon = document.getElementById('soundIcon');
  const audioLabel = document.getElementById('audioLabel');

  function updateAudioButtonUI() {
    if (!audioToggle) return;
    if (audio.isMuted) {
      audioToggle.classList.remove('active');
      audioLabel.textContent = 'AUDIO: MUTE';
      audioToggle.style.opacity = '0.5';
    } else {
      audioToggle.classList.add('active');
      audioLabel.textContent = 'AUDIO: ON';
      audioToggle.style.opacity = '1';
    }
  }

  if (audioToggle) {
    updateAudioButtonUI();
    audioToggle.addEventListener('click', () => {
      const unmuted = audio.toggleMute();
      updateAudioButtonUI();
      if (unmuted) {
        audio.play('deploy');
        showToast('🔊 Efeitos Sonoros Táticos Ativados');
      } else {
        showToast('🔇 Efeitos Sonoros Silenciados');
      }
    });
  }

  // Keyboard shortcut M for mute
  window.addEventListener('keydown', (e) => {
    if (e.key === 'm' || e.key === 'M') {
      if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'SELECT') {
        if (audioToggle) audioToggle.click();
      }
    }
  });

  // --- 4. COLOR THEME PICKER ---
  const themeDots = document.querySelectorAll('.theme-dot');
  themeDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const themeColor = dot.getAttribute('data-color');
      document.documentElement.setAttribute('data-theme', themeColor);
      themeDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      audio.play('blip');
      showToast(`⚡ Frequência HUD Alterada: [${themeColor.toUpperCase()}]`);
    });
  });

  // --- 5. TACTICAL CANVAS: PARTICLES & RADAR SWEEP ---
  const canvas = document.getElementById('tacticalCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 45;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 1.5 + 0.8;
        this.alpha = Math.random() * 0.4 + 0.15;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateCanvas);
    }

    animateCanvas();
  }

  // --- 6. 3D CARD TILT & SPECULAR SHEEN EFFECT ---
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

      const sheen = card.querySelector('.holo-sheen');
      if (sheen) {
        sheen.style.opacity = '0.7';
        sheen.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px) rotate(25deg)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      const sheen = card.querySelector('.holo-sheen');
      if (sheen) sheen.style.opacity = '0.2';
    });
  });

  // --- 7. ANIMATED STAT COUNTERS ---
  const counterElements = document.querySelectorAll('.counter');
  let counted = false;

  const observerOptions = { threshold: 0.3 };
  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        animateCounters();
        observer.disconnect();
      }
    });
  }, observerOptions);

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  function animateCounters() {
    counterElements.forEach(el => {
      const target = parseFloat(el.getAttribute('data-target'));
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      const duration = 1600;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // EaseOutExpo
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = ease * target;

        el.textContent = currentVal.toFixed(decimals);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target.toFixed(decimals);
        }
      }

      requestAnimationFrame(update);
    });
  }

  // --- 8. ROSTER FILTER SYSTEM ---
  const filterButtons = document.querySelectorAll('.roster-filter-btn');
  const playerCards = document.querySelectorAll('.player-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      playerCards.forEach(card => {
        const cardRole = card.getAttribute('data-role');
        if (filter === 'all' || cardRole === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- 9. TACTICAL DOSSIER MODAL WINDOW ---
  const dossierModal = document.getElementById('dossierModal');
  const dossierCloseBtn = document.getElementById('dossierCloseBtn');
  const dossierPlayerName = document.getElementById('dossierPlayerName');
  const dossierContent = document.getElementById('dossierContent');

  function openDossier(playerId) {
    const p = PLAYERS[playerId];
    if (!p) return;

    dossierPlayerName.textContent = p.name.toUpperCase();
    
    dossierContent.innerHTML = `
      <div class="dossier-grid">
        <div class="dossier-left">
          <div class="dossier-photo-frame">
            <img src="${p.image}" alt="${p.name} - ${p.operator}">
            <div class="avatar-hud-overlay"></div>
          </div>
          <div class="dossier-badge-grid">
            <div class="dbg-item"><span class="dbg-lbl">FUNÇÃO:</span><span class="dbg-val text-accent">${p.role.toUpperCase()}</span></div>
            <div class="dbg-item"><span class="dbg-lbl">OPERADOR:</span><span class="dbg-val">${p.operator.toUpperCase()}</span></div>
            <div class="dbg-item"><span class="dbg-lbl">K/D OFICIAL:</span><span class="dbg-val text-accent">${p.kd}</span></div>
            <div class="dbg-item"><span class="dbg-lbl">HEADSHOT:</span><span class="dbg-val">${p.hs}</span></div>
            <div class="dbg-item"><span class="dbg-lbl">WINRATE:</span><span class="dbg-val">${p.win}</span></div>
          </div>
        </div>

        <div class="dossier-right">
          <div>
            <div class="dossier-section-title"><span>//</span> DIRETRIZ E FRASE DE ASSINATURA</div>
            <p class="dossier-bio-text" style="font-style: italic; color: #fff; margin-bottom: 8px;">${p.quote}</p>
            <p class="dossier-bio-text">${p.tacticalNotes}</p>
          </div>

          <div>
            <div class="dossier-section-title"><span>//</span> ARSENAL & LOADOUT PREFERIDO</div>
            <div class="dossier-loadout-grid">
              <div class="loadout-slot">
                <span class="ls-type">PRIMÁRIA</span>
                <span class="ls-name">${p.loadout.primary}</span>
              </div>
              <div class="loadout-slot">
                <span class="ls-type">SECUNDÁRIA</span>
                <span class="ls-name">${p.loadout.secondary}</span>
              </div>
              <div class="loadout-slot">
                <span class="ls-type">DISPOSITIVO GADGET</span>
                <span class="ls-name text-accent">${p.loadout.gadget}</span>
              </div>
            </div>
          </div>

          <div>
            <div class="dossier-section-title"><span>//</span> PONTOS FORTES NO ROUND</div>
            <div class="skills-bars-container">
              <div class="skill-bar-row">
                <div class="sbr-head"><span>MIRA & TROCA DE TIRO</span><span class="text-accent">${(p.aimRating * 10).toFixed(0)}%</span></div>
                <div class="sbr-track"><div class="sbr-fill" style="width: ${p.aimRating * 10}%;"></div></div>
              </div>
              <div class="skill-bar-row">
                <div class="sbr-head"><span>CLUTCH & FRIEZA</span><span class="text-accent">${(p.clutchRating * 10).toFixed(0)}%</span></div>
                <div class="sbr-track"><div class="sbr-fill" style="width: ${p.clutchRating * 10}%;"></div></div>
              </div>
              <div class="skill-bar-row">
                <div class="sbr-head"><span>ENTRY / ESPAÇO</span><span class="text-accent">${(p.entryRating * 10).toFixed(0)}%</span></div>
                <div class="sbr-track"><div class="sbr-fill" style="width: ${p.entryRating * 10}%;"></div></div>
              </div>
              <div class="skill-bar-row">
                <div class="sbr-head"><span>COMUNICAÇÃO & CALLS</span><span class="text-accent">${(p.commsRating * 10).toFixed(0)}%</span></div>
                <div class="sbr-track"><div class="sbr-fill" style="width: ${p.commsRating * 10}%;"></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    dossierModal.classList.add('active');
    dossierModal.setAttribute('aria-hidden', 'false');
    audio.play('ping');
  }

  function closeDossier() {
    dossierModal.classList.remove('active');
    dossierModal.setAttribute('aria-hidden', 'true');
  }

  // Bind inspect buttons
  document.querySelectorAll('[data-inspect]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.getAttribute('data-inspect');
      openDossier(pid);
    });
  });

  const quickDossierBtn = document.getElementById('quickDossierBtn');
  if (quickDossierBtn) {
    quickDossierBtn.addEventListener('click', () => {
      openDossier('BorisDream');
    });
  }

  if (dossierCloseBtn) {
    dossierCloseBtn.addEventListener('click', closeDossier);
  }

  if (dossierModal) {
    dossierModal.addEventListener('click', (e) => {
      if (e.target === dossierModal) closeDossier();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dossierModal && dossierModal.classList.contains('active')) {
      closeDossier();
    }
  });

  // --- 10. INTERACTIVE WIN & RANK SIMULATOR ---
  const winSlider = document.getElementById('winSlider');
  const winCountVal = document.getElementById('winCountVal');
  const projectedMMR = document.getElementById('projectedMMR');
  const projectedRank = document.getElementById('projectedRank');
  const projectedTilt = document.getElementById('projectedTilt');

  if (winSlider) {
    winSlider.addEventListener('input', () => {
      const wins = parseInt(winSlider.value, 10);
      winCountVal.textContent = `${wins} ${wins === 1 ? 'vitória' : 'vitórias'}`;

      // Starting MMR is 2,140
      const newMMR = 2140 + wins * 40;
      projectedMMR.textContent = `${newMMR.toLocaleString()} MMR`;

      if (newMMR < 2300) {
        projectedRank.textContent = 'PRATA III';
        projectedTilt.textContent = `${12 + wins * 2}% (BAIXA)`;
      } else if (newMMR < 2500) {
        projectedRank.textContent = 'PRATA I';
        projectedTilt.textContent = `${18 + wins * 2}% (MODERADA)`;
      } else if (newMMR < 3200) {
        projectedRank.textContent = 'OURO II (META ALCANÇADA!)';
        projectedTilt.textContent = '35% (PRESSÃO)';
      } else {
        projectedRank.textContent = 'PLATINA III (DEUS TÁTICO!)';
        projectedTilt.textContent = '5% (TRANSCENDÊNCIA)';
      }

      audio.play('blip');
    });
  }

  // --- 11. HEAD-TO-HEAD COMPARISON MODULE ---
  const compPlayer1 = document.getElementById('compPlayer1');
  const compPlayer2 = document.getElementById('compPlayer2');
  const compareDisplay = document.getElementById('compareDisplay');

  function updateComparison() {
    if (!compPlayer1 || !compPlayer2 || !compareDisplay) return;
    const p1 = PLAYERS[compPlayer1.value];
    const p2 = PLAYERS[compPlayer2.value];
    if (!p1 || !p2) return;

    compareDisplay.innerHTML = `
      <div class="comp-side-box">
        <div class="csb-header">
          <img src="${p1.image}" alt="${p1.name}" class="csb-avatar">
          <div>
            <div class="csb-name">${p1.name}</div>
            <div class="text-accent" style="font-size: 10px; font-family: var(--font-mono);">${p1.operator} • ${p1.role}</div>
          </div>
        </div>
        <div class="csb-stat-row">
          <span>K/D RATIO:</span>
          <strong class="${p1.kd >= p2.kd ? 'text-accent' : ''}">${p1.kd}</strong>
        </div>
        <div class="csb-stat-row">
          <span>HEADSHOT %:</span>
          <strong class="${parseInt(p1.hs) >= parseInt(p2.hs) ? 'text-accent' : ''}">${p1.hs}</strong>
        </div>
        <div class="csb-stat-row">
          <span>PODER DE CLUTCH:</span>
          <strong>${(p1.clutchRating * 10).toFixed(0)}%</strong>
        </div>
        <div class="csb-stat-row">
          <span>ENTRY FRAG:</span>
          <strong>${(p1.entryRating * 10).toFixed(0)}%</strong>
        </div>
      </div>

      <div class="comp-side-box">
        <div class="csb-header">
          <img src="${p2.image}" alt="${p2.name}" class="csb-avatar">
          <div>
            <div class="csb-name">${p2.name}</div>
            <div class="text-orange" style="font-size: 10px; font-family: var(--font-mono);">${p2.operator} • ${p2.role}</div>
          </div>
        </div>
        <div class="csb-stat-row">
          <span>K/D RATIO:</span>
          <strong class="${p2.kd >= p1.kd ? 'text-orange' : ''}">${p2.kd}</strong>
        </div>
        <div class="csb-stat-row">
          <span>HEADSHOT %:</span>
          <strong class="${parseInt(p2.hs) >= parseInt(p1.hs) ? 'text-orange' : ''}">${p2.hs}</strong>
        </div>
        <div class="csb-stat-row">
          <span>PODER DE CLUTCH:</span>
          <strong>${(p2.clutchRating * 10).toFixed(0)}%</strong>
        </div>
        <div class="csb-stat-row">
          <span>ENTRY FRAG:</span>
          <strong>${(p2.entryRating * 10).toFixed(0)}%</strong>
        </div>
      </div>
    `;
  }

  if (compPlayer1 && compPlayer2) {
    compPlayer1.addEventListener('change', () => {
      updateComparison();
      audio.play('blip');
    });
    compPlayer2.addEventListener('change', () => {
      updateComparison();
      audio.play('blip');
    });
    updateComparison();
  }

  // --- 12. MATCH COUNTDOWN TIMER ---
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMins = document.getElementById('cdMins');
  const cdSecs = document.getElementById('cdSecs');

  // Next Saturday 18:00
  function getNextSaturday18() {
    const d = new Date();
    const day = d.getDay(); // 0 is Sun, 6 is Sat
    const diff = (6 - day + 7) % 7;
    const target = new Date(d);
    target.setDate(d.getDate() + (diff === 0 && d.getHours() >= 18 ? 7 : diff));
    target.setHours(18, 0, 0, 0);
    return target;
  }

  const matchTarget = getNextSaturday18();

  function updateCountdown() {
    const now = new Date();
    let diff = matchTarget - now;
    if (diff <= 0) diff = 0;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
    if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
    if (cdMins) cdMins.textContent = String(mins).padStart(2, '0');
    if (cdSecs) cdSecs.textContent = String(secs).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // --- 13. TOAST SYSTEM ---
  function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span style="color:var(--primary)">⚡</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  const notifyMatchBtn = document.getElementById('notifyMatchBtn');
  if (notifyMatchBtn) {
    notifyMatchBtn.addEventListener('click', () => {
      showToast('✅ Alerta registrado! Você será notificado no Discord quando a squad entrar na sala.');
    });
  }

  // --- 14. MOBILE MENU TOGGLE ---
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');

  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
      audio.play('click');
    });

    navMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });
  }

  // --- 15. RADAR BLIPS CLICK INTERACTION ---
  document.querySelectorAll('.radar-blip').forEach(blip => {
    blip.addEventListener('click', () => {
      const pid = blip.getAttribute('title');
      if (pid && PLAYERS[pid]) {
        openDossier(pid);
      }
    });
  });

  // --- 16. HEADER SHADOW ON SCROLL ---
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  console.log('%c[CAPUAVA TEAM] Cyber Tactical Interface Loaded. 128 Tickrate. System Ready.', 'color:#00f0ff;font-weight:bold;font-size:12px;');
})();
