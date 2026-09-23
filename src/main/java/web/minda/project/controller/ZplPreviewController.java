package web.minda.project.controller;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import java.io.*;
import java.nio.file.Files;
import java.util.UUID;

@RestController
@RequestMapping("/api/zpl")
public class ZplPreviewController {

    @Value("${zpl.renderer.path}")
    private String rendererPath;



    @PostMapping(value = "/preview", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> preview(@RequestBody String zpl) {

        try {

            File tempDir = new File(System.getProperty("java.io.tmpdir"));
            File pngFile = new File(tempDir, UUID.randomUUID() + ".png");

            String base64Zpl = Base64.getEncoder()
                    .encodeToString(zpl.getBytes(StandardCharsets.UTF_8));

            ProcessBuilder pb = new ProcessBuilder(
                    rendererPath,
                    base64Zpl,
                    pngFile.getAbsolutePath()
            );

            pb.redirectErrorStream(true);

            Process process = pb.start();

            // Print console output (very useful for debugging)
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))) {

                String line;
                while ((line = reader.readLine()) != null) {
                    System.out.println(line);
                }
            }

            int exitCode = process.waitFor();

            if (exitCode != 0) {
                return ResponseEntity.internalServerError().build();
            }

            byte[] image = Files.readAllBytes(pngFile.toPath());

            pngFile.delete();

            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(image);

        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

}
