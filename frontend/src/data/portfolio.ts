/**
 * Single source of truth for every piece of content on the site.
 * Edit text, links and skills here — components never hard-code copy.
 */

export type SkillLevel = "legend" | "expert" | "advanced" | "beginner";

export interface Social {
  label: string;
  href: string;
  handle: string;
}

export interface WhatIDo {
  title: string;
  description: string;
  tags: string[];
}

export interface CareerStep {
  role: string;
  context: string;
  year: string;
  text: string;
}

export interface Project {
  icon: string;
  name: string;
  kind: string;
  featured?: boolean;
  description: string;
  stat: { value: string; label: string };
  tags: string[];
  /** TODO: swap each href for the project's own repo / live URL. */
  href: string;
}

export interface SkillGroup {
  label: string;
  skills: { name: string; level: SkillLevel }[];
}

const GITHUB = "https://github.com/deb-barman166";

export const person = {
  name: "Deb Barman",
  handle: "deb-barman166",
  title: "AI Developer & Builder",
  headline: "Deb Barman — AI Developer & Builder",
  description:
    "Deb Barman is an AI developer who has shipped 6 production-grade systems: multi-agent hierarchies, RAG pipelines and deep learning frameworks built from scratch. Python, LangChain, LangGraph, TensorFlow, PyTorch.",
  keywords: [
    "Deb Barman",
    "Deb Barman AI developer",
    "Deb Barman portfolio",
    "AI Developer",
    "Python Developer",
    "RAG",
    "LangChain",
    "LangGraph",
    "Multi-Agent Systems",
    "Machine Learning",
    "Tufanganj",
    "Coochbehar",
    "West Bengal",
  ],
  knowsAbout: [
    "Python",
    "Retrieval-Augmented Generation",
    "Multi-agent systems",
    "LangChain",
    "LangGraph",
    "Deep learning",
    "TensorFlow",
    "PyTorch",
    "Prompt engineering",
    "Data science",
  ],
};

export const socials: Social[] = [
  { label: "GitHub", href: GITHUB, handle: "deb-barman166" },
  { label: "X", href: "https://x.com/debbarman166", handle: "@debbarman166" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/deb-barman166",
    handle: "deb-barman166",
  },
];

export const nav = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

export const about = {
  title: "About me",
  text: "17-year-old AI developer & Class XI student from Tufanganj, Coochbehar, West Bengal. I've shipped 6 production-grade systems this year alone — frameworks, multi-agent hierarchies, and tools — not tutorials. Python is my weapon. Curiosity is my fuel. I don't just use AI. I build with it.",
  proof: [
    { value: 6, label: "Systems shipped", suffix: "" },
    { value: 100, label: "Agents orchestrated", suffix: "+" },
    { value: 6400, label: "Lines, DL framework", suffix: "" },
  ],
};

export const manifesto: { text: string; accent?: boolean }[][] = [
  [
    { text: "Legend can do anything", accent: true },
    { text: "Impossible? No — I am possible" },
    { text: "Self-taught. Self-driven.", accent: true },
    { text: "Built from scratch, not from templates" },
  ],
  [
    { text: "Python is my weapon", accent: true },
    { text: "Curiosity is my fuel" },
    { text: "Not tutorials. Systems.", accent: true },
    { text: "I don't just use AI. I build with it" },
  ],
];

export const whatIDo: WhatIDo[] = [
  {
    title: "Develop",
    description:
      "I build the systems most people only prompt around — AI frameworks, RAG pipelines, multi-agent hierarchies, CLI tools, and full-stack apps, written from scratch at production scale.",
    tags: ["Python", "LangChain", "LangGraph", "ChromaDB", "FastAPI", "React", "MySQL", "n8n"],
  },
  {
    title: "AI & ML",
    description:
      "Most agent demos break the moment you push past the happy path. Mine don't — 100+ agents in an 8-tier hierarchy, coordinating through a 7-layer memory system, still holding at production scale.",
    tags: ["Gen AI", "Prompt Engineering", "PyTorch", "TensorFlow", "Ollama", "Google ADK", "Scikit-Learn"],
  },
  {
    title: "Data Science",
    description:
      "Data doesn't lie, but it does hide — until you clean it, shape it, and ask it the right question. I turn raw CSVs into AutoML pipelines, dashboards, and models that actually predict something useful.",
    tags: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "AutoML", "SQLite", "Jupyter"],
  },
  {
    title: "Creative Editing",
    description:
      "Code isn't the only craft I obsess over. I edit video and photo work with the same eye for detail I bring to a codebase — pacing, color, and composition that don't feel accidental.",
    tags: ["Video Editing", "Photo Editing", "Color Grading", "Compositing", "Motion Graphics"],
  },
];

export const career: CareerStep[] = [
  {
    role: "First Lines of Python",
    context: "Self-Taught · Curiosity-Driven",
    year: "2023",
    text: "Started from zero — no courses, no mentor, just documentation and broken code at 2am. Learned Python fundamentals by building small scripts and automating boring tasks, one error message at a time.",
  },
  {
    role: "AI Automation Engineer",
    context: "n8n · Workflow Automation",
    year: "2024",
    text: "Mastered n8n for complex multi-step AI pipelines. Integrated GPT, Gemini, and custom APIs into end-to-end automation workflows with reusable agent orchestration patterns.",
  },
  {
    role: "Python Developer",
    context: "Data Science · Self-Taught",
    year: "2024–25",
    text: "Deep Python expertise in Pandas, Matplotlib, Seaborn. Built AutoML pipelines, data analysis tools, and a multi-agent Chief Executive Agent on the Anthropic API with SQLite persistent memory.",
  },
  {
    role: "Independent AI Developer",
    context: "Open Source · Self-Directed",
    year: "2025",
    text: "Built RAG_Master, Godfather Agent v10 (100+ agents, 8-tier hierarchy), DL_TENSORFLOW (~6,400 lines), MCP Master Terminal, LeText PWA, PromptCraft Extension — all production-grade, all from scratch.",
  },
  {
    role: "Building What's Next",
    context: "Agentic Systems · Always Shipping",
    year: "Now",
    text: "Currently deep in agentic architecture, memory systems, and multi-provider LLM orchestration — while finishing Class XI. The goal has never changed: build things that actually work, not just demo well.",
  },
];

export const projects: Project[] = [
  {
    icon: "🧠",
    name: "RAG_Master",
    kind: "AI Framework",
    description:
      "Retrieval-augmented generation framework — chunks, embeds, and retrieves context from any document set, then routes it through a configurable LLM chain so answers stay grounded in source material instead of hallucinated.",
    stat: { value: "0", label: "hallucinated citations" },
    tags: ["Python", "LangChain", "LangGraph", "+3"],
    href: GITHUB,
  },
  {
    icon: "🕵️",
    name: "Godfather Agent v10",
    kind: "Multi-Agent System",
    featured: true,
    description:
      "An 8-tier hierarchy of 100+ specialized agents that delegate, negotiate, and report up a chain of command — with a 7-layer memory system so agents retain context across long-running, multi-step tasks instead of resetting each call.",
    stat: { value: "100+", label: "agents, 8 tiers" },
    tags: ["Python", "Google ADK", "Multi-Agent", "+2"],
    href: GITHUB,
  },
  {
    icon: "🔬",
    name: "DL_TENSORFLOW",
    kind: "Deep Learning Framework",
    description:
      "A from-scratch deep learning framework spanning ~6,400 lines — 10 model architectures and 10 optimizers implemented directly, with ONNX export so trained models can be deployed outside the Python runtime that trained them.",
    stat: { value: "6,400", label: "lines, zero shortcuts" },
    tags: ["TensorFlow", "PyTorch", "ONNX", "+1"],
    href: GITHUB,
  },
  {
    icon: "⚡",
    name: "MCP Master",
    kind: "Terminal Tool",
    description:
      "A terminal client implementing the full MCP 2024-11-05 spec from the ground up — connects to any compliant MCP server through a Rich-rendered CLI, backed by a 42-test suite covering the protocol's edge cases.",
    stat: { value: "42", label: "tests, spec-compliant" },
    tags: ["Python", "MCP Spec", "Rich UI"],
    href: GITHUB,
  },
  {
    icon: "📐",
    name: "LeText",
    kind: "PWA LaTeX Editor",
    description:
      "An installable LaTeX editor with live KaTeX preview and 103+ shorthand commands for faster equation entry — works fully offline via Service Worker, so notes and documents stay editable without a connection.",
    stat: { value: "103+", label: "shorthand commands" },
    tags: ["JavaScript", "CodeMirror", "KaTeX"],
    href: GITHUB,
  },
  {
    icon: "🔮",
    name: "PromptCraft",
    kind: "Chrome Extension",
    description:
      "A Manifest V3 browser extension that scores prompt quality in real time and injects improved versions directly into ChatGPT, Claude, and Gemini's input fields — no copy-pasting between a separate tool and the chat window.",
    stat: { value: "3", label: "LLM platforms supported" },
    tags: ["JavaScript", "Manifest V3", "Prompt Scoring"],
    href: GITHUB,
  },
];

const s = (name: string, level: SkillLevel) => ({ name, level });

export const skillGroups: SkillGroup[] = [
  {
    label: "Python Ecosystem",
    skills: [
      s("Python", "advanced"), s("Pandas", "advanced"), s("Matplotlib", "advanced"), s("Seaborn", "advanced"),
      s("NumPy", "beginner"), s("Scikit-Learn", "beginner"), s("PyTorch", "beginner"),
      s("TensorFlow", "beginner"), s("Pygame", "beginner"),
    ],
  },
  {
    label: "AI & Machine Learning",
    skills: [
      s("Gen AI", "expert"), s("AI Tools", "expert"), s("ChatGPT", "expert"),
      s("Prompt Engineering", "advanced"), s("Gemini", "advanced"), s("Perplexity", "advanced"),
      s("MS Copilot", "advanced"), s("Google AI Studio", "advanced"), s("AI Research", "advanced"),
      s("n8n Automation", "advanced"), s("HuggingFace", "advanced"), s("OpenRouter", "advanced"),
      s("NVIDIA NIM", "advanced"), s("Machine Learning", "beginner"), s("Deep Learning", "beginner"),
      s("AI Agents", "beginner"), s("Data Science", "beginner"), s("Vibe Coding", "beginner"),
    ],
  },
  {
    label: "Creative & Visual",
    skills: [
      s("Video Editing", "advanced"), s("Photo Editing", "advanced"), s("Photography", "advanced"),
      s("Video Shooting", "advanced"), s("AI Image Generation", "advanced"), s("AI Presentations", "advanced"),
      s("AI Excel", "advanced"), s("Drawing", "advanced"), s("AI Video Generation", "beginner"),
      s("AI Content Creation", "beginner"),
    ],
  },
  {
    label: "Other Coding Languages",
    skills: [
      s("HTML", "beginner"), s("CSS", "beginner"), s("JavaScript", "beginner"), s("Java", "beginner"),
      s("C", "beginner"), s("C++", "beginner"), s("C#", "beginner"), s("PHP", "beginner"),
      s("MySQL", "beginner"), s("JSON", "beginner"), s("AI Error Solving", "advanced"),
    ],
  },
  {
    label: "Cognitive & Soft Skills",
    skills: [
      s("Creativity", "legend"), s("Observation", "legend"), s("Imagination", "legend"),
      s("Learn Everyday", "legend"), s("Critical Thinking", "expert"), s("Self Control", "expert"),
      s("Idea Generation", "expert"), s("Deep Thinking", "expert"), s("Chess", "expert"),
      s("Problem Solving", "advanced"), s("Decision Making", "advanced"), s("Discipline", "advanced"),
      s("Self-Care", "advanced"), s("Meditation", "advanced"), s("Teaching Others", "advanced"),
    ],
  },
  {
    label: "Study & Knowledge",
    skills: [
      s("Human Brain Power", "expert"), s("Psychology", "advanced"), s("Geography", "advanced"),
      s("Science", "advanced"), s("Mathematics", "advanced"), s("Electronics", "advanced"),
      s("Electric Circuits", "advanced"), s("Philosophy", "beginner"), s("History", "beginner"),
      s("Sanskrit", "beginner"),
    ],
  },
  {
    label: "Language Skills",
    skills: [s("Bangla", "legend"), s("English", "advanced"), s("Hindi", "advanced")],
  },
];

export const skillLegend: { level: SkillLevel; label: string }[] = [
  { level: "legend", label: "Legend" },
  { level: "expert", label: "Expert" },
  { level: "advanced", label: "Advanced" },
  { level: "beginner", label: "Beginner" },
];

export const contact = {
  title: "Got a build in mind?",
  lede: "Got a build, a role, or just a hard question about agent architecture? I read every message myself — reach out below.",
  availability: "Open to freelance, internships & collaborations",
};
