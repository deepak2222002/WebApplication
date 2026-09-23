package web.minda.project.download;

import java.io.IOException;
import java.lang.reflect.Field;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import javax.servlet.ServletOutputStream;

public class DownloadExcelFormat<T> {

	private XSSFWorkbook workbook;
	private XSSFSheet sheet;
	private ServletOutputStream outputStream;
	private List<T> listData;

	public DownloadExcelFormat(List<T> listData, ServletOutputStream outputStream) {
		this.listData = listData;
		this.outputStream = outputStream;
		workbook = new XSSFWorkbook();
	}

	private List<String> selectedFields;

	public DownloadExcelFormat(List<T> listData, List<String> selectedFields, ServletOutputStream outputStream) {
		this.listData = listData;
		this.selectedFields = selectedFields;
		this.outputStream = outputStream;
		workbook = new XSSFWorkbook();
	}

	private void writeHeaderLine() {
		sheet = workbook.createSheet("Users");

		Row row = sheet.createRow(0);

		CellStyle style = workbook.createCellStyle();
		XSSFFont font = workbook.createFont();
		font.setBold(true);
		font.setFontHeight(16);
		style.setFont(font);

		T sampleData = listData.isEmpty() ? null : listData.get(0);

//		if (sampleData != null) {
//
//			for (String fieldName : selectedFields) {
//				createCell(row, fieldName, style);

		if (sampleData != null) {
			for (Field field : sampleData.getClass().getDeclaredFields()) {
				field.setAccessible(true);
				createCell(row, field.getName(), style);

			}
		}
	}

	private void createCell(Row row, Object value, CellStyle style) {
		Cell cell = row.createCell(row.getPhysicalNumberOfCells());
		if (value instanceof Integer) {
			cell.setCellValue((Integer) value);
		} else if (value instanceof Boolean) {
			cell.setCellValue((Boolean) value);
		} else {
			cell.setCellValue(value != null ? value.toString() : "");
		}
	}

//	private void createCell(Row row, String fieldName, CellStyle style) {
//		sheet.autoSizeColumn(row.getPhysicalNumberOfCells());
//		Cell cell = row.createCell(row.getPhysicalNumberOfCells());
//		cell.setCellValue(fieldName);
//		cell.setCellStyle(style);
//	}

	public void export() throws IOException {
		writeHeaderLine();
//			writeDataLines();

		workbook.write(outputStream);
		workbook.close();

		outputStream.flush();
		outputStream.close();

	}
}
