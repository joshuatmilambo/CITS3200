package TestServer;

import java.util.Scanner;

public class Main {
	public static int port = 443;
	public static String questionServer;
	public static void main(String[] args) {
		boolean exit = false;
		String input;
		// start http server
		//		SimpleHttpServer httpServer = new SimpleHttpServer();
		//		httpServer.Start(port);

		// get address of question server
		System.out.println("Enter IP address of Question Server or 'localhost' if running on the same machine: ");
		Scanner scan = new Scanner(System.in);
		questionServer = scan.nextLine();
		System.out.println("Question server address: " + questionServer);

		// start https server
		SimpleHttpsServer httpsServer = new SimpleHttpsServer();
		httpsServer.Start(port);

		System.out.println("Type 'STOP' to exit server");
		while(!exit) {
			input = scan.nextLine();
			if(input.equals("STOP")) {
				scan.close();
				SimpleHttpsServer.Stop();
				exit = true;
				System.out.println("Goodbye");
			}

		}

		//		System.out.println(System.getProperty("user.dir"));
		//		System.out.println(Main.class.getClassLoader().getResource("").getPath());

	}
}
