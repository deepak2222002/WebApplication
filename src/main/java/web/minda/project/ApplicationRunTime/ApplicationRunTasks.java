package web.minda.project.ApplicationRunTime;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import web.minda.project.entity.DepartmentMaster;
import web.minda.project.entity.LoginMaster;
import web.minda.project.entity.MasterDetails;
import web.minda.project.entity.RoleAuthorityMaster;
import web.minda.project.entity.RoleMaster;
import web.minda.project.entity.DepartmentMaster;
import web.minda.project.repositories.DepartmentMasterRepository;
import web.minda.project.repositories.LoginMasterRepository;
import web.minda.project.repositories.MasterDetailsRepository;
import web.minda.project.repositories.RoleAuthorityMasterRepository;
import web.minda.project.repositories.RoleMasterRepository;

@Component
public class ApplicationRunTasks implements ApplicationListener<ApplicationReadyEvent> {

	@Autowired
	RoleMasterRepository roleMasterRepositoryObject;

	@Autowired
	DepartmentMasterRepository departmentMasterRepositoryObject;

	@Autowired
	LoginMasterRepository loginMasterRepositoryObject;

	@Autowired
	MasterDetailsRepository masterDetailsRepositoryObject;

	@Autowired
	RoleAuthorityMasterRepository roleAuthorityMasterRepositoryObject;

	@Override
	public void onApplicationEvent(ApplicationReadyEvent event) {
		// TODO Auto-generated method stub
		List<RoleMaster> roleMaster = new ArrayList<>();
		List<DepartmentMaster> departmentMasters = new ArrayList<>();
		List<LoginMaster> loginMasters = new ArrayList<>();
		List<MasterDetails> masterDetailObject2 = new ArrayList<>();
		List<RoleAuthorityMaster> roleAuthorityDetails = new ArrayList<>();

		RoleMaster roleObject = new RoleMaster();
		DepartmentMaster departmentObject = new DepartmentMaster();

		masterDetailObject2
				.add(new MasterDetails(1, "plantMaster", "Plant Master", "9", "2024-01-24 13:58:50", "Others"));
		masterDetailObject2.add(new MasterDetails(2, "lineMaster", "Line Master", "9", "2024-01-24 13:58:50", "ME"));
		masterDetailObject2
				.add(new MasterDetails(3, "productMaster", "Product Master", "9", "2024-01-24 13:58:50", "Material"));
		masterDetailObject2.add(new MasterDetails(4, "lineProductMappingMaster", "Line Product Mapping Master", "9",
				"2024-01-24 13:58:50", "PE"));
		masterDetailObject2.add(new MasterDetails(5, "roleMaster", "Role Master", "9", "2024-01-24 13:58:50", "User"));
		masterDetailObject2
				.add(new MasterDetails(6, "departmentMaster", "Department Master", "9", "2024-01-24 13:58:50", "User"));
		masterDetailObject2
				.add(new MasterDetails(7, "operationMaster", "Operation Master", "9", "2024-01-24 13:58:50", "User"));
		masterDetailObject2.add(new MasterDetails(8, "operationLoginMappingMaster", "Operation Login Mapping Master",
				"9", "2024-01-24 13:58:50", "PE"));
		masterDetailObject2
				.add(new MasterDetails(9, "breakdownMaster", "Breakdown Master", "9", "2024-01-24 13:58:50", "ME"));
		masterDetailObject2.add(
				new MasterDetails(10, "subBreakdownMaster", "Sub Breakdown Master", "9", "2024-01-24 13:58:50", "ME"));
		masterDetailObject2.add(new MasterDetails(11, "colorMaster", "Color Master", "9", "2024-01-24 13:58:50", "ME"));
		masterDetailObject2.add(new MasterDetails(12, "materialGroupMaster", "Material Group Master", "9",
				"2024-01-24 13:58:50", "Material"));
		masterDetailObject2.add(
				new MasterDetails(13, "instrumentMaster", "Instrument Master", "9", "2024-01-24 13:58:50", "Material"));

		masterDetailObject2
				.add(new MasterDetails(14, "wireMaster", "Wire Master", "9", "2024-01-24 13:58:50", "Material"));
		masterDetailObject2.add(
				new MasterDetails(15, "terminalMaster", "Terminal Master", "9", "2024-01-24 13:58:50", "Material"));
		masterDetailObject2
				.add(new MasterDetails(16, "sealMaster", "Seal Master", "9", "2024-01-24 13:58:50", "Material"));
		masterDetailObject2
				.add(new MasterDetails(17, "machineMaster", "Machine Master", "9", "2024-01-24 13:58:50", "ME"));

		masterDetailObject2.add(new MasterDetails(18, "customerModelMappingMaster", "Customer Model Mapping Master",
				"9", "2024-01-24 13:58:50", "Material"));

		masterDetailObject2.add(new MasterDetails(19, "instrumentMachineMaster", "Instrument Machine Mapping Master",
				"9", "2024-01-24 13:58:50", "PE"));
		masterDetailObject2.add(new MasterDetails(20, "machineSealMaster", "Machine Seal Mapping Master", "9",
				"2024-01-24 13:58:50", "PE"));
		masterDetailObject2.add(new MasterDetails(21, "wireSizeToleranceMaster", "Wire Size Tol Master", "9",
				"2024-01-24 13:58:50", "Material"));
		masterDetailObject2.add(
				new MasterDetails(22, "applicatorMaster", "Applicator Master", "9", "2024-01-24 13:58:50", "Material"));
		masterDetailObject2.add(new MasterDetails(23, "applicatorChildPartMaster", "App. Child Part Master", "9",
				"2024-01-24 13:58:50", "ME"));
		masterDetailObject2.add(new MasterDetails(24, "applicatorChildPartLifeMaster", "App. Child Part Life Master",
				"9", "2024-01-24 13:58:50", "ME"));
		masterDetailObject2.add(new MasterDetails(25, "applicatorChildPartMappingMaster",
				"App. Child Part Mapping Master", "9", "2024-01-24 13:58:50", "PE"));
		masterDetailObject2.add(new MasterDetails(26, "machineApplicatorMappingMaster",
				"M/C. Applicator Mapping Master", "9", "2024-01-24 13:58:50", "PE"));
		masterDetailObject2.add(new MasterDetails(27, "applicatorTerminalMappingMaster", "App. Ter. Mapping Master",
				"9", "2024-01-24 13:58:50", "PE"));
		masterDetailObject2.add(new MasterDetails(28, "mpcrCktLocationMaster", "MPCR CKT Loc. Master", "9",
				"2024-01-24 13:58:50", "ME"));
		masterDetailObject2
				.add(new MasterDetails(29, "bomMaster", "BOM Master", "9", "2024-01-24 13:58:50", "Engineering"));
		masterDetailObject2.add(new MasterDetails(30, "createUser", "Create User", "9", "2024-01-24 13:58:50", "User"));
		masterDetailObject2
				.add(new MasterDetails(31, "oidsMaster", "OIDS Master", "9", "2024-01-24 13:58:50", "Engineering"));
		masterDetailObject2
				.add(new MasterDetails(32, "rqcMaster", "RQC-P Creation", "9", "2024-01-24 13:58:50", "RQC"));
		masterDetailObject2
				.add(new MasterDetails(33, "rqcApproval", "RQC-P Approval", "9", "2024-01-24 13:58:50", "RQC"));
		masterDetailObject2.add(new MasterDetails(34, "mispAndPartNoMapping", "MIS-P And Part Mapping", "9",
				"2024-01-24 13:58:50", "RQC"));
		masterDetailObject2.add(
				new MasterDetails(35, "wireTypeMaster", "Wire Type Master", "9", "2024-01-24 13:58:50", "Material"));
		masterDetailObject2
				.add(new MasterDetails(36, "cktMaster", "CKT Master", "9", "2024-01-24 13:58:50", "Material"));
		masterDetailObject2.add(new MasterDetails(37, "preventiveMaintenanceMaster", "Preventive Maintenance Master",
				"9", "2024-01-24 13:58:50", "ME"));
		masterDetailObject2.add(new MasterDetails(38, "applicatorChildPartTypeMaster", "App. Chid Part Type", "9",
				"2024-01-24 13:58:50", "ME"));
		masterDetailObject2
				.add(new MasterDetails(39, "sparePartMaster", "Spare Part Master", "9", "2024-01-24 13:58:50", "ME"));
		masterDetailObject2
				.add(new MasterDetails(40, "routingMaster", "Routing Master", "9", "2024-01-24 13:58:50", "ME"));
		masterDetailObject2
				.add(new MasterDetails(41, "checkMaster", "Harness Process Master", "9", "2024-01-24 13:58:50", "PE"));
		masterDetailObject2.add(new MasterDetails(42, "finalInspectionMispMaster", "Final Inspection MIS-P Creation",
				"9", "2024-01-24 13:58:50", "Inspection"));
		masterDetailObject2.add(new MasterDetails(43, "finalInspectionlMispApproval", "Final Inspection MIS-P Approval",
				"9", "2024-01-24 13:58:50", "Inspection"));
		masterDetailObject2.add(new MasterDetails(44, "finalInspectionMispAndProductMapping",
				"Final Inspection MIS-P And Product Mapping", "9", "2024-01-24 13:58:50", "Inspection"));
		masterDetailObject2
				.add(new MasterDetails(45, "shiftMaster", "Shift Master", "9", "2024-01-24 13:58:50", "Others"));
		masterDetailObject2.add(new MasterDetails(46, "machineChildPartMaster", "Machine Child Part Master", "9",
				"2024-01-24 13:58:50", "ME"));
		masterDetailObject2.add(new MasterDetails(47, "machineChildPartMappingMaster",
				"Machine Child Part Mapping Master", "9", "2024-01-24 13:58:50", "PE"));

		masterDetailObject2.add(new MasterDetails(63, "crimpingSpecificationMaster", "Crimping Spec. Master", "9",
				"2024-01-24 13:58:50", "PE"));

		masterDetailObject2.add(
				new MasterDetails(64, "lineStationMaster", "Line Station Master", "9", "2024-01-24 13:58:50", "ME"));
		masterDetailObject2.add(new MasterDetails(65, "manpowerDeploymentMaster", "Manpower Deployment Master", "9",
				"2024-01-24 13:58:50", "ME"));

		masterDetailObject2
				.add(new MasterDetails(66, "targetMaster", "Target Master", "9", "2024-01-24 13:58:50", "ME"));

		masterDetailObject2.add(new MasterDetails(67, "subProductMaster", "Sub Product Master", "9",
				"2024-01-24 13:58:50", "Material"));
		masterDetailObject2.add(new MasterDetails(68, "excelDownloadMaster", "Excel Download Master", "9",
				"2024-01-24 13:58:50", "Excel"));
		masterDetailObject2.add(
				new MasterDetails(69, "sheetDetailMaster", "Sheet Detail Master", "9", "2024-01-24 13:58:50", "Excel"));
		masterDetailObject2.add(
				new MasterDetails(70, "excelReportMaster", "Excel Report Master", "9", "2024-01-24 13:58:50", "Excel"));
		masterDetailObject2.add(new MasterDetails(71, "machineCheckSheetField", "Machine Check Sheet Field", "9",
				"2024-01-24 13:58:50", "Excel"));
		masterDetailObject2.add(new MasterDetails(72, "machineCheckSheetLink", "Machine Check Sheet Link", "9",
				"2024-01-24 13:58:50", "Excel"));
		masterDetailObject2.add(new MasterDetails(73, "whoMaster", "Who Master", "9", "2024-01-24 13:58:50", "Excel"));
		masterDetailObject2.add(new MasterDetails(74, "howMaster", "How Master", "9", "2024-01-24 13:58:50", "Excel"));

		masterDetailObject2.add(
				new MasterDetails(75, "materialMaster", "Material Master", "9", "2024-01-24 13:58:50", "Material"));
		masterDetailObject2.add(new MasterDetails(76, "samplingPlanMaster", "Sampling Plan Master", "9",
				"2024-01-24 13:58:50", "Material"));
//		masterDetailObject2
//		.add(new MasterDetails(77, "documentCategoryMaster", "Document Category Master", "9", "2024-01-24 13:58:50", "PE"));
//		masterDetailObject2
//		.add(new MasterDetails(78, "documentRegisterMaster", "Document Register Master", "9", "2024-01-24 13:58:50", "PE"));
		masterDetailObject2.add(new MasterDetails(79, "signMaster", "Sign Master", "9", "2024-01-24 13:58:50", "PE"));
		masterDetailObject2
				.add(new MasterDetails(80, "whenMaster", "When Master", "9", "2024-01-24 13:58:50", "Excel"));
		masterDetailObject2.add(new MasterDetails(81, "phInspectionReqMaster", "Ph Inspection Master", "9",
				"2024-01-24 13:58:50", "Excel"));
		masterDetailObject2.add(
				new MasterDetails(82, "supplierMaster", "Supplier Master", "9", "2024-01-24 13:58:50", "Material"));
		masterDetailObject2.add(new MasterDetails(83, "ionizerFieldMaster", "Ionizer Sheet Field", "9",
				"2024-01-24 13:58:50", "Excel"));
		masterDetailObject2.add(
				new MasterDetails(84, "ionizerLinkMaster", "Ionizer Sheet Link", "9", "2024-01-24 13:58:50", "Excel"));

		masterDetailsRepositoryObject.saveAll(masterDetailObject2);

		roleMaster.add(new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1",
				null));
		roleMaster.add(new RoleMaster((long) 9, "ADMINISTRATOR", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13",
				"1", null));
		roleMaster.add(new RoleMaster((long) 10, "SUPERVISOR", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1",
				null));
		roleMaster.add(
				new RoleMaster((long) 11, "OPERATOR", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null));
		roleMaster.add(new RoleMaster((long) 12, "LINE LEADER", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13",
				"1", null));
		roleMaster.add(new RoleMaster((long) 13, "QA ENGINEER", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13",
				"1", null));
		roleMaster.add(new RoleMaster((long) 14, "LINE INCHARGE", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13",
				"1", null));
		roleMasterRepositoryObject.saveAll(roleMaster);

		departmentMasters.add(new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13"));
		departmentMasters
				.add(new DepartmentMaster((long) 2, "PPC", "111", "1", "2025-04-17 13:14:13", "2025-04-17 13:14:13"));
		departmentMasters.add(
				new DepartmentMaster((long) 3, "Quality", "111", "1", "2025-04-17 13:14:13", "2025-04-17 13:14:13"));
		departmentMasters.add(
				new DepartmentMaster((long) 4, "Production", "111", "1", "2025-04-17 13:14:13", "2025-04-17 13:14:13"));
		departmentMasters.add(new DepartmentMaster((long) 5, "Maintenance", "111", "1", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13"));
		departmentMasters
				.add(new DepartmentMaster((long) 6, "HR", "111", "1", "2025-04-17 13:14:13", "2025-04-17 13:14:13"));
		departmentMasters
				.add(new DepartmentMaster((long) 7, "Store", "111", "1", "2025-04-17 13:14:13", "2025-04-17 13:14:13"));
		departmentMasters.add(
				new DepartmentMaster((long) 11, "Assembly", "111", "1", "2025-04-17 13:14:13", "2025-04-17 13:14:13"));
		departmentMasters.add(new DepartmentMaster((long) 12, "Engineering", "111", "1", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13"));
		departmentMasters.add(new DepartmentMaster((long) 13, "Process Engineering", "111", "1", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13"));
		departmentMasters.add(new DepartmentMaster((long) 15, "Operations", "111", "1", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13"));
		departmentMasters
				.add(new DepartmentMaster((long) 16, "RQC", "111", "1", "2025-04-17 13:14:13", "2025-04-17 13:14:13"));
		departmentMasters.add(new DepartmentMaster((long) 17, "Plant Head", "111", "1", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13"));
		departmentMasters.add(
				new DepartmentMaster((long) 18, "Purchase", "111", "1", "2025-04-17 13:14:13", "2025-04-17 13:14:13"));

		departmentMasterRepositoryObject.saveAll(departmentMasters);

		roleObject.setRoleId((long) 8);
		departmentObject.setDepartmentId((long) 1);
		loginMasters.add(new LoginMaster((long) 111, "Mr.", "Admin", "Developer", "Developer",
				"developer@begaptSolutions.com", "111", null, null, null, null, null, null,
				// "$2a$10$aa9WUpmcl0tZsA9w8N85l.dRgGj4BWJdsEc3T/e.oenThO26Y16XK", roleObject,
				// null,
				"$2a$10$aa9WUpmcl0tZsA9w8N85l.dRgGj4BWJdsEc3T/e.oenThO26Y16XK", roleObject, null, // admin@beg@JNS
				"1,1-2,1-5,1-6,1-13,1-18,1-30,1-32,1-33,1-67,1-68,1-69,1-70,1-71,1-72,1-73,1-74,1-75,1-76,1-79,1-80,1-81,1-82,1-83,1-84,1-",
				"169-149-", departmentObject, null));
		// 148-149-150-151-152-153-154-155-156-157-158-159-160-161-162-164-165-166-167-168-169
		loginMasterRepositoryObject.saveAll(loginMasters);

		loginMasters.add(new LoginMaster((long) 123, "Mr.", "Admin", "Developer", "Developer",
				"developer@begaptSolutions.com", "123", null, null, null, null, null, null,
				// "$2a$10$aa9WUpmcl0tZsA9w8N85l.dRgGj4BWJdsEc3T/e.oenThO26Y16XK", roleObject,
				// null,
				"$2a$10$aa9WUpmcl0tZsA9w8N85l.dRgGj4BWJdsEc3T/e.oenThO26Y16XK", roleObject, null, // admin@10JNS
				"1,1-2,1-5,1-6,1-13,1-18,1-30,1-32,1-33,1-67,1-68,1-69,1-70,1-71,1-72,1-73,1-74,1-75,1-76,1-79,1-80,1-81,1-82,1-83,1-84,1-",
				"169-149-", departmentObject, null));
		// 148-149-150-151-152-153-154-155-156-157-158-159-160-161-162-164-165-166-167-168-169
		loginMasterRepositoryObject.saveAll(loginMasters);

		// 13 material, 18 instrument, 30 createuser, 32 rqc creation ,33 rqc approval,
		// 75 customer model mapping, 76 sampling plan

		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 1, "plantMaster", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 2, "locationMaster", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 3, "rackMaster", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 4, "machineMaster", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 5, "processMaster", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 6, "addNewPlant", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 7, "addNewLocation", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 8, "addNewRack", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 9, "roleMaster", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 10, "addNewRole", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 11, "addNewProcess", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 12, "storeMaterialCategoryMaster", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 13, "storeMaterialMaster", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 14, "productionArticleCategoryMaster", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 15, "productionArticleMaster", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 16, "departmentMaster", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 17, "addNewDepartment", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 18, "addNewStoreMaterialCategory", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 19, "addNewStoreMaterial", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 20, "compoundMaster", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 21, "addNewCompoundMaster", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 22, "devicesMaster", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 23, "addNewDevices", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 24, "shiftMaster", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 25, "addNewShift", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 26, "employeeMaster", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 27, "addNewEmployee", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 28, "addNewProductionArticleCategory", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 29, "addNewProductionArticle", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 30, "addNewCompound", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 31, "addNewMachine", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 32, "addNewDevices", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 33, "productionRejectionMaster", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 34, "productionOperationsMaster", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 35, "productionArticleBomMaster", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 36, "productionArticleRouteMaster", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 37, "productionArticleDetailsMaster", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 38, "packingCustomersDetailsMaster", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 39, "packingCustomerArticleMappingMaster", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 40, "addNewProductionRejection", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 41, "addNewProductionOperations", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 42, "addNewProductionArticleBom", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 43, "addNewProductionArticleRoute", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 44, "addNewProductionArticleDetails", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 45, "addNewPackingCustomersDetails", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 46, "addNewPackingCustomerArticleMapping", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 47, "supplierMaster", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 48, "addNewSupplier", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 49, "storeCategoryMappingMaster", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 50, "addNewStoreCategoryMapping", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 49, "storeMaterialSupplierMappingMaster", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 50, "addNewStoreMaterialSupplierMapping", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));

		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 51, "jobCardInformationReport", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));

		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 52, "storeLiveStockReport", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));

		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 53, "incomingReport", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 54, "issueReport", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 55, "expiryReport", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 56, "releaseMatPendingReport", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 57, "masterReport", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 58, "movingReport", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 59, "qaLogReport", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 60, "notificationMaster", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 61, "addNewNotification", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));

		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 62, "mouldMaster", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 63, "addNewMould", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));

		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 64, "mouldChildPartMaster", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 65, "addNewMouldChildPart", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));

		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 66, "mouldPreventiveMaintenanceMaster", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 67, "addNewMouldPreventiveMaintenance", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));

		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 68, "mouldPreventiveMaintenanceMaster", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 5, "Maintenance", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 69, "addNewMouldPreventiveMaintenance", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 5, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		
		
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 70, "preventiveMaintenance", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "Maintenance", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));

		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 71, "preventiveMaintenance", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 5, "Maintenance", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		
		
		
		
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 72, "productionMouldMaster", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 73, "addNewProductionMould", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		
		
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 74, "productionArticleMouldMaster", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 75, "addNewProductionArticleMould", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		
		
		
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 76, "productionCompoundMaster", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 77, "addNewProductionCompound", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		
		
		
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 78, "productionCompoundChildPartMaster", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 79, "addNewProductionCompoundChildPart", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		
		
		

		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 80, "productionPlanning", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		
		
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 81, "addProductionPlan", "1", "111",
				"2025-04-17 13:14:13", "2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		
		
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 82, "coldMaster", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 83, "addNewCold", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		
		
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 84, "productionArticleChildPartBomMaster", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		
		
		
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 85, "supplierClaimReport", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		
		
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 86, "articleParameterMaster", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		
		roleAuthorityDetails.add(new RoleAuthorityMaster((long) 87, "addNewArticleParameter", "1", "111", "2025-04-17 13:14:13",
				"2025-04-17 13:14:13", true,
				new RoleMaster((long) 8, "SUPER ADMIN", "111", "2025-04-17 13:14:13", "2025-04-17 13:14:13", "1", null),
				new DepartmentMaster((long) 1, "SUPER ADMIN", "111", "1", "2025-04-17 13:14:13",
						"2025-04-17 13:14:13")));
		
		
		
		roleAuthorityMasterRepositoryObject.saveAll(roleAuthorityDetails);

	}

}
