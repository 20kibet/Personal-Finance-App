/* ============================================
   FINANCEAPP - Main JavaScript
   White & Teal Theme — Professional
   ============================================ */

/* ============================================
   1. CHART.JS GLOBAL DEFAULTS
   (must run before DOMContentLoaded)
   ============================================ */
if (typeof Chart !== 'undefined') {
  Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
  Chart.defaults.font.size = 11;
  Chart.defaults.font.weight = '500';
  Chart.defaults.color = '#5f7b78';
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.pointStyleWidth = 8;
  Chart.defaults.plugins.legend.labels.padding = 16;
  Chart.defaults.plugins.tooltip.backgroundColor = '#0f2b28';
  Chart.defaults.plugins.tooltip.padding = 12;
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
  Chart.defaults.plugins.tooltip.titleColor = '#5eead4';
  Chart.defaults.plugins.tooltip.bodyColor = '#d1ece8';
  Chart.defaults.plugins.tooltip.borderColor = 'rgba(13,148,136,0.2)';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.animation.duration = 900;
  Chart.defaults.animation.easing = 'easeOutQuart';
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
      !el.classList.contains('auth-input') &&
      el.type !== 'submit' &&
      el.type !== 'checkbox' &&
      el.type !== 'radio' &&
      el.type !== 'file' &&
      el.type !== 'hidden'
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
     2.3 Auto-dismiss alerts after 4.5s
  ------------------------------------------ */
  document.querySelectorAll('.alert').forEach((alert, i) => {
    setTimeout(() => {
      alert.style.transition = 'opacity 0.5s ease, transform 0.5s ease, max-height 0.4s ease';
      alert.style.opacity = '0';
      alert.style.transform = 'translateY(-8px)';
      setTimeout(() => alert.remove(), 500);
    }, 4500 + i * 400);
  });

  /* ------------------------------------------
     2.4 Animate stat cards on load
  ------------------------------------------ */
  document.querySelectorAll('.stat-card, .stat-mini').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.45s ease, transform 0.45s cubic-bezier(0.34,1.2,0.64,1), box-shadow 0.25s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 80 + i * 90);
  });

  /* ------------------------------------------
     2.5 Animate dash cards and generic cards
  ------------------------------------------ */
  document.querySelectorAll('.card, .dash-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(14px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease, box-shadow 0.25s ease, border-color 0.25s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 120 + i * 60);
  });

  /* ------------------------------------------
     2.6 Animate progress bars
  ------------------------------------------ */
  document.querySelectorAll('.progress-bar').forEach(bar => {
    const target = bar.style.width || bar.getAttribute('aria-valuenow') + '%';
    bar.style.width = '0%';
    setTimeout(() => {
      bar.style.transition = 'width 1.1s cubic-bezier(0.4, 0, 0.2, 1)';
      bar.style.width = target;
    }, 450);
  });

  /* ------------------------------------------
     2.7 Count-up animation for stat values
  ------------------------------------------ */
  function countUp(el) {
    const text = el.textContent.trim();
    const num = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (isNaN(num) || num === 0) return;
    const hasDecimal = text.includes('.');
    const prefix = text.includes('Ksh') ? 'Ksh ' : '';
    const suffix = text.endsWith('%') ? '%' : '';
    const steps = 40;
    let current = 0;
    const increment = num / steps;
    const interval = 900 / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= num) {
        current = num;
        clearInterval(timer);
      }
      const formatted = hasDecimal
        ? current.toFixed(2)
        : Math.floor(current);
      el.textContent = prefix + Number(formatted).toLocaleString() + suffix;
    }, interval);
  }

  setTimeout(() => {
    document.querySelectorAll(
      '.stat-card .stat-value, .stat-mini .stat-mini-value'
    ).forEach(el => countUp(el));
  }, 300);

  /* ------------------------------------------
     2.8 Ripple effect on buttons
  ------------------------------------------ */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      // Don't add ripple if button already has one pending
      if (btn.querySelector('.ripple')) return;

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

    function resizeCanvas() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();

    const PARTICLE_COUNT = 60;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      r:  Math.random() * 2 + 0.8,
      dx: (Math.random() - 0.5) * 0.45,
      dy: (Math.random() - 0.5) * 0.45,
      o:  Math.random() * 0.35 + 0.08,
      pulse: Math.random() * Math.PI * 2
    }));

    let animFrame;

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.pulse += 0.02;
        const alpha = p.o + Math.sin(p.pulse) * 0.05;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(45,212,191,${alpha})`;
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });

      // Connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const d = Math.hypot(
            particles[i].x - particles[j].x,
            particles[i].y - particles[j].y
          );
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(13,148,136,${0.12 * (1 - d / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animFrame = requestAnimationFrame(drawParticles);
    }

    drawParticles();

    window.addEventListener('resize', () => {
      resizeCanvas();
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
          + Math.sin((x + offset) * 0.013) * 20
          + Math.sin((x + offset * 0.8) * 0.007) * 12
          + Math.sin((x + offset * 1.2) * 0.02) * 6;
        wCtx.lineTo(x, y);
      }

      wCtx.lineTo(waveCanvas.width, 90);
      wCtx.lineTo(0, 90);
      wCtx.closePath();
      wCtx.fillStyle = 'rgba(13,148,136,0.06)';
      wCtx.fill();
      offset += 1.0;
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
        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Signing in...';
        btn.disabled = true;
      }
    });
  }

  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function () {
      const btn = document.getElementById('registerBtn');
      if (btn) {
        btn.classList.add('loading');
        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Creating account...';
        btn.disabled = true;
      }
    });
  }

  /* ------------------------------------------
     2.12 Password strength indicator
  ------------------------------------------ */
  document.querySelectorAll('input[type="password"]').forEach(input => {
    input.addEventListener('input', function () {
      const bar = document.getElementById(`strength-${this.name}`);
      if (!bar) return;

      const val = this.value;
      let strength = 0;
      if (val.length >= 8)                                    strength += 33;
      if (val.match(/[a-z]/) && val.match(/[A-Z]/))          strength += 33;
      if (val.match(/[0-9]/) && val.match(/[^a-zA-Z0-9]/))   strength += 34;

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
    const userBtn  = document.getElementById('userTabBtn');
    const adminBtn = document.getElementById('adminTabBtn');
    const userForm  = document.getElementById('userLoginForm');
    const adminForm = document.getElementById('adminLoginForm');

    if (!userBtn || !adminBtn || !userForm || !adminForm) return;

    if (tab === 'user') {
      userBtn.classList.add('active');
      adminBtn.classList.remove('active');
      adminForm.style.display = 'none';
      userForm.style.display = 'block';
      userForm.classList.add('fade-in');
      userForm.classList.remove('fade-out');
    } else {
      adminBtn.classList.add('active');
      userBtn.classList.remove('active');
      userForm.style.display = 'none';
      adminForm.style.display = 'block';
      adminForm.classList.add('fade-in');
      adminForm.classList.remove('fade-out');
    }
  }

  window.switchTab = switchTab;

  const userLoginForm = document.getElementById('userLoginForm');
  if (userLoginForm) {
    userLoginForm.addEventListener('submit', function () {
      const btn = document.getElementById('userSubmitBtn');
      if (btn) {
        btn.classList.add('loading');
        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Signing in...';
        btn.disabled = true;
      }
    });
  }

  const adminLoginForm = document.getElementById('adminLoginForm');
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', function () {
      const btn = document.getElementById('adminSubmitBtn');
      if (btn) {
        btn.classList.add('loading');
        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Accessing panel...';
        btn.disabled = true;
      }
    });
  }

  /* ------------------------------------------
     2.14 Smooth scroll for anchors
  ------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ------------------------------------------
     2.15 Topbar scroll shadow enhancement
  ------------------------------------------ */
  const topbar = document.querySelector('.topbar');
  if (topbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        topbar.style.boxShadow = '0 2px 20px rgba(13,148,136,0.12)';
      } else {
        topbar.style.boxShadow = '0 1px 0 var(--border), 0 4px 16px rgba(13,148,136,0.06)';
      }
    }, { passive: true });
  }

  /* ------------------------------------------
     2.16 Table row click feedback
  ------------------------------------------ */
  document.querySelectorAll('table tbody tr[data-href]').forEach(row => {
    row.style.cursor = 'pointer';
    row.addEventListener('click', function () {
      window.location.href = this.dataset.href;
    });
  });

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
            '#0d9488', '#14b8a6', '#2dd4bf', '#5eead4',
            '#0f766e', '#059669', '#0284c7', '#6d28d9',
            '#7c3aed', '#db2777'
          ],
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 10,
          hoverBorderWidth: 3,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 9,
              padding: 14,
              font: { size: 11, weight: '600' }
            }
          },
          tooltip: {
            callbacks: {
              label: function (c) {
                const total = c.dataset.data.reduce((a, b) => a + b, 0);
                const pct = ((c.raw / total) * 100).toFixed(1);
                return `  Ksh ${c.raw.toLocaleString()} (${pct}%)`;
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true
        }
      }
    });
  }
}

/* ------------------------------------------
   3.2 Income vs Expense bar chart (if present)
------------------------------------------ */
const incomeExpenseCanvas = document.getElementById('incomeExpenseChart');
if (incomeExpenseCanvas) {
  const labels   = JSON.parse(incomeExpenseCanvas.dataset.labels   || '[]');
  const incomes  = JSON.parse(incomeExpenseCanvas.dataset.incomes  || '[]');
  const expenses = JSON.parse(incomeExpenseCanvas.dataset.expenses || '[]');

  if (labels.length > 0) {
    new Chart(incomeExpenseCanvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Income',
            data: incomes,
            backgroundColor: 'rgba(13,148,136,0.8)',
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: 'Expenses',
            data: expenses,
            backgroundColor: 'rgba(225,29,72,0.7)',
            borderRadius: 6,
            borderSkipped: false,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: c => `  Ksh ${c.raw.toLocaleString()}`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false }
          },
          y: {
            grid: { color: 'rgba(13,148,136,0.06)' },
            border: { display: false },
            ticks: {
              callback: v => 'Ksh ' + (v >= 1000 ? (v/1000).toFixed(0) + 'k' : v)
            }
          }
        }
      }
    });
  }
}

/* ------------------------------------------
   3.3 Signup trend chart (admin dashboard)
------------------------------------------ */
const signupCanvas = document.getElementById('signupChart');
if (signupCanvas) {
  const months = JSON.parse(signupCanvas.dataset.months || '[]');
  const counts = JSON.parse(signupCanvas.dataset.counts || '[]');

  if (months.length > 0) {
    new Chart(signupCanvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'New Signups',
          data: counts,
          borderColor: '#0d9488',
          backgroundColor: 'rgba(13,148,136,0.08)',
          borderWidth: 2.5,
          pointBackgroundColor: '#0d9488',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: c => `  ${c.raw} new user${c.raw !== 1 ? 's' : ''}`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false }
          },
          y: {
            grid: { color: 'rgba(13,148,136,0.06)' },
            border: { display: false },
            ticks: { precision: 0 },
            beginAtZero: true
          }
        }
      }
    });
  }
}