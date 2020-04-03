function parsePath() {
    // /virtuoso/delivery/pub-doc/2.0/assessment/lti.1.0/exam.html
    const path = window.location.pathname;
    const pathSegments = path.split("/").filter(s => s !== "");

    const semester = pathSegments[3];
    const chapter = pathSegments[5].replace("lti.", "");
    
    console.log(semester);
    console.log(chapter);
}


function findAnswers(questionText, answers) {
    const fileName = parsePath();
    if (!fileName) return [];
    const fileUrl = chrome.runtime.getURL("answers/" + fileName + ".json");

    var request = new XMLHttpRequest();
    request.open("GET", fileUrl, false);
    request.send(null);

    if (request.status !== 200) return [];

    const chapterQuestions = JSON.parse(request.responseText);

    for (question of chapterQuestions) {

    }

    return [answers[0]];
}


function processQuestion(question) {
    const questionTextDom = question.querySelector(".questionText");
    if (!questionTextDom) return;
    const questionText = questionTextDom.textContent.trim();

    const answersDom = question.querySelector("ul.coreContent");
    if (!answersDom) return;
    const answers = answersDom.children;

    const correctAnswers = findAnswers(questionText, answers);
    for (const answer of correctAnswers) {
        const input = answer.querySelector("input");
        if (!input) return;
        input.checked = true;
    }
}


window.addEventListener("keydown", event => {
    if (event.key === "a") {
        // Inactive questions have the hidden class
        const activeQuestion = document.querySelector(".question:not(.hidden)");
        if (activeQuestion) {
            processQuestion(activeQuestion);
        }
    }
});