// All copy and image paths for the site. Components read from here.

export const site = {
  brand: "Kalp Joshi",

  menu: [
    { label: "home", href: "#home" },
    { label: "projects", href: "#portfolio" },
    { label: "interests", href: "#off-the-clock" },
    { label: "contact", href: "#contact" },
  ],

  hero: {
    name: "Kalp Joshi",
    line: "I build websites and apps, and study computer science at the University of Manitoba.",
    place: "Winnipeg, Canada",
  },

  intro: {
    greeting: "Hey!",
    lead: "I'm Kalp, a computer science student at the University of Manitoba in Winnipeg.",
    body: [
      "I build websites and apps. Some are for clients, like the Shopify store for KVSCHE and the Weebly site for Happy Brides. Others start with something I care about, like a search tool for the Bhagavad Gita.",
      "Most of my work is front end, in React, Next.js and TypeScript. I've also built an Android app that keeps all its data on the phone in SQLite.",
      "Away from the screen I paint, draw my own manga characters and play chess.",
    ],
    ctaLabel: "get in touch",
    ctaHref: "#contact",
    photo: "/me.webp",
    photoAlt: "Kalp Joshi, sitting at a table with his arms crossed",
    photoBw: "/me-bw.webp",
  },

  socials: [
    { label: "LinkedIn", short: "in", href: "https://www.linkedin.com/in/kalp-joshi-28559923b/" },
    { label: "GitHub", short: "Gh", href: "https://github.com/KalpKJ" },
  ],

  portfolio: {
    title: "Things I've designed and built.",
    projects: [
      {
        name: "Ask the Gita",
        description:
          "Ask a question and read the Bhagavad Gita verses that answer it. All 701 verses are searched in the browser with a small embedding model, and a local Llama model can write a short answer that cites them.",
        tags: ["React", "TypeScript", "Transformers.js", "Ollama"],
        kind: "Web app",
        year: "2026",
        image: "/projects/ask-the-gita.webp",
        alt: "Ask the Gita: the question box beside a painting of Krishna showing Arjuna his universal form",
        href: "https://kalpkj.github.io/ask-the-gita/",
        code: "https://github.com/KalpKJ/ask-the-gita",
      },
      {
        name: "Sundarkand",
        description:
          "The complete Sundarkand of the Ramcharitmanas, in Devanagari with roman letters and an English translation, laid out to read like a printed pothi.",
        tags: ["React", "TypeScript", "Vite"],
        kind: "Reading site",
        year: "2026",
        image: "/projects/sundarkand.webp",
        alt: "Sundarkand: the opening page with a painting and the first verse",
        href: "https://kalpkj.github.io/sundarkand/",
        code: "https://github.com/KalpKJ/sundarkand",
      },
      {
        name: "Buildora",
        description:
          "The website for Buildora, which builds websites and growth systems for startups. I led the development and designed the interface.",
        tags: ["Next.js", "React", "Tailwind", "Java", "Python"],
        kind: "Website",
        year: "2025",
        image: "/projects/buildora.webp",
        alt: "Buildora home page",
        href: "https://buildoraonline.com",
        code: "",
      },
      {
        name: "KVSCHE",
        description: "A Shopify store for a client who makes custom-height wine displays, with full-width product photography.",
        tags: ["Shopify", "Liquid"],
        kind: "Client store",
        year: "2025",
        image: "/projects/kvsche.webp",
        alt: "KVSCHE store front with a wine display",
        href: "https://kvsche.com",
        code: "",
      },
      {
        name: "Happy Brides",
        description: "A site for a bridal boutique, built on Weebly, where brides can browse dresses and book an appointment.",
        tags: ["Weebly"],
        kind: "Client site",
        year: "2024",
        image: "/projects/happybrides.webp",
        alt: "Happy Brides home page with bridal photography",
        href: "https://happybrides.ca",
        code: "",
      },
      {
        name: "ExerGen",
        description:
          "An Android app that generates structured interval workouts. It works fully offline and stores everything on the phone.",
        tags: ["Android SDK", "SQLite"],
        kind: "Android app",
        year: "2024",
        image: "",
        alt: "",
        href: "",
        code: "",
      },
    ],
  },

  interests: {
    title: "Off the clock, I paint, watch anime and play chess.",
  },

  contact: {
    headline: "Say hello.",
    subline: "The quickest way to reach me is a message on LinkedIn. My code is on GitHub.",
    copyright: "© 2026 Kalp Joshi",
  },
};

export type Site = typeof site;
export type Project = Site["portfolio"]["projects"][number];
