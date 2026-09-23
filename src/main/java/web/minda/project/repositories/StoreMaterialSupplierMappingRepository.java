package web.minda.project.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.PackingCustomerArticleMapping;
import web.minda.project.entity.StoreMaterialSupplierMapping;

public interface StoreMaterialSupplierMappingRepository extends JpaRepository<StoreMaterialSupplierMapping, Long> {

//	boolean existsByStoreMaterial_MaterialAndSupplier_SupplierNameAndStoreMaterialSupplierMappingIdIdNot(String material, String supplierName, Long storeMaterialSupplierMappingId);
	
	
	boolean existsByStoreMaterial_MaterialIgnoreCaseAndSupplier_SupplierName(
	        String material,
	        String supplierName	
	);
	
	
	boolean existsByStoreMaterial_MaterialIgnoreCaseAndSupplier_SupplierNameIgnoreCaseAndStoreMaterialSupplierMappingIdNot(
	        String material,
	        String supplierName,
	        Long storeMaterialSupplierMappingId
	);
	
//	@Query(value = """
//			SELECT pcam.* FROM store_material_supplier_mapping pcam
//			LEFT JOIN store_material_master smm ON smm.id = pcam.store_material_id
//			LEFT JOIN supplier_master sm ON sm.id = pcam.supplier_id
//			WHERE (:material IS NULL OR :material = '' OR LOWER(smm.material) LIKE LOWER(CONCAT('%', :material, '%')))
//			AND (:supplier_name IS NULL OR :supplier_name = '' OR LOWER(sm.supplier_name) LIKE LOWER(CONCAT('%', :supplier_name, '%')))
//			AND (:createdBy IS NULL OR :createdBy = '' OR LOWER(pcam.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
//			""",
//
//			countQuery = """
//					SELECT COUNT(*) FROM Packing_customer_material_mapping pcam
//					LEFT JOIN Production_material_master smm ON smm.id = pcam.store_material_id
//					LEFT JOIN packing_customer_details sm ON sm.id = pcam.supplier_id
//					WHERE (:material IS NULL OR :material = '' OR LOWER(smm.material) LIKE LOWER(CONCAT('%', :material, '%')))
//					AND (:supplier_name IS NULL OR :supplier_name = '' OR LOWER(sm.supplier_name) LIKE LOWER(CONCAT('%', :supplier_name, '%')))
//					AND (:createdBy IS NULL OR :createdBy = '' OR LOWER(pcam.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
//					""",
//
//			nativeQuery = true)
//	Page<StoreMaterialSupplierMapping> getLikeStoreMaterialSupplierMapping(@Param("material") String material,
//			@Param("supplier_name") String supplier_name, @Param("createdBy") String createdBy, Pageable pageable);
	
	@Query(value = """
	        SELECT pcam.* FROM store_material_supplier_mapping pcam
	        LEFT JOIN store_material_master smm ON smm.id = pcam.store_material_id
	        LEFT JOIN supplier_master sm ON sm.id = pcam.supplier_id
	        WHERE (:material IS NULL OR :material = '' OR smm.material LIKE '%' + :material + '%')
	        AND (:supplier_name IS NULL OR :supplier_name = '' OR sm.supplier_name LIKE '%' + :supplier_name + '%')
	        AND (:createdBy IS NULL OR :createdBy = '' OR pcam.created_by LIKE '%' + :createdBy + '%')
	        """,

	        countQuery = """
	        SELECT COUNT(*) FROM store_material_supplier_mapping pcam
	        LEFT JOIN store_material_master smm ON smm.id = pcam.store_material_id
	        LEFT JOIN supplier_master sm ON sm.id = pcam.supplier_id
	        WHERE (:material IS NULL OR :material = '' OR smm.material LIKE '%' + :material + '%')
	        AND (:supplier_name IS NULL OR :supplier_name = '' OR sm.supplier_name LIKE '%' + :supplier_name + '%')
	        AND (:createdBy IS NULL OR :createdBy = '' OR pcam.created_by LIKE '%' + :createdBy + '%')
	        """,

	        nativeQuery = true)
	Page<StoreMaterialSupplierMapping> getLikeStoreMaterialSupplierMapping(
	        @Param("material") String material,
	        @Param("supplier_name") String supplier_name,
	        @Param("createdBy") String createdBy,
	        Pageable pageable);
	
	@Query(value = """
		    SELECT pcam.*
		    FROM store_material_supplier_mapping pcam
		    LEFT JOIN store_material_master smm ON smm.id = pcam.store_material_id
		    LEFT JOIN supplier_master sm ON sm.id = pcam.supplier_id
		    WHERE (:material IS NULL OR :material = '' 
		           OR LOWER(smm.material) LIKE LOWER(CONCAT('%', :material, '%')))
		    AND (:supplier_name IS NULL OR :supplier_name = '' 
		         OR LOWER(sm.supplier_name) LIKE LOWER(CONCAT('%', :supplier_name, '%')))
		    AND (:createdBy IS NULL OR :createdBy = '' 
		         OR LOWER(pcam.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		    """,
		    nativeQuery = true
		)
		List<StoreMaterialSupplierMapping> getAllStoreMaterialSupplierMappingMaster(
		        @Param("material") String material,
		        @Param("supplier_name") String supplier_name,
		        @Param("createdBy") String createdBy
		);
	
	
	List<StoreMaterialSupplierMapping> findBySupplier_SupplierId(Long supplierId);

	
	
}
