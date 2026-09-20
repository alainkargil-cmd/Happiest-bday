/**
 * Vyomini's Magical Dream World Configuration
 * 
 * Customize all names, photos, captions, letters, and settings here!
 * Photos can be placed in public/images/vyomini/
 */

export const birthdayConfig = {
  // Recipient Name
  name: "Vyomini",
  nickname: "Vyo",
  
  // Sender info (optional, leave empty if anonymous or customize as desired)
  senderName: "With all the love and warmth 💖",

  // Audio configuration
  audio: {
    // If you have a custom mp3 file, put it in public/audio/dream_theme.mp3
    bgmUrl: `${import.meta.env.BASE_URL}audio/dream_theme.mp3`,
    synthFallback: true, // Uses Web Audio API dreamy synth chime automatically!
    defaultVolume: 0.65,
  },

  // Narrative texts across the journey
  narrative: {
    scene1: {
      pretitle: "Somewhere in this universe, a little magic was waiting for you...",
      subtitle: "✨ And it has your name on it...",
      buttonText: "Enter Your Dream ✨"
    },
    scene2: {
      welcome: "Welcome to your little dream world...",
      subtitle: "A universe woven out of starlight, just for you.",
      buttonText: "Follow the Magic 💫"
    },
    scene3: {
      pretitle: "Today, the stars shine a little brighter...",
      title: "Because today is Vyomini's special day. 💖",
      wishPrompt: "Close your eyes, hold a wish in your heart...",
      makeWishBtn: "Make a Wish ✨",
      blowCandlesBtn: "Blow Out the Candles 🎂",
      wishGranted: "May every little wish in your heart find its way to you. ✨",
      continueBtn: "Discover the Gifts 🎁"
    },
    scene4: {
      title: "The Gifts of Memories 🎁",
      subtitle: "Some memories are too beautiful to stay hidden in the shadows of time...",
      hint: "Click on a glowing gift box to open it ✨",
      continueBtn: "Send to the Sky & Continue →"
    },
    scene5: {
      title: "One Last Surprise...",
      subtitle: "The stars have gathered the greatest magic of all for you.",
      readyBtn: "I'm Ready ✨",
      countdownReady: "Hold your breath..."
    },
    scene6: {
      birthdayWishTitle: "Happy Birthday, Vyomini! 💖",
      paragraphs: [
        "May your days be filled with beautiful surprises, your heart with endless happiness, and your dreams with a thousand reasons to come true.",
        "May life always be gentle with you, may you always find reasons to smile, and may this new chapter bring you more happiness than you could ever imagine.",
        "Never stop shining your wonderful light onto the world."
      ],
      closing: "Never stop dreaming. The universe loves you. ✨",
      replayBtn: "Replay the Journey 🔄"
    }
  },

  // Interactive Memory Presents
  // You can add as many memories as you like!
  memories: [
    {
      id: 1,
      image: `${import.meta.env.BASE_URL}images/vyomini/photo01.jpg`,
      title: "A Radiant Smile",
      caption: "A smile that lights up the quietest corners of the universe. ✨",
      date: "A Cherished Moment",
      color: "#ec4899", // Soft rose pink
      ribbonColor: "#fef08a" // Gold
    },
    {
      id: 2,
      image: `${import.meta.env.BASE_URL}images/vyomini/photo02.jpg`,
      title: "Pure Grace & Wonder",
      caption: "Some moments deserve their own little piece of eternal magic. 🌸",
      date: "Timeless Memory",
      color: "#8b5cf6", // Violet
      ribbonColor: "#fed7aa"
    },
    {
      id: 3,
      image: `${import.meta.env.BASE_URL}images/vyomini/photo03.jpg`,
      title: "Starry Laughter",
      caption: "The kind of laughter that makes the whole world feel lighter and brighter. 💫",
      date: "Unforgettable Joy",
      color: "#06b6d4", // Cyan celestial
      ribbonColor: "#fbcfe8"
    },
    {
      id: 4,
      image: `${import.meta.env.BASE_URL}images/vyomini/photo04.jpg`,
      title: "Golden Hour Glow",
      caption: "Walking under the sunlit sky, bringing warmth wherever you go. ☀️",
      date: "Sweet Sunshine",
      color: "#f59e0b", // Amber gold
      ribbonColor: "#f3e8ff"
    },
    {
      id: 5,
      image: `${import.meta.env.BASE_URL}images/vyomini/photo05.jpg`,
      title: "Magical Adventures",
      caption: "Every day with you is another chapter in the most wonderful story. 📖✨",
      date: "Beautiful Chapter",
      color: "#ec4899", // Magenta pink
      ribbonColor: "#fde047"
    }
  ]
};
