import os
import shutil


sources = ["icon128.png"]
destinations = ["chrome"]

for source in sources:
    for destination in destinations:
        if os.path.isdir(source):
            shutil.copytree(source, destination + "/" + source)

        else:
            shutil.copy(source, destination + "/" + source)
