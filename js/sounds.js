// Real ULTRAKILL Sound Effects Engine
class SoundEngine {
  constructor() {
    this.muted = localStorage.getItem('sound_muted') === 'true';
    this.bgm = null;
    this.bgmPlaying = false;

    // Real sound file paths from ULTRAKILL
    this.soundPaths = {
      parry: 'assets/sounds/parry.mp3',
      coin: 'assets/sounds/coin.mp3',
      punch: 'assets/sounds/punch.mp3',
      judgement: 'assets/sounds/judgement.mp3',
      niceTry: 'assets/sounds/nice-try.mp3',
      prepareThyself: 'assets/sounds/prepare-thyself.mp3',
      thyEndIsNow: 'assets/sounds/thy-end-is-now.mp3',
      destroy: 'assets/sounds/destroy.mp3',
      enrage: 'assets/sounds/enrage.mp3',
      intro: 'assets/sounds/intro.mp3',
      explosion: 'assets/sounds/explosion.mp3',
      flash: 'assets/sounds/flash.mp3',
      behold: 'assets/sounds/behold.mp3'
    };

    // Preloaded audio cache
    this.audioCache = {};
    this.preloadSounds();
  }

  preloadSounds() {
    for (const [key, path] of Object.entries(this.soundPaths)) {
      const audio = new Audio(path);
      audio.preload = 'auto';
      this.audioCache[key] = audio;
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('sound_muted', this.muted);
    if (this.bgm && this.muted) {
      this.bgm.pause();
      this.bgmPlaying = false;
    }
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  // Helper to play audio (cloning enables rapid polyphonic playback)
  playSound(key, volume = 0.8) {
    if (this.muted) return;
    try {
      const src = this.soundPaths[key];
      if (!src) return;
      const sound = new Audio(src);
      sound.volume = volume;
      sound.play().catch(e => {
        // Autoplay restrictions handle
        console.warn('Audio play restricted until user interacts:', e);
      });
      return sound;
    } catch (err) {
      console.error('Error playing sound:', err);
    }
  }

  // --- Real ULTRAKILL Sound Methods ---

  // Real ULTRAKILL Parry Sound (Punch + Explosion + Ringing Chime)
  playParry() {
    return this.playSound('parry', 0.95);
  }

  // Real ULTRAKILL Marksman Coin Toss Flick
  playCoinToss() {
    return this.playSound('coin', 0.9);
  }

  // Real ULTRAKILL Feedbacker Punch
  playPunch() {
    return this.playSound('punch', 0.85);
  }

  // Real Minos Prime "JUDGEMENT!"
  playJudgement() {
    return this.playSound('judgement', 0.95);
  }

  // Real Sisyphus Prime "Nice try!"
  playNiceTry() {
    return this.playSound('niceTry', 0.95);
  }

  // Real Minos Prime "PREPARE THYSELF!"
  playPrepareThyself() {
    return this.playSound('prepareThyself', 0.95);
  }

  // Real Minos Prime "THY END IS NOW!"
  playThyEndIsNow() {
    return this.playSound('thyEndIsNow', 0.95);
  }

  // Real Sisyphus Prime "DESTROY!"
  playDestroy() {
    return this.playSound('destroy', 0.95);
  }

  // Real ULTRAKILL Enrage sound
  playEnrage() {
    return this.playSound('enrage', 0.9);
  }

  // Real ULTRAKILL Intro sound
  playIntro() {
    return this.playSound('intro', 0.9);
  }

  // Real ULTRAKILL Explosion / Projectile Boost
  playExplosion() {
    return this.playSound('explosion', 0.9);
  }

  // Real ULTRAKILL Attack Flash indicator
  playFlash() {
    return this.playSound('flash', 0.85);
  }

  // Real Gabriel "BEHOLD! THE POWER OF AN ANGEL!"
  playBehold() {
    return this.playSound('behold', 0.95);
  }

  // Victory / P-Rank: Combines intro with Gabriel / Minos hype
  playPRankFanfare() {
    if (this.muted) return;
    this.playSound('intro', 0.9);
    setTimeout(() => {
      this.playSound('behold', 0.85);
    }, 450);
  }

  // Style Level Up Chime (uses real flash + parry cue)
  playStyleUp() {
    return this.playSound('flash', 0.7);
  }

  // Terminal UI Click / Button Hover
  playTerminalBeep() {
    return this.playSound('flash', 0.35);
  }

  // Wheel Peg Tick (uses crisp real coin/flash click)
  playWheelTick() {
    return this.playSound('coin', 0.3);
  }

  // Iron Man Arc Reactor & Repulsor mappings
  playArcReactorHum() {
    return this.playSound('enrage', 0.85);
  }

  playRepulsor() {
    return this.playSound('explosion', 0.9);
  }

  // Background Music Toggle (Notion.mp3)
  setupBgm(audioElementId) {
    const el = document.getElementById(audioElementId);
    if (!el) return;
    this.bgm = el;
    this.bgm.volume = 0.4;
  }

  toggleBgm() {
    if (!this.bgm) return false;
    if (this.bgmPlaying) {
      this.bgm.pause();
      this.bgmPlaying = false;
    } else {
      this.bgm.play().then(() => {
        this.bgmPlaying = true;
      }).catch(e => console.log('BGM play prevented:', e));
    }
    return this.bgmPlaying;
  }
}

// Global singleton instance
window.soundFx = new SoundEngine();
