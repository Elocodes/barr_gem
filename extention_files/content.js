// Function to create and insert the Barrister Gemini icon
function insertGeminiIcon() {
    try {
        const icon = document.createElement('img');
        icon.src = chrome.runtime.getURL('icons/icon48.png');
        icon.id = 'barrister-gemini-icon';

        // Style the icon
        icon.style.position = 'fixed';
        icon.style.bottom = '20px';
        icon.style.right = '20px';
        icon.style.width = '50px';
        icon.style.height = '50px';
        icon.style.cursor = 'pointer';
        icon.style.zIndex = '1000';

        // Insert the icon into the page
        document.body.appendChild(icon);

        // Add click event listener
        icon.addEventListener('click', handleIconClick);
    } catch (error) {
        console.error('Error inserting Gemini icon:', error);
    }
}

// Function to detect keywords in the page content
function detectTermsAndConditions() {
    try {
        const termsKeywords = [
            'terms of service',
            'terms and conditions',
            'privacy policy',
            'user agreement',
            'acceptable use policy'
        ];

        // Check headers first
        const headerTags = document.querySelectorAll('h1, h2, h3');
        let headerDetected = false;

        headerTags.forEach(header => {
            const headerText = header.innerText.toLowerCase();
            if (termsKeywords.some(keyword => headerText.includes(keyword))) {
                headerDetected = true;
            }
        });

        return headerDetected;
    } catch (error) {
        console.error('Error detecting terms and conditions:', error);
        return false;
    }
}

// Function to check if the page is likely to have terms and conditions based on URL
function isTermsPage() {
    try {
        const termsPatterns = [/\/terms/, /\/privacy/, /\/legal/, /\/agreement/];
        const url = window.location.href;

        // Check if the URL matches common terms patterns
        return termsPatterns.some(pattern => pattern.test(url));
    } catch (error) {
        console.error('Error checking if page is a terms page:', error);
        return false;
    }
}

// Run detection when the content script is loaded
try {
    if (isTermsPage() || detectTermsAndConditions()) {
        console.log("Terms and Conditions detected!!!");
        insertGeminiIcon();
    }
} catch (error) {
    console.error('Error running detection logic:', error);
}

// Function to handle the click event on the Gemini icon
function handleIconClick() {
    try {
        const termsText = document.body.innerText;

        // Send the text to the background script
        chrome.runtime.sendMessage({ action: 'summarize', text: termsText });
    } catch (error) {
        console.error('Error handling icon click:', error);
    }
}

// Function to create and insert the summary container into the page
function createSummaryContainer() {
    try {
        const summaryContainer = document.createElement('div');
        summaryContainer.id = 'summaryContainer';
        summaryContainer.style.display = 'none';
        summaryContainer.style.position = 'fixed';
        summaryContainer.style.bottom = '20px';
        summaryContainer.style.right = '20px';
        summaryContainer.style.width = '400px';
        summaryContainer.style.maxHeight = '500px';
        summaryContainer.style.overflowY = 'auto';
        summaryContainer.style.backgroundColor = '#f9f9f9';
        summaryContainer.style.border = '1px solid #ddd';
        summaryContainer.style.padding = '10px';
        summaryContainer.style.zIndex = '1000';
        summaryContainer.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';

        const summaryTitle = document.createElement('h2');
        summaryTitle.textContent = 'Summary';
        summaryTitle.style.fontSize = '16px';
        summaryTitle.style.marginBottom = '10px';

        const summaryResult = document.createElement('div');
        summaryResult.id = 'summaryResult';
        summaryResult.style.wordWrap = 'break-word';
        summaryResult.style.whiteSpace = 'pre-wrap';
        summaryResult.style.marginBottom = '10px';

        // Create the "OK" button
        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.display = 'block';
        okButton.style.margin = '0 auto';
        okButton.style.padding = '5px 10px';
        okButton.style.backgroundColor = '#4CAF50';
        okButton.style.color = 'white';
        okButton.style.border = 'none';
        okButton.style.cursor = 'pointer';
        okButton.style.borderRadius = '4px';

        // Add event listener to the "OK" button to close the summary container
        okButton.addEventListener('click', () => {
            summaryContainer.style.display = 'none';
        });

        summaryContainer.appendChild(summaryTitle);
        summaryContainer.appendChild(summaryResult);
        summaryContainer.appendChild(okButton);
        document.body.appendChild(summaryContainer);
    } catch (error) {
        console.error('Error creating summary container:', error);
    }
}

// Create the summary container when the content script loads
try {
    createSummaryContainer();
} catch (error) {
    console.error('Error initializing summary container:', error);
}

// Listener for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    try {
        if (request.action === 'displaySummary') {
            const summary = request.summary;

            // Display the summary in the summary container
            const summaryContainer = document.getElementById('summaryContainer');
            const summaryResult = document.getElementById('summaryResult');

            summaryResult.textContent = summary;
            summaryContainer.style.display = 'block';
        }
    } catch (error) {
        console.error('Error handling message from background script:', error);
    }
});
