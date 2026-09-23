package web.minda.project.download;

//

//import java.io.IOException;
//import java.lang.reflect.Field;
//import java.util.List;
//
//import org.apache.poi.ss.usermodel.Cell;
//import org.apache.poi.ss.usermodel.CellStyle;
//import org.apache.poi.ss.usermodel.Row;
//import org.apache.poi.xssf.usermodel.XSSFFont;
//import org.apache.poi.xssf.usermodel.XSSFSheet;
//import org.apache.poi.xssf.usermodel.XSSFWorkbook;
//
//import javax.servlet.ServletOutputStream;
//
//public class DownLoadExcelData<T> {
//	
//		      private XSSFWorkbook workbook;
//		      private XSSFSheet sheet;
//		      private ServletOutputStream outputStream;
//		      private List<T> listData;
//
//		      public DownLoadExcelData(List<T> listData, ServletOutputStream outputStream) {
//		          this.listData = listData;
//		          this.outputStream = outputStream;
//		          workbook = new XSSFWorkbook();
//		      }
//
//		      private void writeHeaderLine() {
//		          sheet = workbook.createSheet("Users");
//
//		          Row row = sheet.createRow(0);
//
//		          CellStyle style = workbook.createCellStyle();
//		          XSSFFont font = workbook.createFont();
//		          font.setBold(true);
//		          font.setFontHeight(16);
//		          style.setFont(font);
//
//		          T sampleData = listData.isEmpty() ? null : listData.get(0);
//
//		          if (sampleData != null) {
//		              
//		              for (Field field : sampleData.getClass().getDeclaredFields()) {
//		                  field.setAccessible(true);
//		                  createCell(row, field.getName(), style);
//		              }
//		          }
//		      }
//
//		      private void createCell(Row row, String fieldName, CellStyle style) {
//		          sheet.autoSizeColumn(row.getPhysicalNumberOfCells());
//		          Cell cell = row.createCell(row.getPhysicalNumberOfCells());
//		          cell.setCellValue(fieldName);
//		          cell.setCellStyle(style);
//		      }
//
//		      private void writeDataLines() {
//		          int rowCount = 1;
//
//		          CellStyle style = workbook.createCellStyle();
//		          XSSFFont font = workbook.createFont();
//		          font.setFontHeight(14);
//		          style.setFont(font);
//
//		          for (T data : listData) {
//		              Row row = sheet.createRow(rowCount++);
//		              int columnCount = 0;
//
//		              try {
//		                  // Use reflection to get field values
//		                  for (Field field : data.getClass().getDeclaredFields()) {
//		                      field.setAccessible(true);
//		                      createCell(row, field.get(data), style);
//		                  }
//		              } catch (Exception e) {
//		                  e.printStackTrace();
//		              }
//		          }
//		      }
//
//		      private void createCell(Row row, Object value, CellStyle style) {
//		          Cell cell = row.createCell(row.getPhysicalNumberOfCells());
//		          if (value instanceof Integer) {
//		              cell.setCellValue((Integer) value);
//		          } else if (value instanceof Boolean) {
//		              cell.setCellValue((Boolean) value);
//		          } else {
//		              cell.setCellValue(value != null ? value.toString() : "");
//		          }
//		          cell.setCellStyle(style);
//		      }
//
//		      public void export() throws IOException {
//		          writeHeaderLine();
//		          writeDataLines();
//
//		          workbook.write(outputStream);
//		          workbook.close();
//
//		          outputStream.flush();
//		          outputStream.close();
//		      }
//		  }
//
//

import java.io.IOException;
import java.lang.reflect.Field;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Pattern;

import javax.persistence.Column;

import org.apache.commons.compress.harmony.unpack200.bytecode.forms.ThisFieldRefForm;
import org.apache.poi.sl.usermodel.Sheet;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.web.header.writers.frameoptions.StaticAllowFromStrategy;

import javax.servlet.ServletOutputStream;

public class DownloadExcelData {  // used in rqc creation download.
	public static int downloadTotalRow = 0;
	public static int rowInserted = 0;
	private XSSFWorkbook workbook;
	private XSSFSheet sheet;
	private ServletOutputStream outputStream;
	private List<String> listData;
	private String sheetName;
	private String[] headerList;

	public DownloadExcelData(List<String> listData, ServletOutputStream outputStream, String sheetName,
			String[] headerList) {
		this.listData = listData;
		this.outputStream = outputStream;
		this.sheetName = sheetName;
		this.headerList = headerList;
		this.downloadTotalRow = listData.size();
		workbook = new XSSFWorkbook();
	}

	public static boolean isNumeric(String str) {
		return Pattern.matches("-?\\d+(\\.\\d+)?", str);
	}

	private void writeDataLines() throws InterruptedException {
		int rowCount = 1;

		CellStyle style = workbook.createCellStyle();

		XSSFFont font = workbook.createFont();
		style.setWrapText(false);
		style.setBorderTop(BorderStyle.THIN);
		style.setBorderBottom(BorderStyle.THIN);
		style.setBorderLeft(BorderStyle.THIN);
		style.setBorderRight(BorderStyle.THIN);

		font.setFontHeight(12);
		style.setFont(font);

		for (String data : listData) {
			rowInserted = rowInserted + 1;

			Row row = sheet.createRow(rowCount++);

			int columnCount = 0;
			try {
				String[] list = data.split(";");

				for (String string : list) {
					if (isNumeric(string)) {
					}
					createCellAsText(row, string, style);
				}

			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		downloadTotalRow = 0;
		Thread.sleep(1000);
		rowInserted = 0;

	}

	private void createCellAsText(Row row, Object value, CellStyle style) {
		Cell cell = row.createCell(row.getPhysicalNumberOfCells());

		if (value == null) {
			cell.setCellValue(""); // or set a default value
		} else {
			cell.setCellValue(value.toString());
		}

		cell.setCellStyle(style);
	}

	private void writeHeaderLine() {

		sheet = workbook.createSheet(this.sheetName);
		Row row = sheet.createRow(0);

		CellStyle style = workbook.createCellStyle();
		XSSFFont font = workbook.createFont();
		font.setBold(true);
		font.setFontHeight(12);
		style.setFont(font);

		for (String string : this.headerList) {
			createCell(row, string, style);
		}
	}

	private void createCell(Row row, String fieldName, CellStyle style) {
		sheet.autoSizeColumn(row.getPhysicalNumberOfCells());
		Cell cell = row.createCell(row.getPhysicalNumberOfCells());
		cell.setCellValue(fieldName);
		cell.setCellStyle(style);
	}

	public void export() throws IOException, InterruptedException {
		writeHeaderLine();
		writeDataLines();

		workbook.write(outputStream);
		workbook.close();

		outputStream.flush();
		outputStream.close();
	}

	public static int getInsertedRows() {
		return rowInserted;
	}

	public static int getDownloadTotalRows() {
		return downloadTotalRow;
	}

}
