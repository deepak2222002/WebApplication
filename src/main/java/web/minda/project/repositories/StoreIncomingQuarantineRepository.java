package web.minda.project.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import web.minda.project.entity.IncomingMaterial;
import web.minda.project.entity.StoreIncomingQuarantine;

public interface StoreIncomingQuarantineRepository extends JpaRepository<StoreIncomingQuarantine, Long>{
	
    Optional<StoreIncomingQuarantine> findTopByInMaterialOrderByStoreIncomingQuarantineIdDesc(IncomingMaterial mat);

	Optional<StoreIncomingQuarantine> findByInMaterialAndQaStatus(IncomingMaterial mat, String qaCode);

	Optional<StoreIncomingQuarantine> findByQaBarcode(String qaBarcode);

	Optional<StoreIncomingQuarantine> findByLocation(String locationBarcode);

	@Modifying
	@Transactional
	@Query("UPDATE StoreIncomingQuarantine s SET s.location = :location, s.quarantineLabelPasteStatus = '1' WHERE s.qaBarcode = :barcode")
	void updateLocationAndStatus(@Param("barcode") String barcode,
	                             @Param("location") String location);
	
	@Modifying
	@Transactional
	@Query(value = """
			UPDATE store_incoming_quarantine SET quarantine_label_paste_status = 1 WHERE qa_barcode = :label
			""",nativeQuery = true)
	void updateQaLabelStatus(@Param("label") String label);

	Optional<StoreIncomingQuarantine> findByInMaterial_IncomingMaterialId(Long incomingId);
	
	
	
	   StoreIncomingQuarantine
       findTopByInMaterialIncomingMaterialIdOrderByStoreIncomingQuarantineIdDesc(
           Long incomingMaterialId);
}
