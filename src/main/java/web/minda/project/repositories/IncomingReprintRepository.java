package web.minda.project.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.IncomingMaterial;

public interface IncomingReprintRepository extends JpaRepository<IncomingMaterial, Long> {

	@Query("""
		    SELECT DISTINCT inc FROM IncomingMaterial inc
		    LEFT JOIN inc.storeIncomingQuality q
		    WHERE (:partName IS NULL OR LOWER(inc.partName) LIKE LOWER(CONCAT('%', :partName, '%')))
		    AND (:lotNumber IS NULL OR LOWER(inc.lotNumber) LIKE LOWER(CONCAT('%', :lotNumber, '%')))
		    AND (:supplierName IS NULL OR LOWER(inc.supplier) LIKE LOWER(CONCAT('%', :supplierName, '%')))
		    AND (:partType IS NULL OR LOWER(COALESCE(q.part_type, '')) LIKE LOWER(CONCAT('%', :partType, '%')))
		    AND (:category IS NULL OR LOWER(COALESCE(inc.category.category, '')) LIKE LOWER(CONCAT('%', :category, '%')))
		    AND (inc.taggingStatus IS NULL OR inc.taggingStatus <> '1')
		    ORDER BY inc.incomingMaterialId DESC
		""")
		Page<IncomingMaterial> getIncomingReprint(
		        @Param("partName") String partName,
		        @Param("supplierName") String supplierName,
		        @Param("partType") String partType,
		        @Param("lotNumber") String lotNumber,
		        @Param("category") String category,
		        Pageable pageable
		);
	
	
	
	@Query("""
			SELECT COUNT(i)
			FROM IncomingMaterial i
			WHERE i.partName=:partName
			AND i.lotNumber=:lotNumber
			AND i.mfgDate=:mfgDate
			AND i.expireDate=:expireDate
			""")
			long countByPartNameAndLotNumberAndMfgDateAndExpireDate(
			        String partName,
			        String lotNumber,
			        String mfgDate,
			        String expireDate
			);

}
