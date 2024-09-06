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

//detection logic
// Function to check if the current page is a search engine result page
function isSearchEngineResultsPage() {
    const url = new URL(window.location.href);
    const searchParams = ['q', 'search', 'query'];
    return searchParams.some(param => url.searchParams.has(param));
}

// Function to check if the current page is likely a terms page based on URL
function isTermsPageURL() {
    const termsPatterns = [/\/terms/, /\/privacy/, /\/legal/, /\/site-policy/, /\/agreement/];
    const url = window.location.href;
    return termsPatterns.some(pattern => pattern.test(url));
}

// Function to check if the current page contains terms and conditions in headers
function containsTermsKeywordsInHeaders() {
    const termsKeywords = [
        'terms of service',
        'terms and conditions',
        'privacy policy',
        'user agreement',
        'acceptable use policy',
        'privacy statement',
        'terms and policies'
    ];
    const headerTags = document.querySelectorAll('h1, h2, h3');
    return Array.from(headerTags).some(header => {
        const headerText = header.innerText.toLowerCase();
        return termsKeywords.some(keyword => headerText.includes(keyword));
    });
}

// New function to check if the page has educational or informational content
function containsInformationalContent() {
    const informationalKeywords = [
        'By using our products, you agree to our Terms', 'by accessing or using our services, you are agreeing to these terms'
    ];
    const bodyText = document.body.innerText.toLowerCase();

    return informationalKeywords.some(keyword => bodyText.includes(keyword));
}

// New function to check for structured legal document content
function containsStructuredLegalContent() {
    const structuredPatterns = [/section \d+/i, /article \d+/i, /clause \d+/i, /subsection \d+/i, /part \d+/i];
    const bodyText = document.body.innerText.toLowerCase();
    return structuredPatterns.some(pattern => pattern.test(bodyText));
}

// Main function to decide if the Gemini icon should be shown
function shouldShowGeminiIcon() {
    try {
        // If it's a search engine results page, do not show the icon
        if (isSearchEngineResultsPage()) {
            return false;
        }

        // If headers contain terms and conditions keywords but not informational content, do not show the icon
        //if (containsTermsKeywordsInHeaders() && containsInformationalContent()) {
            //return true;
        //}

        // If the URL suggests it might be a terms page, and contains structured content, show the icon
        if (isTermsPageURL() && containsTermsKeywordsInHeaders()) {
            return true;
        }

        // If headers contain terms and conditions keywords but not informational content, do not show the icon
        //if (containsTermsKeywordsInHeaders() && !containsInformationalContent()) {
            //return true;
        //}

        // Otherwise, do not show the icon
        return false;
    } catch (error) {
        console.error('Error determining if the Gemini icon should be shown:', error);
        return false;
    }
}

// Run detection when the content script is loaded
try {
    if (shouldShowGeminiIcon()){
        console.log("Terms and Conditions detected!!!");
        insertGeminiIcon();
    }
} catch (error) {
    console.error('Error running detection logic:', error);
}

// Function to create and insert the loading spinner
function insertLoadingSpinner() {
    const spinner = document.createElement('div');
    spinner.id = 'loadingSpinner';
    
    // Style and insert the spinner into the page
    spinner.style.position = 'fixed';
    spinner.style.bottom = '20px';
    spinner.style.right = '90px'; // Adjusted position next to the Gemini icon
    spinner.style.width = '40px';
    spinner.style.height = '40px';
    spinner.style.border = '4px solid rgba(255, 255, 255, 0.3)';
    spinner.style.borderTopColor = '#fff';
    spinner.style.borderRadius = '50%';
    spinner.style.animation = 'spin 1s linear infinite';
    spinner.style.zIndex = '1001';
    spinner.style.display = 'none'; // Initially hidden

    document.body.appendChild(spinner);
}

// Function to show the loading spinner
function showLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'block';
    }
}

// Function to hide the loading spinner
function hideLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

// Insert the spinner when the content script loads
insertLoadingSpinner();

// Function to handle the click event on the Gemini icon
function handleIconClick() {
    try {
        showLoadingSpinner(); // Show the loading spinner
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

            // Hide the loading spinner
            hideLoadingSpinner();

            // Display the summary in the summary container
            const summaryContainer = document.getElementById('summaryContainer');
            const summaryResult = document.getElementById('summaryResult');

            //summaryResult.textContent = summary;
            summaryResult.innerHTML = summary; // Use innerHTML for HTML content
            summaryContainer.style.display = 'block';
        }
    } catch (error) {
        console.error('Error handling message from background script:', error);
    }
});
