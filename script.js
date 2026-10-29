/**
 * FOR DADDY — AN ODE FOR AINAIN
 * Vanilla JavaScript implementation
 * Handles:
 * - Opening gate unlock & audio gesture authorization
 * - Custom sacred audio player with progress scrubbing, time readouts, skip controls
 * - Sticky mini audio controller on scroll
 * - iOS Safari & Android Chrome page visibility pause handling
 * - Drifting Kashmiri Chinar leaves & diya embers ambient canvas
 * - Scroll animations & Ameen prayer interaction
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- Elements ---
  const gate = document.getElementById('opening-gate');
  const gateStartBtn = document.getElementById('gate-start-btn');
  const audio = document.getElementById('naat-audio');
  const voiceCard = document.querySelector('.voice-card');
  const mainPlayBtn = document.getElementById('main-play-btn');
  const playIconSvg = document.getElementById('play-icon-svg');
  const pauseIconSvg = document.getElementById('pause-icon-svg');
  const currentTimeEl = document.getElementById('current-time');
  const durationTimeEl = document.getElementById('duration-time');
  const progressTrack = document.getElementById('progress-track');
  const progressFill = document.getElementById('progress-fill');
  const progressThumb = document.getElementById('progress-thumb');
  const skipBackBtn = document.getElementById('skip-back-btn');
  const skipFwdBtn = document.getElementById('skip-fwd-btn');
  const volumeSlider = document.getElementById('volume-slider');
  const muteBtn = document.getElementById('mute-btn');
  const volIcon = document.getElementById('vol-icon');

  // Sticky Bar Elements
  const stickyBar = document.getElementById('sticky-audio-bar');
  const stickyPlayBtn = document.getElementById('sticky-play-btn');
  const stickyPlayIcon = stickyPlayBtn ? stickyPlayBtn.querySelector('.play-icon') : null;
  const stickyPauseIcon = stickyPlayBtn ? stickyPlayBtn.querySelector('.pause-icon') : null;
  const stickyTimeDisplay = document.getElementById('sticky-time-display');
  const stickyProgressFill = document.getElementById('sticky-progress-fill');
  const stickyJumpPlayer = document.getElementById('sticky-jump-player');

  // Interactive Elements
  const ameenBtn = document.getElementById('ameen-btn');
  const ameenFeedback = document.getElementById('ameen-feedback');
  const footerReplayBtn = document.getElementById('footer-replay-btn');
  const ambientToggle = document.getElementById('ambient-toggle');
  const canvas = document.getElementById('ambient-canvas');

  // State Variables
  let isDraggingProgress = false;
  let previousVolume = 0.7;
  let isAmbianceActive = true;
  let animationFrameId = null;

  // Check if URL has ?entered=true or #entered for preview / automated inspection
  const isPreviewMode = window.location.search.includes('entered=true') || window.location.hash.includes('entered');
  if (isPreviewMode && gate) {
    gate.style.display = 'none';
    gate.classList.add('gate-dismissed');
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
  }

  // Set default audio volume comfortably (70%)
  if (audio) {
    audio.volume = 0.7;
  }

  // =========================================================================
  // 1. OPENING GATE EXPERIENCE
  // =========================================================================
  if (gateStartBtn && gate && audio) {
    gateStartBtn.addEventListener('click', () => {
      // Start audio playback on explicit user tap (complies with iOS/Android autoplay policy)
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            updatePlayPauseUI(true);
          })
          .catch((err) => {
            console.warn('Audio play was prevented or delayed:', err);
            updatePlayPauseUI(false);
          });
      }

      // Smoothly dismiss the gate
      gate.classList.add('gate-fading');
      setTimeout(() => {
        gate.classList.add('gate-dismissed');
      }, 1100);
      document.body.style.overflow = 'auto';

      // Focus dedication section gently after a moment
      setTimeout(() => {
        const titleEl = document.querySelector('.grandfather-name');
        if (titleEl) {
          titleEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 400);
    });
  }

  // =========================================================================
  // 2. AUDIO PLAYBACK & CONTROLLER LOGIC
  // =========================================================================
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function updatePlayPauseUI(isPlaying) {
    if (!playIconSvg || !pauseIconSvg) return;

    if (isPlaying) {
      playIconSvg.classList.add('hidden');
      pauseIconSvg.classList.remove('hidden');
      if (voiceCard) voiceCard.classList.add('is-playing');

      if (stickyPlayIcon && stickyPauseIcon) {
        stickyPlayIcon.classList.add('hidden');
        stickyPauseIcon.classList.remove('hidden');
      }
    } else {
      playIconSvg.classList.remove('hidden');
      pauseIconSvg.classList.add('hidden');
      if (voiceCard) voiceCard.classList.remove('is-playing');

      if (stickyPlayIcon && stickyPauseIcon) {
        stickyPlayIcon.classList.remove('hidden');
        stickyPauseIcon.classList.add('hidden');
      }
    }
  }

  function togglePlay() {
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => updatePlayPauseUI(true)).catch(console.warn);
    } else {
      audio.pause();
      updatePlayPauseUI(false);
    }
  }

  if (mainPlayBtn) {
    mainPlayBtn.addEventListener('click', togglePlay);
  }

  if (stickyPlayBtn) {
    stickyPlayBtn.addEventListener('click', togglePlay);
  }

  // Update progress bar as audio plays
  if (audio) {
    audio.addEventListener('timeupdate', () => {
      if (isDraggingProgress) return;
      const current = audio.currentTime;
      const duration = audio.duration || 428.85; // Known duration fallback ~7:08

      const percentage = (current / duration) * 100;
      if (progressFill) progressFill.style.width = `${percentage}%`;
      if (progressThumb) progressThumb.style.left = `${percentage}%`;
      if (progressTrack) progressTrack.setAttribute('aria-valuenow', Math.round(percentage));

      if (currentTimeEl) currentTimeEl.textContent = formatTime(current);
      if (durationTimeEl && !isNaN(audio.duration)) {
        durationTimeEl.textContent = formatTime(audio.duration);
      }

      // Sticky Bar
      if (stickyProgressFill) stickyProgressFill.style.width = `${percentage}%`;
      if (stickyTimeDisplay) {
        stickyTimeDisplay.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
      }
    });

    audio.addEventListener('loadedmetadata', () => {
      if (durationTimeEl) durationTimeEl.textContent = formatTime(audio.duration);
      if (stickyTimeDisplay) {
        stickyTimeDisplay.textContent = `0:00 / ${formatTime(audio.duration)}`;
      }
    });

    audio.addEventListener('play', () => updatePlayPauseUI(true));
    audio.addEventListener('pause', () => updatePlayPauseUI(false));

    audio.addEventListener('ended', () => {
      updatePlayPauseUI(false);
      if (progressFill) progressFill.style.width = '0%';
      if (progressThumb) progressThumb.style.left = '0%';
      if (currentTimeEl) currentTimeEl.textContent = '0:00';
    });
  }

  // Progress scrubbing (Touch & Click)
  function seekToPosition(clientX) {
    if (!audio || !progressTrack) return;
    const rect = progressTrack.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = clickX / rect.width;
    const duration = audio.duration || 428.85;

    audio.currentTime = percentage * duration;

    if (progressFill) progressFill.style.width = `${percentage * 100}%`;
    if (progressThumb) progressThumb.style.left = `${percentage * 100}%`;
    if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
  }

  if (progressTrack) {
    progressTrack.addEventListener('click', (e) => {
      seekToPosition(e.clientX);
    });

    // Touch & Mouse Dragging
    const handleDragMove = (e) => {
      if (!isDraggingProgress) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      seekToPosition(clientX);
    };

    const handleDragEnd = () => {
      if (isDraggingProgress) {
        isDraggingProgress = false;
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchmove', handleDragMove);
        document.removeEventListener('touchend', handleDragEnd);
      }
    };

    progressTrack.addEventListener('mousedown', (e) => {
      isDraggingProgress = true;
      seekToPosition(e.clientX);
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
    });

    progressTrack.addEventListener('touchstart', (e) => {
      isDraggingProgress = true;
      seekToPosition(e.touches[0].clientX);
      document.addEventListener('touchmove', handleDragMove, { passive: true });
      document.addEventListener('touchend', handleDragEnd);
    });

    // Keyboard support (Accessibility)
    progressTrack.addEventListener('keydown', (e) => {
      if (!audio) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        audio.currentTime = Math.min(audio.currentTime + 5, audio.duration || 428.85);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        audio.currentTime = Math.max(audio.currentTime - 5, 0);
      }
    });
  }

  // Skip -10s and +10s
  if (skipBackBtn && audio) {
    skipBackBtn.addEventListener('click', () => {
      audio.currentTime = Math.max(audio.currentTime - 10, 0);
    });
  }

  if (skipFwdBtn && audio) {
    skipFwdBtn.addEventListener('click', () => {
      const maxDuration = audio.duration || 428.85;
      audio.currentTime = Math.min(audio.currentTime + 10, maxDuration);
    });
  }

  // Volume Slider & Mute
  function updateVolumeIcon(volume, isMuted) {
    if (!volIcon) return;
    if (isMuted || volume === 0) {
      volIcon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
    } else if (volume < 0.5) {
      volIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>';
    } else {
      volIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
    }
  }

  if (volumeSlider && audio) {
    volumeSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      audio.volume = val;
      audio.muted = (val === 0);
      updateVolumeIcon(val, audio.muted);
      if (val > 0) previousVolume = val;
    });
  }

  if (muteBtn && audio) {
    muteBtn.addEventListener('click', () => {
      if (audio.muted || audio.volume === 0) {
        audio.muted = false;
        audio.volume = previousVolume > 0 ? previousVolume : 0.7;
        if (volumeSlider) volumeSlider.value = audio.volume;
        updateVolumeIcon(audio.volume, false);
      } else {
        previousVolume = audio.volume;
        audio.muted = true;
        audio.volume = 0;
        if (volumeSlider) volumeSlider.value = 0;
        updateVolumeIcon(0, true);
      }
    });
  }

  // =========================================================================
  // 3. PAGE VISIBILITY API: PAUSE AUDIO WHEN APP / TAB IS HIDDEN
  // (Required for clean iOS Safari / Android Chrome experience)
  // =========================================================================
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      if (audio && !audio.paused) {
        audio.pause();
        updatePlayPauseUI(false);
      }
    }
  });

  // =========================================================================
  // 4. STICKY MINI AUDIO BAR ON SCROLL
  // =========================================================================
  const voiceSection = document.getElementById('section-voice');

  function checkStickyBar() {
    if (!stickyBar || !voiceSection || (gate && !gate.classList.contains('gate-dismissed'))) return;
    const rect = voiceSection.getBoundingClientRect();
    // Show sticky player when main player is scrolled above the view
    if (rect.bottom < 80) {
      stickyBar.classList.remove('hidden');
    } else {
      stickyBar.classList.add('hidden');
    }
  }

  window.addEventListener('scroll', checkStickyBar, { passive: true });

  if (stickyJumpPlayer) {
    stickyJumpPlayer.addEventListener('click', () => {
      if (voiceSection) {
        voiceSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // =========================================================================
  // 5. INTERSECTION OBSERVER FOR GENTLE SCROLL FADES
  // =========================================================================
  const fadeElements = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window && !isPreviewMode) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.05,
      rootMargin: '0px 0px -20px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
  } else {
    // If preview mode or IntersectionObserver is unsupported
    fadeElements.forEach(el => el.classList.add('visible'));
  }

  // =========================================================================
  // 6. AMEEN BUTTON INTERACTION
  // =========================================================================
  if (ameenBtn) {
    // Check if previously pressed
    const hasSaidAmeen = localStorage.getItem('for_daddy_said_ameen');
    if (hasSaidAmeen) {
      ameenBtn.classList.add('ameen-pressed');
      const textSpan = document.getElementById('ameen-btn-text');
      if (textSpan) textSpan.textContent = 'Ameen 🤲';
      if (ameenFeedback) ameenFeedback.textContent = 'Your Ameen is remembered. May Allah elevate his status.';
    }

    ameenBtn.addEventListener('click', () => {
      ameenBtn.classList.add('ameen-pressed');
      const textSpan = document.getElementById('ameen-btn-text');
      if (textSpan) textSpan.textContent = 'Ameen 🤲';

      if (ameenFeedback) {
        ameenFeedback.textContent = 'May Allah accept our dua and grant Daddy the highest station in Jannah.';
      }

      try {
        localStorage.setItem('for_daddy_said_ameen', 'true');
      } catch (e) {
        // LocalStorage gracefully ignored if unavailable
      }
    });
  }

  // =========================================================================
  // 7. FOOTER REPLAY BUTTON
  // =========================================================================
  if (footerReplayBtn && audio) {
    footerReplayBtn.addEventListener('click', () => {
      if (voiceSection) {
        voiceSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setTimeout(() => {
        audio.currentTime = 0;
        audio.play().then(() => updatePlayPauseUI(true)).catch(console.warn);
      }, 350);
    });
  }

  // =========================================================================
  // 8. AMBIENT CANVAS: DRIFTING CHINAR LEAVES & DIYA PARTICLES
  // =========================================================================
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      isAmbianceActive = false;
    }

    function resizeCanvas() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Leaf silhouette drawer (Stylized Chinar / Maple leaf)
    function drawChinarLeaf(ctx, size, color, alpha) {
      ctx.save();
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      // Draw 5-pointed Kashmiri Chinar leaf shape
      ctx.moveTo(0, -size);
      ctx.quadraticCurveTo(size * 0.3, -size * 0.7, size * 0.6, -size * 0.6);
      ctx.quadraticCurveTo(size * 0.4, -size * 0.3, size * 0.85, -size * 0.1);
      ctx.quadraticCurveTo(size * 0.5, size * 0.1, size * 0.7, size * 0.4);
      ctx.quadraticCurveTo(size * 0.3, size * 0.4, size * 0.2, size * 0.8);
      ctx.lineTo(0, size * 0.5); // base
      ctx.lineTo(-size * 0.2, size * 0.8);
      ctx.quadraticCurveTo(-size * 0.3, size * 0.4, -size * 0.7, size * 0.4);
      ctx.quadraticCurveTo(-size * 0.5, size * 0.1, -size * 0.85, -size * 0.1);
      ctx.quadraticCurveTo(-size * 0.4, -size * 0.3, -size * 0.6, -size * 0.6);
      ctx.quadraticCurveTo(-size * 0.3, -size * 0.7, 0, -size);
      ctx.closePath();
      ctx.fill();

      // Delicate stem
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, size * 0.5);
      ctx.lineTo(0, size * 1.1);
      ctx.stroke();

      ctx.restore();
    }

    // Particle Classes
    const leafColors = [
      '#a83d28', // Chinar Autumn Red
      '#d97d36', // Warm Amber
      '#e5a84b', // Golden Saffron
      '#b85e26', // Deep Rust
      '#c97b83'  // Pashmina Rose tint
    ];

    class Leaf {
      constructor() {
        this.reset(true);
      }
      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -30;
        this.size = Math.random() * 9 + 8; // 8 - 17px
        this.speedY = Math.random() * 0.55 + 0.35; // Gentle slow descent
        this.speedX = Math.random() * 0.4 - 0.2;
        this.angle = Math.random() * Math.PI * 2;
        this.angularSpeed = (Math.random() - 0.5) * 0.015;
        this.color = leafColors[Math.floor(Math.random() * leafColors.length)];
        this.alpha = Math.random() * 0.35 + 0.25; // Translucent, subtle
        this.sway = Math.random() * 100;
        this.swaySpeed = Math.random() * 0.02 + 0.01;
      }
      update() {
        this.y += this.speedY;
        this.sway += this.swaySpeed;
        this.x += Math.sin(this.sway) * 0.5 + this.speedX;
        this.angle += this.angularSpeed;

        if (this.y > height + 40 || this.x < -40 || this.x > width + 40) {
          this.reset(false);
        }
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        drawChinarLeaf(ctx, this.size, this.color, this.alpha);
        ctx.restore();
      }
    }

    class DiyaSpark {
      constructor() {
        this.reset(true);
      }
      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 10;
        this.radius = Math.random() * 1.8 + 0.6;
        this.speedY = -(Math.random() * 0.4 + 0.2); // Slowly rise like embers
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.alpha = Math.random() * 0.5 + 0.2;
        this.pulse = Math.random() * Math.PI;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.pulse += 0.03;
        if (this.y < -10) this.reset(false);
      }
      draw() {
        const currentAlpha = Math.max(0.1, this.alpha + Math.sin(this.pulse) * 0.15);
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffd58a';
        ctx.globalAlpha = currentAlpha;
        ctx.shadowColor = '#f39c38';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }
    }

    // Determine particle count based on screen size (keeps lightweight on mobile)
    const isMobile = window.innerWidth < 640;
    const leafCount = isMobile ? 12 : 20;
    const sparkCount = isMobile ? 16 : 28;

    const leaves = Array.from({ length: leafCount }, () => new Leaf());
    const sparks = Array.from({ length: sparkCount }, () => new DiyaSpark());

    function animate() {
      if (!isAmbianceActive) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Render sparks
      for (let i = 0; i < sparks.length; i++) {
        sparks[i].update();
        sparks[i].draw();
      }

      // Render leaves
      for (let i = 0; i < leaves.length; i++) {
        leaves[i].update();
        leaves[i].draw();
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    // Start ambient loop
    if (isAmbianceActive) {
      animate();
    }

    // Toggle button handler
    if (ambientToggle) {
      ambientToggle.addEventListener('click', () => {
        isAmbianceActive = !isAmbianceActive;
        const btnText = ambientToggle.querySelector('.btn-text');

        if (isAmbianceActive) {
          if (btnText) btnText.textContent = 'Ambiance';
          ambientToggle.style.opacity = '1';
          cancelAnimationFrame(animationFrameId);
          animate();
        } else {
          if (btnText) btnText.textContent = 'Still';
          ambientToggle.style.opacity = '0.6';
          cancelAnimationFrame(animationFrameId);
          ctx.clearRect(0, 0, width, height);
        }
      });
    }
  }

});
