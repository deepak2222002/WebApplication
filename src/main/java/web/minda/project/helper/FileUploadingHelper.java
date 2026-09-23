package web.minda.project.helper;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;

@Component
public class FileUploadingHelper {
	Resource resource = new ClassPathResource("static/uploadImages/");
	Resource trainingResource = new ClassPathResource("static/trainingResouces/");
	String trainingPath = "src/main/resources/static/trainingResouces/";

//	private String trainingPath = trainingResource.getFile().getAbsoluteFile();

	 @PostConstruct
	    public void init() {
	        System.out.println("➡ @PostConstruct executed...");

	        try {
	            trainingPath = trainingResource.getFile().getAbsolutePath();
	            System.out.println("✅ Training Path from classpath: " + trainingPath);
	        } catch (Exception ex) {
	            System.out.println("❌ ClassPathResource not writable, fallback to external folder: " + ex.getMessage());
	            trainingPath = System.getProperty("catalina.base") + "/trainingResouces/";
	            new File(trainingPath).mkdirs();
	            System.out.println("✅ External Folder Path: " + trainingPath);
	        }
	 }

	public boolean uploadPartNumberImageInDirectory(MultipartFile image, String partNumber) {

		boolean imageStatus = false;
		try {
			Files.copy(image.getInputStream(),
					Paths.get(resource.getFile().getAbsolutePath() + "//" + partNumber + ".png"),
					StandardCopyOption.REPLACE_EXISTING);
			imageStatus = true;
		} catch (Exception e) {
			// TODO: handle exception
		}
		return imageStatus;
	}

	public Boolean saveImageInBytes(byte[] imageBytes, String partnumber, String revNumber) throws IOException {
		try {

			Files.write(Paths.get(resource.getFile().getAbsolutePath() + "//" + partnumber + "_" + revNumber + ".png"),
					imageBytes);
			return true;

		} catch (Exception e) {
			return false;
		}
	}

	public Boolean saveTrainingInBytes(byte[] imageBytes, String fileName) throws IOException {
		try {

			Files.write(Paths.get(trainingPath + "//" + fileName + ".png"), imageBytes);
			return true;

		} catch (Exception e) {
			return false;
		}
	}

	public Boolean saveTrainingVideo(MultipartFile video, String fileName) throws IOException {
		try {

			if (!video.isEmpty()) {
				byte[] videoBytes = video.getBytes();
				Files.write(Paths.get(trainingPath + "//" + fileName + ".mp4"), videoBytes);
				return true;

			} else {
				return false;
			}

		} catch (Exception e) {
			return false;
		}
	}

	public Boolean saveTrainingImages(MultipartFile image, String fileName) throws IOException {
		try {

			if (!image.isEmpty()) {
				byte[] imagesBytes = image.getBytes();				
				Files.write(Paths.get(trainingPath + "//" + fileName + ".png"), imagesBytes);
				return true;

			} else {
				return false;
			}

		} catch (Exception e) {
			return false;
		}
	}

	public Boolean saveExcelFile(MultipartFile excelFile, String fileName) throws IOException {
		try {
			if (!excelFile.isEmpty()) {
				byte[] fileBytes = excelFile.getBytes();
				Files.write(Paths.get(trainingPath + "//" + fileName + getFileExtension(excelFile)), fileBytes);
				return true;
			} else {
				return false;
			}
		} catch (Exception e) {
			e.printStackTrace(); // optional: log the error
			return false;
		}
	}
	
	public Boolean savePDFFile(MultipartFile pdfFile, String fileName) throws IOException {
		try {
			if (!pdfFile.isEmpty()) {
				byte[] fileBytes = pdfFile.getBytes();
				Files.write(Paths.get(trainingPath + "//" + fileName + getFileExtension(pdfFile)), fileBytes);
				
				System.out.println(trainingPath);
				return true;
			} else {
				return false;
			}
		} catch (Exception e) {
			e.printStackTrace(); // optional: log the error
			return false;
		}
	}


	private String getFileExtension(MultipartFile file) {
		String originalFilename = file.getOriginalFilename();
		if (originalFilename != null && originalFilename.contains(".")) {
			return originalFilename.substring(originalFilename.lastIndexOf("."));
		}
		return ""; // fallback
	}

	public String getDirectoryPath() throws IOException {
		return resource.getFile().getAbsolutePath() + "//";
	}
}