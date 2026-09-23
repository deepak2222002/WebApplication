package web.minda.project.repositories;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import web.minda.project.entity.IncomingMaterial;
import web.minda.project.entity.StoreIncomingQuality;

public interface StoreIncomingQualityRepository extends JpaRepository<StoreIncomingQuality, Long>{

	Optional<StoreIncomingQuality> findByQaBarcode(String qaBarcode);

	Optional<StoreIncomingQuality> findByInMaterial(IncomingMaterial mat);
	
	
	@Modifying
	@Transactional
	@Query(value = """
			UPDATE store_incoming_quality SET qa_label_paste_status = 1 WHERE qa_barcode = :label
			""",nativeQuery = true)
	void updateQaLabelStatus(@Param("label") String label);

	Optional<StoreIncomingQuality> findByInMaterial_IncomingMaterialId(Long incomingId);

}
