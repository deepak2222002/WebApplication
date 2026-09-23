package web.minda.project.scheduler;

import java.security.MessageDigest;
import java.time.Instant;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class Scheduler {

	public static String generateOTP() {
		try {
			// Get current time in milliseconds
			long currentTime = Instant.now().toEpochMilli();

			// Convert to bytes and hash for randomness
			MessageDigest md = MessageDigest.getInstance("SHA-256");
			byte[] hash = md.digest(Long.toString(currentTime).getBytes());

			// Convert first few bytes to a numeric string
			StringBuilder otp = new StringBuilder();
			for (int i = 0; i < hash.length && otp.length() < 6; i++) {
				// Convert byte to 2-digit positive number (0-99)
				int num = (hash[i] & 0xFF) % 10;
				otp.append(num);
			}

			return otp.toString();

		} catch (Exception e) {
			e.printStackTrace();
			return "0000000000";
		}
	}

}
