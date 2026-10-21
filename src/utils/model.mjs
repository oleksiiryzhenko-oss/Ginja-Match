export const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
export const dayKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
export function percentage(successes, attempts) {
  return attempts > 0 ? Math.round((successes / attempts) * 100) : 0;
}
export function aggregate(sessions) {
  return sessions.reduce(
    (a, s) => ({
      attempts: a.attempts + s.attempts,
      successes: a.successes + s.successes,
      minutes: a.minutes + s.seconds / 60,
      sessions: a.sessions + 1,
    }),
    { attempts: 0, successes: 0, minutes: 0, sessions: 0 },
  );
}
export function challengeProgress(challenge, sessions) {
  const eligible = sessions.filter(
    (s) =>
      (!challenge.skillId || s.skillId === challenge.skillId) &&
      s.day >= challenge.startDay &&
      s.day <= challenge.endDay,
  );
  const totals = aggregate(eligible);
  const value =
    challenge.metric === "sessions"
      ? totals.sessions
      : challenge.metric === "minutes" || challenge.metric === "minutos"
        ? Math.floor(totals.minutes)
        : totals.successes;
  return {
    value,
    percent: Math.min(100, percentage(value, challenge.target)),
    complete: value >= challenge.target,
  };
}
export function streak(sessions, today = new Date()) {
  const days = new Set(sessions.map((s) => s.day));
  const cursor = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let count = 0;
  while (days.has(dayKey(cursor))) {
    count++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}
export function validateSkill(input) {
  if (
    typeof input.name !== "string" ||
    !input.name.trim() ||
    input.name.trim().length > 60
  )
    return "Becerinize bir ad verin (1–60 karakter).";
  if (!Number.isInteger(input.goal) || input.goal < 1 || input.goal > 10000)
    return "1 ile 10.000 deneme arasında bir hedef belirleyin.";
  if (
    !Number.isInteger(input.duration) ||
    input.duration < 1 ||
    input.duration > 180
  )
    return "Süre 1 ile 180 dakika arasında olmalıdır.";
  return null;
}
export function validateSession(input) {
  if (
    !Number.isInteger(input.attempts) ||
    input.attempts < 1 ||
    input.attempts > 100000
  )
    return "1 ile 100.000 arasında deneme girin.";
  if (
    !Number.isInteger(input.successes) ||
    input.successes < 0 ||
    input.successes > input.attempts
  )
    return "Başarılı deneme sayısı sıfır ile toplam deneme sayısı arasında olmalıdır.";
  if (
    !Number.isFinite(input.seconds) ||
    input.seconds < 1 ||
    input.seconds > 86400
  )
    return "1 saniye ile 24 saat arasında bir süre girin.";
  return null;
}
export function validateChallenge(input) {
  if (
    typeof input.name !== "string" ||
    !input.name.trim() ||
    input.name.trim().length > 80
  )
    return "Hedefinize bir ad verin (1–80 karakter).";
  if (!["sessions", "minutes", "minutos", "successes"].includes(input.metric))
    return "Bir hedef türü seçin.";
  if (
    !Number.isInteger(input.target) ||
    input.target < 1 ||
    input.target > 100000
  )
    return "1 ile 100.000 arasında bir hedef belirleyin.";
  if (!Number.isInteger(input.days) || input.days < 1 || input.days > 90)
    return "1 ile 90 gün arasında bir süre seçin.";
  return null;
}
export function isState(value) {
  if (
    !value ||
    value.schema !== 1 ||
    !Array.isArray(value.skills) ||
    !Array.isArray(value.sessions) ||
    !Array.isArray(value.challenges)
  )
    return false;
  const ids = new Set();
  for (const skill of value.skills) {
    if (
      !skill ||
      typeof skill.id !== "string" ||
      !skill.id ||
      ids.has(skill.id) ||
      validateSkill(skill) ||
      typeof skill.sport !== "string" ||
      typeof skill.instructions !== "string" ||
      typeof skill.archived !== "boolean"
    )
      return false;
    ids.add(skill.id);
  }
  const sessionIds = new Set();
  const validDay = (value) =>
    typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
  for (const s of value.sessions) {
    if (
      !s ||
      typeof s.id !== "string" ||
      !s.id ||
      sessionIds.has(s.id) ||
      !ids.has(s.skillId) ||
      !validDay(s.day) ||
      validateSession(s) ||
      typeof s.notes !== "string" ||
      !["Easy", "Steady", "Challenging"].includes(s.effort)
    )
      return false;
    sessionIds.add(s.id);
  }
  const challengeIds = new Set();
  for (const c of value.challenges) {
    if (
      !c ||
      typeof c.id !== "string" ||
      !c.id ||
      challengeIds.has(c.id) ||
      (c.skillId && !ids.has(c.skillId)) ||
      validateChallenge(c) ||
      !validDay(c.startDay) ||
      !validDay(c.endDay) ||
      c.endDay < c.startDay
    )
      return false;
    challengeIds.add(c.id);
  }
  return true;
}
