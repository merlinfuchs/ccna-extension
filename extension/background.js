chrome.runtime.onMessage.addListener((data, sender, onSuccess) => {
    if (data.type !== "load") return;
    fetch(data.url)
        .then(response => response.text())
        .then(text => {
            const results = [];

            const parser = new DOMParser();
            const virtDom = parser.parseFromString(text, "text/html");

            const answersDom = virtDom.querySelector(".pf-content");

            let index = -1;
            for (let childDom of answersDom.children) {
                index++;

                if (childDom.tagName === "P") {
                    // maybe a question question
                    const innerDom = childDom.querySelector("strong");
                    if (innerDom === null) continue;

                    const textContent = innerDom.textContent.trim();
                    const matches = textContent.match(/^[0-9]+\. (.*)$/);
                    if (matches !== null) {
                        // most likely a question
                        const questionText = matches[1];
                        const nextChild = answersDom.children[index + 1];
                        if (nextChild === null) continue;

                        if (nextChild.tagName === "UL") {
                            // most likely the answers
                            const answers = [];
                            for (let answerDom of nextChild.querySelectorAll("strong")) {
                                let answerText = answerDom.textContent.trim();
                                if (answerText.endsWith("*")) {
                                    answerText = answerText.substring(0, answerText.length - 1);
                                }
                                answers.push(answerText);
                            }

                            results.push({
                                question: questionText,
                                answers: answers
                            });
                        }
                    }

                }
            }

            onSuccess(results);
        });

    return true;
});