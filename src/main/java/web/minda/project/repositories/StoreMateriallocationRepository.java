package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.StoreMaterialLocation;

public interface StoreMateriallocationRepository extends JpaRepository<StoreMaterialLocation, Long>{

	Optional<StoreMaterialLocation> findByLocationBarcode(String locationBarcode);

	List<StoreMaterialLocation> findByCategory(String category);
	
	@Query("""
			SELECT s.locationBarcode FROM StoreMaterialLocation s
			WHERE s.locationBarcode LIKE :prefix%
			AND (s.materialBarcode IS NULL OR s.materialBarcode = '')
			ORDER BY s.locationBarcode ASC
			""")
			List<String> findAvailableLocations(@Param("prefix") String prefix);
	
	
	@Query("""
		    SELECT r.rackCode FROM RackMaster r
		    WHERE r.rackCode LIKE :prefix%
		    AND r.rackCode NOT IN (
		        SELECT s.locationBarcode FROM StoreMaterialLocation s
		        WHERE s.materialBarcode IS NOT NULL AND s.materialBarcode <> ''
		    )
		    ORDER BY r.rackCode ASC
		""")
		List<String> findAvailableRackLocations(@Param("prefix") String prefix);

	Optional<StoreMaterialLocation> findTopByMaterialBarcodeOrderByStoreMaterialLocationIdDesc(String valueOf);

	List<StoreMaterialLocation> findAllByLocationBarcode(String locationBarcode);

}
