import pyperclip
import time
import traceback
import json


questions = json.load(open("questions/" + input("Question file (e.g. '2_1'): ") + ".json"))

while True:
    try:
        question = pyperclip.paste()
        if question and not question.startswith("A: "):
            answers = []
            for q, a in questions:
                if question.strip() in q:
                    answers.append(a)

            pyperclip.copy("A: " + " //// ".join(["; ".join(a) for a in answers]))

    except:
        traceback.print_exc()

    finally:
        time.sleep(0.5)
