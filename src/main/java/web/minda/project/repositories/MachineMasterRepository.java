package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.LocationMaster;
import web.minda.project.entity.MachineMaster;

public interface MachineMasterRepository extends JpaRepository<MachineMaster, Long> {
	
	@Query(value="""
			select machine_name from machine_master 
			""",nativeQuery = true)
	public List<String> getAllMachineList();
	
	
	@Query(value="SELECT * FROM machine_master ",nativeQuery = true)
	List<MachineMaster> getAllMachineMasters();

//	@Query(value="select * from machine_master  WHERE id = :locationId",nativeQuery = true)
//	public MachineMaster findByMachineIds(@Param("locationId") Long locationId);
//	
//	@Query(value="select * from machine_master  WHERE machine_name = :machineName",nativeQuery = true)
//	public MachineMaster findByMachineNames(@Param("machineName") Long machineName);
//	
//	@Query(value="select * from machine_master  WHERE barcode = :barcode",nativeQuery = true)
//	public MachineMaster findByBarcode(@Param("barcode") String barcode);
	
	
	Optional<MachineMaster> findByMachineId(Long machineId);
	Optional<MachineMaster> findByMachineName(String machineName);
	Optional<MachineMaster> findByBarcode(String barcode);


	boolean existsByMachineId(Long Id);
	
	boolean existsByMachineName(String machineName);
	
	boolean existsByBarcode(String barcode);
	
	@Query(value = """
			SELECT CONCAT_WS(';',machine_name, description, barcode, tonnage,created_by,
			 date_time_modified) FROM machine_master
			""",
		       nativeQuery = true)
		List<MachineMaster> getalldata();

//	@Query(value = """
//	        SELECT * FROM machine_master
//	        WHERE (:machineName IS NULL OR :machineName = '' OR machine_name LIKE CONCAT('%', :machineName, '%'))
//	        AND (:description IS NULL OR :description = '' OR description LIKE CONCAT('%', :description, '%'))
//	        AND (:barcode IS NULL OR :barcode = '' OR barcode LIKE CONCAT('%', :barcode, '%'))
//	        AND (:tonnage IS NULL OR :tonnage = '' OR tonnage LIKE CONCAT('%', :tonnage, '%'))
//	        AND (:status IS NULL OR :status = '' OR status LIKE CONCAT('%', :status, '%'))
//	        AND (:createdBy IS NULL OR :createdBy = '' OR created_by LIKE CONCAT('%', :createdBy, '%'))
//	        """,
//	        nativeQuery = true)
//	Page<MachineMaster> getLikeMachine(
//	        @Param("machineName") String machineName,
//	        @Param("description") String description,
//	        @Param("barcode") String barcode,
//	        @Param("tonnage") String tonnage,
//	        @Param("status") String status,
//	        @Param("createdBy") String createdBy,
//	        Pageable pageable);
	
	@Query(
			value = """
			SELECT *
			FROM machine_master mm
			WHERE (:machineName IS NULL OR :machineName = '' OR mm.machine_name LIKE '%' + :machineName + '%')
			AND (:description IS NULL OR :description = '' OR mm.description LIKE '%' + :description + '%')
			AND (:barcode IS NULL OR :barcode = '' OR mm.barcode LIKE '%' + :barcode + '%')
			AND (:tonnage IS NULL OR :tonnage = '' OR mm.tonnage LIKE '%' + :tonnage + '%')
			AND (:status IS NULL OR :status = '' OR mm.status LIKE '%' + :status + '%')
			AND (:createdBy IS NULL OR :createdBy = '' OR mm.created_by LIKE '%' + :createdBy + '%')
			""",

			countQuery = """
			SELECT COUNT(*)
			FROM machine_master mm
			WHERE (:machineName IS NULL OR :machineName = '' OR mm.machine_name LIKE '%' + :machineName + '%')
			AND (:description IS NULL OR :description = '' OR mm.description LIKE '%' + :description + '%')
			AND (:barcode IS NULL OR :barcode = '' OR mm.barcode LIKE '%' + :barcode + '%')
			AND (:tonnage IS NULL OR :tonnage = '' OR mm.tonnage LIKE '%' + :tonnage + '%')
			AND (:status IS NULL OR :status = '' OR mm.status LIKE '%' + :status + '%')
			AND (:createdBy IS NULL OR :createdBy = '' OR mm.created_by LIKE '%' + :createdBy + '%')
			""",

			nativeQuery = true
			)
			Page<MachineMaster> getLikeMachine(
			        @Param("machineName") String machineName,
			        @Param("description") String description,
			        @Param("barcode") String barcode,
			        @Param("tonnage") String tonnage,
			        @Param("status") String status,
			        @Param("createdBy") String createdBy,
			        Pageable pageable
			);
	
	
	@Query(value = """
		    SELECT *
		    FROM machine_master mm
		    WHERE (:machineName IS NULL OR :machineName = '' 
		           OR LOWER(mm.machine_name) LIKE LOWER(CONCAT('%', :machineName, '%')))
		    AND (:description IS NULL OR :description = '' 
		         OR LOWER(mm.description) LIKE LOWER(CONCAT('%', :description, '%')))
		    AND (:barcode IS NULL OR :barcode = '' 
		         OR LOWER(mm.barcode) LIKE LOWER(CONCAT('%', :barcode, '%')))
		    AND (:tonnage IS NULL OR :tonnage = '' 
		         OR LOWER(mm.tonnage) LIKE LOWER(CONCAT('%', :tonnage, '%')))
		    AND (:status IS NULL OR :status = '' 
		         OR LOWER(mm.status) LIKE LOWER(CONCAT('%', :status, '%')))
		    AND (:createdBy IS NULL OR :createdBy = '' 
		         OR LOWER(mm.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		    """,
		    nativeQuery = true
		)
		List<MachineMaster> getAllMachineMasters(
		        @Param("machineName") String machineName,
		        @Param("description") String description,
		        @Param("barcode") String barcode,
		        @Param("tonnage") String tonnage,
		        @Param("status") String status,
		        @Param("createdBy") String createdBy
		);

}
