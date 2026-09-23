package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.DevicesMaster;
import web.minda.project.entity.ProcessMaster;

public interface DevicesMasterRepository extends JpaRepository<DevicesMaster, Long> {
	@Query(value="""
			select device_name from devices_master 
			""",nativeQuery = true)
	public List<String> getAllDeviceList();
	
	
	@Query(value="SELECT * FROM devices_master ",nativeQuery = true)
	List<DevicesMaster> getAllDeviceMasters();

//	@Query(value="select * from devices_master  WHERE id = :devicesId",nativeQuery = true)
//	public DevicesMaster findBydeviceIds(@Param("devicesId") Long devicesId);
//	
//	@Query(value="select * from devices_master  WHERE device_name = :deviceName",nativeQuery = true)
//	public DevicesMaster findBydeviceNames(@Param("deviceName") Long deviceName);
//	
//	@Query(value="select * from devices_master  WHERE address = :address",nativeQuery = true)
//	public DevicesMaster findByAddresss(@Param("address") Long address);
	
	
	Optional<DevicesMaster> findBydevicesId(Long devicesId);
	Optional<DevicesMaster> findBydeviceName(String deviceName);
	Optional<DevicesMaster> findByAddress(String address);


	boolean existsByDevicesId(Long Id);
	
	boolean existsByDeviceName(String deviceName);
	
	boolean existsByAddress(String address);
	
	@Query(value = """
			SELECT CONCAT_WS(';',device_name, description, address, status,created_by,
			 date_time_modified) FROM devices_master
			""",
		       nativeQuery = true)
		List<DevicesMaster> getalldata();


	@Query(
			value = """
			SELECT *
			FROM devices_master dm
			WHERE (:deviceName IS NULL OR :deviceName = '' OR dm.device_name LIKE '%' + :deviceName + '%')
			AND (:description IS NULL OR :description = '' OR dm.description LIKE '%' + :description + '%')
			AND (:address IS NULL OR :address = '' OR dm.address LIKE '%' + :address + '%')
			AND (:status IS NULL OR :status = '' OR dm.status LIKE '%' + :status + '%')
			AND (:createdBy IS NULL OR :createdBy = '' OR dm.created_by LIKE '%' + :createdBy + '%')
			""",

			countQuery = """
			SELECT COUNT(*)
			FROM devices_master dm
			WHERE (:deviceName IS NULL OR :deviceName = '' OR dm.device_name LIKE '%' + :deviceName + '%')
			AND (:description IS NULL OR :description = '' OR dm.description LIKE '%' + :description + '%')
			AND (:address IS NULL OR :address = '' OR dm.address LIKE '%' + :address + '%')
			AND (:status IS NULL OR :status = '' OR dm.status LIKE '%' + :status + '%')
			AND (:createdBy IS NULL OR :createdBy = '' OR dm.created_by LIKE '%' + :createdBy + '%')
			""",

			nativeQuery = true
			)
			Page<DevicesMaster> getLikeDevice(
			        @Param("deviceName") String deviceName,
			        @Param("description") String description,
			        @Param("address") String address,
			        @Param("status") String status,
			        @Param("createdBy") String createdBy,
			        Pageable pageable
			);
	
//	@Query(value = """
//	        SELECT * FROM devices_master
//	        WHERE (:deviceName IS NULL OR :deviceName = '' OR device_name LIKE CONCAT('%', :deviceName, '%'))
//	        AND (:description IS NULL OR :description = '' OR description LIKE CONCAT('%', :description, '%'))
//	        AND (:address IS NULL OR :address = '' OR process_data LIKE CONCAT('%', :address, '%'))
//	        AND (:status IS NULL OR :status = '' OR status LIKE CONCAT('%', :status, '%'))
//	        AND (:createdBy IS NULL OR :createdBy = '' OR created_by LIKE CONCAT('%', :createdBy, '%'))
//	        """,
//	        nativeQuery = true)
//	Page<DevicesMaster> getLikeDevice(
//	        @Param("deviceName") String deviceName,
//	        @Param("description") String description,
//	        @Param("address") String address,
//	        @Param("status") String status,
//	        @Param("createdBy") String createdBy,
//	        Pageable pageable);

	
	@Query(value = """
		    SELECT *
		    FROM devices_master dm
		    WHERE (:deviceName IS NULL OR :deviceName = '' 
		           OR LOWER(dm.device_name) LIKE LOWER(CONCAT('%', :deviceName, '%')))
		    AND (:description IS NULL OR :description = '' 
		         OR LOWER(dm.description) LIKE LOWER(CONCAT('%', :description, '%')))
		    AND (:address IS NULL OR :address = '' 
		         OR LOWER(dm.address) LIKE LOWER(CONCAT('%', :address, '%')))
		    AND (:status IS NULL OR :status = '' 
		         OR LOWER(dm.status) LIKE LOWER(CONCAT('%', :status, '%')))
		    AND (:createdBy IS NULL OR :createdBy = '' 
		         OR LOWER(dm.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		    """,
		    nativeQuery = true
		)
		List<DevicesMaster> getAllDeviceMaster(
		        @Param("deviceName") String deviceName,
		        @Param("description") String description,
		        @Param("address") String address,
		        @Param("status") String status,
		        @Param("createdBy") String createdBy
		);
}
