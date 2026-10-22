/**
 * HBD LOVER WEBSITE - CONFIGURATION
 * 
 * Centralized settings for personalizing the birthday surprise experience.
 * Edit this file to customize names, dates, messages, letter content, and photos.
 */

import { galleryImages } from './gallery_data.js';

export const config = {
  // --- Personalization ---
  recipientName: "My Love",
  senderName: "With All My Heart",
  nickname: "Sweetheart",

  // --- Target Birthday Date & Time ---
  // The website will automatically transition to the celebration at midnight (00:00) of this date.
  // Format: 'YYYY-MM-DD'
  birthdayDate: "2026-10-23",
  targetHour: 0,      // 0 = Midnight (12:00 AM)
  targetMinute: 0,    // 00 minutes
  
  // Target Timezone (IANA format, e.g. 'Asia/Kolkata', 'America/New_York', 'Europe/London')
  timezone: "Asia/Kolkata",

  // --- Test & Preview Mode ---
  // Set to true to preview the celebration immediately without waiting for the target time.
  // A test floating bar will also allow you to toggle countdown vs celebration anytime.
  testMode: false,

  // --- Birthday Reveal Messages ---
  reveal: {
    heading: "Happy Birthday, My Love ❤️",
    subheading: "Today is all about you. You make my world brighter, and every single moment with you is a gift I cherish.",
    ctaButton: "Open Your Birthday Surprise 🎂"
  },

  // --- Birthday Cake Section ---
  cake: {
    title: "Make a Birthday Wish 🎂",
    subtitle: "Close your eyes, make a sweet wish, and blow out the candles!",
    blowButton: "Blow the Candles 🕯️",
    wishGrantedTitle: "Make a wish, my love! ✨",
    wishGrantedSubtitle: "May all your sweetest dreams, hopes, and prayers come true today and always! 💖"
  },

  // --- Romantic Love Letter ---
  letter: {
    envelopeTitle: "A Letter From My Heart",
    envelopeHint: "Click the heart seal to open your letter 💌",
    salutation: "My Dearest Love,",
    paragraphs: [
      "Happy Birthday to the most special person in my whole world. From the moment you walked into my life, everything became warmer, brighter, and infinitely more beautiful.",
      "You bring happiness, gentle comfort, and unforgettable memories into my days. Every laugh we share, every conversation late into the night, and every little smile you give me means more than words can ever capture.",
      "I hope your special day is overflowing with love, pure joy, and endless reasons to smile. You deserve all the magic and sweetness this universe has to offer.",
      "No matter how many birthdays come and go, I promise to stand by you, celebrate you, and love you more with every passing day."
    ],
    closing: "Forever & Always With Love,",
    signature: "Yours Forever ❤️"
  },

  // --- Our Memories Gallery ---
  // Loaded from your personal photos in D:\HBD image
  gallery: galleryImages,

  // --- Music Configuration ---
  music: {
    title: "Kalla Nikkiriye (Anbil Avan) 🎵",
    artist: "Sid Sriram & Preity",
    filePath: "assets/music/kalla-nikkiriye.mp3",
    loop: true,
    defaultVolume: 0.75
  },

  // --- Fireworks Simulation Settings ---
  fireworks: {
    rocketSpawnInterval: 800, // milliseconds between rocket launches
    maxRockets: 5,
    maxParticles: 450,
    heartFireworkProbability: 0.35, // 35% of bursts are special heart-shaped
    colors: [
      "#ff2a6d", "#ff6ac1", "#ff70a6", "#ffd166", "#05d9e8", 
      "#ffb703", "#e0aaff", "#ffffff", "#ff4d6d", "#f72585"
    ]
  }
};
