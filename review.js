
    const SHEET_API_URL = "https://script.google.com/macros/s/AKfycby3VRl8zP2ji0p2Qs7f6ekqjbHpWapSPUSijHElKQhfqAYmJgYsb3FM7XjH3e_P6YCb/exec";
    // ---------------------------

    const grid = document.getElementById('reviews-grid');
    const stateEl = document.getElementById('reviews-state');

    function setState(msg) {
      stateEl.textContent = msg;
      stateEl.style.display = 'block';
    }

    // Decides whether the handle looks like an email or an Instagram handle,
    // and formats it accordingly.
    function formatHandle(raw) {
      if (!raw) return '';
      const value = String(raw).trim();
      const looksLikeEmail = /\S+@\S+\.\S+/.test(value);
      if (looksLikeEmail) return value;
      return value.startsWith('@') ? value : '@' + value;
    }

    function escapeHtml(str) {
      if (str === null || str === undefined) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    function renderReviews(reviews) {
      const usable = reviews.filter(r => r.feedback && String(r.feedback).trim() !== '');

      if (usable.length === 0) {
        setState('No reviews yet.');
        return;
      }

      stateEl.style.display = 'none';

      grid.innerHTML = usable.map(r => `
        <div class="review-card">
          <p class="review-card-quote">${escapeHtml(r.feedback)}</p>
          <span class="review-card-divider"></span>
          <div class="review-card-name">${escapeHtml(r.name || 'Anonymous')}</div>
          <div class="review-card-role">${escapeHtml(formatHandle(r.handle))}</div>
        </div>
      `).join('');
    }

    // JSONP fetch: more reliable than fetch() against Apps Script web apps,
    // since Apps Script's doGet doesn't always send CORS headers for plain fetch.
    function fetchReviewsJSONP() {
      return new Promise((resolve, reject) => {
        const callbackName = 'gtReviewsCallback_' + Date.now();
        const script = document.createElement('script');

        window[callbackName] = function (response) {
          resolve(response);
          delete window[callbackName];
          script.remove();
        };

        script.onerror = function () {
          reject(new Error('Failed to load reviews.'));
          delete window[callbackName];
          script.remove();
        };

        const separator = SHEET_API_URL.includes('?') ? '&' : '?';
        script.src = SHEET_API_URL + separator + 'callback=' + callbackName;
        document.body.appendChild(script);
      });
    }

    async function init() {
      if (!SHEET_API_URL || SHEET_API_URL.includes('PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE')) {
        setState('Add your Apps Script Web App URL in the SHEET_API_URL variable.');
        return;
      }

      try {
        const response = await fetchReviewsJSONP();
        if (!response.success) {
          setState('Could not load reviews: ' + (response.error || 'unknown error'));
          return;
        }
        renderReviews(response.data || []);
      } catch (err) {
        setState('Could not load reviews. Please try again later.');
        console.error(err);
      }
    }

    init();