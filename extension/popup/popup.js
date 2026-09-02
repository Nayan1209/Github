const defaults = { enabled: false, scheduleHour: 23, mode: "pull-request", maxChangesPerRun: 1, repository: "" };
const $ = (id) => document.getElementById(id);

for (let h = 0; h < 24; h++) {
  const option = document.createElement("option");
  option.value = h;
  option.textContent = `${String(h).padStart(2, "0")}:00`;
  $("hour").appendChild(option);
}

async function load() {
  const { config = defaults } = await chrome.storage.local.get("config");
  $("repository").value = config.repository || "";
  $("hour").value = config.scheduleHour ?? 23;
  $("mode").value = config.mode || "pull-request";
  render(config.enabled);
}

async function save(enabled = undefined) {
  const { config = defaults } = await chrome.storage.local.get("config");
  const next = {
    ...defaults,
    ...config,
    repository: $("repository").value.trim(),
    scheduleHour: Number($("hour").value),
    mode: $("mode").value,
    ...(enabled === undefined ? {} : { enabled })
  };
  await chrome.storage.local.set({ config: next });
  render(next.enabled);
  $("message").textContent = "Settings saved.";
}

function render(enabled) {
  $("status").textContent = enabled ? "ON" : "OFF";
  $("status").className = `status ${enabled ? "on" : "off"}`;
  $("toggle").textContent = enabled ? "Disable daily agent" : "Enable daily agent";
}

$("save").addEventListener("click", () => save());
$("toggle").addEventListener("click", async () => {
  const { config = defaults } = await chrome.storage.local.get("config");
  if (!$("repository").value.trim()) {
    $("message").textContent = "Add a repository first.";
    return;
  }
  await save(!config.enabled);
});
load();
