let userAgentList = [];

async function loadUserAgents() {
  try {
    const response = await fetch(chrome.runtime.getURL('wordlist.txt'));
    if (!response.ok) throw new Error('Failed to load user agents file');

    const text = await response.text();
    userAgentList = text.split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'));

    const select = document.getElementById('userAgentSelect');
    while (select.options.length > 1) {
      select.remove(1);
    }

    userAgentList.forEach(ua => {
      const option = new Option(ua, ua);
      select.add(option);
    });

    if (userAgentList.length === 0) {
      throw new Error('No valid user agents found in wordlist.txt');
    }

    return userAgentList;
  } catch (error) {
    console.error('Error loading user agents:', error);
    showStatus(`Error: ${error.message}`, 'error');

    const fallbacks = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Mobile/15E148 Safari/604.1'
    ];

    fallbacks.forEach(ua => {
      document.getElementById('userAgentSelect').add(new Option(ua, ua));
    });

    return fallbacks;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadUserAgents();

  // Preset: Apply UA
  document.getElementById('applyPreset').addEventListener('click', () => {
    const selectedUA = document.getElementById('userAgentSelect').value;
    if (!selectedUA) {
      showStatus('Please select a user agent', 'error');
      return;
    }

    chrome.runtime.sendMessage({ action: 'setUserAgent', userAgent: selectedUA }, (response) => {
      if (response.success) {
        showStatus('User Agent applied successfully', 'success');
        updateCurrentAgentDisplay(selectedUA);
        refreshAllTabs();
      } else {
        showStatus('Failed to set User Agent', 'error');
      }
    });
  });

  // Preset: Reset to default
  document.getElementById('resetPreset').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'resetUserAgent' }, (response) => {
      if (response.success) {
        showStatus('Reset to default User Agent', 'success');
        updateCurrentAgentDisplay(navigator.userAgent);
        refreshAllTabs();
      } else {
        showStatus('Failed to reset User Agent', 'error');
      }
    });
  });

  // Custom: Apply custom UA
  document.getElementById('applyCustom').addEventListener('click', () => {
    const customUAInput = document.getElementById('customUserAgent');
    const customUA = customUAInput.value.trim();

    if (!customUA) {
      showStatus('Please enter a custom user agent', 'error');
      customUAInput.focus();
      customUAInput.style.borderColor = 'red';
      return;
    }

    customUAInput.style.borderColor = ''; // reset border if valid

    chrome.runtime.sendMessage({ action: 'setUserAgent', userAgent: customUA }, (response) => {
      if (response.success) {
        showStatus('Custom User Agent applied successfully', 'success');
        updateCurrentAgentDisplay(customUA);
        refreshAllTabs();
      } else {
        showStatus('Failed to set User Agent', 'error');
      }
    });
  });

  // Custom: Reset to default
  document.getElementById('resetCustom').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'resetUserAgent' }, (response) => {
      if (response.success) {
        showStatus('Reset to default User Agent', 'success');
        updateCurrentAgentDisplay(navigator.userAgent);
        refreshAllTabs();
      } else {
        showStatus('Failed to reset User Agent', 'error');
      }
    });
  });
});

document.querySelectorAll('.tab-button').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-tab');

    // Deactivate all tabs and buttons
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));

    // Activate the selected tab and button
    document.getElementById(target).classList.add('active');
    btn.classList.add('active');

    // Focus the input when switching to custom tab
    if (target === 'custom') {
      setTimeout(() => {
        const input = document.getElementById('customUserAgent');
        input.focus();
      }, 50);
    }
  });
});

function showStatus(message, type) {
  const status = document.getElementById('statusMessage');
  status.textContent = message;
  status.className = `status ${type}`;
  status.style.display = 'block';
}

function updateCurrentAgentDisplay(ua) {
  document.getElementById('currentAgent').textContent = ua;
}

function openTab(tabName) {
  const tabs = document.querySelectorAll('.tab');
  const buttons = document.querySelectorAll('.tab-button');

  tabs.forEach(tab => tab.classList.remove('active'));
  buttons.forEach(btn => btn.classList.remove('active'));

  document.getElementById(tabName).classList.add('active');
  event.target.classList.add('active');
}

function refreshAllTabs() {
  chrome.tabs.query({}, (tabs) => {
    for (let tab of tabs) {
      if (
        tab.id &&
        tab.url &&
        !tab.url.startsWith("chrome://") &&
        !tab.url.startsWith("chrome-extension://")
      ) {
        chrome.tabs.reload(tab.id);
      }
    }
  });
}
