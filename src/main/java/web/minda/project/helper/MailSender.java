package web.minda.project.helper;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.SimpleMailMessage;

import java.util.Properties;

public class MailSender {
			// builds and configures the email sender
    public static JavaMailSenderImpl createMailSender(String host, int port, String username, String password) {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        mailSender.setHost(host);
        mailSender.setPort(port);
        mailSender.setUsername(username);
        mailSender.setPassword(password);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "true"); // Optional for logging

        return mailSender;
    }
    	// uses that sender to actually send an email
    public static void sendEmail(JavaMailSender mailSender, String[] to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to); // Accept multiple recipients
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

}
