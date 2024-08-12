chrome.runtime.onInstalled.addListener(() => {
    console.log('Barrister Gemini installed');
  });

// Listener for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'summarize') {
        const termsText = request.text;

        // Send the text to the Flask server
        fetch('https://barr-gem-server.vercel.app/api/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: termsText })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Summary:', data.summary);

            // send the summary back to the content script to display
            chrome.tabs.sendMessage(sender.tab.id, { action: 'displaySummary', summary: data.summary });
        })
        .catch(error => console.error('Error:', error));
    }
});