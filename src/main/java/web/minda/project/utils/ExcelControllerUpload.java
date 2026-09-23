package web.minda.project.utils;

import org.apache.poi.ss.usermodel.*;

import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;
import java.io.*;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.BiFunction;
import java.util.function.Consumer;
import java.util.function.Function;
import org.springframework.http.HttpStatus;

// GenericExcelUploadHelper.java
@Component
public class ExcelControllerUpload { 
	
	// Valid entries are uploaded ,   Duplicates are skipped


	    public <T> ResponseEntity<?> handleUpload(
	            MultipartFile file,
	            String employeeId,
	            String sheetName,
	            String errorFileName,
	            List<T> existingFromDB,
	            Function<MultipartFile, List<T>> parseFunction,
	            Function<T, String> getKey,
	            Consumer<List<T>> saveFunction,
	            BiFunction<List<T>, List<T>, ByteArrayInputStream> createErrorFile) {

	        try {
	            if (!checkExcelFormat(file)) {
	                return ResponseEntity.ok()
	                        .body(Map.of("error", "Invalid file format. Please upload an \"Excel\" file."));
	            }

	            List<T> duplicateList = new ArrayList<>();
	            List<T> parsedData = parseFunction.apply(file);

	            if (parsedData.isEmpty() && duplicateList.isEmpty() && existingFromDB.isEmpty()) {
	                return ResponseEntity.ok().body(Map.of("message",
	                        "Excel Sheet with name '" + sheetName + "' not found in the uploaded file."));
	            }

	            Set<String> keys = new HashSet<>();
	            for (T item : parsedData) {
	                if (!keys.add(getKey.apply(item))) {
	                    duplicateList.add(item);
	                }
	            }


	            // Collect existing matches BEFORE removing
	            List<T> existingConflicts = parsedData.stream()
	                    .filter(item -> existingFromDB.stream()
	                            .map(getKey)
	                            .anyMatch(key -> key.equals(getKey.apply(item))))
	                    .collect(Collectors.toList());
	            
	            // Now remove duplicates and existing
	            parsedData.removeAll(duplicateList);
	            parsedData.removeAll(existingConflicts);
	            
	            // Save valid entries
	            saveFunction.accept(parsedData);


	            // If error file needed
	            if (!duplicateList.isEmpty() || !existingConflicts.isEmpty()) {
	                ByteArrayInputStream errorFile = createErrorFile.apply(duplicateList, existingConflicts);
	                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + errorFileName)
	                        .contentType(MediaType.parseMediaType("application/vnd.ms-excel"))
	                        .body(new InputStreamResource(errorFile));
	            }

	            return ResponseEntity.ok(Map.of("message", "File uploaded and data saved successfully."));

	        } catch (Exception e) {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                    .body(Map.of("error", "Unexpected error: " + e.getMessage()));
	        }
	    }
	    // This checks if the uploaded file is an Excel format
	    public static boolean checkExcelFormat(MultipartFile file) {
	        String contentType = file.getContentType();
	        return contentType != null && (
	                contentType.equals("application/vnd.ms-excel") ||                         // .xls
	                contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") // .xlsx
	        );
	    }

}

