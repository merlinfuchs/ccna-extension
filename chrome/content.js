let answerUrl;
let chapterData;

function fetchChapterData() {
    // Chapter answers are fetched by the background script because CORS sucks
    chrome.runtime.sendMessage({type: "load", url: answerUrl}, function (data) {
        console.table(data);
        chapterData = data;
    });
}

function levenshteinDistance (s, t) {
    if (!s.length) return t.length;
    if (!t.length) return s.length;

    return Math.min(
        levenshteinDistance(s.substr(1), t) + 1,
        levenshteinDistance(t.substr(1), s) + 1,
        levenshteinDistance(s.substr(1), t.substr(1)) + (s[0] !== t[0] ? 1 : 0)
    ) + 1;
}

function matchText(textA, textB) {
    const replaceRegex = /[^\w]/gi;
    textA = textA.replace(replaceRegex, "");
    textB = textB.replace(replaceRegex, "");
    return (textA === textB);
}


function findAnswers(questionText, answers) {
    if (chapterData === null) {
        alert("No chapter data loaded. Maybe the fetch failed?!");
        return [];
    }

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


function processQuestion(question) {
    const questionTextDom = question.querySelector(".questionText");
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

    const correctAnswers = findAnswers(questionText, answers);
    if (correctAnswers.length === 0) {
        console.log("No answers found for this question. ;(");
        return;
    }

    for (const answer of correctAnswers) {
        const input = answer.querySelector("input");
        if (!input) continue;
        input.checked = true;
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
        answerUrl = prompt("Please input the answer url (itexamanswers.net)");
        fetchChapterData();
    }
});