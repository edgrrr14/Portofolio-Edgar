/* ============================================
   MAIN.JS — Portfolio Interactions
   ============================================ */

// ---- Sidebar Toggle (mobile) ----
const hamburgerBtn = document.getElementById('hamburgerBtn');
const sidebar      = document.getElementById('sidebar');
const overlay      = document.getElementById('sidebarOverlay');

function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('visible');
  hamburgerBtn.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('visible');
  hamburgerBtn.classList.remove('open');
  document.body.style.overflow = '';
}

hamburgerBtn.addEventListener('click', () => {
  sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
});

overlay.addEventListener('click', closeSidebar);

// Close on nav link click (mobile)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 960) closeSidebar();
  });
});

// ---- Active Nav Link on Scroll ----
const sections = document.querySelectorAll('.section');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  },
  { threshold: 0.35 }
);

sections.forEach(section => sectionObserver.observe(section));

// ---- Smooth scroll for nav links ----
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').replace('#', '');
    const target   = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const targetId = href.replace('#', '');
    const target   = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- 1. Add fade-up class to animatable elements FIRST ----
const animatableSelectors = [
  '.section-header',
  '.project-card',
  '.bento-card',
  '.about-photo-col',
  '.about-text-col',
  '.contact-card',
  '.contact-vibes',
  '.contact-form',
  '.hero-tag',
  '.hero-stats',
];

animatableSelectors.forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('fade-up');
    el.style.transitionDelay = `${i * 0.07}s`;
  });
});

// ---- 2. Now create the observer and observe all fade-up elements ----
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

// ---- Skill Bar Animation ----
const barFills = document.querySelectorAll('.bar-fill');

const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        barObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

barFills.forEach(bar => barObserver.observe(bar));

// ---- Immediately show elements already in view on load ----
window.addEventListener('load', () => {
  document.querySelectorAll('.fade-up').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('in-view');
    }
  });
});



// ---- Stat Counter Animation ----
function animateCounter(el, target, duration = 1600) {
  let start     = null;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + (el.dataset.suffix || '+');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num');
let countersStarted = false;

const heroObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting && !countersStarted) {
      countersStarted = true;
      statNums.forEach(el => {
        const raw    = el.textContent.trim();
        const target = parseInt(raw.replace(/\D/g, ''), 10);
        el.dataset.suffix = raw.replace(/\d/g, '');
        animateCounter(el, target);
      });
    }
  },
  { threshold: 0.5 }
);

const heroSection = document.getElementById('home');
if (heroSection) heroObserver.observe(heroSection);

// ---- Floating chip parallax on mouse move ----
const heroVisual = document.querySelector('.hero-visual');
const chips      = document.querySelectorAll('.floating-chip');

if (heroVisual) {
  heroVisual.addEventListener('mousemove', (e) => {
    const rect  = heroVisual.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const dx    = (e.clientX - cx) / rect.width;
    const dy    = (e.clientY - cy) / rect.height;

    chips.forEach((chip, i) => {
      const factor = (i + 1) * 8;
      chip.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  });

  heroVisual.addEventListener('mouseleave', () => {
    chips.forEach(chip => { chip.style.transform = ''; });
  });
}

// ---- Cursor sparkle effect ----
const sparkleColors = ['#FF5E5B', '#8B5CF6', '#06B6D4', '#F59E0B', '#10B981'];

document.addEventListener('click', (e) => {
  for (let i = 0; i < 6; i++) {
    const spark = document.createElement('div');
    spark.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: ${sparkleColors[i % sparkleColors.length]};
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      animation: sparkle-out 0.6s ease-out forwards;
    `;
    document.body.appendChild(spark);

    const angle  = (i / 6) * 2 * Math.PI;
    const dist   = 30 + Math.random() * 30;
    const tx     = Math.cos(angle) * dist;
    const ty     = Math.sin(angle) * dist;

    spark.animate(
      [
        { transform: `translate(-50%, -50%) scale(1)`, opacity: 1 },
        { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
      ],
      { duration: 600, easing: 'ease-out', fill: 'forwards' }
    ).onfinish = () => spark.remove();
  }
});

// ---- Case Study Modal ----
const caseStudies = {
  1: {
    title: 'POLABDC — Dental Clinic Management System',
    image: 'assets/project_1.png',
    tags: [
      { label: 'Web App', cls: 'ptag-coral' },
      { label: 'Healthcare', cls: 'ptag-purple' }
    ],
    overview: 'POLABDC adalah platform manajemen klinik gigi berbasis web yang dirancang untuk membantu dokter gigi dan tenaga medis dalam mengelola operasional klinik secara efisien. Sistem ini mencakup dashboard dokter yang komprehensif, manajemen jadwal praktik, pelacakan data kunjungan pasien, serta fitur prediksi perawatan gigi yang inovatif. Proyek ini merupakan tugas akademis yang dikembangkan dengan pendekatan profesional layaknya produk industri.',
    role: 'UI/UX Designer — bertanggung jawab penuh atas proses desain dari awal hingga akhir, meliputi riset pengguna (dokter gigi dan perawat), perancangan information architecture, wireframing, visual design dengan brand identity berwarna pink-magenta, serta pembuatan prototype interaktif di Figma.',
    challenge: 'Tantangan utama adalah merancang sistem yang mampu menyajikan data medis yang kompleks — seperti jadwal praktik multi-lokasi, riwayat kunjungan, dan kualifikasi tenaga medis — dalam antarmuka yang bersih, intuitif, dan tidak membuat pengguna kewalahan. Selain itu, sistem harus mengakomodasi dua peran pengguna berbeda (Dokter dan Perawat) dengan kebutuhan akses yang berbeda melalui satu login yang seamless.',
    process: ['User Research', 'Information Architecture', 'Wireframing', 'UI Design', 'Prototyping', 'Usability Testing'],
    results: [],
    tools: ['Figma', 'Maze'],
    prototypeUrl: 'https://www.figma.com/proto/36TcSUm9gah1hORtHbbOlc/Projek-Protein?node-id=30-31&p=f&t=ivNH9R9y5ga2VKDE-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=30%3A31',
    takeaway: '"Mendesain untuk industri kesehatan mengajarkan saya bahwa kejelasan informasi adalah segalanya. Setiap elemen UI harus menyampaikan data penting tanpa ambiguitas, karena keputusan yang diambil berdasarkan antarmuka ini berdampak langsung pada perawatan pasien."'
  },
  2: {
    title: 'Mamikos — App Redesign',
    image: 'assets/project_2.png',
    tags: [
      { label: 'Mobile App', cls: 'ptag-cyan' },
      { label: 'Redesign', cls: 'ptag-purple' }
    ],
    overview: 'Mamikos adalah platform pencarian kos-kosan terbesar di Indonesia. Proyek ini merupakan tugas kuliah yang berfokus pada redesign aplikasi mobile Mamikos, khususnya dari sisi pengalaman pemilik kos (landlord). Tujuan utamanya adalah menyederhanakan alur pendaftaran, login, dan pengelolaan properti agar lebih intuitif dan ramah pengguna, sehingga pemilik kos dapat dengan mudah mendaftarkan dan mempromosikan properti mereka.',
    role: 'UI/UX Designer — bertanggung jawab atas analisis UX aplikasi eksisting, identifikasi pain points pengguna, perancangan user flow baru, wireframing, serta pembuatan hi-fidelity mockup dan prototype interaktif.',
    challenge: 'Tantangan utama adalah memperbaiki alur onboarding pemilik kos yang sebelumnya terlalu panjang dan membingungkan. Banyak pemilik kos yang bukan digital native, sehingga desain harus sangat sederhana dan jelas. Selain itu, halaman beranda perlu dioptimalkan agar pencarian kos lebih cepat dan relevan bagi calon penghuni.',
    process: ['Heuristic Evaluation', 'User Flow Analysis', 'Wireframing', 'UI Design', 'Prototyping', 'Usability Testing'],
    results: [],
    tools: ['Figma', 'Maze', 'Google Forms'],
    takeaway: '"Redesign bukan sekadar memperbarui tampilan visual — melainkan memahami secara mendalam mengapa pengguna kesulitan, lalu merancang solusi yang terasa alami dan effortless bagi mereka."'
  },
  3: {
    title: 'Green Maggot — Smart Waste & IoT',
    image: 'assets/project_3.png',
    tags: [
      { label: 'Mobile App', cls: 'ptag-purple' },
      { label: 'Hackathon', cls: 'ptag-yellow' },
      { label: 'IoT', cls: 'ptag-cyan' }
    ],
    overview: 'Green Maggot adalah proyek aplikasi mobile yang dikembangkan saat mengikuti lomba hackathon. Aplikasi ini dirancang untuk mendigitalisasi proses penukaran sampah organik dari masyarakat ke fasilitas budidaya maggot BSF (Black Soldier Fly). Keunggulan utama sistem ini adalah integrasinya dengan perangkat IoT (Internet of Things) yang memungkinkan pemantauan suhu dan kelembapan biopond secara real-time, memastikan kondisi maggot selalu optimal.',
    role: 'UI/UX Designer — mendesain end-to-end interface aplikasi mobile, mulai dari dashboard pemantauan sensor IoT, alur scan QR untuk penukaran sampah, hingga fitur artikel/berita edukasi pengelolaan sampah.',
    challenge: 'Tantangan terbesar dalam proyek hackathon ini adalah waktu. Saya harus dengan cepat merancang antarmuka yang bisa menjembatani informasi kompleks dari sensor IoT ke visualisasi yang mudah dimengerti oleh warga awam. Desain juga harus menggunakan bahasa visual yang mengedepankan kesan eco-friendly dan teknologi pintar.',
    process: ['Ideation', 'Rapid Wireframing', 'UI Design', 'Prototyping', 'Pitch Deck Preparation'],
    results: [],
    tools: ['Figma', 'Maze'],
    takeaway: '"Merancang dalam tekanan waktu hackathon melatih saya untuk membuat keputusan desain yang cepat, tepat sasaran, dan fokus pada Minimum Viable Product (MVP) yang fungsional sekaligus menarik secara visual."'
  },
  4: {
    title: 'RiseMind — PTSD Support App',
    image: 'assets/project_4.png',
    tags: [
      { label: 'Mobile App', cls: 'ptag-purple' },
      { label: 'Health & Wellness', cls: 'ptag-coral' }
    ],
    overview: 'RiseMind adalah proyek freelance (freelance project) yang saya kerjakan: sebuah aplikasi penyokong kesehatan mental yang secara khusus dirancang untuk individu dengan PTSD (Post-Traumatic Stress Disorder). Aplikasi ini menyediakan tempat yang aman secara digital dengan menghadirkan fitur-fitur seperti pelacakan suasana hati, teknik grounding pernapasan cepat, jurnal refleksi, hingga tombol bantuan darurat krisis.',
    role: 'UI/UX Designer — berkolaborasi langsung dengan klien dan praktisi psikologi untuk menerjemahkan metode terapi kognitif ke dalam antarmuka UI yang menenangkan dan mudah diakses saat pengguna mengalami kepanikan.',
    challenge: 'Mendesain untuk pengguna dengan kondisi traumatis sangat berbeda dari desain UI/UX biasa. Warna yang mencolok, notifikasi mendadak, atau navigasi rumit bisa memicu kecemasan (trigger). Saya harus menciptakan visual yang sejuk (menggunakan teal dan elemen organik logo daun/otak) dan memastikan tombol darurat sangat mencolok namun tidak intimidatif.',
    process: ['Client Requirements', 'Psychology Context Research', 'Wireframing', 'UI Design (Calming Theme)', 'Prototyping'],
    results: [],
    tools: ['Figma'],
    takeaway: '"Desain di bidang kesehatan mental mengajarkan saya esensi dari \'desain yang berempati\'. Bukan soal fitur yang canggih, melainkan tentang menghadirkan rasa aman melalui setiap warna, bentuk, dan tombol yang dirancang."'
  },
  5: {
    title: 'Lync — URL Shortener & QR Maker',
    image: 'assets/project_5.png',
    tags: [
      { label: 'Mobile App', cls: 'ptag-purple' },
      { label: 'Academic', cls: 'ptag-yellow' },
      { label: 'Productivity', cls: 'ptag-cyan' }
    ],
    overview: 'Lync adalah tugas proyek mata kuliah pembuatan aplikasi mobile. Aplikasi ini berfungsi sebagai alat produktivitas all-in-one bagi manajer media sosial, pemasar, atau pengguna umum yang perlu mempersingkat URL yang panjang dan membuat kode QR kustom untuk tautan tersebut.',
    role: 'UI/UX Designer — mendesain keseluruhan antarmuka mulai dari layar beranda (splash screen), alur utama penyingkat tautan (shortener), pembuat QR (generator), hingga riwayat tautan (history) dengan gaya visual modern minimalis.',
    challenge: 'Mengingat fungsi utamanya sangat sederhana (input URL -> output link/QR), tantangannya adalah membuat alur interaksinya (micro-interactions) terasa sangat mulus, cepat, dan intuitif. Pengguna harus bisa mendapatkan apa yang mereka inginkan hanya dalam 1-2 kali tap.',
    process: ['Competitive Analysis', 'User Stories', 'Wireframing', 'Visual Design', 'Clickable Prototype'],
    results: [],
    tools: ['Figma'],
    takeaway: '"Terkadang proyek dengan fitur yang paling sedikit bisa menjadi yang tersulit untuk didesain. Karena ketika tidak banyak fitur, setiap interaksi dan transisi sekecil apa pun akan sangat terlihat dan dirasakan pengguna."'
  }
};

const csOverlay  = document.getElementById('csModalOverlay');
const csCloseBtn = document.getElementById('csCloseBtn');

function openCaseStudy(projectId) {
  const data = caseStudies[projectId];
  if (!data) return;

  // Populate hero
  document.getElementById('csHeroImg').src = data.image;
  document.getElementById('csHeroImg').alt = data.title;
  document.getElementById('csTitle').textContent = data.title;

  // Tags
  const tagsEl = document.getElementById('csTags');
  tagsEl.innerHTML = data.tags.map(t => `<span class="ptag ${t.cls}">${t.label}</span>`).join('');

  // Text sections
  document.getElementById('csOverview').textContent = data.overview;
  document.getElementById('csRole').textContent = data.role;
  document.getElementById('csChallenge').textContent = data.challenge;

  // Process
  const processEl = document.getElementById('csProcess');
  processEl.innerHTML = data.process.map((step, i) =>
    `<div class="cs-process-step"><span class="step-num">0${i + 1}</span> ${step}</div>`
  ).join('');

  // Results
  const resultsEl = document.getElementById('csResults');
  const resultsSection = resultsEl.closest('.cs-section');
  if (data.results && data.results.length > 0) {
    resultsSection.style.display = '';
    resultsEl.innerHTML = data.results.map(r =>
      `<div class="cs-result-card">
        <div class="cs-result-num" style="color:${r.color}">${r.num}</div>
        <div class="cs-result-label">${r.label}</div>
      </div>`
    ).join('');
  } else {
    resultsSection.style.display = 'none';
  }

  // Tools
  const toolsEl = document.getElementById('csTools');
  toolsEl.innerHTML = data.tools.map(t => `<span class="cs-tool-tag">${t}</span>`).join('');

  // Takeaway
  document.getElementById('csTakeaway').textContent = data.takeaway;


  // Open modal
  csOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Scroll modal to top
  document.getElementById('csModal').scrollTop = 0;
}

function closeCaseStudy() {
  csOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Bind close
csCloseBtn.addEventListener('click', closeCaseStudy);
csOverlay.addEventListener('click', (e) => {
  if (e.target === csOverlay) closeCaseStudy();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCaseStudy();
});

// Bind "View Case Study" buttons
document.getElementById('viewProject1Btn').addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  openCaseStudy(1);
});

document.getElementById('viewProject2Btn').addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  openCaseStudy(2);
});

document.getElementById('viewProject3Btn').addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  openCaseStudy(3);
});

document.getElementById('viewProject4Btn').addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  openCaseStudy(4);
});

document.getElementById('viewProject5Btn').addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  openCaseStudy(5);
});
