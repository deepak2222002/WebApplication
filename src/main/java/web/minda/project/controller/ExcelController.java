package web.minda.project.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddressList;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.function.Function;

@RestController
@RequestMapping("/Controllers")
public class ExcelController {

	// Create headers for the Excel sheet
	public static void createHeaders(Sheet sheet, String[] headers, int[] columnWidths, Workbook workbook) {
		Row row = sheet.createRow(0);
		// Create a font and set it to bold with a specific size
		Font headerFont = workbook.createFont();
		headerFont.setBold(true);
		headerFont.setFontHeightInPoints((short) 12);
		headerFont.setColor(IndexedColors.WHITE.getIndex());

		// Create a CellStyle with the bold font and background color
		CellStyle headerStyle = workbook.createCellStyle();
		headerStyle.setFont(headerFont);
		headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
		headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		headerStyle.setAlignment(HorizontalAlignment.CENTER);
		headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);

		for (int i = 0; i < headers.length; i++) {
			Cell cell = row.createCell(i);
			cell.setCellValue(headers[i]);
			cell.setCellStyle(headerStyle);
			sheet.setColumnWidth(i, columnWidths[i]);
		}
	}
	
	// Generic method to Write data rows to the Excel sheet dynamically
	public static <T> void writeDataRows(
	        Sheet sheet, 
	        List<T> dataList, 
	        List<Function<T, Object>> getters, 
	        String[] entityName, 
	        int rowIndex, 
	        Workbook workbook) {
	    
	    // Create and configure the data style
	    CellStyle dataStyle = workbook.createCellStyle();
	    dataStyle.setAlignment(HorizontalAlignment.CENTER);
	    dataStyle.setVerticalAlignment(VerticalAlignment.CENTER);

	    // Iterate over the data list
	    for (T data : dataList) {
	        Row dataRow = sheet.createRow(rowIndex++);
	        
	        // Populate the row using getter functions
	        for (int i = 0; i < getters.size(); i++) {
	            try {
	                Object value = getters.get(i).apply(data); // Get value using the getter
	                if (value != null) {
	                    Cell cell = dataRow.createCell(i);
	                    cell.setCellValue(value.toString());
	                    cell.setCellStyle(dataStyle);
	                }
	            } catch (Exception e) {
	                e.printStackTrace();
	            }
	        }
	    }
	}


	// Generate Excel file from data list
	public static <T> ByteArrayInputStream generateExcelData(List<T> dataList, List<Function<T, Object>> getters, String[] headers, int[] columnWidths,
			String sheetName) throws IOException {
		Workbook workbook = new XSSFWorkbook();
		ByteArrayOutputStream baoutobject = new ByteArrayOutputStream();

		try {
			Sheet sheet = workbook.createSheet(sheetName);

			// Create headers
			createHeaders(sheet, headers, columnWidths, workbook);

			// Write data rows
			writeDataRows(sheet, dataList, getters, headers, 1, workbook);

			// Write the output to the ByteArrayOutputStream
			workbook.write(baoutobject);
			return new ByteArrayInputStream(baoutobject.toByteArray());
		} catch (IOException e) {
			e.printStackTrace();
			System.out.println("Failed to create Excel file!");
		} finally {
			workbook.close();
			baoutobject.close();
		}
		return null;
	}

	// Generate Excel file from template list
	public static <T> ByteArrayInputStream generateExcelTemplate(String[] headers, int[] columnWidths,
			String sheetName) throws IOException {
		Workbook workbook = new XSSFWorkbook();
		ByteArrayOutputStream baoutobject = new ByteArrayOutputStream();

		try {
			Sheet sheet = workbook.createSheet(sheetName);

			// Create headers
			createHeaders(sheet, headers, columnWidths, workbook);

			// Write data rows
			// writeDataRows(sheet, dataList, headers, 1, workbook);

			// Write the output to the ByteArrayOutputStream
			workbook.write(baoutobject);
			return new ByteArrayInputStream(baoutobject.toByteArray());
		} catch (IOException e) {
			e.printStackTrace();
			System.out.println("Failed to create Excel file!");
		} finally {
			workbook.close();
			baoutobject.close();
		}
		return null;
	}
	
//	//  (With Dropdown Support)
//	public static ByteArrayInputStream generateExcelTemplate(
//	        String[] headers,
//	        int[] columnWidths,
//	        String sheetName,
//	        List<String> dataList,  // dropdown values
//	        int noOfRows,
//	        int startColumn,
//	        int endColumn
//	) throws IOException {
//	    Workbook workbook = new XSSFWorkbook();
//	    ByteArrayOutputStream baoutobject = new ByteArrayOutputStream();
//
//	    try {
//	        Sheet sheet = workbook.createSheet(sheetName);
//
//	        // Create headers
//	        createHeaders(sheet, headers, columnWidths, workbook);
//
//	        // Add dropdowns if dataList is provided
//	        if (dataList != null && !dataList.isEmpty()) {
//	            DataValidationHelper validationHelper = sheet.getDataValidationHelper();
//	            String[] dropdownArray = dataList.toArray(new String[0]);
//	            DataValidationConstraint constraint = validationHelper.createExplicitListConstraint(dropdownArray);
//
//	            for (int col = startColumn; col <= endColumn; col++) {
//	                CellRangeAddressList addressList = new CellRangeAddressList(1, noOfRows, col, col);
//	                DataValidation validation = validationHelper.createValidation(constraint, addressList);
//	                validation.setSuppressDropDownArrow(true);
//	                validation.setShowErrorBox(true);
//	                sheet.addValidationData(validation);
//	            }
//	        }
//
//	        workbook.write(baoutobject);
//	        return new ByteArrayInputStream(baoutobject.toByteArray());
//
//	    } catch (IOException e) {
//	        e.printStackTrace();
//	        System.out.println("Failed to create Excel file!");
//	    } finally {
//	        workbook.close();
//	        baoutobject.close();
//	    }
//
//	    return null;
//	}
	public static ByteArrayInputStream generateExcelTemplate(
	        String[] headers,
	        int[] columnWidths,
	        String sheetName,
	        List<String> dataList,
	        int noOfRows,
	        int startColumn,
	        int endColumn
	) throws IOException {

	    Workbook workbook = new XSSFWorkbook();
	    ByteArrayOutputStream baoutobject = new ByteArrayOutputStream();

	    try {
	        Sheet sheet = workbook.createSheet(sheetName);
	        createHeaders(sheet, headers, columnWidths, workbook);

	        if (dataList != null && !dataList.isEmpty()) {
	            // Create hidden sheet for dropdown values
	            String hiddenSheetName = "hidden_dropdown";
	            Sheet hidden = workbook.createSheet(hiddenSheetName);

	            for (int i = 0; i < dataList.size(); i++) {
	                hidden.createRow(i).createCell(0).setCellValue(dataList.get(i));
	            }

	            // Create a named range for the dropdown list
	            Name namedRange = workbook.createName();
	            namedRange.setNameName("instrumentList");
	            namedRange.setRefersToFormula(hiddenSheetName + "!$A$1:$A$" + dataList.size());

	            // Create data validation using the named range
	            DataValidationHelper validationHelper = sheet.getDataValidationHelper();
	            DataValidationConstraint constraint = validationHelper.createFormulaListConstraint("instrumentList");

	            for (int col = startColumn; col <= endColumn; col++) {
	                CellRangeAddressList addressList = new CellRangeAddressList(1, noOfRows, col, col);
	                DataValidation validation = validationHelper.createValidation(constraint, addressList);
	                validation.setSuppressDropDownArrow(true);
	                validation.setShowErrorBox(true);
	                sheet.addValidationData(validation);
	            }

	            // Hide the sheet with dropdown values
	            workbook.setSheetHidden(workbook.getSheetIndex(hidden), true);
	        }

	        workbook.write(baoutobject);
	        return new ByteArrayInputStream(baoutobject.toByteArray());
	    } finally {
	        workbook.close();
	        baoutobject.close();
	    }
	}

}
