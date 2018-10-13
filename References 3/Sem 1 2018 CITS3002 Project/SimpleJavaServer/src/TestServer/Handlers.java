package TestServer;

import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.file.*;
import java.security.cert.Certificate;
import java.nio.charset.StandardCharsets;
import java.util.*;

import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

public class Handlers {
	// get current Logged in StuID for DB usage
	public static String currentStudent = "";
	public static int questionNum = 0;
	public static String QsNum = "";
	public static ArrayList<String> Qseq;
	public static int attempts = 3;
	public static int marks = 0;
	public static int startPosit, position,endPosit; 

	// writes HTML question to page
	private static void postToPage(String q, String b, HttpExchange he) throws IOException {
		// write html code to the page(Firefox)
		String response;
		if(q == "" || b == "") {
			response = "<html>"
					+ "		<form action = \"/UserAuth\" method = \"post\">"
					+ "			<input type=\"text\" name=\"stuID\" size = \"8\" placeholder=\"Student ID\"><br>"
					+ "			<input type=\"password\" name=\"pass\" size=\"16\" placeholder=\"Password\"><br>"
					+ "			<input value=\"Log In\" type=\"submit\">"
					+ "		</form>"
					+ "</html>";
		} else if(q.equals("done")&&b.equals("done")){
			response = "<p> Student number: "+currentStudent+"</p>"+"</p>"+"<p> Score: "+marks+"/"+Qseq.size()*3+"</p>";
		}else if(q.equals("valid") && b.equals("valid")) {
			response = "<p>Login Successful for " + currentStudent + "</p>"
					 + "<form action=\"/Question\">"
					 + "	<button type=\"submit\">Continue</button>"
					 + "</form>";
		}else if(q.equals("invalid") && b.equals("invalid")) {
			response = "<p>Login Unsuccessful</p>"
					 + "<form action=\"/\">"
					 + "	<button type=\"submit\">Return</button>"
					 + "</form>";
		}else {
			System.out.println(position +" "+ endPosit);
			String nextbutton,backbutton = "";
			if (position == endPosit)nextbutton = "<button type=\"submit\" formaction=\"/Next\" disabled>next</button><br>";
			else nextbutton = "<button type=\"submit\" formaction=\"/Next\">next</button><br>";
			if (position == startPosit)backbutton = "<button type=\"submit\" formaction=\"/Back\" disabled>back</button>";
			else backbutton = "<button type=\"submit\" formaction=\"/Back\">back</button>";
			response = "<table style=\"background-color: #dddddd; width: 50em;\">"
					+ 			"<tbody>"
					+ "				<tr>"
					+ "					<td style=\"background-color: #dddddd; padding: 8px;\">"
					+  						QsNum + q
					+ "							<form action = \"echoPost\" method = \"post\">"
					+ 						b
					+						"<p>attempts: "+Integer.toString(attempts)+"/3</p>"
					+						"<p>score: "+Integer.toString(marks)+"</p>"
					+						backbutton
					+						nextbutton
					+   					"<button type=\"submit\" formaction=\"/\">Logout</button>"
					+ "							</form>"
					+ "						</td>"
					+ "					</tr>"
					+ "				</tbody>"
					+ "			</table>"
					;
		}
		//send the html code to body
		he.sendResponseHeaders(200, response.getBytes().length);
		he.getResponseHeaders().set("Content-Type", "text/html");
		//write code to <body>response</body
		OutputStream os = he.getResponseBody();
		os.write(response.getBytes());
		os.close();
		System.out.println("attr "+he.getAttribute("stuID").toString());
	}

	//this handler will load when it first logged in
	public static class QuestionHandler implements HttpHandler {	
		@Override
		public void handle(HttpExchange he) throws IOException {
			System.out.println("Served by /Question...");
			//get question from txt file with the student number stored in text file
			String question = storeStuIDreturnQuest(he);
			// get body of question from question server (python)
			String body = retrieveQuestionOrBody("b"+Qseq.get(questionNum-1));
			postToPage(question, body, he);

		}

	}
	// log in page
	public static class RootLoginHandler implements HttpHandler{
		@Override
		public void handle(HttpExchange he) throws IOException {
			System.out.println("Served by /RootLogin...");
			postToPage("", "", he);
		}
	}
	// user authentication handler
	public static class UserAuthHandler implements HttpHandler {

		@Override
		public void handle(HttpExchange he) throws IOException {
			System.out.println("Served by /UserAuth");
			boolean valid = false;
			Path user_path = Paths.get("src\\TestServer","users.txt");
			// create a list of string in file
			List<String> fileContent = new ArrayList<>(Files.readAllLines(user_path, StandardCharsets.UTF_8));
			// get logged in data, which is the student ID only
			// maybe using Map here would be overkill
			Map<String, Object> parameters = new HashMap<String, Object>();
			InputStreamReader isr = new InputStreamReader(he.getRequestBody(), "utf-8");
			BufferedReader br = new BufferedReader(isr);
			String query = br.readLine();
			parseQuery(query, parameters);
			// parse the data to stuID
			String stuID = parameters.get("stuID").toString();
			String pass = parameters.get("pass").toString();
			// check if valid student id
			for (int i = 0; i < fileContent.size(); i++) {
				String IDs = fileContent.get(i).substring(0,8);
				if (IDs.equals(stuID)) {
					String line = fileContent.get(i);
					// get password details from the user
					String password = line.split(",")[1];
					if(password.equals(pass)) {
						currentStudent = stuID;
						valid = true;
					}
					break;
				}
			}
			
			// posts html to page
			if (valid) {
				postToPage("valid", "valid", he);
			} else {
				postToPage("invalid", "invalid", he);
			}
		}

	}

	public static class NextHandler implements HttpHandler{
		@Override
		public void handle(HttpExchange he) throws IOException {
			String question,body = "";
			System.out.println("Served by /Next...");
			Path file_path = Paths.get("src\\TestServer","test.txt");
			List<String> fileContent = new ArrayList<>(Files.readAllLines(file_path, StandardCharsets.UTF_8));
			for (int i = 0; i < fileContent.size(); i++) {
				// get IDs
				String IDs = fileContent.get(i).substring(0,8);
				String line = fileContent.get(i);
				if (IDs.equals(currentStudent)) {
					position +=4;
					questionNum = findNextIndex(line);
					QsNum = "Q"+Integer.toString(questionNum)+".";
					attempts = Character.getNumericValue(line.charAt((position+2)));
				}
			}
			question = retrieveQuestionOrBody("q"+Qseq.get(questionNum-1));
			// get question body
			body = retrieveQuestionOrBody("b"+Qseq.get(questionNum-1));
			postToPage(question, body, he);	
		}
	}
	public static class BackHandler implements HttpHandler{
		@Override
		public void handle(HttpExchange he) throws IOException {
			String question,body="";
			System.out.println("Served by /Back...");
			Path file_path = Paths.get("src\\TestServer","test.txt");
			List<String> fileContent = new ArrayList<>(Files.readAllLines(file_path, StandardCharsets.UTF_8));
			for (int i = 0; i < fileContent.size(); i++) {
				// get IDs
				String IDs = fileContent.get(i).substring(0,8);
				String line = fileContent.get(i);
				if (IDs.equals(currentStudent)) {
					position -=4;
					questionNum = findPrevIndex(line);
					QsNum = "Q"+Integer.toString(questionNum)+".";
					attempts = Character.getNumericValue(line.charAt((position+2)));
				}
			}
			question = retrieveQuestionOrBody("q"+Qseq.get(questionNum-1));
			// get question body
			body = retrieveQuestionOrBody("b"+Qseq.get(questionNum-1));
			postToPage(question, body, he);
		}
	}
	//pretty much useless handler, coz form methods are all post, instead of get
	// <form action = "somepage" method = "post"></form>
	public static class EchoGetHandler implements HttpHandler {
		@Override
		public void handle(HttpExchange he) throws IOException {
			// parse request
			Map<String, Object> parameters = new HashMap<String, Object>();
			URI requestedUri = he.getRequestURI();
			String query = requestedUri.getRawQuery();
			parseQuery(query, parameters);
			// send response
			String response = "";
			for (String key : parameters.keySet())
				response += key + " = " + parameters.get(key) + "\n";
			he.sendResponseHeaders(200, response.getBytes().length);
			OutputStream os = he.getResponseBody();
			os.write(response.toString().getBytes());
			os.close();
		}
	}
	// this handler deals with sending/marking answer and then generating new questions
	// First, it creates a list of string, which stores the list of strings in the text file,
	// and loop through the strings, when found matching student number to "currentStudent" 
	// then it overwrites the question to the new random generated question
	// and finally overwrite the whole text file with the modified list of strings
	public static class EchoPostHandler implements HttpHandler {
		String question,body,answer = "";
		Path file_path = Paths.get("src\\TestServer","test.txt");
		Path marks_path = Paths.get("src\\TestServer","marks.txt");
		@Override
		public void handle(HttpExchange he) throws IOException {
			System.out.println("Served by /echoPost handler...");
			// create list of strings, storing content of text file
			List<String> fileContent = new ArrayList<>(Files.readAllLines(file_path, StandardCharsets.UTF_8));
			// for marks.txt
			List<String> MarksContent = new ArrayList<>(Files.readAllLines(marks_path, StandardCharsets.UTF_8));
			// Map is for collecting the user's answer to a question
			Map<String, Object> parameters = new HashMap<String, Object>();
			InputStreamReader isr = new InputStreamReader(he.getRequestBody(), "utf-8");
			BufferedReader br = new BufferedReader(isr);
			// get posted data query
			String query = br.readLine();
			// parse data into a Map
			parseQuery(query, parameters);
			// if the answer is an programming answer, it should be wayyy over length of 4
			if(parameters.get("vehicle").toString().length() > 4 ) {
				// dont know why it has to run twice to get correct answer
				/* wrong at first */answer = retrieveQuestionOrBody("p"+Qseq.get(questionNum-1)+parameters.get("vehicle"));
				/* then correct */answer = retrieveQuestionOrBody("p"+Qseq.get(questionNum-1)+parameters.get("vehicle"));
			}else {
				// if the answer is just multiple choice, it's length should be below 4
				answer = retrieveQuestionOrBody("a"+Qseq.get(questionNum-1)+parameters.get("vehicle"));
			}

			// loop through the list of string, find matching stuID then overwrite to new question
			for (int i = 0; i < fileContent.size(); i++) {
				// get IDs
				String IDs = fileContent.get(i).substring(0,8);
				String line = fileContent.get(i);
				if (IDs.equals(currentStudent)) {
					StringBuilder sb = new StringBuilder(line);
					if(answer.equals("right")) {
						// if user gets it right, update mark to marks.txt
						marks += attempts;
						MarksContent.set(i, currentStudent+","+Integer.toString(marks));
						sb.setCharAt(position, 'D');
						// overwrite to new question
						fileContent.set(i,sb.toString());	
						position +=4;
						System.out.println("sb = " + sb.toString());
						questionNum = findNextIndex(sb.toString());
						QsNum = "Q"+Integer.toString(questionNum)+".";
						System.out.println("questionNum = "+questionNum);
						// reset
						attempts = 3;
					}else if(answer.equals("wrong")&& attempts == 1) {
						sb.setCharAt(position, 'D');
						// overwrite to new question
						fileContent.set(i,sb.toString());	
						position +=4;
						System.out.println("sb = " + sb.toString());
						questionNum = findNextIndex(sb.toString());
						QsNum = "Q"+Integer.toString(questionNum)+".";


						// reset
						attempts = 3;
					}
					else if(answer.equals("wrong")) {
						attempts--;
						sb.setCharAt(position+2, (char)(attempts+'0'));
						// overwrite to new question
						fileContent.set(i,sb.toString());	
					}

					break;
				}
			}
			// write new list to text files
			Files.write(file_path, fileContent, StandardCharsets.UTF_8);
			Files.write(marks_path, MarksContent, StandardCharsets.UTF_8);
			if (questionNum == -1)postToPage("done","done",he);
			// get random question and question body from python server
			question = retrieveQuestionOrBody("q"+Qseq.get(questionNum-1));
			// get question body
			body = retrieveQuestionOrBody("b"+Qseq.get(questionNum-1));
			postToPage(question, body, he);			
		}
		// if questionNum exceed the question size, 6 in this case 
		// then it should show the score page
		public void finish(List<String> fileContent, List<String> MarksContent, HttpExchange he) throws IOException {
			for (int i = 0; i < fileContent.size(); i++) {
				// get IDs
				String IDs = fileContent.get(i).substring(0,8);
				if (IDs.equals(currentStudent)) {
					if(answer.equals("right")) {
						// add the final mark
						marks += attempts; 
						// update mark
						MarksContent.set(i, currentStudent+","+Integer.toString(marks));
					}
					// overwrite to new question
					fileContent.set(i, currentStudent+","+Qseq.toString()+","+Integer.toString(questionNum)
					+","+Integer.toString(attempts));					
					break;
				}
			}
			Files.write(file_path, fileContent, StandardCharsets.UTF_8);
			Files.write(marks_path, MarksContent, StandardCharsets.UTF_8);
			// done meaning finished all questions
			postToPage("done","done",he);
		}

	}

	// parsing data to a map
	// the name attribute as key and data as value
	@SuppressWarnings("unchecked")
	public static void parseQuery(String query, Map<String, Object> parameters) throws UnsupportedEncodingException {
		if (query != null) {
			String pairs[] = query.split("[&]");

			for (String pair : pairs) {
				String param[] = pair.split("[=]");

				String key = null;
				String value = null;
				if (param.length > 0) {
					key = URLDecoder.decode(param[0], System.getProperty("file.encoding"));
				}

				if (param.length > 1) {
					value = URLDecoder.decode(param[1], System.getProperty("file.encoding"));
				}

				if (parameters.containsKey(key)) {
					Object obj = parameters.get(key);
					if (obj instanceof List<?>) {
						List<String> values = (List<String>) obj;
						values.add(value);
					} else if (obj instanceof String) {
						List<String> values = new ArrayList<String>();
						values.add((String) obj);
						values.add(value);
						parameters.put(key, values);
					}
				} else {
					parameters.put(key, value);
				}
			}
		}
	}
	// get question or question body from question server
	public static String retrieveQuestionOrBody(String question){
		String body = "";
		// connect to python server
		try{      
			SSLSocketFactory ssf = SimpleHttpsServer.sslContext.getSocketFactory();  
			SSLSocket socket = (SSLSocket) ssf.createSocket(Main.questionServer, 2004);
			socket.startHandshake();

			SSLSession session = socket.getSession();
			Certificate[] certs = session.getPeerCertificates();
			System.out.println(certs[0]);

			DataOutputStream dout=new DataOutputStream(socket.getOutputStream());  
			DataInputStream din=new DataInputStream(socket.getInputStream());

			System.out.println(question);
			// send the question to QS python
			dout.writeUTF(question);
			dout.flush();
			// get body of question
			body = din.readUTF();//in.readLine();

			System.out.println("Message "+body);


			dout.close();  
			din.close();
			socket.close();
		}

		catch(Exception e){
			e.printStackTrace();
		}
		return body;
	}
	// this handler is only used when user first logged in, 
	// it records their student ID and generate a random question for him
	// and store them into the text file as new line
	public static String storeStuIDreturnQuest(HttpExchange he) throws IOException{
		String question = "";
		Path file_path = Paths.get("src\\TestServer","test.txt");
		Path marks_path = Paths.get("src\\TestServer","marks.txt");
		// create a list of string in file
		List<String> fileContent = new ArrayList<>(Files.readAllLines(file_path, StandardCharsets.UTF_8));
		List<String> MarksContent = new ArrayList<>(Files.readAllLines(marks_path, StandardCharsets.UTF_8));
		// record the currentStudent ID for future uses
		String stuID = currentStudent;

		// go through the list of strings in text file
		// if found a existing user, then resume the question he was doing
		// if not found, then add student number to new line and give him a random question
		for (int i = 0; i < fileContent.size(); i++) {
			String IDs = fileContent.get(i).substring(0,8);
			System.out.println(IDs);
			if (IDs.equals(stuID)) {
				String line = fileContent.get(i);
				// get all details from the user
				int pos = 0;
				for(int j = line.length()-1;j >= 0;j--)if(line.charAt(j)==']') {
					pos= j;
					startPosit = j+2;
				}

				Qseq = new ArrayList<String>(Arrays.asList(line.substring(10, pos).split(", ")));
				System.out.println("pos "+pos+Qseq.toString());
				//questionNum = Character.getNumericValue(line.charAt(line.length()-3));
				boolean foundNotD = false;
				for(int j = startPosit;j<=line.length()-3;j+=4) {
					if(line.charAt(j)!='D') {
						questionNum = Character.getNumericValue(line.charAt(j));
						position = j;
						foundNotD = true;
						break;
					}
				}
				endPosit = line.length()-3;
				marks = Integer.parseInt(MarksContent.get(i).substring(9, MarksContent.get(i).length()));
				if(foundNotD == false)postToPage("done","done",he);
				attempts = Character.getNumericValue(line.charAt((position+2)));
				QsNum = "Q"+Integer.toString(questionNum)+".";
				System.out.println(IDs+ " " + QsNum+ " "+Qseq.toString()+marks);

				//if(questionNum > Qseq.size())postToPage("done","done",he);
				// if existing user found
				question = retrieveQuestionOrBody("q"+Qseq.get(questionNum-1));
				return question;
			}
		}
		// if new user then init all these crap
		questionNum = 1;
		QsNum = "Q1.";
		Qseq = createRandomQuestoinSequence();
		marks = 0;
		// get question from Qseq ( arrayList of random numbers from 0-5 shuffled)
		question = retrieveQuestionOrBody("q"+Qseq.get(questionNum-1));
		String questionsAndAttempts = "";
		for(int i = 1 ; i < Qseq.size();i++)questionsAndAttempts += i+",3,";
		questionsAndAttempts += Integer.toString(Qseq.size()) +",3";
		String line = stuID+","+Qseq.toString()+","+questionsAndAttempts;
		for(int i = 0 ; i <line.length(); i++) {
			if (line.charAt(i)==']') {
				startPosit = i+2;
				position = i+2;
				break;
			}
		}
		endPosit = line.length()-3;
		// append both new stuID and question to List
		fileContent.add(line);
		MarksContent.add(stuID+ ","+marks);

		// and overwrite the text file with new content
		Files.write(file_path, fileContent, StandardCharsets.UTF_8);
		Files.write(marks_path, MarksContent, StandardCharsets.UTF_8);
		return question;
	}
	// shuffle numbers from 0 to 5
	public static ArrayList<String> createRandomQuestoinSequence(){
		ArrayList<String> seq = new ArrayList<String>();
		for(int i = 0 ; i < 6;i++) {
			seq.add(Integer.toString(i));
		}
		Collections.shuffle(seq);
		return seq;
	}
	public static int findNextIndex(String line) {
		for(int i = position; i <= line.length()-3;i+=4) {
			System.out.println("index = " + line.charAt(i));
			if(line.charAt(i)!='D') {
				position = i;
				return Character.getNumericValue(line.charAt(i));
			}
		}
		for(int i = startPosit; i < position;i+=4) {
			System.out.println("index2 = " + line.charAt(i));
			if(line.charAt(i)!='D') {
				position = i;
				return Character.getNumericValue(line.charAt(i));
			}
		}
		return -1;
	}
	public static int findPrevIndex(String line) {
		for(int i = position; i >= startPosit;i-=4) {
			System.out.println("index = " + line.charAt(i));
			if(line.charAt(i)!='D') {
				position = i;
				return Character.getNumericValue(line.charAt(i));
			}
		}
		for(int i = endPosit; i > position;i-=4) {
			System.out.println("index2 = " + line.charAt(i));
			if(line.charAt(i)!='D') {
				position = i;
				return Character.getNumericValue(line.charAt(i));
			}
		}
		return -1;
	}
}
