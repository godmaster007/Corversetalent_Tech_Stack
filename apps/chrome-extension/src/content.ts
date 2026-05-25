// Corversetalent Content Script
// Injected into LinkedIn pages to extract DOM data and automate clicks safely

console.log("Corversetalent Automation: Content Script injected on LinkedIn.");

// Utility to create human-like delays
const randomDelay = (min = 2000, max = 8000) => {
  return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
};

// Listen for messages from background/popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "EXTRACT_PROFILE") {
    sendResponse(extractProfileData());
  }
  if (request.action === "SCRAPE_SEARCH_RESULTS") {
    sendResponse(scrapeSearchResults());
  }
  if (request.action === "RUN_CONNECTION_CAMPAIGN") {
    runConnectionCampaign(request.note).then(() => {
      sendResponse({ status: "campaign_completed" });
    });
    return true; // Keep async channel open
  }
});

// Basic Profile Extraction Logic
function extractProfileData() {
  const nameElement = document.querySelector("h1.text-heading-xlarge");
  const titleElement = document.querySelector("div.text-body-medium");
  const locationElement = document.querySelector("span.text-body-small.inline.t-black--light.break-words");
  
  const data = {
    name: nameElement ? nameElement.textContent?.trim() : "Unknown",
    title: titleElement ? titleElement.textContent?.trim() : "Unknown",
    location: locationElement ? locationElement.textContent?.trim() : "Unknown",
    linkedinUrl: window.location.href,
    scrapedAt: new Date().toISOString()
  };
  
  console.log("Extracted Profile Data:", data);
  chrome.runtime.sendMessage({ action: "SYNC_PROFILE_DATA", data });
  return data;
}

// Scrape Standard Search Results
function scrapeSearchResults() {
  const results: any[] = [];
  // LinkedIn standard search result cards usually have this general structure
  const cards = document.querySelectorAll("li.reusable-search__result-container");
  
  cards.forEach(card => {
    const nameEl = card.querySelector("span[dir='ltr'] span[aria-hidden='true']");
    const titleEl = card.querySelector(".entity-result__primary-subtitle");
    const locationEl = card.querySelector(".entity-result__secondary-subtitle");
    const linkEl = card.querySelector("a.app-aware-link");
    
    if (nameEl && linkEl) {
      results.push({
        name: nameEl.textContent?.trim(),
        title: titleEl ? titleEl.textContent?.trim() : "",
        location: locationEl ? locationEl.textContent?.trim() : "",
        linkedinUrl: (linkEl as HTMLAnchorElement).href.split('?')[0] // Remove tracking params
      });
    }
  });
  
  console.log(`Scraped ${results.length} profiles from search.`);
  return results;
}

// Run Connection Automation on Search Page
async function runConnectionCampaign(personalizedNote: string) {
  console.log("Starting connection campaign...");
  
  const buttons = Array.from(document.querySelectorAll("button")).filter(
    btn => btn.textContent?.trim() === "Connect" && btn.offsetParent !== null
  );
  
  if (buttons.length === 0) {
    console.log("No Connect buttons found on this page.");
    return;
  }

  for (let i = 0; i < buttons.length; i++) {
    // 1. Safety Check: Ask background script if we hit daily limit
    const safetyCheck = await new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: "CHECK_LIMITS" }, resolve);
    });
    
    if (!(safetyCheck as any).safe) {
      console.warn("Safety limit reached. Stopping campaign.");
      break;
    }

    const btn = buttons[i];
    console.log(`Clicking Connect button ${i + 1} of ${buttons.length}`);
    
    // Smooth scroll to button to mimic human
    btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await randomDelay(1000, 3000);
    
    btn.click();
    await randomDelay(1500, 3000); // Wait for modal
    
    // 2. Handle "Add a note" Modal
    const addNoteBtn = Array.from(document.querySelectorAll("button")).find(
      b => b.textContent?.trim() === "Add a note"
    );
    
    if (addNoteBtn) {
      addNoteBtn.click();
      await randomDelay(1000, 2000);
      
      const textArea = document.querySelector("textarea[name='message']") as HTMLTextAreaElement;
      if (textArea && personalizedNote) {
        // Trigger React change events
        textArea.value = personalizedNote;
        textArea.dispatchEvent(new Event('input', { bubbles: true }));
        await randomDelay(1000, 2500);
      }
      
      // Click Send
      const sendBtn = Array.from(document.querySelectorAll("button")).find(
        b => b.textContent?.trim() === "Send"
      );
      if (sendBtn) {
        sendBtn.click();
        
        // Log successful connection to background script
        chrome.runtime.sendMessage({ action: "LOG_CONNECTION" });
      }
    } else {
      // Sometimes it's just "Send without a note" or immediately sends
      const sendWithoutNoteBtn = Array.from(document.querySelectorAll("button")).find(
        b => b.textContent?.trim() === "Send without a note"
      );
      if (sendWithoutNoteBtn) {
        sendWithoutNoteBtn.click();
        chrome.runtime.sendMessage({ action: "LOG_CONNECTION" });
      }
    }
    
    // Massive delay between connection requests (Safety Protocol)
    console.log("Connection sent. Resting...");
    await randomDelay(15000, 35000); // Wait 15-35 seconds between connections
  }
  
  console.log("Campaign iteration finished.");
}

// Auto-run extraction if we land on a profile page
if (window.location.href.includes("linkedin.com/in/")) {
  setTimeout(() => extractProfileData(), 3000);
}
