# Advanced MCP Service Integrations for CorverseTalent

This document details the advanced feature roadmap for integrating the **Model Context Protocol (MCP)**—specifically the `chrome-devtools-mcp` server—directly into the CorverseTalent workflow. By leveraging MCP, we can transition from a simple "manual click" Chrome Extension to a fully autonomous, AI-driven recruitment engine.

---

## 1. Autonomous AI Outreach (The "Auto-Pitch")
Instead of just scraping data, we can use MCP to actively interact with the LinkedIn DOM on behalf of the user.
* **How it works:** Once a candidate is synced, the AI analyzes their profile (skills, recent roles, mutual connections) and drafts a highly personalized introductory message. 
* **MCP Integration:** We use the `chrome-devtools` tools (`click`, `type_text`, `press_key`) to automatically open the LinkedIn message dialog, type out the personalized pitch with human-like delays, and hit send.
* **Benefit:** Saves recruiters 5-10 minutes per candidate by eliminating manual message drafting and copying/pasting.

## 2. Bulk Background Search Scraping
Currently, the extension works one profile at a time. MCP allows us to automate bulk discovery.
* **How it works:** The user defines a search in the CRM (e.g., "Senior React Developers in Austin"). The backend triggers a background task.
* **MCP Integration:** The MCP server launches a hidden Chrome Beta instance, navigates to the LinkedIn Search URL, and uses `evaluate_script` to scrape all 10 results on the page. It then uses `click` to hit "Next Page" and repeats this until 100+ candidates are injected into the Supabase database.
* **Benefit:** Massive scale pipeline generation without the user needing to manually click through search pages.

## 3. Human-Emulation Anti-Bot Bypassing
LinkedIn aggressively blocks automated scrapers. Standard puppeteer scripts get banned fast.
* **How it works:** We make the automation indistinguishable from a human recruiter.
* **MCP Integration:** Using the `hover`, `drag`, and `emulate` MCP endpoints, we inject randomized mouse jitters, natural scroll acceleration, and varying pause times between clicks. We also emulate different viewport sizes and user agents.
* **Benefit:** Keeps the user's LinkedIn account 100% safe from "automated bot" bans while still reaping the benefits of automation.

## 4. Deep Profile Extraction (Lazy-Load Bypassing)
LinkedIn hides important data (like the "Skills" section, full "About" summaries, and "Recommendations") behind "Show More" buttons or lazy-loaded scroll triggers.
* **How it works:** A simple HTTP scrape misses this data. We need a real browser to interact with the page first.
* **MCP Integration:** MCP uses `evaluate_script` to find all "Show More" buttons on the profile and systematically clicks them. It then scrolls to the absolute bottom of the page to trigger all lazy-loaded network requests before finally pulling the full DOM for parsing.
* **Benefit:** Richer, more accurate CRM data that captures the full depth of a candidate's resume.

## 5. Network Interception & Validation
Sometimes API calls fail silently due to network drops or Vercel SSO blockers.
* **How it works:** We monitor the actual network traffic of the browser in real-time.
* **MCP Integration:** By using `list_network_requests` and `get_network_request`, the MCP server actively watches the Chrome Extension's outgoing `POST` requests to the Vercel backend. If it detects a `401 Unauthorized` or `500 Error`, it immediately alerts the user or triggers an automatic retry.
* **Benefit:** Guaranteed data integrity. No candidate is ever "lost" due to a silent failure.

## 6. Automated Follow-Up Sequences
Recruitment requires follow-ups.
* **How it works:** The CRM tracks when a message was sent. If 3 days pass with no reply, a follow-up is triggered.
* **MCP Integration:** A CRON job detects the pending follow-up. It uses MCP to open Chrome, navigate directly to that specific user's LinkedIn message thread, checks the DOM to ensure the candidate hasn't replied yet, and if clear, uses `type_text` to send the follow-up.
* **Benefit:** Creates a self-driving outreach machine that runs in the background.

---
**Next Steps for Implementation:**
To begin building these, we will rely heavily on the `chrome-devtools-mcp` tools already registered in our environment, specifically chaining `evaluate_script` (to read the DOM state) with `click` and `type_text` (to perform the actions).
