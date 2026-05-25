// Corversetalent Background Service Worker
// Manages automation queues, safety limits, and API sync

console.log("Corversetalent Automation: Background Service Worker initialized.");

// State management
let isRunning = false;
let dailyConnections = 0;
const MAX_DAILY_CONNECTIONS = 25; // Safety limit
const API_BASE_URL = "http://localhost:3000/api";

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed and ready.");
  // Initialize storage
  chrome.storage.local.set({ 
    isRunning: false,
    dailyStats: {
      date: new Date().toISOString().split('T')[0],
      connections: 0,
      messages: 0,
      profilesViewed: 0
    }
  });
});

// Message listener from popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "START_CAMPAIGN") {
    isRunning = true;
    chrome.storage.local.set({ isRunning: true });
    sendResponse({ status: "started" });
    return true;
  }
  
  if (request.action === "STOP_CAMPAIGN") {
    isRunning = false;
    chrome.storage.local.set({ isRunning: false });
    sendResponse({ status: "stopped" });
    return true;
  }
  
  if (request.action === "CHECK_LIMITS") {
    chrome.storage.local.get(['dailyStats'], (res) => {
      if (res.dailyStats && res.dailyStats.connections >= MAX_DAILY_CONNECTIONS) {
        sendResponse({ safe: false, reason: "Daily connection limit reached." });
      } else {
        sendResponse({ safe: true });
      }
    });
    return true;
  }

  if (request.action === "LOG_CONNECTION") {
    chrome.storage.local.get(['dailyStats'], (res) => {
      if (res.dailyStats) {
        res.dailyStats.connections += 1;
        chrome.storage.local.set({ dailyStats: res.dailyStats });
        console.log(`Connection logged. Total today: ${res.dailyStats.connections}`);
      }
    });
    // Fire and forget
  }

  if (request.action === "SYNC_PROFILE_DATA") {
    syncToCRM(request.data)
      .then(res => sendResponse({ success: true, data: res }))
      .catch(err => sendResponse({ success: false, error: err.toString() }));
    return true;
  }
});

async function syncToCRM(profileData: any) {
  try {
    console.log("Syncing to CRM...", profileData);
    // Real implementation would POST to Next.js /api/linkedin/sync route
    return { synced: true };
  } catch (error) {
    console.error("Failed to sync to CRM", error);
    throw error;
  }
}
