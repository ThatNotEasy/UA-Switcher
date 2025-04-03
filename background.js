const DEFAULT_RULE_ID = 1;

async function getNextRuleId() {
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  if (existingRules.length === 0) return DEFAULT_RULE_ID;
  return Math.max(...existingRules.map(rule => rule.id)) + 1;
}

async function setUserAgent(userAgent) {
  try {
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const ruleIds = existingRules.map(rule => rule.id);
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ruleIds
    });

    const ruleId = await getNextRuleId();
    const targetUA = userAgent || navigator.userAgent;

    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [
        {
          id: ruleId,
          priority: 1,
          action: {
            type: "modifyHeaders",
            requestHeaders: [
              { header: "User-Agent", operation: "set", value: targetUA }
            ]
          },
          condition: { urlFilter: "*://*/*", resourceTypes: ["main_frame"] }
        }
      ]
    });

    return { success: true, currentUA: targetUA };
  } catch (error) {
    console.error("Error setting User Agent:", error);
    return { success: false, error: error.message };
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'setUserAgent') {
    setUserAgent(request.userAgent).then(sendResponse);
    return true;
  } else if (request.action === 'resetUserAgent') {
    setUserAgent(null).then(sendResponse);
    return true;
  }
});

chrome.runtime.onInstalled.addListener(async () => {
  await setUserAgent(null);
});
