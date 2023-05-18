let answerUrl;
let chapterData;

function fetchChapterData() {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: "load", url: answerUrl }, (data) => {
        console.table(data);
        if (data) {
          resolve(data);
        } else {
          reject(new Error("Failed to fetch chapter data."));
        }
      });
    });
  }
  

function matchText(textA, textB) {
    const replaceRegex = /[^\w]/gi;
    textA = textA.replace(replaceRegex, "");
    textB = textB.replace(replaceRegex, "");
    return (textA === textB);
}

function findAnswers(questionText, answers, chapterData) {
    const correctAnswers = [];
    for (let entry of chapterData) {
      if (matchText(questionText.trim(), entry.question)) {
        for (let availableAnswer of answers) {
          for (let possibleAnswer of entry.answers) {
            if (matchText(availableAnswer.textContent.trim(), possibleAnswer)) {
              correctAnswers.push(availableAnswer);
            }
          }
        }
      }
    }
    return correctAnswers;
  }
  
  async function processQuestion(question) {
    const questionTextDom = question.querySelector(".questionText .mattext");
    if (!questionTextDom) return;
    const questionText = questionTextDom.textContent.trim();
  
    const answersDom = question.querySelector("ul.coreContent");
    if (!answersDom) return;
    const answers = answersDom.children;
  
    for (let answer of answers) {
      const input = answer.querySelector("input");
      if (!input) continue;
      input.checked = false;
    }
  
    try {
      const chapterData = await fetchChapterData();
      const correctAnswers = findAnswers(questionText, answers, chapterData);
      if (correctAnswers.length === 0) {
        console.log("No answers found for this question. ;(");
        return;
      }
  
      for (const answer of correctAnswers) {
        const input = answer.querySelector("input");
        if (!input) continue;
        input.checked = true;
      }
    } catch (error) {
      console.error("Error fetching chapter data:", error);
    }
  }
  


function clickNext() {
    document.getElementById("next").click();
}

window.addEventListener("keydown", event => {
    if (event.key === "a") {
        // Inactive questions have the hidden class
        const activeQuestion = document.querySelector(".question:not(.hidden)");
        if (activeQuestion) {
            processQuestion(activeQuestion);
        }

    } else if (event.key === "n") {
        clickNext();

    } else if (event.key === "p") {
        chrome.storage.local.get(["lastUrl"], result => {
            answerUrl = prompt("Please input the answer url (itexamanswers.net)", result.lastUrl);
            chrome.storage.local.set({lastUrl: answerUrl});
            fetchChapterData();
        })
    }
    else if (event.key === "t") {
      chrome.storage.local.get(["lastUrl"], result => {
          answerUrl = "put-link-here";
          chrome.storage.local.set({lastUrl: answerUrl});
          fetchChapterData();
      })
  }
});
