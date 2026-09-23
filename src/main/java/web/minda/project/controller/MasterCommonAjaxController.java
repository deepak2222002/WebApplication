package web.minda.project.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import web.minda.project.entity.MasterDetails;
import web.minda.project.repositories.LoginMasterRepository;
import web.minda.project.repositories.MasterDetailsRepository;


@RestController
@RequestMapping("/Controllers")
public class MasterCommonAjaxController {
	
	@Autowired
	LoginMasterRepository loginMasterRepositoryObject;
	@Autowired
	MasterDetailsRepository masterDetailsRepositoryObject;
	
	
	@GetMapping("/getMastersDetails/{like}/{employeeId}")
	public ResponseEntity<Object> getMastersDetails(@PathVariable("like") String like,
			@PathVariable("employeeId") String employeeId) {

		String authorizationObject = this.loginMasterRepositoryObject.getMasterAuthorizationByEmployeeId(employeeId);
		List<String> module = this.masterDetailsRepositoryObject.getAllModule();

		List<String> idList = new ArrayList<>();
		String[] list = authorizationObject.split("-");

		for (String string : list) {
			String[] value = string.split(",");
			idList.add(value[0]);
		}

		List<MasterDetails> masterObject = new ArrayList<>();

		if (like.equals("-")) {
			for (String masterId : idList) {
				MasterDetails object = this.masterDetailsRepositoryObject.getDataById(Integer.parseInt(masterId));
				masterObject.add(object);
			}
		} else {
			for (String masterId : idList) {
				MasterDetails object = this.masterDetailsRepositoryObject.getDataById(Integer.parseInt(masterId));
				if (object.getMasterName().toLowerCase().contains(like.toLowerCase())) {
					masterObject.add(object);
				}
			}
		}

		Map<String, Object> responseMap = new HashMap<>();
		responseMap.put("masterId", masterObject);
		responseMap.put("modules", module);

		return new ResponseEntity<Object>(responseMap, HttpStatus.OK);
	}

	@GetMapping("/getIdByMasterName/{masterName}")
	public ResponseEntity<Object> getIdByMasterName(@PathVariable String masterName) {

		String Id = this.masterDetailsRepositoryObject.getIdByMasterName(masterName);

		Map<String, Object> responseMap = new HashMap<>();
		responseMap.put("masterId", Id);

		return new ResponseEntity<>(responseMap, HttpStatus.OK);
	}
	
	@GetMapping("/getMasterAuthorityByUser/{employeeId}")
	public ResponseEntity<Object> getMasterAuthorityByUser(@PathVariable String employeeId) {

		String objectmaster = this.loginMasterRepositoryObject.getMasterAuthorizationByEmployeeId(employeeId);

		Map<String, Object> responseMap = new HashMap<>();
		responseMap.put("masterId", objectmaster);

		return new ResponseEntity<>(responseMap, HttpStatus.OK);
	}
}
