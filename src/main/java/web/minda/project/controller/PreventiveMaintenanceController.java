package web.minda.project.controller;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import web.minda.project.entity.SupplierMaster;
import web.minda.project.dto.PreventiveMaintenanceDTO;
import web.minda.project.entity.LocationMaster;
import web.minda.project.entity.MouldChildPartMaster;
import web.minda.project.entity.MouldMaster;
import web.minda.project.entity.MouldPreventiveMaintenanceMaster;
import web.minda.project.entity.PreventiveMaintenanceHistoryMaster;
import web.minda.project.helper.ExcelUploadHelper;
import web.minda.project.repositories.SupplierMasterRepository;
import web.minda.project.repositories.MouldChildPartMasterRepository;
import web.minda.project.repositories.MouldMasterRepository;
import web.minda.project.repositories.PreventiveMaintenanceHistoryRepository;
import web.minda.project.repositories.PreventiveMaintenanceRepository;
import web.minda.project.service.DateTimeService;
import web.minda.project.service.ZebraUsbPrinterService;

@RestController
@RequestMapping("/Controllers")
public class PreventiveMaintenanceController {

	@Autowired
	PreventiveMaintenanceRepository preventiveMaintenanceRepositoryObject;

	@Autowired
	SupplierMasterRepository supplierMasterRepositoryObject;

	@Autowired
	PreventiveMaintenanceHistoryRepository preventiveMaintenanceHistoryRepositoryObject;

	@Autowired
	MouldChildPartMasterRepository mouldChildPartMasterRepositoryObject;

	@Autowired
	private DateTimeService dateTimeService;

	@Autowired
	private ZebraUsbPrinterService printerService;

	@Value("${qa.upload.path}")
	private String folderPath;

	@Autowired
	private Environment env;

	@PostMapping("/getLikePreventiveMaintenance/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikeMould(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody MouldMaster jsonObject) {

		try {
			Pageable pageable = PageRequest.of(page, pageSize);
			Page<PreventiveMaintenanceDTO> object = this.preventiveMaintenanceRepositoryObject
					.getLikePreventiveMaintenance(jsonObject.getMouldName(), jsonObject.getMouldName(), pageable);
			return new ResponseEntity<Object>(object, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("Internal Server Error.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/insertMouldPreventiveMaintenanceHistory")
	public ResponseEntity<Object> insertMouldPreventiveMaintenanceHistory(
			@RequestBody PreventiveMaintenanceHistoryMaster jsonObject) {

		try {

//			if (!optionObject.isPresent()) {
//				return new ResponseEntity<>("Mould not found.", HttpStatus.NOT_ACCEPTABLE);
//			}
//
//			MouldChildPartMaster mappingObject = optionObject.get();
//			boolean exists = mouldPreventiveMaintenanceMasterRepositoryObject
//					.existsByMouldNameAndChildPartName(jsonObject.getChildPartName(), jsonObject.getChildPartName());
//			if (!exists) {
//
//
//			} else {
//
//				return new ResponseEntity<>("Preventive Maintenance already exist.", HttpStatus.NOT_ACCEPTABLE);
//
//			}
//			
			Optional<MouldPreventiveMaintenanceMaster> optionObject = preventiveMaintenanceRepositoryObject
					.findByMouldNameAndChildPartName(jsonObject.getMouldName(), jsonObject.getChildPartName());

//			Optional<MouldChildPartMaster> optionObject2 = mouldChildPartMasterRepositoryObject
//					.findByMouldNameAndChildPartName(jsonObject.getMouldName(), jsonObject.getChildPartName());

			if (!optionObject.isPresent()) {
				return new ResponseEntity<>("Preventive Maintenance not found.", HttpStatus.NOT_ACCEPTABLE);
			}

//			if (!optionObject2.isPresent()) {
//				return new ResponseEntity<>("Mould Child Part not found.", HttpStatus.NOT_ACCEPTABLE);
//			}

			MouldPreventiveMaintenanceMaster preventiveObject = optionObject.get();
			preventiveObject.setPmDate(jsonObject.getPmDate());
			if (jsonObject.getLifeStatus().equals("YES")) {
				preventiveObject.setCurrentLife("0");
			}
			preventiveObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());
			preventiveMaintenanceRepositoryObject.save(preventiveObject);

//			MouldChildPartMaster mouldChildPartObject = optionObject2.get();
//			mouldChildPartObject.set(jsonObject.getPmDate());
//			mouldChildPartObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());
//			preventiveMaintenanceRepositoryObject.save(preventiveObject);

			jsonObject.setDateTimeCreation(dateTimeService.getCurrentDateAndTime());
			jsonObject.setDateTimeModified(dateTimeService.getCurrentDateAndTime());

			preventiveMaintenanceHistoryRepositoryObject.save(jsonObject);

			return new ResponseEntity<>("Preventive maintenance updated successfully.", HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Object>("Internal Server Error.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/getLikeMouldPreventiveMaintenanceHistory/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikeMouldPreventiveMaintenanceHistory(@PathVariable("pageNum") int page,
			@PathVariable("pageSize") int pageSize, @RequestBody PreventiveMaintenanceHistoryMaster jsonObject) {

		try {
			Pageable pageable = PageRequest.of(page, pageSize);
			Page<PreventiveMaintenanceHistoryMaster> object = this.preventiveMaintenanceHistoryRepositoryObject
					.getLikeMouldPreventiveMaintenanceHistory(jsonObject.getChildPartName(), jsonObject.getMouldName(),
							pageable);
			return new ResponseEntity<Object>(object, HttpStatus.OK);

		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<Object>("Internal Server Error.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/download/data/preventiveMaintenanceHistor")
	public void exportTopreventiveMaintenanceHistorExcel(HttpServletResponse response, @RequestBody PreventiveMaintenanceHistoryMaster jsonObject)
			throws IOException {
		try {
			// Set the content type to Excel file
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

			// Fetch data from the repository as a List<PlantMaster>
			List<PreventiveMaintenanceHistoryMaster> listObject = this.preventiveMaintenanceHistoryRepositoryObject
					.getAllMouldPreventiveMaintenanceHistoryMaster(jsonObject.getChildPartName(),
							jsonObject.getMouldName());

			String[] headerList = new String[] { "Mould Name", "Child Part Name", "Action Taken", "PM Status",
					"Total Life", "Life Reset", "Current Life", "Remark", "Done By", "Date & Time" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256 };

			List<Function<PreventiveMaintenanceHistoryMaster, Object>> getters = Arrays.asList(
					PreventiveMaintenanceHistoryMaster::getMouldName,
					PreventiveMaintenanceHistoryMaster::getChildPartName,
					PreventiveMaintenanceHistoryMaster::getActionTaken, PreventiveMaintenanceHistoryMaster::getPmStatus,
					PreventiveMaintenanceHistoryMaster::getTotalLife, PreventiveMaintenanceHistoryMaster::getLifeStatus,
					PreventiveMaintenanceHistoryMaster::getCurrentLife, PreventiveMaintenanceHistoryMaster::getRemark,
					PreventiveMaintenanceHistoryMaster::getCreatedBy,
					PreventiveMaintenanceHistoryMaster::getDateTimeModified);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(listObject, getters, headerList,
					COLUMN_WIDTHS, "Maintenance History");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();

		}
	}
	
	
	@PostMapping("/download/data/preventiveMaintenance")
	public void exportTopreventiveMaintenanceExcel(HttpServletResponse response, @RequestBody MouldMaster jsonObject)
			throws IOException {
		try {
			// Set the content type to Excel file
			response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

			// Fetch data from the repository as a List<PlantMaster>
			List<PreventiveMaintenanceDTO> listObject = this.preventiveMaintenanceRepositoryObject
					.getAllPreventiveMaintenanceMaster(jsonObject.getMouldName(),
							jsonObject.getMouldName());

			String[] headerList = new String[] { "Mould Name", "Child Part Name", "Description", "Total Life",
					"Alarm Life", "Current Life", "Pm Date", "Alert Days", "Days Remain", "Priority", "Last PM Date Time", "Next PM Date" };
			int[] COLUMN_WIDTHS = { 50 * 256, 25 * 256, 50 * 256, 25 * 256, 30 * 256, 15 * 256, 25 * 256, 20 * 256,
					25 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256, 30 * 256};

			List<Function<PreventiveMaintenanceDTO, Object>> getters = Arrays.asList(
					PreventiveMaintenanceDTO::getMouldName,
					PreventiveMaintenanceDTO::getChildPartName,
					PreventiveMaintenanceDTO::getDescription, PreventiveMaintenanceDTO::getTotalLife,
					PreventiveMaintenanceDTO::getAlarmLife, PreventiveMaintenanceDTO::getCurrentLife,
					PreventiveMaintenanceDTO::getPmDate, PreventiveMaintenanceDTO::getAlertDays,
					PreventiveMaintenanceDTO::getDaysRemaining, PreventiveMaintenanceDTO::getPriority,
					PreventiveMaintenanceDTO::getLast,
					PreventiveMaintenanceDTO::getNext);

			ByteArrayInputStream excelFile = ExcelController.generateExcelData(listObject, getters, headerList,
					COLUMN_WIDTHS, "Maintenance History");
			ServletOutputStream outputStream = response.getOutputStream();
			response.getOutputStream().write(excelFile.readAllBytes());
			outputStream.flush();
		} catch (Exception e) {
			e.printStackTrace();

		}
	}

}
