package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.dto.QaLogDTO;
import web.minda.project.entity.IncomingMaterial;
import web.minda.project.entity.Qualityincoming;
import web.minda.project.entity.StoreIncomingQuality;

public interface QualityIncomingRepository extends JpaRepository<Qualityincoming, Long>{

	Qualityincoming findByInMaterial(IncomingMaterial inc);

	List<Qualityincoming> findByInMaterialOrderByQualityIncomingIdDesc(IncomingMaterial incoming);

	List<Qualityincoming> findByInMaterialOrderByQualityIncomingId(IncomingMaterial incoming);

	@Query(
		    value = """
		        SELECT 
		               qil.id AS qualityIncomingId,   im.id AS incomingMaterialId,
		               qil.created_by AS createdBy,
		               qil.date_time_creation AS dateTimeCreation,
		               qil.date_time_modified AS dateTimeModified,
		               qil.qa_status AS qaStatus,
		               qil.remark AS remark,
		               qil.status AS status,
		               im.part_name AS partName,
		               im.boxe_no AS boxNo,
		               im.lot_name AS lotName,
		               im.quantity AS quantity,
		               im.lot_name AS lotNumber,
		               im.supplier AS supplier,
		               im.mfg_date AS mfgDate,
		               im.expire_date AS expireDate
		        FROM (
		            SELECT 
		                   qil.*,
		                   ROW_NUMBER() OVER (
		                       PARTITION BY im.lot_name 
		                       ORDER BY qil.id DESC
		                   ) AS rn
		            FROM quality_incoming_log qil
		            LEFT JOIN incoming_material im 
		                ON qil.in_material = im.id
		        ) qil
		        LEFT JOIN incoming_material im 
		            ON qil.in_material = im.id
		        WHERE qil.rn = 1
		    """,

		    countQuery = """
		        SELECT COUNT(*)
		        FROM (
		            SELECT 
		                ROW_NUMBER() OVER (
		                    PARTITION BY im.lot_name 
		                    ORDER BY qil.id DESC
		                ) AS rn
		            FROM quality_incoming_log qil
		            LEFT JOIN incoming_material im 
		                ON qil.in_material = im.id
		        ) t
		        WHERE rn = 1
		    """,

		    nativeQuery = true
		)
	Page<QaLogDTO> getQaLogReport(Pageable pageable);
	
	
	
	@Query(value = """
		    SELECT 
		           qil.id AS qualityIncomingId,
		           qil.created_by AS createdBy,
		           qil.date_time_creation AS dateTimeCreation,
		           qil.qa_status AS qaStatus,
		           qil.remark AS remark,
		           qil.status AS status,
		           qil.operation AS operation
		    FROM quality_incoming_log qil
		    WHERE qil.in_material = :incomingMaterialId
		    ORDER BY qil.id DESC
		""", nativeQuery = true)
		List<QaLogDTO> getQaLogsByMaterial(@Param("incomingMaterialId") String incomingMaterialId);

	Optional<StoreIncomingQuality> findByInMaterial_IncomingMaterialId(Long incomingId);


}
