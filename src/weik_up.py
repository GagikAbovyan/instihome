import os
from subprocess import check_output

def get_pid(name):
    return check_output(["pidof",name])

def is_process_running(process_id):
    try:
   	os.kill(process_id, 0)
        return True
    except OSError:
        return False

PID = 3634

def main():
    global PID
    while True:
        if is_process_running(PID):
            s = 4
        else:
            sudoPassword = 'Gagik_20'
            command = 'sudo python annotate_backend.py'
	    ip = os.system('echo %s|sudo -S %s' % (sudoPassword, command))
            print(os.getpid())
	    print(get_pid('python annotate_backend.py')
            #PID = get_pid('172.20.11.65:https (LISTEN)')
	

if __name__ == '__main__':
	main()
