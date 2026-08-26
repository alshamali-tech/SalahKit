/** Français. Le texte coranique reste toujours en arabe. */
import type { TranslationKeys } from '../keys';

export const fr: TranslationKeys = {
  app: { name: 'SalahKit', tagline: 'Outils islamiques gratuits hors ligne' },
  nav: {
    home: 'Accueil SalahKit', settings: 'Ouvrir les réglages', support: 'Soutenir',
    privacy: 'Politique de confidentialité', terms: 'Conditions d’utilisation',
    openMenu: 'Ouvrir le menu de navigation', closeMenu: 'Fermer le menu de navigation',
    language: 'Langue de l’interface',
  },
  sidebar: {
    freeBadge: 'Gratuit pour toujours',
    sections: { daily: 'Quotidien', knowledge: 'Savoir', practice: 'Pratique', about: 'À propos' },
    supportNote: 'Gratuit pour toujours. Sans publicité. Si cela vous aide, pensez à une sadaqa.',
    supportCta: 'Soutenir SalahKit', more: 'Plus',
  },
  modules: {
    prayer: 'Horaires de prière', qibla: 'Boussole Qibla', hijri: 'Calendrier hégirien',
    quran: 'Lecteur du Coran', tajweed: 'Tajwid', arabic: 'Bases de l’arabe',
    dhikr: 'Compteur de dhikr', zakat: 'Calculateur de Zakat', duas: 'Duas & Adhkar',
    names: '99 Noms', hadith: 'Bibliothèque de hadiths', hifz: 'Mémorisation (Hifz)',
    tracker: 'Suivi des prières', calendar: 'Calendrier hégirien',
  },
  badges: { free: 'Gratuit', offline: 'Hors ligne · fonctionne', online: 'En ligne', freeForever: 'Gratuit pour toujours' },
  common: {
    listen: 'Écouter', copy: 'Copier', copied: 'Copié', search: 'Rechercher', all: 'Tout',
    favorites: 'Favoris', next: 'Étape suivante →', back: '← Retour', save: 'Enregistrer',
    close: 'Fermer', learnMore: 'En savoir plus', reset: 'Réinitialiser', loading: 'Chargement…',
  },
  landing: {
    kicker: 'Gratuit · Hors ligne · Privé',
    title: 'Tout ce qu’il faut pour votre dîn — dans une belle boîte à outils',
    sub: 'Horaires de prière, Qibla, le Coran complet, tajwid, arabe, hifz, dhikr, Zakat et plus. Sans publicité, sans inscription, sans suivi. Fonctionne hors ligne, vos données restent sur votre appareil.',
    ctaTools: 'Ouvrir la boîte à outils', ctaFree: 'Gratuit pour toujours', livePrayer: 'Prochaine prière',
    featuresKicker: 'Quatorze outils, un seul endroit',
    featuresTitle: 'Tout entre le Fajr et le sommeil — bien récité',
    featuresSub: 'Touchez une tuile pour ouvrir l’outil — sans installation, sans compte.',
    compareKicker: 'Le calcul honnête', compareTitle: 'Pourquoi payer — et être suivi — pour cela ?',
    compareSub: 'L’application musulmane payante typique impose un abonnement et affiche encore des pubs. SalahKit inverse les deux.',
    faqKicker: 'Questions', faqTitle: 'Posées, répondues',
    supportTitle: 'Gratuit pour toujours — par choix, pas par la publicité.',
    supportSub: 'Les contributions sont volontaires, gérées par des prestataires externes, et ne débloquent rien — car rien n’est verrouillé.',
    supportBtn: 'Soutenir',
    faq: [
      { q: 'Comment est-ce gratuit ?', a: 'SalahKit est construit comme une sadaqa jariya — une aumône continue. Sans pub, sans abonnement, sans vente de données. Un don facultatif via Ko-fi fait vivre le projet. Aucune culpabilisation, aucun mur payant.' },
      { q: 'Ça marche vraiment hors ligne ?', a: 'Oui. Les horaires, la Qibla, le Coran, le tajwid, l’arabe et les 99 Noms sont calculés ou stockés sur votre appareil. La seule fonction réseau est un raffinement du calendrier, qui se dégrade proprement.' },
      { q: 'Que deviennent mes données ?', a: 'Elles ne quittent jamais votre appareil. Exportez, importez ou effacez tout depuis les Réglages — nous n’avons ni serveurs ni statistiques.' },
      { q: 'Quelle est la précision des horaires ?', a: 'Nous utilisons des méthodes astronomiques ouvertes avec les préréglages MWL, ISNA, Égypte, Karachi et Oumm al-Qura. Vérifiez les horaires de jeûne auprès de votre mosquée.' },
      { q: 'Pourquoi pas d’application en magasin ?', a: 'SalahKit est une PWA : ouvrez-le dans votre navigateur puis « Ajouter à l’écran d’accueil ». Plein écran, icône propre, hors ligne — sans frais ni permissions.' },
      { q: 'Mon don est-il obligatoire ?', a: 'Jamais. Les dons sont volontaires et traités par le prestataire externe. Ils ne débloquent rien car rien n’est verrouillé.' },
    ],
  },
  settings: {
    title: 'Réglages', city: 'Ville', method: 'Méthode de calcul', asrMadhab: 'Madhab pour Asr',
    shafi: 'Chaféite (1×)', hanafi: 'Hanafite (2×)', theme: 'Thème', light: 'Clair', dark: 'Sombre',
    plan: 'Formule', planNote: 'Toutes les fonctions sont incluses. Pour toujours.', language: 'Langue',
    support: 'Soutenir SalahKit', supportNote: 'Gratuit pour toujours. Sans pub. Si cela vous aide, pensez à une sadaqa.',
    donate: 'Donner',
  },
  offline: { message: 'Vous êtes hors ligne — tous les outils fonctionnent. Vos données restent sur cet appareil.' },
  donation: {
    toastTitle: 'SalahKit est gratuit pour toujours',
    toastBody: 'Sans pub, sans suivi. Si cela vous aide, pensez à une sadaqa — liens sous Soutenir dans les Réglages.',
    notNow: 'Pas maintenant',
  },
  footer: {
    line: 'Une boîte à outils islamique gratuite, d’abord hors ligne. Vos données restent sur votre appareil — toujours.',
    tools: 'Outils', support: 'Soutien', builtWith: 'Construit avec ihsan.',
  },
};
