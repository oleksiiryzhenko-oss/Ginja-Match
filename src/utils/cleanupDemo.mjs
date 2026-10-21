const skillIds = ['demo:free-throw', 'demo:passing', 'demo:balance'];
const sessionIds = Array.from({ length: 12 }, (_, i) => `demo:session:${i}`);
const challengeIds = ['demo:weekly', 'demo:accuracy', 'demo:focus'];

export function removeDemoData(state) {
  const sessions = state.sessions.filter((item) => !sessionIds.includes(item.id));
  const challenges = state.challenges.filter((item) => !challengeIds.includes(item.id));
  const referenced = new Set([...sessions, ...challenges].map((item) => item.skillId));
  return { ...state, sessions, challenges, skills: state.skills.filter((item) => !skillIds.includes(item.id) || referenced.has(item.id)) };
}
