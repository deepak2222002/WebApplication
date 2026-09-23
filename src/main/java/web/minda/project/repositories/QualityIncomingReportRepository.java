package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.dto.MovingReportDTO;
import web.minda.project.dto.QaLogDTO;
import web.minda.project.entity.IncomingMaterial;
import web.minda.project.entity.Qualityincoming;

public interface QualityIncomingReportRepository extends JpaRepository<Qualityincoming, Long> {

	Qualityincoming findByInMaterial(IncomingMaterial inc);

	List<Qualityincoming> findByInMaterialOrderByQualityIncomingIdDesc(IncomingMaterial incoming);

	List<Qualityincoming> findByInMaterialOrderByQualityIncomingId(IncomingMaterial incoming);

//	@Query(value = """
//			    SELECT
//			           qil.id AS qualityIncomingId,
//			           qil.created_by AS createdBy,
//			           qil.date_time_creation AS dateTimeCreation,
//			           qil.date_time_modified AS dateTimeModified,
//			           qil.qa_status AS qaStatus,
//			           qil.remark AS remark,
//			           qil.status AS status,
//			           im.part_name AS partName,
//			           im.box_no AS boxNo,
//			           im.lot_name AS lotName,
//			           im.quantity AS quantity,
//			           im.lot_name AS lotNumber,
//			           im.supplier AS supplier,
//			           im.mfg_date AS mfgDate,
//			           im.expire_date AS expireDate
//			    FROM (
//			        SELECT
//			               qil.*,
//			               ROW_NUMBER() OVER (
//			                   PARTITION BY im.lot_name
//			                   ORDER BY qil.id DESC
//			               ) AS rn
//			        FROM quality_incoming_log qil
//			        LEFT JOIN store_incoming_material im
//			            ON qil.in_material = im.id
//			    ) qil
//			    LEFT JOIN store_incoming_material im
//			        ON qil.in_material = im.id
//			    WHERE qil.rn = 1
//			""",
//
//			countQuery = """
//					    SELECT COUNT(*)
//					    FROM (
//					        SELECT
//					            ROW_NUMBER() OVER (
//					                PARTITION BY im.lot_name
//					                ORDER BY qil.id DESC
//					            ) AS rn
//					        FROM quality_incoming_log qil
//					        LEFT JOIN store_incoming_material im
//					            ON qil.in_material = im.id
//					    ) t
//					    WHERE rn = 1
//					""",
//
//			nativeQuery = true)
//	Page<QaLogDTO> getQaLogReport(Pageable pageable);
	
	@Query(value = """
		   	    SELECT *
		    FROM (
		        SELECT
		            qil.id AS qualityIncomingId,
		            qil.in_material AS inMaterial,
		            qil.created_by AS createdBy,
		            qil.date_time_creation AS dateTimeCreation,
		            qil.date_time_modified AS dateTimeModified,
		            qil.qa_status AS qaStatus,
		            qil.remark AS remark,
		            qil.status AS status,

		            im.part_name AS partName,
		            im.box_no AS boxNo,
		            im.lot_name AS lotName,
		            im.quantity AS quantity,
		            im.lot_name AS lotNumber,
		            im.supplier AS supplier,
		            im.mfg_date AS mfgDate,
		            im.expire_date AS expireDate,
					smm.description AS description,
					smm.uom AS uom,
					smcm.category AS category,

		            ROW_NUMBER() OVER (
		                PARTITION BY im.lot_name
		                ORDER BY qil.id DESC
		            ) AS rn

		        FROM quality_incoming_log qil
		        LEFT JOIN store_incoming_material im
		            ON qil.in_material = im.id left join store_material_master smm on smm.material = im.part_name left join store_material_category_master
					smcm on smcm.id=smm.category_id
		    ) t
		    WHERE t.rn = 1
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
		        LEFT JOIN store_incoming_material im
		            ON qil.in_material = im.id
		    ) t
		    WHERE rn = 1
		""",

		nativeQuery = true)
		Page<QaLogDTO> getQaLogReport(Pageable pageable);
	
	
//	@Query(value = """
//		    SELECT *
//		    FROM (
//		        SELECT
//		            qil.id AS qualityIncomingId,
//		            qil.in_material AS inMaterial,
//		            qil.created_by AS createdBy,
//		            qil.date_time_creation AS dateTimeCreation,
//		            qil.date_time_modified AS dateTimeModified,
//		            qil.qa_status AS qaStatus,
//		            qil.remark AS remark,
//		            qil.status AS status,
//
//		            im.part_name AS partName,
//		            im.box_no AS boxNo,
//		            im.lot_name AS lotName,
//		            im.quantity AS quantity,
//		            im.lot_name AS lotNumber,
//		            im.supplier AS supplier,
//		            im.mfg_date AS mfgDate,
//		            im.expire_date AS expireDate,
//		            
//		            smm.description AS description,
//		            smm.uom AS uom,
//		            smcm.category AS category,
//
//		            ROW_NUMBER() OVER (
//		                PARTITION BY im.lot_name
//		                ORDER BY qil.id DESC
//		            ) AS rn
//
//		        FROM quality_incoming_log qil
//		        LEFT JOIN store_incoming_material im 
//		            ON qil.in_material = im.id 
//		        LEFT JOIN store_material_master smm 
//		            ON smm.material = im.part_name 
//		        LEFT JOIN store_material_category_master smcm 
//		            ON smcm.id = smm.category_id
//		    ) t
//		    WHERE t.rn = 1
//		    AND (:partName IS NULL OR :partName = '' OR t.partName LIKE CONCAT('%', :partName, '%'))
//		    AND (:qaStatus IS NULL OR :qaStatus = '' OR t.qaStatus = :qaStatus)
//		    AND (:startDate IS NULL OR :startDate = '' OR DATE(t.dateTimeCreation) >= DATE(:startDate))
//		    AND (:endDate IS NULL OR :endDate = '' OR DATE(t.dateTimeCreation) <= DATE(:endDate))
//		    AND (:supplier IS NULL OR :supplier = '' OR t.supplier LIKE CONCAT('%', :supplier, '%'))
//		    AND (:lotNumber IS NULL OR :lotNumber = '' OR t.lotNumber LIKE CONCAT('%', :lotNumber, '%'))
//		    AND (:status IS NULL OR :status = '' OR t.status = :status)
//		""",
//
//		countQuery = """
//		    SELECT COUNT(*)
//		    FROM (
//		        SELECT
//		            im.part_name AS partName,
//		            qil.qa_status AS qaStatus,
//		            qil.date_time_creation AS dateTimeCreation,
//		            im.supplier AS supplier,
//		            im.lot_name AS lotNumber,
//		            qil.status AS status,
//		            ROW_NUMBER() OVER (
//		                PARTITION BY im.lot_name
//		                ORDER BY qil.id DESC
//		            ) AS rn
//		        FROM quality_incoming_log qil
//		        LEFT JOIN store_incoming_material im
//		            ON qil.in_material = im.id
//		    ) t
//		    WHERE t.rn = 1
//		    AND (:partName IS NULL OR :partName = '' OR t.partName LIKE CONCAT('%', :partName, '%'))
//		    AND (:qaStatus IS NULL OR :qaStatus = '' OR t.qaStatus = :qaStatus)
//		    AND (:startDate IS NULL OR :startDate = '' OR DATE(t.dateTimeCreation) >= DATE(:startDate))
//		    AND (:endDate IS NULL OR :endDate = '' OR DATE(t.dateTimeCreation) <= DATE(:endDate))
//		    AND (:supplier IS NULL OR :supplier = '' OR t.supplier LIKE CONCAT('%', :supplier, '%'))
//		    AND (:lotNumber IS NULL OR :lotNumber = '' OR t.lotNumber LIKE CONCAT('%', :lotNumber, '%'))
//		    AND (:status IS NULL OR :status = '' OR t.status = :status)
//		""",
//
//		nativeQuery = true)
//		Page<QaLogDTO> getQaLogReport(
//		    @Param("partName") String partName,
//		    @Param("qaStatus") String qaStatus,
//		    @Param("startDate") String startDate,
//		    @Param("endDate") String endDate,
//		    @Param("supplier") String supplier,
//		    @Param("lotNumber") String lotNumber,
//		    @Param("status") String status,
//		    Pageable pageable
//		);
	@Query(value = "SELECT qal.* FROM quality_incoming_log AS qal WHERE (:material IS NULL OR :material = '' OR qal.in_material = :material )",

			nativeQuery = true)
	List<Qualityincoming> getAllListOfQualityLog(@Param("material") String material);

}
