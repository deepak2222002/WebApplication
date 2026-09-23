package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.ProcessMaster;
import web.minda.project.entity.StoreMaterial;

public interface ProcessMasterRepository extends JpaRepository<ProcessMaster,Long> {

	@Query(value="""
			select process_name from process_Master 
			""",nativeQuery = true)
	public List<String> getAllLocationList();
	
    @Query("""
            SELECT sm 
            FROM ProcessMaster sm
            ORDER BY sm.processName ASC
        """)
        List<ProcessMaster> getAllActiveProcess();
	
	
	@Query(value="SELECT * FROM process_Master ",nativeQuery = true)
	List<ProcessMaster> getAllLocationMasters();

//	@Query(value="select * from process_name  WHERE id = :processId",nativeQuery = true)
//	public ProcessMaster findByProcessIds(@Param("processId") Long processId);
//	
//	@Query(value="select * from process_name  WHERE process_name = :processName",nativeQuery = true)
//	public ProcessMaster findByProcessNames(@Param("processName") Long processName);
//	
//	@Query(value="select * from process_name  WHERE process_data = :processData",nativeQuery = true)
//	public ProcessMaster findByProcessDatas(@Param("processData") Long processData);
	
	
	Optional<ProcessMaster> findByProcessId(Long processId);
	Optional<ProcessMaster> findByProcessName(String processName);
	Optional<ProcessMaster> findByProcessData(String processData);


	boolean existsByProcessId(Long Id);
	
	boolean existsByProcessName(String processName);
	
	boolean existsByProcessData(String processData);
	
	@Query(value = """
			SELECT CONCAT_WS(';',process_name, description, process_data, status,created_by,
			 date_time_modified) FROM process_Master
			""",
		       nativeQuery = true)
		List<ProcessMaster> getalldata();


	@Query(
			value = """
			SELECT * FROM process_master
			WHERE (:processName IS NULL OR :processName = '' OR process_name LIKE CONCAT('%', :processName, '%'))
			AND (:description IS NULL OR :description = '' OR description LIKE CONCAT('%', :description, '%'))
			AND (:processData IS NULL OR :processData = '' OR process_data LIKE CONCAT('%', :processData, '%'))
			AND (:status IS NULL OR :status = '' OR status LIKE CONCAT('%', :status, '%'))
			AND (:createdBy IS NULL OR :createdBy = '' OR created_by LIKE CONCAT('%', :createdBy, '%'))
			""",
			countQuery = """
			SELECT COUNT(*) FROM process_master
			WHERE (:processName IS NULL OR :processName = '' OR process_name LIKE CONCAT('%', :processName, '%'))
			AND (:description IS NULL OR :description = '' OR description LIKE CONCAT('%', :description, '%'))
			AND (:processData IS NULL OR :processData = '' OR process_data LIKE CONCAT('%', :processData, '%'))
			AND (:status IS NULL OR :status = '' OR status LIKE CONCAT('%', :status, '%'))
			AND (:createdBy IS NULL OR :createdBy = '' OR created_by LIKE CONCAT('%', :createdBy, '%'))
			""",
			nativeQuery = true
			)
			Page<ProcessMaster> getLikeProcess(
			        @Param("processName") String processName,
			        @Param("description") String description,
			        @Param("processData") String processData,
			        @Param("status") String status,
			        @Param("createdBy") String createdBy,
			        Pageable pageable);


	@Query(value="""
			select process_name from process_master 
			""",nativeQuery = true)
	public List<String> getAllProcessNameMasterList();

//	@Query(value = """
//	        SELECT * FROM process_Master
//	        WHERE (:processName IS NULL OR :processName = '' OR process_name LIKE CONCAT('%', :processName, '%'))
//	        AND (:description IS NULL OR :description = '' OR description LIKE CONCAT('%', :description, '%'))
//	        AND (:processData IS NULL OR :processData = '' OR process_data LIKE CONCAT('%', :processData, '%'))
//	        AND (:status IS NULL OR :status = '' OR status LIKE CONCAT('%', :status, '%'))
//	        AND (:createdBy IS NULL OR :createdBy = '' OR created_by LIKE CONCAT('%', :createdBy, '%'))
//	        """,
//	        nativeQuery = true)
//	Page<ProcessMaster> getLikeProcess(
//	        @Param("processName") String processName,
//	        @Param("description") String description,
//	        @Param("processData") String processData,
//	        @Param("status") String status,
//	        @Param("createdBy") String createdBy,
//	        Pageable pageable);
	
	@Query(value = """
		    SELECT * FROM process_master pm
		    WHERE (:processName IS NULL OR :processName = '' 
		           OR LOWER(pm.process_name) LIKE LOWER(CONCAT('%', :processName, '%')))
		    AND (:description IS NULL OR :description = '' 
		         OR LOWER(pm.description) LIKE LOWER(CONCAT('%', :description, '%')))
		    AND (:processData IS NULL OR :processData = '' 
		         OR LOWER(pm.process_data) LIKE LOWER(CONCAT('%', :processData, '%')))
		    AND (:status IS NULL OR :status = '' 
		         OR LOWER(pm.status) LIKE LOWER(CONCAT('%', :status, '%')))
		    AND (:createdBy IS NULL OR :createdBy = '' 
		         OR LOWER(pm.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		    """,
		    nativeQuery = true
		)
		List<ProcessMaster> getAllProcessMaster(
		        @Param("processName") String processName,
		        @Param("description") String description,
		        @Param("processData") String processData,
		        @Param("status") String status,
		        @Param("createdBy") String createdBy
		);


}
