package web.minda.project.controller;

import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import web.minda.project.dto.ArticleMouldRequest;
import web.minda.project.dto.CompoundDTO;
import web.minda.project.entity.BreakdownMaster;
import web.minda.project.entity.DepartmentMaster;
import web.minda.project.entity.LoginMaster;
import web.minda.project.entity.MachineMaster;
import web.minda.project.entity.MouldChildPartMaster;
import web.minda.project.entity.MouldMaster;
import web.minda.project.entity.PlantMaster;
import web.minda.project.entity.ProcessMaster;
import web.minda.project.entity.ProductionArticleBom;
import web.minda.project.entity.ProductionMouldMaster;
import web.minda.project.entity.RoleMaster;
import web.minda.project.entity.StoreMaterial;
import web.minda.project.entity.SubBreakdownMaster;
import web.minda.project.repositories.BreakdownMasterRepository;
import web.minda.project.repositories.ColdMasterRepository;
import web.minda.project.repositories.DepartmentMasterRepository;
import web.minda.project.repositories.LocationMasterRepository;
import web.minda.project.repositories.LoginMasterRepository;
import web.minda.project.repositories.MachineMasterRepository;
import web.minda.project.repositories.MouldChildPartMasterRepository;
import web.minda.project.repositories.MouldMasterRepository;
import web.minda.project.repositories.PackingCustomerDetailsRepository;
import web.minda.project.repositories.PlantMasterRepository;
import web.minda.project.repositories.ProcessMasterRepository;
import web.minda.project.repositories.ProductionArticleBomRepository;
import web.minda.project.repositories.ProductionArticleCategoryRepository;
import web.minda.project.repositories.ProductionArticleMasterRepository;
import web.minda.project.repositories.ProductionArticleMouldRepository;
import web.minda.project.repositories.ProductionMouldRepository;
import web.minda.project.repositories.RackMasterRepository;
import web.minda.project.repositories.RoleMasterRepository;
import web.minda.project.repositories.StoreMaterialCategoryRepository;
import web.minda.project.repositories.StoreMaterialRepository;
import web.minda.project.repositories.SubBreakdownMasterRepository;
import web.minda.project.repositories.SupplierMasterRepository;

@RestController
@RequestMapping("/Controllers")
public class SelectListAjaxController {

	@Autowired
	RoleMasterRepository roleMasterRepositoryObject;
	RoleMaster roleMasterObject = new RoleMaster();

	@Autowired
	DepartmentMasterRepository departmentMasterRepositoryObject;
	DepartmentMaster departmentMasterObject = new DepartmentMaster();

	@Autowired
	LoginMasterRepository loginMasterRepositoryObject;

	@Autowired
	LocationMasterRepository locationMasterRepositoryObject;

	@Autowired
	StoreMaterialCategoryRepository storeMaterialCategoryRepositoryObject;

	@Autowired
	ProductionArticleCategoryRepository productionArticleCategoryRepositoryObject;

	@Autowired
	ProductionArticleMasterRepository productionArticleMasterRepository;

	@Autowired
	ProcessMasterRepository processMasterRepository;

	@Autowired
	PackingCustomerDetailsRepository packingCustomerDetailsRepository;

	@Autowired
	SupplierMasterRepository supplierMasterRepository;

	@Autowired
	StoreMaterialRepository storeMaterialMasterRepository;

	@Autowired
	RackMasterRepository rackMasterRepositoryObject;

	@Autowired
	MouldMasterRepository mouldMasterRepositoryObject;

	@Autowired
	MouldChildPartMasterRepository mouldChildPartMasterRepositoryObject;

	@Autowired
	MachineMasterRepository machineMasterRepositoryObject;

	@Autowired
	BreakdownMasterRepository breakdownMasterRepositoryObject;

	@Autowired
	SubBreakdownMasterRepository subBreakdownMasterRepositoryObject;
	
	@Autowired
	ProductionMouldRepository productionMouldRepository;
	
	@Autowired
	ProductionArticleMouldRepository productionArticleMouldRepository;
	
	@Autowired
	ColdMasterRepository coldMasterRepository;
	
	@Autowired
	ProductionArticleBomRepository productionArticleBomRepository;

	// -------------------Login Master Ajax Controller ---------------------///
	@GetMapping("/getAllRoleInList/{role}")
	public ResponseEntity<Object> getAllRoleInList(@PathVariable("role") String role) {
		try {
			List<String> objectList = this.roleMasterRepositoryObject.getAllRole();
			return new ResponseEntity<>(objectList, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/getAllDepartmentInList/{role}/{employeeId}")
	public ResponseEntity<Object> getAllDepartmentInList(@PathVariable("role") String role,
			@PathVariable("employeeId") String employeeId) {
		try {
			List<String> objectList = this.departmentMasterRepositoryObject.getAllDepartment();
			return new ResponseEntity<>(objectList, HttpStatus.OK);

		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/getAllDepartmentInList")
	public ResponseEntity<Object> getAllDepartmentsInList() {
		try {
			List<String> objectList = this.departmentMasterRepositoryObject.getAllDepartmentName();
			return new ResponseEntity<>(objectList, HttpStatus.OK);

		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

////////////  /getDepartmentsByPlant
	@Autowired
	private LoginMasterRepository loginMasterRepository;

	@GetMapping("/getDepartmentsByPlant/{plantId}")
	public ResponseEntity<List<String>> getDepartmentsByPlant(@PathVariable("plantId") Long plantId) {
		try {
			// Fetch unique departments where plant matches and employee is active
			List<String> deptList = loginMasterRepository.findDistinctDepartmentsByPlantIdAndActive(plantId);
			return new ResponseEntity<>(deptList, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(Collections.emptyList(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Autowired
	PlantMasterRepository plantRepositoryObject;
	PlantMaster plantMasterObject = new PlantMaster();

	@GetMapping("/getAllPlantsInList")
	public List<String> getAllPlantsInList() {

		List<String> objectList = this.plantRepositoryObject.getPlantListString("1");
		// System.out.println(objectList);

		return objectList;
	}

/////////////      /getUsersByPlantAndDepartment
	@GetMapping("/getUsersByPlantAndDepartment/{plantId}/{deptId}")
	public ResponseEntity<List<Map<String, Object>>> getUsersByPlantAndDepartment(@PathVariable Long plantId,
			@PathVariable Long deptId) {

		List<LoginMaster> users = loginMasterRepository.getActiveUsersByPlantAndDepartment(plantId, deptId);

		List<Map<String, Object>> response = users.stream().map(u -> {
			Map<String, Object> map = new HashMap<>();
			map.put("id", u.getLoginId());
			map.put("name", u.getLoginId() + " - " + u.getTitle() + u.getFirstName() + " " + u.getLastName() + " "
					+ u.getRole().getRoleName());
			// map.put("role", u.getRole().getRoleName());
			return map;
		}).toList();

		return ResponseEntity.ok(response);
	}

	@GetMapping("/getAllLocationInList")
	public ResponseEntity<Object> getAllLocationInList() {
		try {
			List<String> objectList = this.locationMasterRepositoryObject.getAllLocationList();
			return new ResponseEntity<>(objectList, HttpStatus.OK);

		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/getAllStoreCategoryInList")
	public ResponseEntity<Object> getAllStoreCategoryInList() {
		try {
			List<String> objectList = this.storeMaterialCategoryRepositoryObject
					.getAllStoreMaterialCategoryMasterList();
			return new ResponseEntity<>(objectList, HttpStatus.OK);

		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/getAllArticelCategoryInList")
	public ResponseEntity<Object> getAllArticelCategoryInList() {
		try {
			List<String> objectList = this.productionArticleCategoryRepositoryObject
					.getAllProductionArticleCategoryMasterList();
			return new ResponseEntity<>(objectList, HttpStatus.OK);

		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/getAllArticelInList")
	public ResponseEntity<Object> getAllArticelInList() {
		try {
			List<String> objectList = this.productionArticleMasterRepository.getAllProductionArticleMasterList();
			return new ResponseEntity<>(objectList, HttpStatus.OK);

		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	
	@GetMapping("/getMouldsByArticle/{article}")
	public ResponseEntity<Object> getMouldsByArticle(@PathVariable String article) {
	    try {
	        List<String> mouldList = productionArticleMouldRepository
	                                  .getMouldsByArticle(article);

	        return new ResponseEntity<>(mouldList, HttpStatus.OK);
	    } catch (Exception e) {
	        return new ResponseEntity<>("Error", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	
	@GetMapping("/getColdRunnerByMould")
	public ResponseEntity<Object> getColdRunnerByMould(
	        @RequestParam String mould) {

	    try {

	        List<String> mouldList =
	                coldMasterRepository
	                .getColdRunnerByMould(mould);

	        return new ResponseEntity<>(
	                mouldList,
	                HttpStatus.OK
	        );

	    } catch (Exception e) {

	        e.printStackTrace();

	        return new ResponseEntity<>(
	                "Error",
	                HttpStatus.INTERNAL_SERVER_ERROR
	        );
	    }
	}

	@GetMapping("/getAllProcessInList")
	public ResponseEntity<Object> getAllProcessInList() {
		try {
			List<String> objectList = this.processMasterRepository.getAllProcessNameMasterList();
			return new ResponseEntity<>(objectList, HttpStatus.OK);

		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/getAllCustomerNamesInList")
	public ResponseEntity<Object> getAllCustomerNamesInList() {
		try {
			List<String> objectList = this.packingCustomerDetailsRepository.getAllCustomerNameInList();
			return new ResponseEntity<>(objectList, HttpStatus.OK);

		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/getAllSupplierInList")
	public ResponseEntity<Object> getAllSupplierInList() {
		try {
			List<String> objectList = this.supplierMasterRepository.getAllSupplierNameInList();
			return new ResponseEntity<>(objectList, HttpStatus.OK);

		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/getAllMaterialInList")
	public ResponseEntity<Object> getAllMaterialInList() {
		try {
			List<String> objectList = this.storeMaterialMasterRepository.getAllStoreMaterialInList();
			return new ResponseEntity<>(objectList, HttpStatus.OK);

		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/getAllRoleInList")
	public ResponseEntity<Object> getAllRoleInList() {
		try {
			List<String> objectList = this.roleMasterRepositoryObject.getAllRoleInList();
			return new ResponseEntity<>(objectList, HttpStatus.OK);

		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/getAllRackInList")
	public ResponseEntity<Object> getAllRackInList() {
		try {
			List<String> objectList = this.rackMasterRepositoryObject.getAllRackCodeInList();
			return new ResponseEntity<>(objectList, HttpStatus.OK);

		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/getAllMouldInList")
	public ResponseEntity<Object> getAllMouldInList() {
		try {
			List<String> objectList = this.mouldMasterRepositoryObject.getAllMouldNameInList();
			return new ResponseEntity<>(objectList, HttpStatus.OK);

		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/getAllMouldChildPartInList")
	public ResponseEntity<Object> getAllMouldChildPartInList(@RequestBody MouldChildPartMaster jsonObject) {
		try {
//			System.out.println(jsonObject.getMouldName() + "printing");

			List<String> objectList = this.mouldChildPartMasterRepositoryObject
					.getAllMouldChildPartInList(jsonObject.getMouldName());
			return new ResponseEntity<>(objectList, HttpStatus.OK);

		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/getAllMachineInList")
	public ResponseEntity<Object> getAllMachineInList() {
		try {
			List<String> objectList = this.machineMasterRepositoryObject.getAllMachineList();
			return new ResponseEntity<>(objectList, HttpStatus.OK);

		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/getAllBreakdownInList")
	public ResponseEntity<Object> getAllBreakdownCategoryInList() {

		try {
			List<String> objectList = this.breakdownMasterRepositoryObject.getAllBreakdownInList();
			return new ResponseEntity<>(objectList, HttpStatus.OK);

		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/getAllSubBreakdownInListByBreakdown")
	public ResponseEntity<Object> getAllBreakdownInListByBreakdown(@RequestBody BreakdownMaster jsonObject) {

		try {

			Optional<BreakdownMaster> breakdown = breakdownMasterRepositoryObject
					.findByBreakdownCategory(jsonObject.getBreakdownCategory());

			if (!breakdown.isPresent()) {
				return new ResponseEntity<>("NOT FOUND", HttpStatus.NOT_FOUND);
			}

			List<String> objectList = this.subBreakdownMasterRepositoryObject.findByBreakdowns(breakdown.get());
			return new ResponseEntity<>(objectList, HttpStatus.OK);

		} catch (Exception e) {
			return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
	
	@PostMapping("/getShotsByArticleMouldList")
	public ResponseEntity<?> getShotsByArticleMouldList(@RequestBody List<ArticleMouldRequest> reqList) {

	    List<String> articleList = reqList.stream()
	            .map(ArticleMouldRequest::getArticle)
	            .distinct()
	            .toList();

	    List<String> mouldList = reqList.stream()
	            .map(ArticleMouldRequest::getMouldName)
	            .distinct()
	            .toList();

	    List<Object[]> data = productionArticleMouldRepository.getShotsByArticleAndMould(articleList, mouldList);

	    return ResponseEntity.ok(data);
	}
	
//	@PostMapping("/getCompoundByArticleList")
//	public ResponseEntity<?> getCompoundByArticleList(@RequestBody List<String> articleList) {
//
//	    List<ProductionArticleBom> data =
//	    		productionArticleBomRepository.findCompoundByArticleList(articleList);
//
//	    return ResponseEntity.ok(data);
//	}
	
	@PostMapping("/getCompoundByArticleList")
	public ResponseEntity<?> getCompoundByArticleList(@RequestBody List<String> articleList) {

	    List<CompoundDTO> data =
	            productionArticleBomRepository.findCompoundByArticleList(articleList);
	    
	    System.out.println("data: "+data);

	    return ResponseEntity.ok(data);
	}
	
	

    @GetMapping("/getAllStoreMaterial")
    public ResponseEntity<?> getAllStoreMaterial() {

        List<StoreMaterial> data = storeMaterialMasterRepository.getAllActiveStoreMaterial();

        return ResponseEntity.ok(data);
    }
    
    
    @GetMapping("/getAllProcessMaster")
    public ResponseEntity<?> getAllProcessMaster() {

        List<ProcessMaster> data = processMasterRepository.getAllActiveProcess();

        return ResponseEntity.ok(data);
    }

}
