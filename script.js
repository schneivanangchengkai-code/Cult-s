/*
 * CULTÚS WEBSITE SETTINGS — EDIT THIS SECTION FIRST.
 * Leave a setting as an empty string until you have the real details.
 * Never enter passwords, bank log-in information, or secret API keys here.
 */
const CULTUS = {
  phoneNumber: "",          // Example format: "+65 9123 4567"
  whatsappNumber: "",       // Optional; numbers only, including country code, e.g. "6591234567"
  contactEmail: "",         // Your public business contact email
  instagramUrl: "",         // Optional; your actual Instagram page URL
  newsletterEndpoint: ""    // Your Formspree form endpoint, e.g. "https://formspree.io/f/xxxxxxxx"
};

// ---------- Header / navigation ----------
const header = document.querySelector('.site-header');
const menuButton = document.getElementById('menu-toggle');
const mainNav = document.getElementById('main-nav');

function closeMenu() {
  mainNav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  document.body.classList.remove('menu-open');
}
menuButton.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  document.body.classList.toggle('menu-open', isOpen);
});
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 4), {passive: true});
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Contact links ----------
const phoneHost = document.getElementById('phone-contact');
const emailHost = document.getElementById('email-contact');
const socialHost = document.getElementById('social-contact');
const socialItem = document.getElementById('social-item');

function makeLink(label, href, targetHost) {
  const link = document.createElement('a');
  link.textContent = label;
  link.href = href;
  if (href.startsWith('https://')) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
  targetHost.replaceChildren(link);
}

if (CULTUS.phoneNumber.trim()) {
  const phoneDigits = CULTUS.phoneNumber.replace(/[^\d+]/g, '');
  makeLink(CULTUS.phoneNumber, `tel:${phoneDigits}`, phoneHost);
  // Add a separate WhatsApp link if an actual WhatsApp number is configured.
  if (/^\d{8,15}$/.test(CULTUS.whatsappNumber)) {
    const br = document.createElement('div'); br.style.marginTop = '12px';
    const whatsapp = document.createElement('a');
    whatsapp.textContent = 'Message us on WhatsApp ↗';
    whatsapp.href = `https://wa.me/${CULTUS.whatsappNumber}?text=${encodeURIComponent('Hi CULTÚS, I would like to enquire about The Essential Trouser.')}`;
    whatsapp.target = '_blank'; whatsapp.rel = 'noopener noreferrer';
    whatsapp.style.fontSize = '15px'; br.append(whatsapp); phoneHost.append(br);
  }
}
if (CULTUS.contactEmail.trim()) {
  makeLink(CULTUS.contactEmail, `mailto:${CULTUS.contactEmail}`, emailHost);
}
if (/^https:\/\/(www\.)?instagram\.com\//i.test(CULTUS.instagramUrl)) {
  makeLink('Visit our Instagram ↗', CULTUS.instagramUrl, socialHost);
  socialItem.hidden = false;
}

// ---------- Media: add your real files to assets/; placeholders disappear automatically ----------
// All images are optional. If a file is missing, its designed placeholder stays visible.
document.querySelectorAll('[data-image]').forEach(slot => {
  const image = new Image();
  image.alt = slot.dataset.alt || 'CULTÚS campaign image';
  image.loading = slot.classList.contains('hero-visual') ? 'eager' : 'lazy';
  image.decoding = 'async';
  image.addEventListener('load', () => {
    slot.append(image);
    slot.classList.add('has-asset');
  });
  image.src = slot.dataset.image;
});

// The brand-film section supports an optional MP4 video.
const filmFrame = document.getElementById('film-frame');
const filmButton = document.getElementById('film-play');
const film = document.createElement('video');
film.controls = true;
film.playsInline = true;
film.preload = 'metadata';
film.setAttribute('aria-label', 'CULTÚS campaign film');
film.addEventListener('loadedmetadata', () => {
  filmFrame.append(film);
  filmFrame.classList.add('has-video');
  filmButton.hidden = false;
  filmButton.textContent = 'Play film ▶';
  filmFrame.querySelector('.film-note')?.remove();
});
film.addEventListener('play', () => { filmButton.hidden = true; });
film.addEventListener('pause', () => { filmButton.hidden = false; filmButton.textContent = 'Play film ▶'; });
filmButton.addEventListener('click', async () => {
  try { await film.play(); }
  catch { filmButton.hidden = false; }
});
film.src = filmFrame.dataset.video;

// ---------- Newsletter ----------
// Formspree collects form submissions; it does not automatically send marketing campaigns.
// Configure your own Formspree form in CULTUS.newsletterEndpoint above.
const signupForm = document.getElementById('newsletter-form');
const emailInput = document.getElementById('subscriber-email');
const consentInput = document.getElementById('subscriber-consent');
const messageBox = document.getElementById('form-message');
const subscribeButton = document.getElementById('subscribe-button');

function formMessage(message, state = 'error') {
  messageBox.className = `form-message ${state}`;
  messageBox.textContent = message;
}

signupForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!emailInput.validity.valid) {
    formMessage('Please enter a valid email address.');
    emailInput.focus();
    return;
  }
  if (!consentInput.checked) {
    formMessage('Please tick the box if you would like to receive email updates.');
    consentInput.focus();
    return;
  }
  const endpoint = CULTUS.newsletterEndpoint.trim();
  if (!/^https:\/\/formspree\.io\/f\/[a-z\d]+$/i.test(endpoint)) {
    formMessage('Email sign-ups are not yet connected. The CULTÚS team must add the form endpoint before registrations can be saved.');
    return;
  }
  subscribeButton.disabled = true;
  subscribeButton.textContent = 'Joining…';
  try {
    const data = new FormData(signupForm);
    // Keep a clear record that the user opted in to marketing emails.
    data.set('_subject', 'New CULTÚS email subscriber');
    const response = await fetch(endpoint, {
      method: 'POST',
      body: data,
      headers: {Accept: 'application/json'}
    });
    if (!response.ok) throw new Error('The sign-up service did not accept the submission.');
    signupForm.reset();
    formMessage('You’re on the list. Thanks for subscribing to CULTÚS updates.', 'success');
  } catch (error) {
    formMessage('We could not save your email right now. Please try again later.');
  } finally {
    subscribeButton.disabled = false;
    subscribeButton.innerHTML = 'Join the list <span aria-hidden="true">↗</span>';
  }
});
