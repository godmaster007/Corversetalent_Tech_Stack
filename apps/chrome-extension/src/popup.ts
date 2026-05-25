// Popup UI logic

document.addEventListener('DOMContentLoaded', () => {
  const btnStart = document.getElementById('btn-start') as HTMLButtonElement;
  const btnStop = document.getElementById('btn-stop') as HTMLButtonElement;
  const statusDot = document.getElementById('status-dot') as HTMLSpanElement;
  const statusText = document.getElementById('status-text') as HTMLSpanElement;
  
  // Load initial state
  chrome.storage.local.get(['isRunning', 'dailyStats'], (result) => {
    updateUI(result.isRunning);
    
    if (result.dailyStats) {
      const elConns = document.getElementById('stat-connections');
      const elViews = document.getElementById('stat-views');
      const elMsgs = document.getElementById('stat-messages');
      
      if (elConns) elConns.textContent = `${result.dailyStats.connections} / 25`;
      if (elViews) elViews.textContent = `${result.dailyStats.profilesViewed}`;
      if (elMsgs) elMsgs.textContent = `${result.dailyStats.messages}`;
    }
  });
  
  btnStart?.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'START_CAMPAIGN' }, (res) => {
      if (res && res.status === 'started') {
        updateUI(true);
      }
    });
  });
  
  btnStop?.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'STOP_CAMPAIGN' }, (res) => {
      if (res && res.status === 'stopped') {
        updateUI(false);
      }
    });
  });
  
  function updateUI(isRunning: boolean) {
    if (isRunning) {
      btnStart.classList.add('hidden');
      btnStop.classList.remove('hidden');
      statusDot.classList.remove('status-inactive');
      statusDot.classList.add('status-active');
      statusText.textContent = 'Automation Running';
    } else {
      btnStart.classList.remove('hidden');
      btnStop.classList.add('hidden');
      statusDot.classList.remove('status-active');
      statusDot.classList.add('status-inactive');
      statusText.textContent = 'Automation Paused';
    }
  }
});
