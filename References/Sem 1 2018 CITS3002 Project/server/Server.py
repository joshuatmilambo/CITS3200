#!/usr/bin/env python
 
import socket, ssl
import subprocess
import os

def javaMain (txtF, funcName):
    txtF.write("\n \t" + "public static void main(String[] args){" + "\n \t\t" +
                  funcName+ "\n \t}" + "\n}")
    '''create java file and write the context to it'''
def jaFunc(txtF, textarea):
    txtFile = open(txtF,"w")
    txtFile.write("import java.util.*;\n"+
                  "public class secLarge{\n\t")
    txtFile.write("\t"+textarea+"\n")
    javaMain(txtFile, "int [] v = {2,1};\n\t "+
                    "int n  = v.length;\n\t"+
                    "int res = secondLarge(v,n);\n\t"+
                    "System.out.print(res);")
    txtFile.close()
    ''' try compiling the file and run it and get the output'''
    ''' using cmd in windows'''
    path = os.getcwd()
    cmd = 'C:/"Program Files"/Java/jdk1.8.0_161/bin/javac.exe ' + path+"\\secLarge.java"
    print(cmd)
    cmd2 = "cd "+path
    cmd3 = 'C:/"Program Files"/Java/jdk1.8.0_161/bin/java.exe ' + "secLarge"
    ''' execute first cmd'''
    proc = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    ''' execute second cmd2'''
    proc = subprocess.Popen(cmd2, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE) 
    out, err = proc.communicate()
    print(out)
    print(err)
    '''execute third cmd3'''
    proc = subprocess.Popen(cmd3, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE) 
    out, err = proc.communicate()
    print(out)
    print(err)
    return out
def main():
    bank = {" Consider a C99 function of type <b>void</b>.Which of the following statements is true?<p></p>": 
            "<input name=\"vehicle\" value=\"a1\" type=\"radio\">The function must haveprecisely 0 return statements<br>"
                        + "                                <input name=\"vehicle\" value=\"a2\" type=\"radio\">The function must have precisely 1 return statement<br>"
                        + "                                <input name=\"vehicle\" value=\"a3\" type=\"radio\">The function must have at least 1 return statement<br>"
                        + "                                <input name=\"vehicle\" value=\"a4\" type=\"radio\">The function may have any number of return statements<br>"
                        + "                                <input value=\"Submit my answer for marking\" type=\"submit\">",
            " Who is father of <b>C</b> Language?<p></p>":
            "<input name=\"vehicle\" value=\"a1\" type=\"radio\">Dr. E.F. Codd<br>"
                        + "                                <input name=\"vehicle\" value=\"a2\" type=\"radio\">Bjame Stroustrup<br>"
                        + "                                <input name=\"vehicle\" value=\"a3\" type=\"radio\">Dennis Ritchie<br>"
                        + "                                <input name=\"vehicle\" value=\"a4\" type=\"radio\">James A. Gosling<br>"
                        + "                                <input value=\"Submit my answer for marking\" type=\"submit\">",
            " C programs are converted into <b>machine language</b> with the help of?<p></p>":
            "<input name=\"vehicle\" value=\"a1\" type=\"radio\">An Editor<br>"
                        + "                                <input name=\"vehicle\" value=\"a2\" type=\"radio\">A compiler<br>"
                        + "                                <input name=\"vehicle\" value=\"a3\" type=\"radio\">An operating system<br>"
                        + "                                <input name=\"vehicle\" value=\"a4\" type=\"radio\">None of the above<br>"
                        + "                                <input value=\"Submit my answer for marking\" type=\"submit\">",
            " A C <b>variable</b> cannot start with? <p></p>":
            "<input name=\"vehicle\" value=\"a1\" type=\"radio\">An alphabet<br>"
                        + "                                <input name=\"vehicle\" value=\"a2\" type=\"radio\">A number<br>"
                        + "                                <input name=\"vehicle\" value=\"a3\" type=\"radio\">A special symbol<br>"
                        + "                                <input name=\"vehicle\" value=\"a4\" type=\"radio\">both (b) and (c) <br>"
                        + "                                <input value=\"Submit my answer for marking\" type=\"submit\">",
            " Which of the following is <b>allowed</b> in a C Arithmetic instruction? <p></p>":
            "<input name=\"vehicle\" value=\"a1\" type=\"radio\">[]<br>"
                        + "                                <input name=\"vehicle\" value=\"a2\" type=\"radio\">{}<br>"
                        + "                                <input name=\"vehicle\" value=\"a3\" type=\"radio\">()<br>"
                        + "                                <input name=\"vehicle\" value=\"a4\" type=\"radio\">None of the above<br>"
                        + "                                <input value=\"Submit my answer for marking\" type=\"submit\">",
            " Write a Java function which is passed two parameters -a vector of integers,and an integer indicating the number of elements in that vector -and returns the second largest integer in the vector.<br>You may assume that the vector contains at least two different values.<p></p>" :
             "<textarea name =\"vehicle\" rows=\"8\" cols=\"60\">public static int secondLarge(int vectors[], intn){\n\n}</textarea><br>"
             + "<input value=\"Submit my answer for marking\" type=\"submit\">"
            }
    
    answer = {" Consider a C99 function of type <b>void</b>.Which of the following statements is true?<p></p>": 
            "a4",
            " Who is father of <b>C</b> Language?<p></p>":
            "a3",
            " C programs are converted into <b>machine language</b> with the help of?<p></p>":
            "a2",
            " A C <b>variable</b> cannot start with? <p></p>":
            "a4",
            " Which of the following is <b>allowed</b> in a C Arithmetic instruction? <p></p>":
            "a3",
            " Write a C99 function which is passed two parameters -a vector of integers,and an integer indicating the number of elements in that vector -and returns the second largest integer in the vector.<br>":
            "1"
            }

    context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
    context.load_cert_chain("questionserver.crt", "questionserver.key", "password")
    
    soc = socket.socket()
    host = "0.0.0.0"
    port = 2004
    print("Server running at: " + host, port)
    soc.bind((host, port))
    soc.listen(5)
    
    '''
        msg is basically the question header
    '''
    while True:
        newsocket, addr = soc.accept()
        conn = context.wrap_socket(newsocket, server_side=True)
        print("Got connection from",addr)
        length_of_message = int.from_bytes(conn.recv(2), byteorder='big')
        msg = conn.recv(length_of_message).decode("UTF-8")
        # get question header
        print(msg)
        print(length_of_message)
    
        ''' if the question header is in the question bank'''
        ''' q for returning questoin'''
        ''' b for returning question Body'''
        ''' a for checking answer'''
        ''' p for programming questoin'''
        if msg[0] == 'q':
            ''' return the body with > bank[msg]'''
            message_to_send = list(bank.keys())[int(msg[1])].encode("UTF-8")
            conn.send(len(message_to_send).to_bytes(2, byteorder='big'))
            conn.send(message_to_send)
        elif msg[0] == 'b':
            ''' return the body with > bank[msg]'''
            message_to_send = list(bank.values())[int(msg[1])].encode("UTF-8")
            conn.send(len(message_to_send).to_bytes(2, byteorder='big'))
            conn.send(message_to_send)  
        elif msg[0] == 'a':
            ''' check if msg equal to answer in answer bank'''
            if list(answer.values())[int(msg[1])] == msg[2:]:
                message_to_send = "right".encode("UTF-8")
                conn.send(len(message_to_send).to_bytes(2, byteorder='big'))
                conn.send(message_to_send)
            else:
                message_to_send = "wrong".encode("UTF-8")
                conn.send(len(message_to_send).to_bytes(2, byteorder='big'))
                conn.send(message_to_send)
            ''' create a java file containing the answer by user'''
            ''' compile it and run it '''
            ''' see if the output same as expected output in answer bank'''
        elif msg[0] == 'p':
            textarea = msg[2:]
            ans = str(jaFunc("secLarge.java", textarea))
            print(ans[2], list(answer.values())[int(msg[1])])
            if list(answer.values())[int(msg[1])]==ans[2]:
                message_to_send = "right".encode("UTF-8")
                conn.send(len(message_to_send).to_bytes(2, byteorder='big'))
                conn.send(message_to_send)
                if os.path.isfile("secLarge.class"):
                    print ("The dir is: %s" %os.listdir(os.getcwd()))
                    os.remove("secLarge.class")
                    print ("The dir is: %s" %os.listdir(os.getcwd()))
            else:
                message_to_send = "wrong".encode("UTF-8")
                conn.send(len(message_to_send).to_bytes(2, byteorder='big'))
                conn.send(message_to_send)
        else :
            print ("nothing to send")

        conn.shutdown(socket.SHUT_RDWR)
        conn.close()
        print("Connection with ", addr, " closed")
        
if __name__ == '__main__':
    main()
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
