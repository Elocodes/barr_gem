chrome.runtime.onInstalled.addListener(() => {
    console.log('Barrister Gemini installed');
});

function markdownToHtml(markdown) {
    // Convert headings (## and # to <h1> and <h2>)
    markdown = markdown.replace(/^## (.*$)/gim, '<h2>$1</h2>'); // Subheading (##)
    markdown = markdown.replace(/^# (.*$)/gim, '<h1>$1</h1>');  // Heading (#)

    // Convert bold text ( **text** to <b>text</b> )
    markdown = markdown.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    // Convert bullet points (* or - followed by a space to <li>)
    markdown = markdown.replace(/^\s*[-*]\s+(.*$)/gim, '<li>$1</li>');

    // Wrap lists in <ul> tags
    markdown = markdown.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');

    // Return the converted HTML
    return markdown;
}

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
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.summary) {
                const htmlSummary = markdownToHtml(data.summary);
                console.log('Summary:', htmlSummary);
                //console.log('Summary:', data.summary);


                // send the summary back to the content script to display
                chrome.tabs.sendMessage(sender.tab.id, { action: 'displaySummary', summary: htmlSummary });
            } else {
                console.error('Unexpected response format:', data);
                chrome.tabs.sendMessage(sender.tab.id, { action: 'displaySummary', summary: 'Error: Unexpected response format.' });
            }
        })
        .catch(error => {
            console.error('Error fetching summary:', error);
            // Optionally, send a message back to the content script to handle the error gracefully
            //chrome.tabs.sendMessage(sender.tab.id, { action: 'displaySummary', summary: 'Error: Unable to fetch summary. Please try again later.' });
        });
    }
});