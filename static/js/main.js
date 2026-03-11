/* ============================================
   FINANCEAPP - Main JavaScript
   White & Teal Theme
   ============================================ */

/* ============================================
   1. CHART.JS GLOBAL DEFAULTS
   (must run before DOMContentLoaded)
   ============================================ */
if (typeof Chart !== 'undefined') {
  Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
  Chart.defaults.font.size = 11;
  Chart.defaults.color = '#6b7280';
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.padding = 14;
  Chart.defaults.plugins.tooltip.backgroundColor = '#134e4a';
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.plugins.tooltip.cornerRadius = 6;
  Chart.defaults.plugins.tooltip.titleColor = '#2dd4bf';
  Chart.defaults.plugins.tooltip.bodyColor = '#e2e8f0';
  Chart.defaults.animation.duration = 800;
}

/* ============================================
   2. DOM READY
   ============================================ */
document.addEventListener('DOMContentLoaded', function () {

  /* ------------------------------------------
     2.1 Auto-style form inputs
  ------------------------------------------ */
  document.querySelectorAll('input, select, textarea').forEach(el => {
    if (
      !el.classList.contains('btn') &&
      el.type !== 'submit' &&
      el.type !== 'checkbox' &&
      el.type !== 'radio' &&
      el.type !== 'file'
    ) {
      el.classList.add('form-control');
    }
  });

  /* ------------------------------------------
     2.2 Live date in topbar
  ------------------------------------------ */
  const dateEl = document.getElementById('topbar-date');
  if (dateEl) {
    const now = new Date();
    dateEl.textContent = now.toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    });
  }

  /* ------------------------------------------
     2.3 Auto-dismiss alerts after 4s
  ------------------------------------------ */
  document.querySelectorAll('.alert').forEach(alert => {
    setTimeout(() => {
      alert.style.transition = 'opacity 0.4s ease';
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 400);
    }, 4000);
  });

  /* ------------------------------------------
     2.4 Animate stat cards on load
  ------------------------------------------ */
  document.querySelectorAll('.stat-card, .stat-mini').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(18px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease, box-shadow 0.25s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 80);
  });

  /* ------------------------------------------
     2.5 Animate general cards on load
  ------------------------------------------ */
  document.querySelectorAll('.card, .dash-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(12px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.35s ease, transform 0.35s ease, box-shadow 0.25s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100 + i * 55);
  });

  /* ------------------------------------------
     2.6 Animate progress bars
  ------------------------------------------ */
  document.querySelectorAll('.progress-bar').forEach(bar => {
    const target = bar.style.width;
    bar.style.width = '0%';
    setTimeout(() => {
      bar.style.transition = 'width 0.9s ease';
      bar.style.width = target;
    }, 400);
  });

  /* ------------------------------------------
     2.7 Count-up animation for stat values
  ------------------------------------------ */
  function countUp(el) {
    const text = el.textContent;
    const num = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (isNaN(num) || num === 0) return;
    const hasDecimal = text.includes('.');
    const prefix = text.includes('Ksh') ? 'Ksh ' : '';
    const steps = 35;
    let current = 0;
    const increment = num / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= num) { current = num; clearInterval(timer); }
      el.textContent = prefix + (hasDecimal
        ? current.toFixed(2)
        : Math.floor(current)
      ).toLocaleString();
    }, 800 / steps);
  }

  setTimeout(() => {
    document.querySelectorAll('.stat-card .stat-value, .stat-mini .stat-mini-value')
      .forEach(el => countUp(el));
  }, 200);

  /* ------------------------------------------
     2.8 Ripple effect on buttons
  ------------------------------------------ */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width  = size + 'px';
      ripple.style.height = size + 'px';
      ripple.style.left   = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top    = (e.clientY - rect.top  - size / 2) + 'px';
      btn.style.position  = 'relative';
      btn.style.overflow  = 'hidden';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  /* ------------------------------------------
     2.9 Particle background (auth pages only)
  ------------------------------------------ */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 55 }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      r:  Math.random() * 2.5 + 1,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      o:  Math.random() * 0.4 + 0.1
    }));

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(45,212,191,${p.o})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const d = Math.hypot(
            particles[i].x - particles[j].x,
            particles[i].y - particles[j].y
          );
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(13,148,136,${0.1 * (1 - d / 110)})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(drawParticles);
    }

    drawParticles();
    window.addEventListener('resize', () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  /* ------------------------------------------
     2.10 Wave background (main pages only)
  ------------------------------------------ */
  const waveCanvas = document.getElementById('wave-canvas');
  if (waveCanvas) {
    const wCtx = waveCanvas.getContext('2d');
    let offset = 0;

    function drawWave() {
      waveCanvas.width  = window.innerWidth;
      waveCanvas.height = 90;
      wCtx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
      wCtx.beginPath();
      wCtx.moveTo(0, 45);
      for (let x = 0; x <= waveCanvas.width; x++) {
        const y = 45
          + Math.sin((x + offset) * 0.013) * 22
          + Math.sin((x + offset) * 0.007) * 14;
        wCtx.lineTo(x, y);
      }
      wCtx.lineTo(waveCanvas.width, 90);
      wCtx.lineTo(0, 90);
      wCtx.closePath();
      wCtx.fillStyle = 'rgba(13,148,136,0.07)';
      wCtx.fill();
      offset += 1.2;
      requestAnimationFrame(drawWave);
    }

    drawWave();
  }

  /* ------------------------------------------
     2.11 Auth form loading states
  ------------------------------------------ */
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function () {
      const btn = document.getElementById('submitBtn');
      if (btn) {
        btn.classList.add('loading');
        btn.innerHTML = '<i class="fas fa-circle-notch"></i> Signing in...';
      }
    });
  }

  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function () {
      const btn = document.getElementById('registerBtn');
      if (btn) {
        btn.classList.add('loading');
        btn.innerHTML = '<i class="fas fa-circle-notch"></i> Creating account...';
      }
    });
  }

  /* ------------------------------------------
     2.12 Password strength indicator (register page)
  ------------------------------------------ */
  document.querySelectorAll('input[type="password"]').forEach(input => {
    input.addEventListener('input', function () {
      const bar = document.getElementById(`strength-${this.name}`);
      if (!bar) return;

      const val = this.value;
      let strength = 0;
      if (val.length >= 8)                                          strength += 33;
      if (val.match(/[a-z]/) && val.match(/[A-Z]/))                strength += 33;
      if (val.match(/[0-9]/) && val.match(/[^a-zA-Z0-9]/))        strength += 34;

      bar.style.width = strength + '%';
      bar.className = 'auth-strength-bar';

      if      (strength < 33) bar.classList.add('strength-weak');
      else if (strength < 66) bar.classList.add('strength-medium');
      else                    bar.classList.add('strength-strong');
    });
  });

  /* ------------------------------------------
     2.13 Tabbed login interface
  ------------------------------------------ */
  function switchTab(tab) {
      const userBtn = document.getElementById('userTabBtn');
      const adminBtn = document.getElementById('adminTabBtn');
      const userForm = document.getElementById('userLoginForm');
      const adminForm = document.getElementById('adminLoginForm');
      
      if (!userBtn || !adminBtn || !userForm || !adminForm) return;
      
      if (tab === 'user') {
          userBtn.classList.add('active');
          adminBtn.classList.remove('active');
          userForm.style.display = 'block';
          adminForm.style.display = 'none';
          userForm.classList.add('fade-in');
      } else {
          adminBtn.classList.add('active');
          userBtn.classList.remove('active');
          adminForm.style.display = 'block';
          userForm.style.display = 'none';
          adminForm.classList.add('fade-in');
      }
  }

  // Attach tab switching to global scope
  window.switchTab = switchTab;

  // Handle user login form submission
  const userLoginForm = document.getElementById('userLoginForm');
  if (userLoginForm) {
      userLoginForm.addEventListener('submit', function(e) {
          const btn = document.getElementById('userSubmitBtn');
          if (btn) {
              btn.classList.add('loading');
              btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Signing in...';
          }
      });
  }

  // Handle admin login form submission
  const adminLoginForm = document.getElementById('adminLoginForm');
  if (adminLoginForm) {
      adminLoginForm.addEventListener('submit', function(e) {
          const btn = document.getElementById('adminSubmitBtn');
          if (btn) {
              btn.classList.add('loading');
              btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Accessing admin...';
          }
      });
  }

});

/* ============================================
   3. DASHBOARD CHARTS
   ============================================ */

/* ------------------------------------------
   3.1 Expense doughnut chart
------------------------------------------ */
const expenseCanvas = document.getElementById('expenseChart');
if (expenseCanvas) {
  const categories = JSON.parse(expenseCanvas.dataset.categories || '[]');
  const amounts    = JSON.parse(expenseCanvas.dataset.amounts    || '[]');

  if (categories.length > 0) {
    new Chart(expenseCanvas.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: categories,
        datasets: [{
          data: amounts,
          backgroundColor: [
            '#0d9488','#14b8a6','#2dd4bf','#5eead4',
            '#0f766e','#059669','#0284c7','#6d28d9'
          ],
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        cutout: '68%',
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 10, padding: 12 } },
          tooltip: {
            callbacks: {
              label: function (c) {
                const total = c.dataset.data.reduce((a, b) => a + b, 0);
                return ` Ksh ${c.raw.toLocaleString()} (${((c.raw / total) * 100).toFixed(1)}%)`;
              }
            }
          }
        }
      }
    });
  }
}