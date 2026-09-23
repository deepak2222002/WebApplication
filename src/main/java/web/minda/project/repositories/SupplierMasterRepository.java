package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.StoreMaterial;
import web.minda.project.entity.SupplierMaster;

public interface SupplierMasterRepository extends JpaRepository<SupplierMaster, Long> {

	boolean existsBySupplierName(String processName);
	
	Optional<SupplierMaster> findBySupplierName(String supplierName);
	

	@Query(value="""
			select supplier_name from supplier_master 
			""",nativeQuery = true)
	public List<String> getAllSupplierNameInList();

	@Query(
		    value = """
		    SELECT * FROM supplier_master
		    WHERE (:supplierName IS NULL OR :supplierName = '' OR supplier_name LIKE CONCAT('%', :supplierName, '%'))
		    AND (:address IS NULL OR :address = '' OR address LIKE CONCAT('%', :address, '%'))
		    AND (:contactNo IS NULL OR :contactNo = '' OR contact_no LIKE CONCAT('%', :contactNo, '%'))
		    AND (:status IS NULL OR :status = '' OR status LIKE CONCAT('%', :status, '%'))
		    AND (:createdBy IS NULL OR :createdBy = '' OR created_by LIKE CONCAT('%', :createdBy, '%'))
		    """,
		    
		    countQuery = """
		    SELECT COUNT(*) FROM supplier_master
		    WHERE (:supplierName IS NULL OR :supplierName = '' OR supplier_name LIKE CONCAT('%', :supplierName, '%'))
		    AND (:address IS NULL OR :address = '' OR address LIKE CONCAT('%', :address, '%'))
		    AND (:contactNo IS NULL OR :contactNo = '' OR contact_no LIKE CONCAT('%', :contactNo, '%'))
		    AND (:status IS NULL OR :status = '' OR status LIKE CONCAT('%', :status, '%'))
		    AND (:createdBy IS NULL OR :createdBy = '' OR created_by LIKE CONCAT('%', :createdBy, '%'))
		    """,
		    
		    nativeQuery = true
		)
		Page<SupplierMaster> getLikeSupplier(
		        @Param("supplierName") String supplierName,
		        @Param("address") String address,
		        @Param("contactNo") String contactNo,
		        @Param("status") String status,
		        @Param("createdBy") String createdBy,
		        Pageable pageable
		);
	
	@Query(value = """
		    SELECT *
		    FROM supplier_master sm
		    WHERE (:supplierName IS NULL OR :supplierName = '' 
		           OR LOWER(sm.supplier_name) LIKE LOWER(CONCAT('%', :supplierName, '%')))
		    AND (:address IS NULL OR :address = '' 
		         OR LOWER(sm.address) LIKE LOWER(CONCAT('%', :address, '%')))
		    AND (:contactNo IS NULL OR :contactNo = '' 
		         OR LOWER(sm.contact_no) LIKE LOWER(CONCAT('%', :contactNo, '%')))
		    AND (:status IS NULL OR :status = '' 
		         OR LOWER(sm.status) LIKE LOWER(CONCAT('%', :status, '%')))
		    AND (:createdBy IS NULL OR :createdBy = '' 
		         OR LOWER(sm.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		    """,
		    nativeQuery = true
		)
		List<SupplierMaster> getAllSupplierMaster(
		        @Param("supplierName") String supplierName,
		        @Param("address") String address,
		        @Param("contactNo") String contactNo,
		        @Param("status") String status,
		        @Param("createdBy") String createdBy
		);

}
