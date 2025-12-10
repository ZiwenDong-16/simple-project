
export const mockProject = {
  id: 1,
  name: "Demo Project (no backend)",
  description: "This project is using local mock data instead of a real backend.",
  slug: "demo-project",
};

export const mockTasks = [
  {
    id: 1,
    title: "Set up React project",
    description: "Make sure npm start works.",
    stage: 1,
  },
  {
    id: 2,
    title: "Implement WebSocket client",
    description: "Connect Project and Board to ws server.",
    stage: 2,
  },
  {
    id: 3,
    title: "Test real-time sync",
    description: "Open two browser windows and drag cards.",
    stage: 2,
  },
  {
    id: 4,
    title: "Write report",
    description: "Describe architecture & concurrency model.",
    stage: 3,
  },
];
