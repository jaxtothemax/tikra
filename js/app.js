/* TIKRA — Application Logic */

function tikraApp() {
  const savedLang = localStorage.getItem('tikra-lang') || 'sl';

  return {
    // State
    currentSection: 'home',
    currentLang: savedLang,
    t: translations[savedLang],
    mobileMenuOpen: false,
    langMenuOpen: false,
    navScrolled: false,
    navLight: false,
    activeProduct: null,
    activeFaq: null,
    activeRefTab: 'slovenia',
    formSubmitted: false,

    // Init
    init() {
      // Set document attrs for initial language
      document.documentElement.lang = savedLang === 'de' ? 'de' : savedLang === 'en' ? 'en' : 'sl';

      // Nav scroll effect
      window.addEventListener('scroll', () => {
        this.navScrolled = window.scrollY > 20;
        this.navLight = window.scrollY > window.innerHeight * 0.8;
      });

      // Hash routing
      this.handleHash();
      window.addEventListener('hashchange', () => this.handleHash());

      // Body scroll lock when mobile menu open
      this.$watch('mobileMenuOpen', val => {
        document.body.style.overflow = val ? 'hidden' : '';
      });

      // Close menus on outside click
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.lang-toggle')) {
          this.langMenuOpen = false;
        }
      });
    },

    handleHash() {
      const hash = window.location.hash.replace('#', '');
      const validSections = ['home', 'products', 'references', 'faq', 'news', 'contact'];
      if (validSections.includes(hash)) {
        this.navigate(hash, false);
      }
    },

    // Navigation
    navigate(section, updateHash = true) {
      this.currentSection = section;
      this.mobileMenuOpen = false;
      this.activeProduct = null;
      if (updateHash) {
        history.pushState(null, '', section === 'home' ? '/' : `#${section}`);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // Language
    setLang(lang, save = true) {
      this.currentLang = lang;
      this.t = translations[lang];
      this.langMenuOpen = false;
      if (save) localStorage.setItem('tikra-lang', lang);
      document.documentElement.lang = lang === 'sl' ? 'sl' : lang === 'de' ? 'de' : 'en';
      document.title = lang === 'sl' ? 'Tikra d.o.o. — Ognjevarni premazi'
                     : lang === 'de' ? 'Tikra d.o.o. — Brandschutzbeschichtungen'
                     : 'Tikra d.o.o. — Fire-Resistant Coatings';
    },

    langLabel() {
      return { sl: 'SLO', en: 'ENG', de: 'DEU' }[this.currentLang];
    },

    langFlag() {
      return { sl: '🇸🇮', en: '🇬🇧', de: '🇩🇪' }[this.currentLang];
    },

    // Products
    toggleProduct(id) {
      this.activeProduct = this.activeProduct === id ? null : id;
    },

    productById(id) {
      return this.t.products.items.find(p => p.id === id);
    },

    // FAQ
    toggleFaq(idx) {
      this.activeFaq = this.activeFaq === idx ? null : idx;
    },

    // Contact form
    submitForm(e) {
      e.preventDefault();
      const form = e.target;
      const data = new FormData(form);
      const mailto = `mailto:info.tikra@gmail.com?subject=${encodeURIComponent(data.get('subject') || 'Povpraševanje')}&body=${encodeURIComponent(`Ime: ${data.get('name')}\nE-pošta: ${data.get('email')}\n\n${data.get('message')}`)}`;
      window.location.href = mailto;
      this.formSubmitted = true;
      setTimeout(() => { this.formSubmitted = false; form.reset(); }, 5000);
    },

    // Animate temp bars when about section visible
    tempBarWidth(target, max) {
      return `${(target / max) * 100}%`;
    },
  };
}
