package web.minda.project.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.IncomingMaterial;
import web.minda.project.entity.StoreIncomingQuality;

public interface QuarantineReprintRepository extends JpaRepository<IncomingMaterial, Long>  {

	@Query("""
		    SELECT DISTINCT i FROM IncomingMaterial i
		    LEFT JOIN i.storeIncomingQuarantine qt
		    WHERE i.qa = 'RERELEASED'
		    AND (:partName IS NULL OR LOWER(i.partName) LIKE LOWER(CONCAT('%', :partName, '%')))
		    AND (:lotNumber IS NULL OR LOWER(i.lotNumber) LIKE LOWER(CONCAT('%', :lotNumber, '%')))
		    AND (:supplierName IS NULL OR LOWER(i.supplier) LIKE LOWER(CONCAT('%', :supplierName, '%')))
		    AND (:partType IS NULL OR LOWER(COALESCE(qt.part_type, '')) LIKE LOWER(CONCAT('%', :partType, '%')))
		    AND (:category IS NULL OR LOWER(i.category.category) LIKE LOWER(CONCAT('%', :category, '%')))
		""")
		Page<IncomingMaterial> getQuarantineReprint(
		        @Param("partName") String partName,
		        @Param("supplierName") String supplierName,
		        @Param("partType") String partType,
		        @Param("lotNumber") String lotNumber,
		        @Param("category") String category,
		        Pageable pageable
		);
	
	
	@Query("""
		    SELECT DISTINCT i FROM IncomingMaterial i
		    LEFT JOIN i.storeIncomingQuality q
		    WHERE i.qa = 'RELEASED'
		    AND (:partName IS NULL OR LOWER(i.partName) LIKE LOWER(CONCAT('%', :partName, '%')))
		    AND (:lotNumber IS NULL OR LOWER(i.lotNumber) LIKE LOWER(CONCAT('%', :lotNumber, '%')))
		    AND (:supplierName IS NULL OR LOWER(i.supplier) LIKE LOWER(CONCAT('%', :supplierName, '%')))
		    AND (:partType IS NULL OR LOWER(COALESCE(q.part_type, '')) LIKE LOWER(CONCAT('%', :partType, '%')))
		    AND (:category IS NULL OR LOWER(i.category.category) LIKE LOWER(CONCAT('%', :category, '%')))
		""")
		Page<IncomingMaterial> getQualityReprint(
		        @Param("partName") String partName,
		        @Param("supplierName") String supplierName,
		        @Param("partType") String partType,
		        @Param("lotNumber") String lotNumber,
		        @Param("category") String category,
		        Pageable pageable
		);


	Optional<StoreIncomingQuality> findByIncomingMaterialId(long long1);


}
