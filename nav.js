/**
 * GT Edits – Shared Navigation & Footer Component
 * Eliminates header/footer duplication across all pages.
 *
 * Usage: add <script src="nav.js"></script> (or <script src="../nav.js"></script>
 * for pages inside sub-folders) at the END of <body>.
 * Add data-page="pageName" to <body> to highlight the active nav link.
 */

(function () {
  // ── Detect if we are in a sub-folder (Assets/) ──────────────────────────
  const inSubfolder = window.location.pathname.includes('/Assets/');
  const base = inSubfolder ? '../' : '';

  // ── Nav link definitions ─────────────────────────────────────────────────
  const navLinks = [
    { href: 'index.html',    label: 'Home' },
    { href: 'About.html',    label: 'About' },
    { href: 'Graphics.html', label: 'Graphics' },
    { href: 'Vid.html',      label: 'Video Editing' },
    { href: 'Assets.html',  label: 'Assets' },
  ];

  // Current page name (set via data-page attribute on <body>)
  const currentPage = document.body.getAttribute('data-page') || '';

  // ── Build nav <a> elements ───────────────────────────────────────────────
  function buildNavLinks(extraClasses, activeClasses, defaultClasses) {
    return navLinks.map(link => {
      const isActive = link.label === currentPage;
      const cls = isActive
        ? `${extraClasses} ${activeClasses}`
        : `${extraClasses} ${defaultClasses}`;
      return `<a href="${base}${link.href}" class="${cls}">${link.label}</a>`;
    }).join('\n');
  }

  // ── Arrow SVG ────────────────────────────────────────────────────────────
  const arrowSvg = `<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-1" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>`;

  // ── Header HTML ──────────────────────────────────────────────────────────
  const headerHTML = `
<header class="text-white body-font bg-black">
  <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row md:items-center items-center">
    <a href="${base}index.html" class="flex title-font font-medium items-center text-gray-200 mb-4 md:mb-0">
      <span class="ml-1 text-xl">GT Edits</span>
    </a>

    <!-- Hamburger -->
    <button id="gt-menuBtn" class="md:hidden ml-auto text-white focus:outline-none" aria-label="Open navigation menu">
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
      </svg>
    </button>

    <!-- Mobile Sidebar -->
    <div id="gt-sidebar" class="fixed left-0 top-0 w-64 h-full bg-black transform -translate-x-full transition-transform duration-300 md:hidden p-5 z-50" aria-modal="true" role="dialog">
      <button id="gt-closeBtn" class="absolute top-4 right-4 text-white focus:outline-none" aria-label="Close navigation menu">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      <nav class="flex flex-col mt-10 space-y-4" aria-label="Mobile navigation">
        ${buildNavLinks('', 'text-indigo-400 font-semibold', 'text-white hover:text-indigo-200')}
      </nav>
      <a href="https://www.instagram.com/gt._.edits/" class="mt-5 inline-block" target="_blank" rel="noopener noreferrer">
        <button class="w-full bg-indigo-800 border-0 py-2 px-3 focus:outline-none hover:bg-indigo-600 rounded text-base">Contact me</button>
      </a>
    </div>

    <!-- Desktop Nav -->
    <nav class="md:ml-auto hidden md:flex flex-wrap items-center text-base justify-center" aria-label="Desktop navigation">
      ${buildNavLinks('mr-5', 'text-indigo-400 font-semibold border-b border-indigo-400 pb-0.5', 'hover:text-indigo-200')}
    </nav>

    <a href="https://www.instagram.com/gt._.edits/" class="hidden md:inline-block ml-4" target="_blank" rel="noopener noreferrer">
      <button class="inline-flex items-center bg-indigo-800 border-0 py-1 px-3 focus:outline-none hover:bg-indigo-600 rounded text-base mt-4 md:mt-0">
        Contact me ${arrowSvg}
      </button>
    </a>
  </div>
</header>`;

  // ── Footer HTML ──────────────────────────────────────────────────────────
  const footerHTML = `
<footer class="text-gray-600 body-font">
  <div>
    <div class="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
      <p class="text-white text-sm text-center sm:text-left">© <span id="gt-year"></span> GT Edits</p>
      <span class="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
        <a href="${base}index.html" class="ml-3 text-white hover:text-indigo-200">Home</a>
        <a href="https://x.com/GTTanishq22" class="ml-3 text-white hover:text-indigo-200" target="_blank" rel="noopener noreferrer" aria-label="Twitter/X">
          <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
        </a>
        <a href="https://www.instagram.com/gt._.edits/" class="ml-3 text-white hover:text-indigo-200" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path></svg>
        </a>
        <a href="https://www.linkedin.com/in/tanishq-mehta-51055127b/" class="ml-3 text-white hover:text-indigo-200" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0" class="w-5 h-5" viewBox="0 0 24 24"><path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2" stroke="none"></circle></svg>
        </a>
      </span>
    </div>
  </div>
</footer>`;

  // ── Inject header ────────────────────────────────────────────────────────
  const headerPlaceholder = document.getElementById('gt-header');
  if (headerPlaceholder) {
    headerPlaceholder.outerHTML = headerHTML;
  }

  // ── Inject footer ────────────────────────────────────────────────────────
  const footerPlaceholder = document.getElementById('gt-footer');
  if (footerPlaceholder) {
    footerPlaceholder.outerHTML = footerHTML;
  }

  // ── Dynamic copyright year ───────────────────────────────────────────────
  const yearEl = document.getElementById('gt-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Mobile sidebar toggle ────────────────────────────────────────────────
  const menuBtn  = document.getElementById('gt-menuBtn');
  const sidebar  = document.getElementById('gt-sidebar');
  const closeBtn = document.getElementById('gt-closeBtn');

  if (menuBtn && sidebar && closeBtn) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.remove('-translate-x-full');
    });
    closeBtn.addEventListener('click', () => {
      sidebar.classList.add('-translate-x-full');
    });
    window.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
        sidebar.classList.add('-translate-x-full');
      }
    });
  }
})();
