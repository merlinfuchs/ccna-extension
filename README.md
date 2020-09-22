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
To install the extension in firefox go to about:debugging#/runtime/this-firefox
and click on "Load temporary Add-on..." in the upper right corner. 
Select the manifest.json in the "extension" directory.
You need to repeat this process when you restart firefox. (it's temporary)

# Use

Go to the cisco exam site, press P and enter the itexamanswers.net url where you want to scrape the answers from.
The extension will fetch and parse the answers in the background.  
Press A to answer a question and N to go to the next question.