// Helper to get formatted YYYY-MM-DD relative to today
const getDateOffset = (daysOffset) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const SUBJECT_CONFIG = {
  "Computer Science": {
    color: "#6366f1", // Indigo
    bg: "rgba(99, 102, 241, 0.12)",
    border: "rgba(99, 102, 241, 0.25)",
    icon: "💻"
  },
  "Mathematics": {
    color: "#0ea5e9", // Sky blue
    bg: "rgba(14, 165, 233, 0.12)",
    border: "rgba(14, 165, 233, 0.25)",
    icon: "📐"
  },
  "Physics": {
    color: "#8b5cf6", // Purple
    bg: "rgba(139, 92, 246, 0.12)",
    border: "rgba(139, 92, 246, 0.25)",
    icon: "⚡"
  },
  "Chemistry": {
    color: "#10b981", // Emerald
    bg: "rgba(16, 185, 129, 0.12)",
    border: "rgba(16, 185, 129, 0.25)",
    icon: "🧪"
  },
  "Literature": {
    color: "#f59e0b", // Amber
    bg: "rgba(245, 158, 11, 0.12)",
    border: "rgba(245, 158, 11, 0.25)",
    icon: "📚"
  },
  "History": {
    color: "#ec4899", // Pink
    bg: "rgba(236, 72, 153, 0.12)",
    border: "rgba(236, 72, 153, 0.25)",
    icon: "🏛️"
  },
  "Economics": {
    color: "#14b8a6", // Teal
    bg: "rgba(20, 184, 166, 0.12)",
    border: "rgba(20, 184, 166, 0.25)",
    icon: "📊"
  },
  "General": {
    color: "#64748b", // Slate
    bg: "rgba(100, 116, 139, 0.12)",
    border: "rgba(100, 116, 139, 0.25)",
    icon: "📝"
  }
};

export const INITIAL_ASSIGNMENTS = [
  {
    id: 1,
    title: "Binary Search Tree & Graph Algorithms Lab",
    subject: "Computer Science",
    deadline: getDateOffset(-2), // Overdue
    priority: "High",
    completed: false,
    estimatedHours: 4,
    notes: "Implement Dijkstra's algorithm and submit before portal locks. Unit tests required.",
    createdAt: Date.now() - 400000000
  },
  {
    id: 2,
    title: "Multivariable Calculus Problem Set #5",
    subject: "Mathematics",
    deadline: getDateOffset(0), // Due Today
    priority: "High",
    completed: false,
    estimatedHours: 3,
    notes: "Problems 12-24 on Green's Theorem and line integrals. Show detailed steps.",
    createdAt: Date.now() - 300000000
  },
  {
    id: 3,
    title: "Quantum Mechanics Wavepacket Simulation Report",
    subject: "Physics",
    deadline: getDateOffset(1), // Due Tomorrow
    priority: "Medium",
    completed: false,
    estimatedHours: 2.5,
    notes: "Plot wave function dispersion curves in Python and export high-res graphs.",
    createdAt: Date.now() - 200000000
  },
  {
    id: 4,
    title: "Modern European History Essay Draft",
    subject: "History",
    deadline: getDateOffset(4), // Due in 4 days
    priority: "Medium",
    completed: false,
    estimatedHours: 5,
    notes: "1,500 words on the economic aftermath of WWI in Central Europe. Cite 4 primary sources.",
    createdAt: Date.now() - 150000000
  },
  {
    id: 5,
    title: "Microeconomics Game Theory Problem Set",
    subject: "Economics",
    deadline: getDateOffset(6), // Upcoming next week
    priority: "Low",
    completed: false,
    estimatedHours: 2,
    notes: "Nash equilibrium matrices and Cournot duopoly competition models.",
    createdAt: Date.now() - 100000000
  },
  {
    id: 6,
    title: "Organic Chemistry Synthesis Lab Write-up",
    subject: "Chemistry",
    deadline: getDateOffset(-1), // Completed
    priority: "High",
    completed: true,
    estimatedHours: 3.5,
    notes: "NMR spectra analysis and infrared absorption spectroscopy interpretation complete.",
    createdAt: Date.now() - 500000000
  },
  {
    id: 7,
    title: "Shakespearean Tragedy Critical Analysis",
    subject: "Literature",
    deadline: getDateOffset(-3), // Completed
    priority: "Medium",
    completed: true,
    estimatedHours: 3,
    notes: "Theme of hubris in King Lear and Macbeth. Submitted via Canvas with Turnitin score 3%.",
    createdAt: Date.now() - 600000000
  }
];
