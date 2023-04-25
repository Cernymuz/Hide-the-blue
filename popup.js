document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggleButton');
  const autoToggle = document.getElementById('autoToggle');

  // Load the autoToggle state from storage and set the checkbox
  chrome.storage.sync.get('autoToggle', (data) => {
    autoToggle.checked = data.autoToggle || false;
  });

  toggleButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      chrome.tabs.sendMessage(tab.id, { message: 'toggleVerifiedReplies' });
    });
  });

  autoToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ autoToggle: autoToggle.checked });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      chrome.tabs.sendMessage(tab.id, { message: 'updateAutoToggle', autoToggle: autoToggle.checked });
    });
  });
});
