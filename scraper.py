import requests
import bs4
import re
import json


def scrape_questions(url):
    page = requests.get(url).text
    soup = bs4.BeautifulSoup(page, "html.parser")
    container = soup.find("div", {"class": "pf-content"})

    elements = container.find_all("strong")
    questions = []
    for i, strong in enumerate(elements):
        if re.match(r"^[0-9]+\. ", strong.text):
            answers = []
            for answer in elements[i + 1:]:
                answer_text = answer.text.strip()
                if answer_text.endswith("*"):
                    answers.append(answer_text.strip(" *"))

                else:
                    break

            questions.append((strong.text.split(" ", 1)[1].strip(), answers))

    return questions


if __name__ == "__main__":
    url = input("Which itexamanswers.net site do you want to scrape?")
    questions = scrape_questions(url)
    print("Scraped %d questions and answers" % len(questions))
    name = input("Which name should the file have?")
    with open("questions/%s.json" % name, "w") as fp:
        json.dump(questions, fp)
