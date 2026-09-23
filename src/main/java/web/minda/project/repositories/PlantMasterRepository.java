package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import web.minda.project.entity.PlantMaster;

public interface PlantMasterRepository extends CrudRepository<PlantMaster, Long> {

	@Query("select p_m.plantId, p_m.plantCode from PlantMaster p_m")
	public List<String> getAllPlantAddress();

	@Query("select p_m from PlantMaster p_m WHERE p_m.plantId= :plantId")
	public PlantMaster findByPlantId(@Param("plantId") Long plantId);

	@Query("select p_m.plantCode from PlantMaster p_m WHERE p_m.plantCode= :plantCode")
	public String existsByPlantCodes(@Param("plantCode") String plantCode);

	boolean existsByPlantCode(String plantCode);
	
//	@Query("select CONCAT_WS(';', r_m.plantName, r_m.plantCode, r_m.plantAddress, r_m.plantCity,  r_m.plantState, r_m.plantPincode, r_m.plantContactPerson , r_m.plantMobileNo ,r_m.createdBy, r_m.dateTimeModified ) from PlantMaster r_m")
//	List<String> getalldata();
	
//	@Query("select CONCAT_WS(';', r_m.plantName, r_m.plantCode, r_m.plantAddress, r_m.plantCity,  r_m.plantState, r_m.plantPincode, r_m.plantContactPerson , r_m.plantMobileNo ,r_m.createdBy, r_m.dateTimeModified ) from PlantMaster r_m")
//	List<PlantMaster> getAllPlantMasters();
	
	@Query("SELECT p FROM PlantMaster p")
	List<PlantMaster> getAllPlantMasters();


	@Query("select p_m.plantAddress from PlantMaster p_m WHERE p_m.plantAddress=:plantAddress")
	public String existsByPlantAddress(@Param("plantAddress") String plantAddress);

	/*
	 * @Query("SELECT x FROM PlantMaster x WHERE x.status=:status") public
	 * List<PlantMaster> getPlantByStatus(@Param("status") String status);
	 */

	@Query("SELECT x FROM PlantMaster x WHERE x.status=:status")
	public Page<PlantMaster> getPlantByStatus1(@Param("status") String status, Pageable pageable);

//	@Query("select p_m.plantId, CONCAT(p_m.plantCode, '_', p_m.plantName) from PlantMaster p_m WHERE p_m.status=:status")
//	public List<String> getPlantListString(@Param("status") String status);
	
	@Query("SELECT CONCAT(p_m.plantId, ',', p_m.plantCode, ' - ', p_m.plantName) FROM PlantMaster p_m WHERE p_m.status = :status")
	List<String> getPlantListString(@Param("status") String status);


	Optional<PlantMaster> findByPlantCode(String plantCode);


//	@Query(value = "SELECT * FROM plant_master where "
//			+ "(:plantName is null or plant_name like %:plantName%) "
//			+ "and (:plantCode is null or plant_code like %:plantCode%) "
//			+ "and (:plantAddress is null or plant_address like %:plantAddress%) "
//			+ "and (:plantCity is null or plant_city like %:plantCity%) "
//			+ "and (:plantState is null or plant_state like %:plantState%) "
//			+ "and (:plantPincode is null or plant_pincode like %:plantPincode%) "
//			+ "and (:plantContactPerson is null or plant_contact_person like %:plantContactPerson%) "
//			+ "and (:plantMobileNo is null or plant_mobile_no like %:plantMobileNo%)"
//			+ "and (:createdBy is null or created_by like %:createdBy%); ", nativeQuery = true)
//	public Page<PlantMaster> getLikePlant(@Param("plantName") String plantName, @Param("plantCode") String plantCode, @Param("plantAddress") String plantAddress, 
//			@Param("plantCity") String plantCity, @Param("plantState") String plantState, @Param("plantPincode") String plantPincode,
//			@Param("plantContactPerson") String plantContactPerson, @Param("plantMobileNo") String plantMobileNo,
//			@Param("createdBy") String createdBy, Pageable pageable);
	
	@Query(value = "SELECT * FROM plant_master WHERE "
	        + "(:plantName IS NULL OR :plantName = '' OR plant_name LIKE CONCAT('%', :plantName, '%')) "
	        + "AND (:plantCode IS NULL OR :plantCode = '' OR plant_code LIKE CONCAT('%', :plantCode, '%')) "
	        + "AND (:plantAddress IS NULL OR :plantAddress = '' OR plant_address LIKE CONCAT('%', :plantAddress, '%')) "
	        + "AND (:plantCity IS NULL OR :plantCity = '' OR plant_city LIKE CONCAT('%', :plantCity, '%')) "
	        + "AND (:plantState IS NULL OR :plantState = '' OR plant_state LIKE CONCAT('%', :plantState, '%')) "
	        + "AND (:plantPincode IS NULL OR :plantPincode = '' OR plant_pincode LIKE CONCAT('%', :plantPincode, '%')) "
	        + "AND (:plantContactPerson IS NULL OR :plantContactPerson = '' OR plant_contact_person LIKE CONCAT('%', :plantContactPerson, '%')) "
	        + "AND (:plantMobileNo IS NULL OR :plantMobileNo = '' OR plant_mobile_no LIKE CONCAT('%', :plantMobileNo, '%')) "
	        + "AND (:createdBy IS NULL OR :createdBy = '' OR created_by LIKE CONCAT('%', :createdBy, '%')) "
	        + "AND (:plantDescription IS NULL OR :plantDescription = '' OR plant_description LIKE CONCAT('%', :plantDescription, '%'))",
	        nativeQuery = true)
	Page<PlantMaster> getLikePlant(
	        @Param("plantName") String plantName,
	        @Param("plantCode") String plantCode,
	        @Param("plantAddress") String plantAddress,
	        @Param("plantCity") String plantCity,
	        @Param("plantState") String plantState,
	        @Param("plantPincode") String plantPincode,
	        @Param("plantContactPerson") String plantContactPerson,
	        @Param("plantMobileNo") String plantMobileNo,
	        @Param("createdBy") String createdBy,
	        @Param("plantDescription") String plantDescription,
	        Pageable pageable);

	
	
	@Query(value = "SELECT x.* FROM plant_master as x where "
			+ "(x.plant_name is null or x.plant_name like %:plantName%) "
			+ "and (x.plant_code is null or x.plant_code like %:plantCode%) "
			+ "and (x.plant_address is null or x.plant_address like %:plantAddress%) "
			+ "and (x.plant_city is null or x.plant_city like %:plantCity%) "
			+ "and (x.plant_state is null or x.plant_state like %:plantState%) "
			+ "and (x.plant_pincode is null or x.plant_pincode like %:plantPincode%) "
			+ "and (x.plant_contact_person is null or x.plant_contact_person like %:plantContactPerson%) "
			+ "and (x.plant_mobile_no is null or x.plant_mobile_no like %:plantMobileNo%)"
			+ "and (x.created_by is null or x.created_by like %:createdBy%); ", nativeQuery = true)
	public List<PlantMaster> getPlantByStatus(@Param("plantName") String plantName, @Param("plantCode") String plantCode, @Param("plantAddress") String plantAddress, 
			@Param("plantCity") String plantCity, @Param("plantState") String plantState, @Param("plantPincode") String plantPincode,
			@Param("plantContactPerson") String plantContactPerson, @Param("plantMobileNo") String plantMobileNo,
			@Param("createdBy") String createdBy);


}
