package web.minda.project.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.dto.ExpiryReportsDTO;
import web.minda.project.dto.IncomingReportsDTO;
import web.minda.project.dto.MovingReportDTO;
import web.minda.project.dto.StoreLiveStockReportDTO;
import web.minda.project.entity.IncomingMaterial;
import web.minda.project.entity.Qualityincoming;
import web.minda.project.entity.StoreIncomingQuality;
import web.minda.project.entity.StoreIncomingQuarantine;

public interface IncomingMaterialRepository extends JpaRepository<IncomingMaterial, Long> {

	//Optional<IncomingMaterial> findByQaBarcode(String qaBarcode);

	List<IncomingMaterial> findByPartNameAndLotNumber(String partName, String lotNumber);
	
	List<IncomingMaterial> findByPartNameAndLotNumberAndMfgDateAndExpireDate(String partName, String lotNumber, String mfgDate, String expireDate);
	
	@Query(
			  value = "SELECT COUNT(*) " +
			          "FROM store_incoming_material i " +
			          "WHERE i.qa = 'PENDING' " +
			          "AND i.date_time_modified <= :timeLimit",
			  nativeQuery = true
			)
			long countPendingOlderThan(@Param("timeLimit") String timeLimit);
	
	
	@Query(
			  value = "SELECT * " +
			          "FROM store_incoming_material i " +
			          "WHERE i.qa = 'PENDING' " +
			          "AND CONVERT(datetime, i.date_time_modified, 120) <= CONVERT(datetime, :timeLimit, 120)",
			  nativeQuery = true
			)
			List<IncomingMaterial> findPendingOlderThan(@Param("timeLimit") String timeLimit);
	
	
	@Query("""
			SELECT COUNT(i)
			FROM IncomingMaterial i
			WHERE i.partName=:partName
			AND i.lotNumber=:lotNumber
			AND i.mfgDate=:mfgDate
			AND i.expireDate=:expireDate
			""")
			Long countBoxes(
			        String partName,
			        String lotNumber,
			        String mfgDate,
			        String expireDate
			);

//	@Query("SELECT inc FROM IncomingMaterial inc WHERE " +
//		       "(inc.qa IN ('REJECTED','EXPIRED','SCRAPPED','RERELEASED','SENT BACK')) " +
//		       "AND (:partName IS NULL OR LOWER(inc.partName) LIKE LOWER(CONCAT('%', :partName, '%'))) " +
//		       "AND (:lotNumber IS NULL OR LOWER(inc.lotNumber) LIKE LOWER(CONCAT('%', :lotNumber, '%'))) " +
//		       "AND (:supplierName IS NULL OR LOWER(inc.supplier) LIKE LOWER(CONCAT('%', :supplierName, '%'))) " +
//		       "AND (:partType IS NULL OR LOWER(inc.part_type) LIKE LOWER(CONCAT('%', :partType, '%'))) " +
//		       "ORDER BY inc.incomingMaterialId DESC")
//		Page<IncomingMaterial> findFilteredData(
//		        String partName,
//		        String lotNumber,
//		        String supplierName,
//		        String partType,
//		        Pageable pageable);
	
	
	
	 @Query("SELECT i FROM IncomingMaterial i " +
	           "WHERE (UPPER(i.qa) = 'RELEASED' OR UPPER(i.qa) = 'RERELEASED') " +
	           "AND (i.taggingStatus IS NULL OR i.taggingStatus <> '1') " +
	           "ORDER BY i.incomingMaterialId DESC")
	    List<IncomingMaterial> findPendingPutaway();

	

	 
//	 @Query("SELECT inc FROM IncomingMaterial inc WHERE "
//		        + "(inc.qa IN ('REJECTED','EXPIRED','SCRAPPED','RERELEASED','SENT BACK')) "
//		        + "AND (:partName IS NULL OR LOWER(inc.partName) LIKE LOWER(CONCAT('%', :partName, '%'))) "
//		        + "AND (:lotNumber IS NULL OR LOWER(inc.lotNumber) LIKE LOWER(CONCAT('%', :lotNumber, '%'))) "
//		        + "AND (:supplierName IS NULL OR LOWER(inc.supplier) LIKE LOWER(CONCAT('%', :supplierName, '%'))) "
//		        + "AND (:partType IS NULL OR LOWER(COALESCE(inc.part_type, '')) LIKE LOWER(CONCAT('%', :partType, '%'))) "
//		        + "AND (:category IS NULL OR LOWER(COALESCE(inc.category.category, '')) LIKE LOWER(CONCAT('%', :category, '%'))) "
//		        + "AND (:status IS NULL OR inc.status = :status) "   // ✅ ADD THIS
//		        + "AND (inc.taggingStatus IS NULL OR inc.taggingStatus <> '1') "
//		        + "ORDER BY inc.id DESC")
//		Page<IncomingMaterial> findFilteredData(
//		        String partName,
//		        String lotNumber,
//		        String supplierName,
//		        String partType,
//		        String category,
//		        Integer status,   
//		        Pageable pageable);            AND (inc.taggingStatus IS NULL OR inc.taggingStatus <> '1')
	 
	 
	 
	 
//	 @Query("""
//    SELECT q FROM StoreIncomingQuality q
//    JOIN q.inMaterial inc
//    WHERE (:partName IS NULL OR LOWER(inc.partName) LIKE LOWER(CONCAT('%', :partName, '%')))
//    AND (:lotNumber IS NULL OR LOWER(inc.lotNumber) LIKE LOWER(CONCAT('%', :lotNumber, '%')))
//    AND (:supplierName IS NULL OR LOWER(inc.supplier) LIKE LOWER(CONCAT('%', :supplierName, '%')))
//    AND (:partType IS NULL OR LOWER(COALESCE(q.part_type, '')) LIKE LOWER(CONCAT('%', :partType, '%')))
//    AND (:category IS NULL OR LOWER(COALESCE(inc.category.category, '')) LIKE LOWER(CONCAT('%', :category, '%')))
//    AND (:status IS NULL OR q.qaStatus = :status)
//    AND (q.qaStatus IN ('0','1'))
//
//    AND (q.qaLabelPasteStatus IS NULL OR q.qaLabelPasteStatus <> '1')
//    AND (inc.taggingStatus IS NULL OR inc.taggingStatus <> '1')
//
//    ORDER BY q.dateTimeCreation DESC
//			""")
//			Page<StoreIncomingQuality> findQualityData(
//			        String partName,
//			        String lotNumber,
//			        String supplierName,
//			        String partType,
//			        String category,
//			        String status,
//			        Pageable pageable
//			);
//	 
	 @Query("""
			    SELECT q FROM StoreIncomingQuality q
			    JOIN q.inMaterial inc
			    WHERE (:partName IS NULL OR LOWER(inc.partName) LIKE LOWER(CONCAT('%', :partName, '%')))
			    AND (:lotNumber IS NULL OR LOWER(inc.lotNumber) LIKE LOWER(CONCAT('%', :lotNumber, '%')))
			    AND (:supplierName IS NULL OR LOWER(inc.supplier) LIKE LOWER(CONCAT('%', :supplierName, '%')))
			    AND (:partType IS NULL OR LOWER(COALESCE(q.part_type, '')) LIKE LOWER(CONCAT('%', :partType, '%')))
			    AND (:category IS NULL OR LOWER(COALESCE(inc.category.category, '')) LIKE LOWER(CONCAT('%', :category, '%')))
			    AND (:status IS NULL OR q.qaStatus = :status)
			    AND (q.qaStatus IN ('0','1'))
			    AND (q.qaLabelPasteStatus IS NULL OR q.qaLabelPasteStatus <> '1')
			  
			    
			    ORDER BY q.dateTimeCreation DESC
			""")
			Page<StoreIncomingQuality> findQualityData(
			        String partName,
			        String lotNumber,
			        String supplierName,
			        String partType,
			        String category,
			        String status,  
			        Pageable pageable
			);

//	
	 @Query("""
			    SELECT DISTINCT inc FROM IncomingMaterial inc
			    LEFT JOIN StoreIncomingQuality q 
			        ON q.inMaterial = inc
			    LEFT JOIN StoreIncomingQuarantine qu 
			        ON qu.inMaterial = inc
			    LEFT JOIN StoreMaterialLocation loc 
			           ON loc.materialBarcode = CAST(inc.incomingMaterialId AS string)
			    LEFT JOIN inc.category cat
			    WHERE (:partName IS NULL OR LOWER(inc.partName) LIKE LOWER(CONCAT('%', :partName, '%')))
			    AND (:lotNumber IS NULL OR LOWER(inc.lotNumber) LIKE LOWER(CONCAT('%', :lotNumber, '%')))
			    AND (:supplierName IS NULL OR LOWER(inc.supplier) LIKE LOWER(CONCAT('%', :supplierName, '%')))
			    AND (:partType IS NULL OR LOWER(COALESCE(q.part_type, '')) LIKE LOWER(CONCAT('%', :partType, '%')))
			    AND (:category IS NULL OR LOWER(COALESCE(cat.category, '')) LIKE LOWER(CONCAT('%', :category, '%')))
			    AND (:status IS NULL OR q.qaStatus = :status OR qu.qaStatus = :status)
			    ORDER BY inc.dateTimeCreation DESC
			""")
			Page<IncomingMaterial> findFilteredDataIncoming(
			        String partName,
			        String lotNumber,
			        String supplierName,
			        String partType,
			        String category,
			        String status,
			        Pageable pageable
			);
	 
	 
	 @Query("""
			    SELECT DISTINCT inc FROM IncomingMaterial inc
			    JOIN StoreMaterialLocation loc 
			        ON loc.materialBarcode = CAST(inc.incomingMaterialId AS string)

			    LEFT JOIN StoreIncomingQuality q 
			        ON q.inMaterial = inc
			    LEFT JOIN StoreIncomingQuarantine qu 
			        ON qu.inMaterial = inc
			    LEFT JOIN inc.category cat

			    WHERE (:partName IS NULL OR LOWER(inc.partName) LIKE LOWER(CONCAT('%', :partName, '%')))
			    AND (:lotNumber IS NULL OR LOWER(inc.lotNumber) LIKE LOWER(CONCAT('%', :lotNumber, '%')))
			    AND (:supplierName IS NULL OR LOWER(inc.supplier) LIKE LOWER(CONCAT('%', :supplierName, '%')))
			    AND (:partType IS NULL OR LOWER(COALESCE(q.part_type, '')) LIKE LOWER(CONCAT('%', :partType, '%')))
			    AND (:category IS NULL OR LOWER(COALESCE(cat.category, '')) LIKE LOWER(CONCAT('%', :category, '%')))
			    AND (:status IS NULL OR q.qaStatus = :status OR qu.qaStatus = :status)

			    AND (:location IS NULL OR LOWER(loc.locationBarcode) LIKE LOWER(CONCAT('%', :location, '%'))) 

			    ORDER BY inc.dateTimeCreation DESC
			""")
			Page<IncomingMaterial> findMainStoreData(
			        String partName,
			        String lotNumber,
			        String supplierName,
			        String partType,
			        String category,
			        String status,
			        String location,   // ✅ NEW
			        Pageable pageable
			);
	 
	 
	 
//	 
//	 @Query(value = """
//			    SELECT 
//			        inc.id AS incomingMaterialId,
//			        inc.part_name AS partName,
//			        inc.lot_name AS lotNumber,
//			        inc.quantity,
//			        inc.mfg_date AS mfgDate,
//			        inc.expire_date AS expireDate,
//			        inc.qa,
//			        inc.qa_status AS qaStatus,
//			        inc.supplier AS supplierName,
//			        inc.date_time_modified AS dateTime,
//			        inc.created_by AS createdBy,
//			        cat.category AS category,
//
//			        q.part_type AS partType,
//			        q.qa_doc_path AS qaDocPath,
//			        q.remark,
//			        q.qa_label_paste_status AS qaLabelPasteStatus,
//
//			        qu.quarantine_remark AS quarentineRemark,
//			        qu.quarantine_document AS quarantineDocPath,
//			        qu.quarantine_label_paste_status AS quarantineLabelPasteStatus,
//			        qu.location,
//
//			        loc.location_name AS storeLocation
//
//			    FROM store_incoming_material inc
//
//			    LEFT JOIN store_material_category_master cat 
//			        ON inc.category_id = cat.id
//
//			    LEFT JOIN store_incoming_quality q 
//			        ON q.in_material = inc.id
//
//			    LEFT JOIN store_incoming_quarantine qu 
//			        ON qu.in_material = inc.id
//
//			    LEFT JOIN store_material_location loc 
//			        ON loc.material_barcode = inc.id
//
//			    WHERE (:partName IS NULL OR LOWER(inc.part_name) LIKE LOWER(CONCAT('%', :partName, '%')))
//			    AND (:lotNumber IS NULL OR LOWER(inc.lot_name) LIKE LOWER(CONCAT('%', :lotNumber, '%')))
//			    AND (:supplierName IS NULL OR LOWER(inc.supplier) LIKE LOWER(CONCAT('%', :supplierName, '%')))
//			    AND (:category IS NULL OR LOWER(cat.category) LIKE LOWER(CONCAT('%', :category, '%')))
//			    AND (:status IS NULL OR q.qa_status = :status OR qu.qa_status = :status)
//
//			    ORDER BY inc.date_time_creation DESC
//			""",
//			countQuery = """
//			    SELECT COUNT(*) 
//			    FROM store_incoming_material inc
//			    LEFT JOIN store_material_category_master cat 
//			        ON inc.category_id = cat.id
//			    LEFT JOIN store_incoming_quality q 
//			        ON q.in_material = inc.id
//			    LEFT JOIN store_incoming_quarantine qu 
//			        ON qu.in_material = inc.id
//			    WHERE (:partName IS NULL OR LOWER(inc.part_name) LIKE LOWER(CONCAT('%', :partName, '%')))
//			    AND (:lotNumber IS NULL OR LOWER(inc.lot_name) LIKE LOWER(CONCAT('%', :lotNumber, '%')))
//			    AND (:supplierName IS NULL OR LOWER(inc.supplier) LIKE LOWER(CONCAT('%', :supplierName, '%')))
//			    AND (:category IS NULL OR LOWER(cat.category) LIKE LOWER(CONCAT('%', :category, '%')))
//			    AND (:status IS NULL OR q.qa_status = :status OR qu.qa_status = :status)
//			""",
//			nativeQuery = true)
//			Page<Object[]> findAllNative(
//			        String partName,
//			        String lotNumber,
//			        String supplierName,
//			        String category,
//			        String status,
//			        Pageable pageable
//			);
//	 
//	 
	 
	 
	 
	 
	 @Query("""
			    SELECT qt FROM StoreIncomingQuarantine qt
			    JOIN qt.inMaterial inc
			    WHERE (:partName IS NULL OR LOWER(inc.partName) LIKE LOWER(CONCAT('%', :partName, '%')))
			    AND (:lotNumber IS NULL OR LOWER(inc.lotNumber) LIKE LOWER(CONCAT('%', :lotNumber, '%')))
			    AND (:supplierName IS NULL OR LOWER(inc.supplier) LIKE LOWER(CONCAT('%', :supplierName, '%')))
			    AND (:partType IS NULL OR LOWER(COALESCE(qt.part_type, '')) LIKE LOWER(CONCAT('%', :partType, '%')))
			    AND (:category IS NULL OR LOWER(COALESCE(inc.category.category, '')) LIKE LOWER(CONCAT('%', :category, '%')))
			    AND (:status IS NULL OR qt.qaStatus = :status)
			    ORDER BY qt.dateTimeCreation DESC
			""")
			Page<StoreIncomingQuarantine> findQuarantineData(
			        String partName,
			        String lotNumber,
			        String supplierName,
			        String partType,
			        String category,
			        String status,
			        Pageable pageable);

	Long countByPartNameAndLotNumberAndMfgDateAndExpireDate(String partName, String lotNumber, String mfgDate,
			String expireDate);

	Optional<IncomingMaterial> findByPartName(String partName);



//	@Query(value = """
//
//						SELECT
//			im.part_name AS partName,
//			rm.rack_code AS storeLocation,
//			lm.location_name AS locationName,
//			im.quantity AS quantity,
//			im.supplier AS suppierName,
//			im.lot_name AS lotNumber,
//			im.mfg_date AS mfgDate,
//			im.expire_date AS expiryDate,
//			im.barcode AS barcode,
//			im.date_time_creation AS dateTime,
//			sm.description AS description,
//			im.created_by AS createdBy,
//			im.quantity AS totalQty,
//			sl.status AS liveStatus,
//
//						    CASE
//						        WHEN TRY_CAST(im.expire_date AS DATETIME) IS NULL THEN 'VALID'
//						        WHEN TRY_CAST(im.expire_date AS DATETIME) < GETDATE() THEN 'EXPIRED'
//						        ELSE 'VALID'
//						    END AS expiredStatus
//
//			FROM rack_master rm
//
//			LEFT JOIN location_master lm
//			ON lm.id = rm.location_id
//
//			LEFT JOIN store_material_location sl
//			ON rm.rack_code = sl.location_barcode
//
//			LEFT JOIN incoming_material im
//			ON im.id = sl.material_barcode
//
//						AND (
//						    (:startDate IS NULL AND :endDate IS NULL)
//						    OR TRY_CAST(im.date_time_creation AS DATETIME)
//						       BETWEEN TRY_CAST(:startDate AS DATETIME)
//						           AND TRY_CAST(:endDate AS DATETIME)
//						)
//
//						LEFT JOIN store_material_master sm
//			ON sm.material = im.part_name
//							WHERE
//			(:partName IS NULL OR :partName = '' OR im.part_name LIKE '%' + :partName + '%')
//			AND (:rackCode IS NULL OR :rackCode = '' OR rm.rack_code LIKE '%' + :rackCode + '%')
//			AND (:lotNumber IS NULL OR :lotNumber = '' OR im.lot_name LIKE '%' + :lotNumber + '%')
//
//
//						""",
//
//			countQuery = """
//
//									SELECT COUNT(*)
//									FROM rack_master rm
//
//									LEFT JOIN location_master lm
//					ON lm.id = rm.location_id
//
//							LEFT JOIN store_material_location sl
//							    ON rm.rack_code = sl.location_barcode
//
//							LEFT JOIN incoming_material im
//							    ON im.id = sl.material_barcode
//
//
//									AND (
//									    (:startDate IS NULL AND :endDate IS NULL)
//									    OR TRY_CAST(im.date_time_creation AS DATETIME)
//									       BETWEEN TRY_CAST(:startDate AS DATETIME)
//									           AND TRY_CAST(:endDate AS DATETIME)
//									)
//
//							LEFT JOIN store_material_master sm
//							 ON sm.material = im.part_name
//							 					WHERE
//									(:partName IS NULL OR :partName = '' OR im.part_name LIKE '%' + :partName + '%')
//									AND (:rackCode IS NULL OR :rackCode = '' OR rm.rack_code LIKE '%' + :rackCode + '%')
//									AND (:lotNumber IS NULL OR :lotNumber = '' OR im.lot_name LIKE '%' + :lotNumber + '%')
//
//									""",
//
//			nativeQuery = true)
//	Page<StoreLiveStockReportDTO> getStoreLiveStockReports(@Param("partName") String partName,
//			@Param("rackCode") String rackCode, @Param("lotNumber") String lotNumber,
//			@Param("startDate") String startDate, @Param("endDate") String endDate, Pageable pageable);
//
//	@Query(value = """
//			SELECT
//			im.id As incomingMaterialId,
//			im.part_name AS partName,
//			im.quantity AS quantity,
//			im.supplier AS supplierName,
//			im.lot_name AS lotNumber,
//			im.mfg_date AS mfgDate,
//			im.expire_date AS expiryDate,
//			im.barcode AS barcode,
//			im.date_time_creation AS dateTime,
//			sm.description AS description,
//			im.created_by AS createdBy,
//			im.quantity AS totalQty,
//			smcm.category AS category,
//			im.qa_barcode AS qaBarcode,
//			im.boxe_no AS boxNo,
//			im.qa_status AS qaStatus
//			FROM incoming_material im
//			LEFT JOIN store_material_master sm
//			ON sm.material = im.part_name
//			LEFT JOIN store_material_category_master smcm
//			ON sm.category_id = smcm.id
//			WHERE
//			(:partName IS NULL OR :partName = '' OR im.part_name LIKE '%' + :partName + '%')
//			AND (:lotNumber IS NULL OR :lotNumber = '' OR im.lot_name LIKE '%' + :lotNumber + '%')
//			AND (:qaStatus IS NULL OR :qaStatus = '' OR im.qa_status LIKE '%' + :qaStatus + '%')
//			AND (:supplier IS NULL OR :supplier = '' OR im.supplier LIKE '%' + :supplier + '%')
//
//			AND (
//			(:startDate IS NULL AND :endDate IS NULL)
//			OR TRY_CAST(im.date_time_creation AS DATETIME)
//			BETWEEN TRY_CAST(:startDate AS DATETIME)
//			AND TRY_CAST(:endDate AS DATETIME)
//			) ORDER By im.id DESC
//			""",
//
//			countQuery = """
//					SELECT COUNT(*)
//					FROM incoming_material im
//					LEFT JOIN store_material_master sm
//					ON sm.material = im.part_name
//					LEFT JOIN store_material_category_master smcm
//					ON sm.category_id = smcm.id
//					WHERE
//					(:partName IS NULL OR :partName = '' OR im.part_name LIKE '%' + :partName + '%')
//					AND (:lotNumber IS NULL OR :lotNumber = '' OR im.lot_name LIKE '%' + :lotNumber + '%')
//					AND (:qaStatus IS NULL OR :qaStatus = '' OR im.qa_status LIKE '%' + :qaStatus + '%')
//					AND (:supplier IS NULL OR :supplier = '' OR im.supplier LIKE '%' + :supplier + '%')
//
//					AND (
//					(:startDate IS NULL AND :endDate IS NULL)
//					OR TRY_CAST(im.date_time_creation AS DATETIME)
//					BETWEEN TRY_CAST(:startDate AS DATETIME)
//					   AND TRY_CAST(:endDate AS DATETIME)
//					)
//					""", nativeQuery = true)
//	Page<IncomingReportsDTO> getIncomingReports(@Param("partName") String partName,
//			@Param("lotNumber") String lotNumber, @Param("qaStatus") String qaStatus,
//			@Param("supplier") String supplier, @Param("startDate") String startDate, @Param("endDate") String endDate,
//			Pageable pageable);
//
//	@Query(value = """
//			SELECT
//			im.id As incomingMaterialId,
//			im.part_name AS partName,
//			im.quantity AS quantity,
//			im.supplier AS supplierName,
//			im.lot_name AS lotNumber,
//			im.mfg_date AS mfgDate,
//			im.expire_date AS expiryDate,
//			im.barcode AS barcode,
//			im.date_time_creation AS dateTime,
//			sm.description AS description,
//			im.created_by AS createdBy,
//			im.quantity AS totalQty,
//			smcm.category AS category,
//			im.qa_barcode AS qaBarcode,
//			im.boxe_no AS boxNo
//			FROM incoming_material im
//			LEFT JOIN store_material_master sm
//			ON sm.material = im.part_name
//			LEFT JOIN store_material_category_master smcm
//			ON sm.category_id = smcm.id
//			WHERE
//			(:partName IS NULL OR :partName = '' OR im.part_name LIKE '%' + :partName + '%')
//
//			AND (:qaStatus IS NULL OR :qaStatus = '' OR im.qa_status LIKE '%' + :qaStatus + '%')
//
//			AND (
//			(:startDate IS NULL AND :endDate IS NULL)
//			OR TRY_CAST(im.date_time_creation AS DATETIME)
//			BETWEEN TRY_CAST(:startDate AS DATETIME)
//			AND TRY_CAST(:endDate AS DATETIME)
//			) ORDER By im.id DESC
//			""",
//
//			countQuery = """
//					SELECT COUNT(*)
//					FROM incoming_material im
//					LEFT JOIN store_material_master sm
//					ON sm.material = im.part_name
//					LEFT JOIN store_material_category_master smcm
//					ON sm.category_id = smcm.id
//					WHERE
//					(:partName IS NULL OR :partName = '' OR im.part_name LIKE '%' + :partName + '%')
//
//					AND (:qaStatus IS NULL OR :qaStatus = '' OR im.qa_status LIKE '%' + :qaStatus + '%')
//
//					AND (
//					(:startDate IS NULL AND :endDate IS NULL)
//					OR TRY_CAST(im.date_time_creation AS DATETIME)
//					BETWEEN TRY_CAST(:startDate AS DATETIME)
//					   AND TRY_CAST(:endDate AS DATETIME)
//					)
//					""", nativeQuery = true)
//	Page<IncomingReportsDTO> getReleaseMaterialPendingReports(@Param("partName") String partName,
//			@Param("qaStatus") String qaStatus, @Param("startDate") String startDate, @Param("endDate") String endDate,
//			Pageable pageable);
//
//
//	@Query(value = """
//
//			SELECT
//			im.part_name AS partName,
//			sl.location_barcode AS storeLocation,
//			sl.location_name AS locationName,
//			im.quantity AS quantity,
//			im.supplier AS supplierName,
//			im.lot_name AS lotNumber,
//			im.mfg_date AS mfgDate,
//			im.expire_date AS expiryDate,
//			im.barcode AS barcode,
//			im.date_time_creation AS dateTime,
//			sm.description AS description,
//			im.created_by AS createdBy,
//			im.quantity AS totalQty,
//			sl.status AS liveStatus,
//			smcm.category AS category,
//
//			CASE
//			WHEN TRY_CAST(im.expire_date AS DATETIME) IS NOT NULL
//			AND TRY_CAST(im.expire_date AS DATETIME) < FORMAT(GETDATE(), 'dd-MM-yyyy')
//			AND sl.material_barcode IS NULL
//			THEN 'EXPIRED (INCOMING)'
//
//			WHEN TRY_CAST(im.expire_date AS DATETIME) IS NOT NULL
//			AND TRY_CAST(im.expire_date AS DATETIME) < FORMAT(GETDATE(), 'dd-MM-yyyy')
//			AND sl.material_barcode IS NOT NULL
//			THEN 'EXPIRED (LOCATION)'
//
//			ELSE 'VALID'
//			END AS expiredStatus,
//
//			CASE
//			WHEN TRY_CAST(im.expire_date AS DATETIME) IS NOT NULL
//			AND TRY_CAST(im.expire_date AS DATETIME) < FORMAT(GETDATE(), 'dd-MM-yyyy')
//			THEN DATEDIFF(
//			DAY,
//			TRY_CAST(im.expire_date AS DATETIME),
//			GETDATE()
//			)
//			ELSE 0
//			END AS expiredDays
//
//			FROM incoming_material im
//
//			LEFT JOIN store_material_location sl
//			ON sl.material_barcode = im.id
//
//			LEFT JOIN store_material_master sm
//			ON sm.material = im.part_name
//
//			LEFT JOIN store_material_category_master smcm
//			ON sm.category_id = smcm.id
//
//			WHERE
//			(:partName IS NULL OR :partName = '' OR im.part_name LIKE '%' + :partName + '%')
//			AND (:lotNumber IS NULL OR :lotNumber = '' OR im.lot_name LIKE '%' + :lotNumber + '%')
//			AND (:supplier IS NULL OR :supplier = '' OR im.supplier LIKE '%' + :supplier + '%')
//
//			AND (
//			(:startDate IS NULL AND :endDate IS NULL)
//			OR TRY_CAST(im.date_time_creation AS DATETIME)
//			BETWEEN TRY_CAST(:startDate AS DATETIME)
//			AND TRY_CAST(:endDate AS DATETIME)
//			)
//
//			And TRY_CAST(im.expire_date AS DATETIME) < FORMAT(GETDATE(), 'dd-MM-yyyy')
//
//			""",
//
//			countQuery = """
//
//					SELECT COUNT(*)
//					FROM incoming_material im
//
//					LEFT JOIN store_material_location sl
//					    ON sl.material_barcode = im.id
//
//					LEFT JOIN store_material_master sm
//					    ON sm.material = im.part_name
//
//					LEFT JOIN store_material_category_master smcm
//					    ON sm.category_id = smcm.id
//
//					WHERE
//					(:partName IS NULL OR :partName = '' OR im.part_name LIKE '%' + :partName + '%')
//					AND (:lotNumber IS NULL OR :lotNumber = '' OR im.lot_name LIKE '%' + :lotNumber + '%')
//
//					AND (:supplier IS NULL OR :supplier = '' OR im.supplier LIKE '%' + :supplier + '%')
//
//					AND (
//					    (:startDate IS NULL AND :endDate IS NULL)
//					    OR TRY_CAST(im.date_time_creation AS DATETIME)
//					       BETWEEN TRY_CAST(:startDate AS DATETIME)
//					           AND TRY_CAST(:endDate AS DATETIME)
//					)
//
//					And TRY_CAST(im.expire_date AS DATETIME) < FORMAT(GETDATE(), 'dd-MM-yyyy')
//
//					""",
//
//			nativeQuery = true)
//	Page<ExpiryReportsDTO> getExpiryReports(@Param("partName") String partName, @Param("lotNumber") String lotNumber,
//			@Param("supplier") String supplier, @Param("startDate") String startDate, @Param("endDate") String endDate,
//			Pageable pageable);
//
//	@Query(value = """
//
//			SELECT
//			im.part_name AS partName,
//			sl.location_barcode AS storeLocation,
//			im.quantity AS quantity,
//			im.supplier AS supplierName,
//			im.lot_name AS lotNumber,
//			im.mfg_date AS mfgDate,
//			im.expire_date AS expiryDate,
//			im.barcode AS barcode,
//			im.date_time_creation AS incomingDate,
//			sm.description AS description,
//			im.created_by AS createdBy,
//			im.quantity AS totalQty,
//			im.date_time_creation AS dateTime,
//			qi.release_date AS qualityReleaseDate
//			FROM incoming_material im
//			LEFT JOIN store_material_location sl
//			ON im.id = sl.material_barcode
//			LEFT JOIN store_material_master sm
//			ON sm.material = im.part_name
//			LEFT JOIN (
//			SELECT in_material, MAX(date_time_creation) AS release_date
//			FROM quality_incoming_log
//			WHERE qa_status = 'RELEASED'
//			GROUP BY in_material
//			) qi ON qi.in_material = im.id
//			WHERE
//			(:partName IS NULL OR :partName = '' OR im.part_name LIKE '%' + :partName + '%')
//
//			AND (
//			:startDate IS NULL OR :endDate IS NULL
//			OR TRY_CAST(im.date_time_creation AS DATETIME)
//			BETWEEN TRY_CAST(:startDate AS DATETIME)
//			 AND TRY_CAST(:endDate AS DATETIME)
//			)
//
//			""", countQuery = """
//			SELECT COUNT(*)
//			FROM incoming_material im
//			LEFT JOIN store_material_location sl
//			ON im.id = sl.material_barcode
//			LEFT JOIN store_material_master sm
//			ON sm.material = im.part_name
//			LEFT JOIN (
//			SELECT in_material, MAX(date_time_creation) AS release_date
//			FROM quality_incoming_log
//			WHERE qa_status = 'RELEASED'
//			GROUP BY in_material
//			) qi ON qi.in_material = im.id
//			WHERE
//			(:partName IS NULL OR :partName = '' OR im.part_name LIKE '%' + :partName + '%')
//
//			AND (
//			:startDate IS NULL OR :endDate IS NULL
//			OR TRY_CAST(im.date_time_creation AS DATETIME)
//			BETWEEN TRY_CAST(:startDate AS DATETIME)
//			 AND TRY_CAST(:endDate AS DATETIME)
//			)
//			""",
//
//			nativeQuery = true)
//	Page<MovingReportDTO> getMovingReports(@Param("partName") String partName, @Param("startDate") String startDate,
//			@Param("endDate") String endDate, Pageable pageable);

}
