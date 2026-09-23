package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import web.minda.project.entity.NotificationMaster;

public interface NotificationMasterRepository extends JpaRepository<NotificationMaster, Long> {

	@Query(value = """
			SELECT nm.*
			FROM notification_master nm
			LEFT JOIN department_master dm ON dm.id = nm.department_id
			WHERE (:departmentName IS NULL OR :departmentName = '' OR nm.department_name LIKE '%' + :departmentName + '%')
			AND (:operation IS NULL OR :operation = '' OR nm.operation LIKE '%' + :operation + '%')
			AND (:duration IS NULL OR :duration = '' OR nm.duration LIKE '%' + :duration + '%')
			AND (:unit IS NULL OR :unit = '' OR nm.unit LIKE '%' + :unit + '%')
			AND (:createdBy IS NULL OR :createdBy = '' OR nm.created_by LIKE '%' + :createdBy + '%')

			""", countQuery = """
			SELECT COUNT(*)
			FROM notification_master nm
			LEFT JOIN department_master dm ON dm.id = nm.department_id
			WHERE (:departmentName IS NULL OR :departmentName = '' OR nm.department_name LIKE '%' + :departmentName + '%')
			AND (:operation IS NULL OR :operation = '' OR nm.operation LIKE '%' + :operation + '%')
			AND (:duration IS NULL OR :duration = '' OR nm.duration LIKE '%' + :duration + '%')
			AND (:unit IS NULL OR :unit = '' OR nm.unit LIKE '%' + :unit + '%')
			AND (:createdBy IS NULL OR :createdBy = '' OR nm.created_by LIKE '%' + :createdBy + '%')

			""", nativeQuery = true)
	Page<NotificationMaster> getLikeNotification(@Param("departmentName") String departmentName,
			@Param("operation") String operation, @Param("duration") String duration, @Param("unit") String unit,
			@Param("createdBy") String createdBy, Pageable pageable);

//	@Query(value = """
//	        SELECT * FROM notification_master nm left join department_master dm on dm.id = nm.department_id
//	        WHERE (:operation IS NULL OR :operation = '' OR dm.location_name LIKE CONCAT('%', :operation, '%'))
//	        AND (:binName IS NULL OR :binName = '' OR nm.bin_name LIKE CONCAT('%', :binName, '%'))
//	        AND (:status IS NULL OR :status = '' OR nm.status LIKE CONCAT('%', :status, '%'))
//	        AND (:createdBy IS NULL OR :createdBy = '' OR nm.created_by LIKE CONCAT('%', :createdBy, '%'))
//	        """,
//	        nativeQuery = true)
//	Page<RackMaster> getLikeRack(
//	        @Param("operation") String operation,
//	        @Param("binName") String binName,	
//	        @Param("status") String status,
//	        @Param("createdBy") String createdBy,
//	        Pageable pageable);
//
//	public boolean existsByBinNameAndLocation_LocationNameAndRackIdNot(String binName, String operation, Long rackId);
//	
//	@Query(value = """
//		    SELECT nm.*
//		    FROM notification_master nm
//		    LEFT JOIN department_master dm ON dm.id = nm.department_id
//		    WHERE (:operation IS NULL OR :operation = '' 
//		           OR LOWER(dm.location_name) LIKE LOWER(CONCAT('%', :operation, '%')))
//		    AND (:binName IS NULL OR :binName = '' 
//		         OR LOWER(nm.bin_name) LIKE LOWER(CONCAT('%', :binName, '%')))
//		    AND (:status IS NULL OR :status = '' 
//		         OR LOWER(nm.status) LIKE LOWER(CONCAT('%', :status, '%')))
//		    AND (:createdBy IS NULL OR :createdBy = '' 
//		         OR LOWER(nm.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
//		    """,
//		    nativeQuery = true
//		)
//		List<RackMaster> getAllRackMaster(
//		        @Param("operation") String operation,
//		        @Param("binName") String binName,
//		        @Param("status") String status,
//		        @Param("createdBy") String createdBy
//		);

	@Query(value = """
			SELECT nm.*
			FROM notification_master nm
			LEFT JOIN department_master dm ON dm.id = nm.department_id
			WHERE (:departmentName IS NULL OR :departmentName = '' OR nm.department_name LIKE '%' + :departmentName + '%')
			AND (:operation IS NULL OR :operation = '' OR nm.operation LIKE '%' + :operation + '%')
			AND (:duration IS NULL OR :duration = '' OR nm.duration LIKE '%' + :duration + '%')
			AND (:unit IS NULL OR :unit = '' OR nm.unit LIKE '%' + :unit + '%')
			AND (:createdBy IS NULL OR :createdBy = '' OR nm.created_by LIKE '%' + :createdBy + '%')
			""", nativeQuery = true)
	List<NotificationMaster> getAllNotificationMaster(@Param("departmentName") String departmentName,
			@Param("operation") String operation, @Param("duration") String duration, @Param("unit") String unit,
			@Param("createdBy") String createdBy);

	public Optional<NotificationMaster> findByOperation(String barcode);

	public Optional<NotificationMaster> findByDuration(String barcode);

	public boolean existsByOperation(String operation);

	public boolean existsByOperationAndNotificationIdNot(String operation, Long notificationId);

}
