import pyperclip
import time
import traceback
import requests
import bs4
import re
import json


page = requests.get("https://itexamanswers.net/ccna-2-v6-0-final-exam-answers-routing-switching-essentials.html").text
soup = bs4.BeautifulSoup(page, "html.parser")
container = soup.find("div", {"class": "pf-content"})

elements = container.find_all("strong")
questions = []
for i, strong in enumerate(elements):
    if re.match(r"^[0-9]+\. ", strong.text):
        print(strong.text)
        answers = ""
        for answer in elements[i + 1:]:
            answer_text = answer.text.strip()
            if answer_text.endswith("*"):
                answers += answer_text.strip(" *") + "; "

            else:
                break

        questions.append((strong.text.split(" ", 1)[1].strip(), answers))

print("Scraped %d questions and answers." % len(questions))

while True:
    try:
        question = pyperclip.paste()
        if question and not question.startswith("A: "):
            answers = []
            for q, a in questions:
                if question.strip() in q:
                    answers.append(a)

            pyperclip.copy("A: " + " //// ".join(answers))

    except:
        traceback.print_exc()

    finally:
        time.sleep(0.5)
