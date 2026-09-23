package web.minda.project.controller;

import java.util.ArrayList;
import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import web.minda.project.dto.ApiResponse;
import web.minda.project.entity.ArticleParameterMaster;
import web.minda.project.entity.BinLocationAndQuantityMaster;
import web.minda.project.entity.ColdMaster;
import web.minda.project.entity.MouldMaster;
import web.minda.project.entity.PackingHistoryMaster;
import web.minda.project.entity.PackingSystemHardwareDetailMaster;
import web.minda.project.repositories.ArticleParameterRepository;
import web.minda.project.repositories.BinLocationAndQuantityRepository;
import web.minda.project.repositories.PackingHistoryRepository;
import web.minda.project.repositories.PackingSystemHardwareDetailRepository;
import web.minda.project.service.DateTimeService;

import java.util.List;

@RestController
@RequestMapping("/Controllers")
public class PackingSystemController {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	ArticleParameterRepository articleParameterRepositoryObject;

	@Autowired
	BinLocationAndQuantityRepository binLocationAndQuantityRepositoryObject;

	@Autowired
	PackingHistoryRepository packingHistoryRepositoryObject;

	@Autowired
	PackingSystemHardwareDetailRepository packingSystemHardwareDetailRepositoryObject;

	@Autowired
	private DateTimeService dateTimeService;

	@GetMapping("/health/database")
	public ResponseEntity<?> databaseHealth() {

		try {

			jdbcTemplate.queryForObject("SELECT 1", Integer.class);

			return ResponseEntity.ok(Map.of("status", true, "message", "Database Connected"));

		} catch (Exception e) {

			return ResponseEntity.ok(Map.of("status", false, "message", e.getMessage()));
		}
	}

	@PostMapping("/getArticleParameterDetails")
	public ResponseEntity<ApiResponse> getArticleParameterDetails(@RequestBody ArticleParameterMaster jsonObject) {

		try {

			Optional<ArticleParameterMaster> optionalObject = articleParameterRepositoryObject
					.findByCustomerNameAndInternalArticleName(jsonObject.getCustomerName(),
							jsonObject.getInternalArticleName());

			if (optionalObject.isPresent()) {

				return ResponseEntity.ok(new ApiResponse(true, "Article Parameter Found", optionalObject.get()));
			}

			return ResponseEntity.ok(new ApiResponse(false, "Article Parameter Not Found", null));

		} catch (Exception e) {
			System.err.println(e);
			return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage(), null));
		}
	}

//	@PostMapping("/getBinAndArticleQuantity")
//	public ResponseEntity<ApiResponse> getBinAndArticleQuantity(@RequestBody ArticleParameterMaster jsonObject) {
//
//		try {
//
//			List<Object[]> results = binLocationAndQuantityRepositoryObject
//					.getBinDetails(jsonObject.getInternalArticleName());
//
//			if (!results.isEmpty()) {
//
//				Object[] result = results.get(0);
//
//				Map<String, Object> response = new HashMap<>();
//
//				response.put("articleName", result[0]);
//				response.put("binNames", result[1]);
//				response.put("totalBinUsed", result[2]);
//				response.put("totalQuantity", result[3]);
//				response.put("totalQuantity", result[4]);
//
//				return ResponseEntity.ok(new ApiResponse(true, "Data Found", response));
//			}
//
//			return ResponseEntity.ok(new ApiResponse(false, "No Bin Found", null));
//
//		} catch (Exception e) {
//
//			e.printStackTrace();
//
//			return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage(), null));
//		}
//	}
//	

	@PostMapping("/getBinAndArticleQuantity")
	public ResponseEntity<ApiResponse> getBinAndArticleQuantity(@RequestBody ArticleParameterMaster jsonObject) {

		try {

			List<Object[]> results = binLocationAndQuantityRepositoryObject
					.getBinDetails(jsonObject.getInternalArticleName());

			if (results.isEmpty()) {
				return ResponseEntity.ok(new ApiResponse(false, "No Bin Found", null));
			}

			Map<String, Object> response = new HashMap<>();

			response.put("articleName", results.get(0)[0]);
			response.put("totalBins", results.size());

			int totalQuantity = 0;

			List<Map<String, Object>> bins = new ArrayList<>();

			for (Object[] row : results) {

				Map<String, Object> bin = new HashMap<>();

				bin.put("binName", row[1]);
				bin.put("connectedPoint", row[2]);
				bin.put("quantity", row[3]);
				bin.put("plcIp", row[4]);

				totalQuantity += Integer.parseInt(row[3].toString());

				bins.add(bin);
			}

			response.put("totalQuantity", totalQuantity);
			response.put("bins", bins);

			return ResponseEntity.ok(new ApiResponse(true, "Data Found", response));

		} catch (Exception e) {

			e.printStackTrace();

			return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage(), null));
		}
	}

	@PostMapping("/insertPackingHistoryData")
	public ResponseEntity<ApiResponse> insertPackingData(@RequestBody PackingHistoryMaster jsonObject) {
		try {
			jsonObject.setLotNumber(String.valueOf(getYearWeekCode()));
			jsonObject.setDateTime(dateTimeService.getCurrentDateAndTime());
			packingHistoryRepositoryObject.save(jsonObject);

			return ResponseEntity.ok(new ApiResponse(true, "Data Added Successfully.", jsonObject));

		} catch (Exception e) {
			e.printStackTrace();

			return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage(), null));
		}
	}

	public int getYearWeekCode() {
		LocalDate today = LocalDate.now();

		int year = today.getYear() % 100; // 2026 -> 26
		int week = today.get(WeekFields.ISO.weekOfWeekBasedYear());

		return year * 100 + week;
	}

	@PostMapping("/updateBinStatusAndQuantity")
	public ResponseEntity<ApiResponse> updateBinStatusAndQuantity(
			@RequestBody BinLocationAndQuantityMaster jsonObject) {
		try {

			int rows = binLocationAndQuantityRepositoryObject.updateBinStatusAndQuantity(jsonObject.getBinName(),
					jsonObject.getBinStatus(), jsonObject.getQuantity());

			System.out.println("Updated rows : " + rows);

			return ResponseEntity.ok(new ApiResponse(true, "Bin data Updated.", null));

		} catch (Exception e) {
			e.printStackTrace();

			return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage(), null));
		}
	}

	@PostMapping("/getSettingData")
	public ResponseEntity<ApiResponse> getSettingData(@RequestBody PackingSystemHardwareDetailMaster jsonObject) {

		try {

			List<PackingSystemHardwareDetailMaster> list = packingSystemHardwareDetailRepositoryObject
					.findAllHardwareDetails();

			return ResponseEntity.ok(new ApiResponse(false, "Data Found SuccessFully.", list));

		} catch (Exception e) {
			System.err.println(e);
			return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage(), null));
		}
	}

	@PostMapping("/getPackingSystemSettingData")
	public ResponseEntity<ApiResponse> getPackingSystemSettingData(
			@RequestBody PackingSystemHardwareDetailMaster jsonObject) {

		try {

			List<PackingSystemHardwareDetailMaster> list = packingSystemHardwareDetailRepositoryObject
					.findAllPackingSystemData(jsonObject.getSystemAddress());

			return ResponseEntity.ok(new ApiResponse(false, "Data Found SuccessFully.", list));

		} catch (Exception e) {
			System.err.println(e);
			return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage(), null));
		}
	}

	@PostMapping("/saveSettingData")
	public ResponseEntity<ApiResponse> saveSettingData(@RequestBody PackingSystemHardwareDetailMaster jsonObject) {

		try {
			boolean isDataExist = packingSystemHardwareDetailRepositoryObject
					.existsByConnectionIpAndHardwareAndLabelType(jsonObject.getConnectionIp(),
							jsonObject.getHardwareName(), jsonObject.getLabelType());
			
			if (!isDataExist) {
				packingSystemHardwareDetailRepositoryObject.save(jsonObject);
				return ResponseEntity.ok(new ApiResponse(true, "Data Saved SuccessFully.", null));
			}else {
				return ResponseEntity.ok(new ApiResponse(false, "Data already exists.", null));
			}

		} catch (Exception e) {
			System.err.println(e);
			return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage(), null));
		}
	}
}