# Barrister Gemini Chrome Extension

## Overview
Barrister Gemini is a Chrome extension designed to help users understand complex legal terms and conditions with ease. It automatically detects pages with terms and conditions and provides a summary, highlighting key points. This extension is particularly useful for those who wish to be informed before agreeing to terms and conditions on websites.

## Features

**Automatic Detection**: Identifies pages with terms and conditions.

**Quick Summary**: Generates a concise summary of the terms and conditions using a backend service powered by Gemini API.

**Interactive Icon**: Displays an icon on detected pages, allowing users to click and view the summary.

**User-Friendly Interface**: Presents the summary in a clean, accessible format with an option to dismiss the summary after reading.

## Installation Guide

**Clone the Repository**: git clone https://github.com/Elocodes/barr_gem.git

**Load the Extension files in Chrome**:
Open Chrome and navigate to chrome://extensions/.
Enable "Developer mode" by toggling the switch at the top right.
Click "Load unpacked" and select the directory where you cloned the repository.

**Set Up the Backend**:
The backend is deployed on Vercel. You don't need to run any local servers. The extension is already configured to use the Vercel deployment for summarizing terms and conditions.

**Configuration**:
Ensure that your .env file is set up properly in your development environment, but note that it's not required for testing the Chrome extension as it uses the live Vercel server.

## How to Use

**Navigate to a Website**:
Open any website that contains terms and conditions or privacy policies.
If Barrister Gemini detects relevant content, the extension icon will appear at the bottom right of the page.

**View Summary**:
Click the icon to view a summary of the terms and conditions.
The summary will be displayed in a pop-up container on the page.

**Dismiss Summary**:
After reading the summary, click the "OK" button to dismiss the summary.

## Testing the Extension

The extension has been tested on various websites. You can test it on pages with clear terms and conditions like:

GitHub Terms of Service
Google Terms of Service
Simply visit these pages with the extension enabled, and you should see the Gemini icon appear.

## Future Improvements
**Enhanced Detection**: Further improve the detection logic to minimize false positives.
**Customizable Settings**: Allow users to customize detection sensitivity and summary length.
**Error Handling**: Additional error handling and feedback for users.

## Deployment
The backend is deployed on Vercel, ensuring that the extension is connected to a reliable server for summarizing terms and conditions. The server handles requests securely and efficiently.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request if you have any improvements or bug fixes.


