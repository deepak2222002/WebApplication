package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.ShiftMaster;

public interface ShiftMasterRepository extends JpaRepository<ShiftMaster, Long>{
	
	@Query(value="""
			select shift from shift_master 
			""",nativeQuery = true)
	public List<String> getAllShiftMasterList();
	
	
	@Query(value="SELECT * FROM shift_master ",nativeQuery = true)
	List<ShiftMaster> getAllShiftMasters();


	Optional<ShiftMaster> findByShiftName(String shiftName);

	boolean existsByShiftName(String shiftName);
	
	
	@Query(value = """
				SELECT CONCAT_WS(';',shift_name, description,shift_start,shift_end,created_by,
			 date_time_modified) FROM shift_master
			""",
		       nativeQuery = true)
		List<ShiftMaster> getalldata();

	@Query(
		    value = """
		    SELECT *
		    FROM shift_master sm
		    WHERE (:shiftName IS NULL OR :shiftName = '' OR LOWER(sm.shift_name) LIKE LOWER(CONCAT('%', :shiftName, '%')))
		    AND (:description IS NULL OR :description = '' OR LOWER(sm.description) LIKE LOWER(CONCAT('%', :description, '%')))
		    AND (:start IS NULL OR :start = '' OR LOWER(sm.shift_start) LIKE LOWER(CONCAT('%', :start, '%')))
		    AND (:end IS NULL OR :end = '' OR LOWER(sm.shift_end) LIKE LOWER(CONCAT('%', :end, '%')))
		    AND (:status IS NULL OR :status = '' OR LOWER(sm.status) LIKE LOWER(CONCAT('%', :status, '%')))
		    AND (:createdBy IS NULL OR :createdBy = '' OR LOWER(sm.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		    """,

		    countQuery = """
		    SELECT COUNT(*)
		    FROM shift_master sm
		    WHERE (:shiftName IS NULL OR :shiftName = '' OR LOWER(sm.shift_name) LIKE LOWER(CONCAT('%', :shiftName, '%')))
		    AND (:description IS NULL OR :description = '' OR LOWER(sm.description) LIKE LOWER(CONCAT('%', :description, '%')))
		    AND (:start IS NULL OR :start = '' OR LOWER(sm.shift_start) LIKE LOWER(CONCAT('%', :start, '%')))
		    AND (:end IS NULL OR :end = '' OR LOWER(sm.shift_end) LIKE LOWER(CONCAT('%', :end, '%')))
		    AND (:status IS NULL OR :status = '' OR LOWER(sm.status) LIKE LOWER(CONCAT('%', :status, '%')))
		    AND (:createdBy IS NULL OR :createdBy = '' OR LOWER(sm.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		    """,

		    nativeQuery = true
		)
			Page<ShiftMaster> getLikeShift(
			        @Param("shiftName") String shiftName,
			        @Param("description") String description,
			        @Param("start") String start,
			        @Param("end") String end,
			        @Param("status") String status,
			        @Param("createdBy") String createdBy,
			        Pageable pageable
			);

//	@Query(value = """
//	   SELECT * FROM shift_master
//	        WHERE (:shiftName IS NULL OR :shiftName = '' OR shift_name LIKE CONCAT('%', :shiftName, '%'))
//	        AND (:description IS NULL OR :description = '' OR description LIKE CONCAT('%', :description, '%'))
//	        AND (:start IS NULL OR :start = '' OR shift_start LIKE CONCAT('%', :start, '%'))
//	        AND (:end IS NULL OR :end = '' OR shift_end LIKE CONCAT('%', :end, '%'))
//	        AND (:status IS NULL OR :status = '' OR status LIKE CONCAT('%', :status, '%'))
//	        AND (:createdBy IS NULL OR :createdBy = '' OR created_by LIKE CONCAT('%', :createdBy, '%'))
//	        """,
//	        nativeQuery = true)
//	Page<ShiftMaster> getLikeShift(
//	        @Param("shiftName") String shiftName,
//	        @Param("description") String description,
//	        @Param("start") String start,	
//	        @Param("end") String end,
//	        @Param("status") String status,
//	        @Param("createdBy") String createdBy,
//	        Pageable pageable);
	
	@Query(value = """
		    SELECT *
		    FROM shift_master sm
		    WHERE (:shiftName IS NULL OR :shiftName = '' OR LOWER(sm.shift_name) LIKE LOWER(CONCAT('%', :shiftName, '%')))
		    AND (:description IS NULL OR :description = '' OR LOWER(sm.description) LIKE LOWER(CONCAT('%', :description, '%')))
		    AND (:start IS NULL OR :start = '' OR LOWER(sm.shift_start) LIKE LOWER(CONCAT('%', :start, '%')))
		    AND (:end IS NULL OR :end = '' OR LOWER(sm.shift_end) LIKE LOWER(CONCAT('%', :end, '%')))
		    AND (:status IS NULL OR :status = '' OR LOWER(sm.status) LIKE LOWER(CONCAT('%', :status, '%')))
		    AND (:createdBy IS NULL OR :createdBy = '' OR LOWER(sm.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		    """,
		    nativeQuery = true
		)
		List<ShiftMaster> getAllShiftMaster(
		        @Param("shiftName") String shiftName,
		        @Param("description") String description,
		        @Param("start") String start,
		        @Param("end") String end,
		        @Param("status") String status,
		        @Param("createdBy") String createdBy
		);


}
