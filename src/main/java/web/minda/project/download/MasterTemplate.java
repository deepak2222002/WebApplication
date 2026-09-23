package web.minda.project.download;

import java.io.IOException;
import java.lang.reflect.Field;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletOutputStream;

import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.DataValidation;
import org.apache.poi.ss.usermodel.DataValidationConstraint;
import org.apache.poi.ss.usermodel.DataValidationHelper;
import org.apache.poi.ss.usermodel.Name;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.util.CellRangeAddressList;
import org.apache.poi.ss.util.CellReference;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class MasterTemplate<T> {
	private XSSFWorkbook workbook;
	private XSSFSheet sheet;
	private ServletOutputStream outputStream;
	private List<String> listData;
	private List<String> dataList;
	private String masterName;
	private String[] headerList;
	private int noOfRows = 1000;
	private int startColumn = 2;
	private int endColumn = 11;

	public MasterTemplate(ServletOutputStream outputStream, String masterName, String[] headerList,
			List<String> dataList) {
		this.outputStream = outputStream;
		this.masterName = masterName;
		this.headerList = headerList;
		this.dataList = dataList;
		workbook = new XSSFWorkbook();
	}

	public MasterTemplate(ServletOutputStream outputStream, String masterName, String[] headerList,
			List<String> dataList, int noOfRows, int startColumn, int endColumn) {
		this.outputStream = outputStream;
		this.masterName = masterName;
		this.headerList = headerList;
		this.dataList = dataList;
		this.noOfRows = noOfRows;
		this.startColumn = startColumn;
		this.endColumn = endColumn;
		workbook = new XSSFWorkbook();
	}

	private void writeHeaderLine() {

		sheet = workbook.createSheet(this.masterName);
		Row row = sheet.createRow(0);

		CellStyle style = workbook.createCellStyle();
		XSSFFont font = workbook.createFont();
		style.setWrapText(false); // Disable text wrapping
		style.setBorderTop(BorderStyle.THIN);
		style.setBorderBottom(BorderStyle.THIN);
		style.setBorderLeft(BorderStyle.THIN);
		style.setBorderRight(BorderStyle.THIN);
		font.setBold(true);
		font.setFontHeight(12);
		style.setFont(font);

		int i = 0;

		for (String string : this.headerList) {
			createCell(row, string, style);
			sheet.autoSizeColumn(i);
			i++;
		}
		i = 0;

		for (int j = 1; j <= 20; j++) {
			Row borderRows = sheet.createRow(j);
			for (String string : this.headerList) {
				createCell(borderRows, "", style);
				sheet.autoSizeColumn(i);
				i++;
			}
		}
		i = 0;

		if (dataList != null && !dataList.isEmpty()) {
			DataValidationHelper validationHelper = sheet.getDataValidationHelper();
			CellRangeAddressList addressList = new CellRangeAddressList(1, noOfRows, startColumn, endColumn);

			Sheet hiddenSheet = workbook.createSheet("Hidden");
			workbook.setSheetHidden(workbook.getSheetIndex("Hidden"), true);

			int chunkSize = 150;
			int rowCount = 0;

			for (int k = 0; k < dataList.size(); k += chunkSize) {
				List<String> chunk = dataList.subList(k, Math.min(k + chunkSize, dataList.size()));
				String rangeName = "ListRange" + (k / chunkSize);

				Row rows = hiddenSheet.createRow(rowCount++);
				for (int j = 0; j < chunk.size(); j++) {
					Cell cell = rows.createCell(j);
					cell.setCellValue(chunk.get(j));
				}

				String rangeFormula = "Hidden!$" + CellReference.convertNumToColString(0) + "$" + rowCount + ":$"
						+ CellReference.convertNumToColString(chunk.size() - 1) + "$" + rowCount;
				Name namedRange = workbook.createName();
				namedRange.setNameName(rangeName);
				namedRange.setRefersToFormula(rangeFormula);

				DataValidationConstraint formulaConstraint = validationHelper.createFormulaListConstraint(rangeName);
				DataValidation validation = validationHelper.createValidation(formulaConstraint, addressList);
				sheet.addValidationData(validation);
			}
		}
	}

	private void createCell(Row row, String fieldName, CellStyle style) {
		sheet.autoSizeColumn(row.getPhysicalNumberOfCells());
		Cell cell = row.createCell(row.getPhysicalNumberOfCells());
		cell.setCellValue(fieldName);
		cell.setCellStyle(style);
	}

	public void export() throws IOException {
		writeHeaderLine();
		// Other code to write data lines

		workbook.write(outputStream);
		workbook.close();

		outputStream.flush();
		outputStream.close();
	}
}
