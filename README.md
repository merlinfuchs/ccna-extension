This is provided as a proof-of-concept and is not intended to actually be used to pass the cisco exams.
Use this at your own risk.

# Install

## Chrome
To install the extension in chrome go to chrome://extensions/ 
and enable the Developer Mode in the upper right corner. 
A button called "Load unpacked" will appear on the left side. 
Click it and select the "extension" directory. 
Optionally move the extension into the chrome menu. (essentially hide it)

## Firefox
Firefox doesn't work with netacad tests (afaik). Same problem with WebKit. Just use a chromium based browser.

# Use

Go to the cisco exam site, press P and enter the itexamanswers.net url where you want to scrape the answers from.
If you want to set the link previously (so you don't have to press P before the test), you can set it in the content.js file at

    else if (event.key === "t") {
      chrome.storage.local.get(["lastUrl"], result => {
          answerUrl = "put-link-here";
          chrome.storage.local.set({lastUrl: answerUrl});
          fetchChapterData();
      })
    }
If you adopt this solution, after you start the test, click T. Nothing will appear.
  
The extension will fetch and parse the answers in the background.  
Press A to answer a question and N to go to the next question.
