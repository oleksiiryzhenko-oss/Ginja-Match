const labels = {
  Basketball: "Basketbol",
  Football: "Futbol",
  Tennis: "Tenis",
  Fitness: "Fitness",
  Running: "Koşu",
  Other: "Diğer",
  Active: "Aktif",
  Archived: "Arşiv",
  Easy: "Hafif",
  Steady: "Orta",
  Challenging: "Zorlayıcı",
  "7 days": "7 gün",
  "30 days": "30 gün",
  "All time": "Tüm zamanlar",
  sessions: "antrenman",
  minutes: "dakika",
  minutos: "dakika",
  successes: "başarılı deneme",
};
export const labelForUi = (value) =>
  Object.hasOwn(labels, value) ? labels[value] : value;
export const formatDay = (value) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? value.split("-").reverse().join(".")
    : value;
