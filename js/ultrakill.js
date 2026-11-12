// Shared ULTRAKILL Logic & Interactivity
document.addEventListener('DOMContentLoaded', () => {
  // Setup audio hooks
  const muteBtn = document.getElementById('mute-toggle-btn');
  const bgmBtn = document.getElementById('bgm-toggle-btn');
  const bgmAudio = document.getElementById('bgm-audio');

  if (bgmAudio && window.soundFx) {
    window.soundFx.setupBgm('bgm-audio');
  }

  function updateMuteIcon() {
    if (!muteBtn || !window.soundFx) return;
    const isMuted = window.soundFx.isMuted();
    muteBtn.innerHTML = isMuted 
      ? '<span style="color:#ff4444;">[AUDIO: OFF]</span>' 
      : '<span style="color:#00ff73;">[AUDIO: ON]</span>';
  }

  function updateBgmIcon() {
    if (!bgmBtn || !window.soundFx) return;
    bgmBtn.innerHTML = window.soundFx.bgmPlaying
      ? '<span style="color:#ffd000;">[BGM: PLAYING]</span>'
      : '<span style="color:#8b99b5;">[BGM: PAUSED]</span>';
  }

  if (muteBtn) {
    updateMuteIcon();
    muteBtn.addEventListener('click', () => {
      window.soundFx.toggleMute();
      updateMuteIcon();
      if (!window.soundFx.isMuted()) {
        window.soundFx.playTerminalBeep();
      }
    });
  }

  if (bgmBtn) {
    updateBgmIcon();
    bgmBtn.addEventListener('click', () => {
      window.soundFx.toggleBgm();
      updateBgmIcon();
    });
  }

  // Interactive Style Meter system
  const styleRanks = [
    { rank: 'D', name: 'DESTRUCTIVE', color: '#00f0ff', pts: 250 },
    { rank: 'C', name: 'CHAOTIC', color: '#39ff14', pts: 500 },
    { rank: 'B', name: 'BRUTAL', color: '#ffea00', pts: 1000 },
    { rank: 'A', name: 'ANARCHIC', color: '#ff9100', pts: 1750 },
    { rank: 'S', name: 'SUPREME', color: '#ff3d00', pts: 2500 },
    { rank: 'SS', name: 'SSADISTIC', color: '#ff1744', pts: 3500 },
    { rank: 'SSS', name: 'SSSHITSTORM', color: '#ff0055', pts: 5000 },
    { rank: 'ULTRAKILL', name: 'ULTRAKILL', color: '#ffd700', pts: 10000 }
  ];

  let currentRankIdx = 3; // Start at A or S
  let styleScore = 1850;

  const styleBadge = document.getElementById('uk-style-rank');
  const styleName = document.getElementById('uk-style-name');
  const stylePoints = document.getElementById('uk-style-pts');

  function renderStyle() {
    if (!styleBadge || !styleName) return;
    const r = styleRanks[currentRankIdx];
    styleBadge.textContent = r.rank;
    styleBadge.style.color = r.color;
    styleBadge.style.textShadow = `0 0 20px ${r.color}, 2px 2px 0 #000`;
    styleName.textContent = r.name;
    styleName.style.color = r.color;
    if (stylePoints) {
      stylePoints.textContent = `STYLE: ${styleScore.toLocaleString()} PTS`;
    }
  }

  window.addStyle = function(amount = 250) {
    styleScore += amount;
    if (currentRankIdx < styleRanks.length - 1 && styleScore >= styleRanks[currentRankIdx + 1].pts) {
      currentRankIdx++;
      if (window.soundFx) window.soundFx.playStyleUp();
    }
    renderStyle();
  };

  renderStyle();

  // Attach sound feedback to standard buttons
  document.querySelectorAll('.uk-btn, .uk-nav-link, .uk-icon-btn, .im-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      if (window.soundFx) window.soundFx.playTerminalBeep();
    });
  });

  // Proposal Button Mechanics (if on index page)
  const acceptBtn = document.getElementById('uk-accept-btn');
  const rejectBtn = document.getElementById('uk-reject-btn');
  const modalOverlay = document.getElementById('uk-p-rank-modal');
  const closeModalBtn = document.getElementById('close-prank-modal');

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      if (window.soundFx) {
        window.soundFx.playPRankFanfare();
      }
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#ffd700', '#ff003c', '#00f0ff', '#ffffff']
        });
        setTimeout(() => {
          confetti({
            particleCount: 80,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ffd700', '#ff003c']
          });
          confetti({
            particleCount: 80,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#00f0ff', '#ffd700']
          });
        }, 300);
      }
      if (modalOverlay) {
        modalOverlay.classList.add('active');
      }
      window.addStyle(5000);
    });
  }

  if (closeModalBtn && modalOverlay) {
    closeModalBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      if (window.soundFx) window.soundFx.playTerminalBeep();
    });
  }

  if (rejectBtn) {
    let rejectDodges = 0;
    const dodgeReject = (e) => {
      rejectDodges++;
      
      // Alternate between real ULTRAKILL sound cues
      if (window.soundFx) {
        if (rejectDodges === 1) {
          window.soundFx.playParry();
        } else if (rejectDodges === 2) {
          window.soundFx.playNiceTry();
        } else if (rejectDodges === 3) {
          window.soundFx.playJudgement();
        } else {
          window.soundFx.playEnrage();
        }
      }
      
      const maxX = 180;
      const maxY = 70;
      const randX = (Math.random() - 0.5) * maxX * 2;
      const randY = (Math.random() - 0.5) * maxY * 2;

      rejectBtn.style.transform = `translate(${randX}px, ${randY}px)`;
      
      const phrases = [
        '+PARRIED! NICE TRY SAHIL!',
        '+ULTRARICOSHOT! CANNOT DECLINE',
        '+PROJECTILE BOOST! TRY AGAIN',
        'JUDGEMENT! SAHIL SAYS YES!',
        'HELL IS FULL... OF LOVE'
      ];
      rejectBtn.textContent = phrases[rejectDodges % phrases.length];
      rejectBtn.style.borderColor = '#ff003c';
      rejectBtn.style.color = '#ff003c';

      if (rejectDodges >= 4) {
        rejectBtn.textContent = 'ACCEPTING MISSION INSTEAD! ❤️';
        rejectBtn.style.borderColor = '#ffd000';
        rejectBtn.style.color = '#ffd000';
        rejectBtn.removeEventListener('mouseover', dodgeReject);
        rejectBtn.addEventListener('click', () => {
          if (acceptBtn) acceptBtn.click();
        });
      }
    };

    rejectBtn.addEventListener('mouseover', dodgeReject);
    rejectBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dodgeReject();
    });
  }
});
