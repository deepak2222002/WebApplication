package web.minda.project.controller;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

import javax.imageio.ImageIO;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import web.minda.project.helper.FileUploadingHelper;

@RestController
@RequestMapping("/Controllers")
@CrossOrigin(origins = "http://localhost:3000")
public class ImageUploadController {
	
	@Autowired
	private FileUploadingHelper fileUploadingHelperObject;
	

	public String removeSpecialCharacters(String input) {
		if (input == null || input.isEmpty()) {
			return input;
		}
		// Replace all non-alphanumeric characters with an empty string
		return input.replaceAll("[^a-zA-Z0-9]", " ");
	}

	private byte[] extractImageFromPDF(MultipartFile pdfFile) throws IOException {

		try (PDDocument document = PDDocument.load(pdfFile.getInputStream())) {
			PDFRenderer pdfRenderer = new PDFRenderer(document);
			BufferedImage image = pdfRenderer.renderImageWithDPI(0, 300);
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			ImageIO.write(image, "png", baos);
			return baos.toByteArray();
		}
	}
	
	@PostMapping("/uploadImage")
	public ResponseEntity<Object> uploadImage(@RequestParam("image") MultipartFile image) throws IOException {
	    try {
	        // Validate file type (only image types allowed)
	        if (image.isEmpty()) {
	            return new ResponseEntity<>("No file selected.", HttpStatus.BAD_REQUEST);
	        }

	        String contentType = image.getContentType();
	        if (contentType == null || !contentType.startsWith("image/")) {
	            return new ResponseEntity<>("Only image files are allowed.", HttpStatus.UNSUPPORTED_MEDIA_TYPE);
	        }

	        // Sanitize file name
	        String fileNameString = removeSpecialCharacters(image.getOriginalFilename());

	        // Save Image
	        //FileUploadingHelper fileUploadingHelperObject = new FileUploadingHelper();
	        Boolean status = fileUploadingHelperObject.saveTrainingImages(image, fileNameString);

	        if (status) {
	            return new ResponseEntity<>(fileNameString, HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>("Image upload failed.", HttpStatus.NOT_ACCEPTABLE);
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	        System.out.println(e);
	        return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}


}
