chrome.runtime.onMessage.addListener((data, sender, onSuccess) => {
    if (data.type !== "load") return;
    fetch(data.url)
      .then((response) => response.text())
      .then((text) => {
        const results = [];
        const parser = new DOMParser();
        const virtDom = parser.parseFromString(text, "text/html");
  
        let answersDom = virtDom.querySelector(".pf-content");
        if (!answersDom) {
          answersDom = virtDom.querySelector(".thecontent");
        }
  
        let index = -1;
        let questionText = '';
        let answers = [];
  
        for (let childDom of answersDom.children) {
          if (childDom.tagName === "P") {
            // maybe a question
            const innerDom = childDom.querySelector("strong");
            if (!innerDom) continue;
  
            const textContent = innerDom.textContent.trim();
            const matches = textContent.match(/^[0-9]+\. (.*)$/);
            if (matches !== null) {
              // most likely a question
              if (answers.length > 0) {
                // If previous question and answers were found, push them to the results array
                results.push({
                  question: questionText,
                  answers: answers,
                });
              }
  
              questionText = matches[1];
              answers = [];
            }
          }
  
          if (childDom.tagName === "UL") {
            // most likely the answers
            for (let answerDom of childDom.querySelectorAll("strong")) {
              let answerText = answerDom.textContent.trim();
              if (answerText.endsWith("*")) {
                answerText = answerText.substring(0, answerText.length - 1);
              }
              answers.push(answerText);
            }
          }
        }
  
        // Push the last question and answers to the results array
        results.push({
          question: questionText,
          answers: answers,
        });
  
        onSuccess(results);
      });
  
    return true;
  });
  