/** Bahasa Indonesia. Teks Al-Qur’an selalu tetap dalam bahasa Arab. */
import type { TranslationKeys } from '../keys';

export const id: TranslationKeys = {
  app: { name: 'SalahKit', tagline: 'Perkakas Islami Gratis & Offline' },
  nav: {
    home: 'Beranda SalahKit', settings: 'Buka pengaturan', support: 'Dukung',
    privacy: 'Kebijakan Privasi', terms: 'Ketentuan Layanan',
    openMenu: 'Buka menu navigasi', closeMenu: 'Tutup menu navigasi',
    language: 'Bahasa antarmuka',
  },
  sidebar: {
    freeBadge: 'Gratis selamanya',
    sections: { daily: 'Harian', knowledge: 'Ilmu', practice: 'Praktik', about: 'Tentang' },
    supportNote: 'Gratis selamanya. Tanpa iklan. Jika bermanfaat, pertimbangkan sedekah.',
    supportCta: 'Dukung SalahKit', more: 'Lainnya',
  },
  modules: {
    prayer: 'Jadwal Shalat', qibla: 'Kompas Kiblat', hijri: 'Kalender Hijriah',
    quran: 'Pembaca Al-Qur’an', tajweed: 'Tajwid', arabic: 'Dasar Bahasa Arab',
    dhikr: 'Penghitung Dzikir', zakat: 'Kalkulator Zakat', duas: 'Doa & Dzikir',
    names: '99 Nama', hadith: 'Perpustakaan Hadis', hifz: 'Hafalan (Hifz)',
    tracker: 'Pelacak Shalat', calendar: 'Kalender Hijriah',
  },
  badges: { free: 'Gratis', offline: 'Offline · tetap jalan', online: 'Online', freeForever: 'Gratis selamanya' },
  common: {
    listen: 'Dengarkan', copy: 'Salin', copied: 'Tersalin', search: 'Cari', all: 'Semua',
    favorites: 'Favorit', next: 'Langkah berikutnya →', back: '← Kembali', save: 'Simpan',
    close: 'Tutup', learnMore: 'Pelajari lebih lanjut', reset: 'Atur ulang', loading: 'Memuat…',
  },
  landing: {
    kicker: 'Gratis · Offline · Privat',
    title: 'Semua yang Anda butuhkan untuk agama — dalam satu perkakas yang indah',
    sub: 'Jadwal shalat, kiblat, Al-Qur’an lengkap, tajwid, bahasa Arab, hafalan, dzikir, zakat, dan lainnya. Tanpa iklan, tanpa daftar, tanpa pelacakan. Bekerja offline, data Anda tetap di perangkat.',
    ctaTools: 'Buka perkakas', ctaFree: 'Gratis selamanya', livePrayer: 'Shalat berikutnya',
    featuresKicker: 'Empat belas alat, satu tempat',
    featuresTitle: 'Semua antara Subuh dan tidur — dibaca dengan benar',
    featuresSub: 'Ketuk kartu mana pun untuk membuka alat — tanpa instal, tanpa login.',
    compareKicker: 'Hitungan jujur', compareTitle: 'Kenapa bayar — dan dilacak — untuk ini?',
    compareSub: 'Aplikasi Muslim berbayar pada umumnya mengenakan langganan dan tetap menampilkan iklan. SalahKit membalik keduanya.',
    faqKicker: 'Pertanyaan', faqTitle: 'Ditanyakan, dijawab',
    supportTitle: 'Gratis selamanya — karena pilihan, bukan karena iklan.',
    supportSub: 'Donasi bersifat sukarela, diproses penyedia eksternal, dan tidak membuka apa pun — karena memang tidak ada yang dikunci.',
    supportBtn: 'Dukung',
    faq: [
      { q: 'Bagaimana bisa gratis?', a: 'SalahKit dibangun sebagai sedekah jariyah. Tanpa iklan, langganan, atau penjualan data. Donasi sukarela lewat Ko-fi menjaganya tetap berjalan. Tanpa paksaan, tanpa paywall.' },
      { q: 'Benarkah bekerja offline?', a: 'Ya. Jadwal, kiblat, Al-Qur’an, tajwid, bahasa Arab, dan 99 Nama dihitung atau disimpan di perangkat Anda. Satu-satunya fitur jaringan adalah penyempurnaan kalender, yang berhenti dengan anggun saat offline.' },
      { q: 'Ke mana data saya?', a: 'Tidak pernah meninggalkan perangkat Anda. Ekspor, impor, atau hapus semuanya dari Pengaturan — kami tidak punya server maupun analitik.' },
      { q: 'Seberapa akurat jadwalnya?', a: 'Kami memakai metode astronomi terbuka dengan preset MWL, ISNA, Mesir, Karachi, dan Umm al-Qura. Verifikasi waktu puasa dan jamaah dengan masjid Anda.' },
      { q: 'Kenapa tidak ada aplikasi di toko?', a: 'SalahKit adalah PWA: buka di browser lalu «Tambah ke Layar Utama» — layar penuh, ikon sendiri, offline. Tanpa biaya toko, tanpa minta izin.' },
      { q: 'Apakah donasi wajib?', a: 'Tidak pernah. Donasi sukarela dan diproses sepenuhnya oleh penyedia eksternal. Tidak membuka apa pun karena tidak ada yang dikunci.' },
    ],
  },
  settings: {
    title: 'Pengaturan', city: 'Kota', method: 'Metode perhitungan', asrMadhab: 'Mazhab Ashar',
    shafi: 'Syafi’i (1×)', hanafi: 'Hanafi (2×)', theme: 'Tema', light: 'Terang', dark: 'Gelap',
    plan: 'Paket', planNote: 'Semua fitur termasuk. Selamanya.', language: 'Bahasa',
    support: 'Dukung SalahKit', supportNote: 'Gratis selamanya. Tanpa iklan. Jika bermanfaat, pertimbangkan sedekah.',
    donate: 'Donasi',
  },
  offline: { message: 'Anda offline — semua alat tetap berjalan. Data tidak pernah meninggalkan perangkat ini.' },
  donation: {
    toastTitle: 'SalahKit gratis selamanya',
    toastBody: 'Tanpa iklan, tanpa pelacakan. Jika bermanfaat, pertimbangkan sedekah — tautan di bawah Dukung pada Pengaturan.',
    notNow: 'Nanti saja',
  },
  footer: {
    line: 'Perkakas Islami gratis yang mengutamakan offline. Data Anda selalu di perangkat — selamanya.',
    tools: 'Alat', support: 'Dukungan', builtWith: 'Dibangun dengan ihsan.',
  },
};
