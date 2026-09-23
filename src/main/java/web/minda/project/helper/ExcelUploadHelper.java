package web.minda.project.helper;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.CellValue;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.FormulaEvaluator;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

//import web.minda.project.entity.AddLocation;
//import web.minda.project.entity.ApplicatorChildPartLifeMaster;
//import web.minda.project.entity.ApplicatorChildPartMappingMaster;
//import web.minda.project.entity.ApplicatorChildPartMaster;
//import web.minda.project.entity.ApplicatorChildPartType;
//import web.minda.project.entity.ApplicatorLocation;
//import web.minda.project.entity.ApplicatorMaster;
//import web.minda.project.entity.ApplicatorTerminalMappingMaster;
//import web.minda.project.entity.BomMaster;
//import web.minda.project.entity.BreakdownMaster;
//import web.minda.project.entity.CKTMaster;
//import web.minda.project.entity.Checkmaster;
//import web.minda.project.entity.ColorMaster;
//import web.minda.project.entity.CrimpingSpecificationMaster;
//import web.minda.project.entity.FinalControlMispMaster;
//import web.minda.project.entity.InstrumentMachineMaster;

//import web.minda.project.entity.LineProductMappingMaster;
//import web.minda.project.entity.LineStationMaster;
//import web.minda.project.entity.LocationMaster;
//import web.minda.project.entity.MachineApplicatorMappingMaster;
//import web.minda.project.entity.MachineChildPart;
//import web.minda.project.entity.MachineChildPartMapping;
//import web.minda.project.entity.MachineMaster;
//import web.minda.project.entity.MachineSealMaster;
//import web.minda.project.entity.ManpowerDailyData;
//import web.minda.project.entity.ManpowerDeploymentMaster;
//import web.minda.project.entity.MaterialGroupMaster;
//import web.minda.project.entity.OperationLoginMappingMaster;
//import web.minda.project.entity.OperationMaster;
import web.minda.project.entity.PlantMaster;
//import web.minda.project.entity.PreventiveMaintenance;
//import web.minda.project.entity.PreventiveMaintenanceMaster;
//import web.minda.project.entity.RoutingMaster;
//import web.minda.project.entity.SealMaster;
//import web.minda.project.entity.SparePartMaster;
//import web.minda.project.entity.SubBreakdownMaster;
//import web.minda.project.entity.TargetMaster;
//import web.minda.project.entity.TerminalMaster;
//import web.minda.project.entity.WireMaster;
//import web.minda.project.entity.WireToleranceMaster;
//import web.minda.project.entity.WireTypeMaster;
//import web.minda.project.repositories.AddLocationRepository;
//import web.minda.project.repositories.ApplicatorChildPartLifeMasterRepository;
//import web.minda.project.repositories.ApplicatorChildPartMappingRepository;
//import web.minda.project.repositories.ApplicatorChildPartMasterRepository;
//import web.minda.project.repositories.ApplicatorChildPartTypeRepository;
//import web.minda.project.repositories.ApplicatorLocationRepository;
//import web.minda.project.repositories.ApplicatorMasterRepository;
//import web.minda.project.repositories.ApplicatorTerminalMappingMasterRepository;
//import web.minda.project.repositories.BomMasterRepository;
//import web.minda.project.repositories.BreakdownMasterRepository;
//import web.minda.project.repositories.CKTMasteRepository;
//import web.minda.project.repositories.CheckMasterRepository;
//import web.minda.project.repositories.ColorMasterRepository;
//import web.minda.project.repositories.CrimpingSpecificationRepository;
//import web.minda.project.repositories.FinalControlMispMasterRepository;
//import web.minda.project.repositories.InstrumentMachineMasterRepository;
//import web.minda.project.repositories.LineProductMappingMasterRepository;
//import web.minda.project.repositories.LineRepository;
//import web.minda.project.repositories.LineStationMasterReporsitory;
//import web.minda.project.repositories.LocationMasterRepository;
//import web.minda.project.repositories.MachineApplicatorMappingMasterRepository;
//import web.minda.project.repositories.MachineChildPartMappingRepository;
//import web.minda.project.repositories.MachineChildPartRepository;
//import web.minda.project.repositories.MachineMasterRepository;
//import web.minda.project.repositories.MachineSealMasterRepository;
//import web.minda.project.repositories.ManpowerDailyDataRepository;
//import web.minda.project.repositories.ManpowerDeploymentMasterRepository;
//import web.minda.project.repositories.MaterialGroupMasterRepository;
import web.minda.project.repositories.PlantMasterRepository;


public class ExcelUploadHelper {

	public static int totalRows = 0;
	public static int currentRow = 0;

	public static String TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
	private static List<String> mispList;

	public static boolean hasExcelFormat(MultipartFile file) {
		return TYPE.equals(file.getContentType());
	}

	public static int getCurrentRow() {
		return currentRow;
	}

	public static int getTotalRows() {
		return totalRows;
	}

	public static String getDateAndTime() {
		DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		LocalDateTime now = LocalDateTime.now();
		return dtf.format(now);
	}


	public static LocalDate getCellDateValueAsLocalDate(Cell cell) {
		if (cell == null || cell.getCellType() != CellType.STRING) {
			return null;
		}
		try {
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
			return LocalDate.parse(cell.getStringCellValue(), formatter);
		} catch (Exception e) {
			return null;
		}
	}

	public static String extractDecimal(String value) {
		Pattern pattern = Pattern.compile("\\d+(\\.\\d{1,2})?");
		Matcher matcher = pattern.matcher(value);
		if (matcher.find()) {
			return matcher.group();
		} else {
			return null;
		}
	}

	public static String getRoundOffValue(String value) {
		return String.valueOf((int) Float.parseFloat(value.trim()));
	}

	public static String getStringCellValue(Cell cell) {
		if (cell == null) {
			return null;
		}
		switch (cell.getCellType()) {
		case BLANK:
			return "";
		case STRING:
			return cell.getStringCellValue().trim();
		case NUMERIC:
			if (DateUtil.isCellDateFormatted(cell)) {
				return cell.getDateCellValue().toString().trim();
			} else {
				double numericValue = cell.getNumericCellValue();
				long longValue = (long) numericValue;

				if (numericValue == longValue) {
					return String.valueOf(longValue).trim();
				} else {
					return String.valueOf(numericValue).trim();
				}
			}
		case BOOLEAN:
			return Boolean.toString(cell.getBooleanCellValue()).trim();
		case FORMULA:
			// Handle formula cells
			FormulaEvaluator formulaEvaluator = cell.getSheet().getWorkbook().getCreationHelper()
					.createFormulaEvaluator();
			CellValue cellValue = formulaEvaluator.evaluate(cell);
			switch (cellValue.getCellType()) {
			case STRING:
				return cellValue.getStringValue().trim();
			case NUMERIC:
				return String.valueOf(cellValue.getNumberValue()).trim();
			case BOOLEAN:
				return Boolean.toString(cellValue.getBooleanValue()).trim();
			default:
				return null;
			}
		default:
			return null;
		}
	}

	public static Long getNumericCellValue(Cell cell) {
		if (cell == null) {
			return null;
		}

		switch (cell.getCellType()) {
		case BLANK:
			return null;
		case STRING:
			try {
				return Long.parseLong(cell.getStringCellValue().trim());
			} catch (NumberFormatException e) {

				return null;
			}
		case NUMERIC:
			return (long) cell.getNumericCellValue();
		case BOOLEAN:
			return cell.getBooleanCellValue() ? 1L : 0L;
		default:
			return null;
		}
	}

}
