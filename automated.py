from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException, UnexpectedAlertPresentException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.expected_conditions import presence_of_element_located
import time
import traceback
import json
import keyboard


questions = json.load(open("questions/" + input("Question file (e.g. '2_1'): ") + ".json"))


def _search_answers(_question):
    pot_answers = []
    for question, answers in questions:
        if _question.strip() in question.strip() or question.strip() in _question.strip():
            pot_answers.append(answers)

    return pot_answers


driver = webdriver.Chrome("./chromedriver")
driver.get("https://netacad.com")
main_window = driver.current_window_handle

"""
email = None
while not email:
    try:
        email = driver.find_element_by_xpath('//*[@id="loginForm"]/div/div/div[3]/div/div[2]/div/input[1]')
    except NoSuchElementException:
        pass

    time.sleep(1)

email.send_keys("")
email.submit()

password = None
while not password:
    try:
        password = driver.find_element_by_xpath('//*[@id="password"]')
    except NoSuchElementException:
        pass

password.send_keys("")
password.submit()

driver.get("https://1376307.netacad.com/courses/886366/assignments")
"""

while len(driver.window_handles) <= 1:
    time.sleep(1)

popup = [h for h in driver.window_handles if h != main_window][0]
driver.switch_to.window(popup)

wait = WebDriverWait(driver, 60)
while True:
    try:
        wait.until(presence_of_element_located((By.CLASS_NAME, "questionText")))
        break

    except UnexpectedAlertPresentException:
        pass

while True:
    time.sleep(0.5)
    if not keyboard.is_pressed("p"):
        continue

    try:
        question = driver.find_elements_by_class_name("questionText")[-1]
        print("q ", question.text)
        answers = driver.find_elements_by_class_name("coreContent")[-1].find_elements_by_tag_name("li")
        pot_answers = _search_answers(question.text)

        for _answers in pot_answers:
            for _answer in _answers:
                for answer in answers:
                    is_corred = _answer.strip() == answer.text.strip()
                    try:
                        input = answer.find_element_by_tag_name("input")

                    except NoSuchElementException:
                        continue

                    try:
                        print(_answer, _answer.strip() == answer.text.strip())
                        if is_corred:
                            if not input.is_selected():
                                input.click()

                    except:
                        traceback.print_exc()

        print(pot_answers)

    except (NoSuchElementException, IndexError) as e:
        pass
