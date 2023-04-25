let hideVerifiedReplies = true;

chrome.storage.sync.get('autoToggle', (data) => {
  hideVerifiedReplies = data.autoToggle || false;
  findVerifiedReplies();
});

function findVerifiedReplies() {
  const textInputField = document.querySelector('div[data-testid="tweetTextarea_0"]');
  let articles = document.querySelectorAll('article');

  if (textInputField) {
    const textInputFieldParent = textInputField.closest('[data-testid="cellInnerDiv"]');
    articles = Array.from(articles).slice(Array.from(articles).indexOf(textInputFieldParent) + 1);
  }

  articles.forEach((article, index) => {
    if (index === 0) return; // Skip the original tweet

    const verifiedAccount = article.querySelector('[aria-label="Verified account"]');
    if (verifiedAccount) {
      let showHideButton = article.previousElementSibling;
      if (!showHideButton || !showHideButton.classList.contains('show-blue-reply-button')) {
        showHideButton = document.createElement('button');
        showHideButton.classList.add('show-blue-reply-button');
        showHideButton.innerText = 'Show blue reply';
        showHideButton.style.background = 'transparent';
        showHideButton.style.color = '#1DA1F2';
        showHideButton.style.border = 'none';
        showHideButton.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
        showHideButton.style.textAlign = 'left';
        showHideButton.style.cursor = 'pointer';
        showHideButton.style.fontSize = 'inherit';
        showHideButton.style.paddingLeft = '20px';
        showHideButton.onclick = () => {
          article.style.display = '';
          showHideButton.style.display = 'none';
        };
      }

      if (hideVerifiedReplies) {
        article.parentElement.insertBefore(showHideButton, article);
        article.style.display = 'none';
      } else {
        article.style.display = '';
        if (showHideButton.parentElement) {
          showHideButton.parentElement.removeChild(showHideButton);
        }
      }
    }
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'toggleVerifiedReplies') {
    hideVerifiedReplies = !hideVerifiedReplies;
    findVerifiedReplies();
  } else if (request.message === 'updateAutoToggle') {
    hideVerifiedReplies = request.autoToggle;
    findVerifiedReplies();
  }
});

// Initial execution of the function is now handled within the chrome.storage.sync.get callback
