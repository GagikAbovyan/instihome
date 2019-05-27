from subprocess import check_output
def get_pid(name):
    return check_output(["pidof", "python", "annotate_backend.py"])

print(int(get_pid('a').split(' ')[0]))

