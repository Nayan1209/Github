const DEFAULT_CONFIG = {
  enabled: false,
  scheduleHour: 23,
  mode: "pull-request",
  maxChangesPerRun: 1,
  repository: ""
};

chrome.runtime.onInstalled.addListener(async () => {
  const stored = await chrome.storage.local.get("config");
  if (!stored.config) {
    await chrome.storage.local.set({ config: DEFAULT_CONFIG });
  }
  await scheduleDailyAlarm();
});

chrome.runtime.onStartup.addListener(scheduleDailyAlarm);

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== "daily-agent") return;
  const { config = DEFAULT_CONFIG } = await chrome.storage.local.get("config");
  if (!config.enabled || !config.repository) return;

  // Phase 1 intentionally does not mutate repositories.
  // Later phases will hand this event to the AI planner/executor.
  console.info("Daily GitHub AI Agent run requested", config.repository);
});

async function scheduleDailyAlarm() {
  const { config = DEFAULT_CONFIG } = await chrome.storage.local.get("config");
  await chrome.alarms.clear("daily-agent");
  await chrome.alarms.create("daily-agent", {
    when: nextOccurrence(config.scheduleHour),
    periodInMinutes: 24 * 60
  });
}

function nextOccurrence(hour) {
  const now = new Date();
  const next = new Date(now);
  next.setHours(Number(hour) || 23, 0, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  return next.getTime();
}
