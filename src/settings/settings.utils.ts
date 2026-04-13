export function readSettings() {
  return JSON.parse(localStorage.getItem("settings") ?? "{}");
}

export function writeSettings(patch: object) {
  localStorage.setItem("settings", JSON.stringify({ ...readSettings(), ...patch }));
}
