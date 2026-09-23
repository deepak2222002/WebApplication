package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import web.minda.project.dto.ExpiryReportsDTO;
import web.minda.project.dto.IncomingReportsDTO;
import web.minda.project.dto.MasterReportDTO;
import web.minda.project.dto.MovingReportDTO;
import web.minda.project.dto.StoreLiveStockReportDTO;
import web.minda.project.dto.SupplierClaimReportDTO;
import web.minda.project.entity.IncomingMaterial;
import web.minda.project.entity.Qualityincoming;

public interface IncomingMaterialReportRepository extends CrudRepository<IncomingMaterial, Long> {

	@Query(value = """
			SELECT im.* FROM store_incoming_material im
			LEFT JOIN store_material_category_master smcm ON smcm.id = im.category_id
				WHERE (:category IS NULL OR :category = '' OR smcm.category LIKE '%' + :category + '%')
				AND (:supplier IS NULL OR :supplier = '' OR im.supplier LIKE '%' + :supplier + '%')
				AND (:partName IS NULL OR :partName = '' OR im.part_name LIKE '%' + :partName + '%')
				AND (:lotNumber IS NULL OR :lotNumber = '' OR im.lot_name LIKE '%' + :lotNumber + '%')
				AND (:quantity IS NULL OR CAST(im.quantity AS VARCHAR) LIKE '%' + :quantity + '%')
				AND (:mfgDate IS NULL OR :mfgDate = '' OR im.mfg_date LIKE '%' + :mfgDate + '%')
				AND (:expireDate IS NULL OR :expireDate = '' OR im.expire_date LIKE '%' + :expireDate + '%')
				AND (:createdBy IS NULL OR :createdBy = '' OR im.created_by LIKE '%' + :createdBy + '%')
				AND (:partType IS NULL OR :partType = '' OR im.part_type LIKE '%' + :partType + '%')
				AND (
				   (:fromDate IS NULL OR :toDate IS NULL)
				   OR im.date_time_modified BETWEEN :fromDate AND :toDate
				)
				""",

			countQuery = """
					SELECT COUNT(*) FROM store_incoming_material im
					LEFT JOIN store_material_category_master smcm ON smcm.id = im.category_id
					WHERE (:category IS NULL OR :category = '' OR smcm.category LIKE '%' + :category + '%')
					AND (:supplier IS NULL OR :supplier = '' OR im.supplier LIKE '%' + :supplier + '%')
					AND (:partName IS NULL OR :partName = '' OR im.part_name LIKE '%' + :partName + '%')
					AND (:lotNumber IS NULL OR :lotNumber = '' OR im.lot_name LIKE '%' + :lotNumber + '%')
					AND (:quantity IS NULL OR CAST(im.quantity AS VARCHAR) LIKE '%' + :quantity + '%')
					AND (:mfgDate IS NULL OR :mfgDate = '' OR im.mfg_date LIKE '%' + :mfgDate + '%')
					AND (:expireDate IS NULL OR :expireDate = '' OR im.expire_date LIKE '%' + :expireDate + '%')
					AND (:createdBy IS NULL OR :createdBy = '' OR im.created_by LIKE '%' + :createdBy + '%')
					AND (:partType IS NULL OR :partType = '' OR im.part_type LIKE '%' + :partType + '%')
					AND (
					   (:fromDate IS NULL OR :toDate IS NULL)
					   OR im.date_time_modified BETWEEN :fromDate AND :toDate
					)
					""",

			nativeQuery = true)
	Page<IncomingMaterial> getLikeIncomingMaterial(@Param("category") String category,
			@Param("supplier") String supplier, @Param("partName") String partName,
			@Param("lotNumber") String lotNumber, @Param("quantity") String quantity, @Param("mfgDate") String mfgDate,
			@Param("expireDate") String expireDate, @Param("createdBy") String createdBy,
			@Param("partType") String partType, @Param("fromDate") String fromDate, @Param("toDate") String toDate,
			Pageable pageable);

//	@Query(
//		    value = """
//
//		        SELECT 
//		            im.part_name AS partName,
//		            sl.location_barcode AS storeLocation,
//		            im.quantity AS quantity,
//		            im.supplier AS suppierName,
//		            im.lot_name AS lotNumber,
//		            im.mfg_date AS mfgDate,
//		            im.expire_date AS expiryDate,
//		            im.barcode AS barcode,
//		            im.date_time_creation AS dateTime,
//		            sm.description AS description,
//		            im.created_by AS createdBy,
//		            im.quantity AS totalQty,
//		            sl.status AS liveStatus,
//
//		            CASE 
//		                WHEN TRY_CAST(im.expire_date AS DATETIME) IS NULL THEN 'VALID'
//		                WHEN TRY_CAST(im.expire_date AS DATETIME) < GETDATE() THEN 'EXPIRED'
//		                ELSE 'VALID'
//		            END AS expiredStatus
//
//		        FROM store_material_location sl   -- ✅ PARENT TABLE
//
//		        LEFT JOIN incoming_material im
//		            ON im.id = sl.material_barcode   -- ✅ CORRECT JOIN
//
//		        LEFT JOIN store_material_master sm 
//		            ON sm.material = im.part_name
//
//		        WHERE 
//		        (:partName IS NULL OR :partName = '' OR im.part_name LIKE '%' + :partName + '%')
//
//		        AND (
//			            :startDate IS NULL OR :endDate IS NULL
//			            OR TRY_CAST(im.date_time_creation AS DATETIME) 
//			               BETWEEN TRY_CAST(:startDate AS DATETIME) 
//			                   AND TRY_CAST(:endDate AS DATETIME)
//			        )
//
//		        """,
//
//		    countQuery = """
//
//		        SELECT COUNT(*)
//		        FROM store_material_location sl
//
//		        LEFT JOIN incoming_material im
//		            ON im.id = sl.material_barcode
//
//		        LEFT JOIN store_material_master sm 
//		            ON sm.material = im.part_name
//
//		        WHERE 
//		        (:partName IS NULL OR :partName = '' OR im.part_name LIKE '%' + :partName + '%')
//
//		        AND (
//			            :startDate IS NULL OR :endDate IS NULL
//			            OR TRY_CAST(im.date_time_creation AS DATETIME) 
//			               BETWEEN TRY_CAST(:startDate AS DATETIME) 
//			                   AND TRY_CAST(:endDate AS DATETIME)
//			        )
//
//		        """,
//
//		    nativeQuery = true
//		)
//		Page<StoreLiveStockReportDTO> getStoreLiveStockReports(
//		        @Param("partName") String partName,
//		        @Param("startDate") String startDate,
//		        @Param("endDate") String endDate,
//		        Pageable pageable
//		);
//	

	@Query(value = """

							SELECT
			    im.part_name AS partName,
			    rm.rack_code AS storeLocation,
			    lm.location_name AS locationName,
			    im.quantity AS quantity,
			    im.supplier AS suppierName,
			    im.lot_name AS lotNumber,
			    im.mfg_date AS mfgDate,
			    im.expire_date AS expiryDate,
			  
			    im.date_time_creation AS dateTime,
			    sm.description AS description,
			    im.created_by AS createdBy,
			    im.quantity AS totalQty,
			    sl.status AS liveStatus,
			    sm.uom As uom,
			    im.id As materialId,

			    CASE
			        WHEN TRY_CONVERT(date, im.expire_date, 105) IS NULL THEN 'VALID'
			        WHEN TRY_CONVERT(date, im.expire_date, 105) < CAST(GETDATE() AS date) THEN 'EXPIRED'
			        ELSE 'VALID'
			    END AS expiredStatus

			FROM rack_master rm

			LEFT JOIN location_master lm
			    ON lm.id = rm.location_id

			LEFT JOIN store_material_location sl
			    ON rm.rack_code = sl.location_barcode

			LEFT JOIN store_incoming_material im
			    ON im.id = sl.material_barcode
			    AND (
			        (:startDate IS NULL AND :endDate IS NULL)
			        OR TRY_CONVERT(datetime, im.date_time_creation, 120)
			           BETWEEN TRY_CONVERT(datetime, :startDate, 120)
			               AND TRY_CONVERT(datetime, :endDate, 120)
			    )

			LEFT JOIN store_material_master sm
			    ON sm.material = im.part_name

			WHERE
			    (:partName IS NULL OR :partName = '' OR im.part_name LIKE '%' + :partName + '%')
			    AND (:rackCode IS NULL OR :rackCode = '' OR rm.rack_code LIKE '%' + :rackCode + '%')
			    AND (:lotNumber IS NULL OR :lotNumber = '' OR im.lot_name LIKE '%' + :lotNumber + '%')
													""",

			countQuery = """

														SELECT COUNT(*)
					FROM rack_master rm

					LEFT JOIN location_master lm
					    ON lm.id = rm.location_id

					LEFT JOIN store_material_location sl
					    ON rm.rack_code = sl.location_barcode

					LEFT JOIN store_incoming_material im
					    ON im.id = sl.material_barcode
					    AND (
					        (:startDate IS NULL AND :endDate IS NULL)
					        OR TRY_CONVERT(datetime, im.date_time_creation, 120)
					           BETWEEN TRY_CONVERT(datetime, :startDate, 120)
					               AND TRY_CONVERT(datetime, :endDate, 120)
					    )

					LEFT JOIN store_material_master sm
					    ON sm.material = im.part_name

					WHERE
					    (:partName IS NULL OR :partName = '' OR im.part_name LIKE '%' + :partName + '%')
					    AND (:rackCode IS NULL OR :rackCode = '' OR rm.rack_code LIKE '%' + :rackCode + '%')
					    AND (:lotNumber IS NULL OR :lotNumber = '' OR im.lot_name LIKE '%' + :lotNumber + '%')
																""",

			nativeQuery = true)
	Page<StoreLiveStockReportDTO> getStoreLiveStockReports(@Param("partName") String partName,
			@Param("rackCode") String rackCode, @Param("lotNumber") String lotNumber,
			@Param("startDate") String startDate, @Param("endDate") String endDate, Pageable pageable);

	@Query(value = """
							SELECT
			    im.part_name AS partName,
			    rm.rack_code AS storeLocation,
			    lm.location_name AS locationName,
			    im.quantity AS quantity,
			    im.supplier AS suppierName,
			    im.lot_name AS lotNumber,
			    im.mfg_date AS mfgDate,
			    im.expire_date AS expiryDate,
			   
			    im.date_time_creation AS dateTime,
			    sm.description AS description,
			    im.created_by AS createdBy,
			    im.quantity AS totalQty,
			    sl.status AS liveStatus,

			    CASE
			        WHEN TRY_CONVERT(date, im.expire_date, 105) IS NULL THEN 'VALID'
			        WHEN TRY_CONVERT(date, im.expire_date, 105) < CAST(GETDATE() AS date) THEN 'EXPIRED'
			        ELSE 'VALID'
			    END AS expiredStatus

			FROM rack_master rm

			LEFT JOIN location_master lm
			    ON lm.id = rm.location_id

			LEFT JOIN store_material_location sl
			    ON rm.rack_code = sl.location_barcode

			LEFT JOIN store_incoming_material im
			    ON im.id = sl.material_barcode
			    AND (
			        (:startDate IS NULL AND :endDate IS NULL)
			        OR TRY_CONVERT(datetime, im.date_time_creation, 120)
			           BETWEEN TRY_CONVERT(datetime, :startDate, 120)
			               AND TRY_CONVERT(datetime, :endDate, 120)
			    )

			LEFT JOIN store_material_master sm
			    ON sm.material = im.part_name

			WHERE
			    (:partName IS NULL OR :partName = '' OR im.part_name LIKE '%' + :partName + '%')
			    AND (:rackCode IS NULL OR :rackCode = '' OR rm.rack_code LIKE '%' + :rackCode + '%')
			    AND (:lotNumber IS NULL OR :lotNumber = '' OR im.lot_name LIKE '%' + :lotNumber + '%')
						""",

			nativeQuery = true)
	List<StoreLiveStockReportDTO> getStoreLiveStockReportsList(@Param("partName") String partName,
			@Param("rackCode") String rackCode, @Param("lotNumber") String lotNumber,
			@Param("startDate") String startDate, @Param("endDate") String endDate);

	@Query(value = """
			SELECT
				im.id As incomingMaterialId,
			    im.part_name AS partName,
			    im.quantity AS quantity,
			    im.supplier AS supplierName,
			    im.lot_name AS lotNumber,
			    im.mfg_date AS mfgDate,
			    im.expire_date AS expiryDate,
			  
			    im.date_time_creation AS dateTime,
			    sm.description AS description,
			    im.created_by AS createdBy,
			    im.quantity AS totalQty,
			    im.tagging_status AS taggingStatus,
			    smcm.category AS category,
			    q.qa_barcode AS qaBarcode,
			    im.box_no AS boxNo,
			    im.qa_status AS qaStatus
			FROM store_incoming_material im
			LEFT JOIN store_material_master sm
			    ON sm.material = im.part_name
			LEFT JOIN store_material_category_master smcm
			    ON sm.category_id = smcm.id
			    LEFT JOIN store_incoming_quality q
			    ON im.id = q.in_material
			WHERE
			(:partName IS NULL OR :partName = '' OR im.part_name LIKE '%' + :partName + '%')
			AND (:lotNumber IS NULL OR :lotNumber = '' OR im.lot_name LIKE '%' + :lotNumber + '%')
			AND (:qaStatus IS NULL OR :qaStatus = '' OR q.qa_status LIKE '%' + :qaStatus + '%')
			AND (:supplier IS NULL OR :supplier = '' OR im.supplier LIKE '%' + :supplier + '%')

			AND (
			        (:startDate IS NULL AND :endDate IS NULL)
			        OR TRY_CONVERT(datetime, im.date_time_creation, 120)
			           BETWEEN TRY_CONVERT(datetime, :startDate, 120)
			               AND TRY_CONVERT(datetime, :endDate, 120)
			    )  ORDER By im.id DESC
			""",

			countQuery = """
    SELECT COUNT(*)
    FROM store_incoming_material im
    LEFT JOIN store_material_master sm
        ON sm.material = im.part_name
    LEFT JOIN store_material_category_master smcm
        ON sm.category_id = smcm.id
    LEFT JOIN store_incoming_quality q
        ON im.id = q.in_material
    WHERE
    (:partName IS NULL OR :partName = '' OR im.part_name LIKE '%' + :partName + '%')
    AND (:lotNumber IS NULL OR :lotNumber = '' OR im.lot_name LIKE '%' + :lotNumber + '%')
    AND (:qaStatus IS NULL OR :qaStatus = '' OR q.qa_status LIKE '%' + :qaStatus + '%')
    AND (:supplier IS NULL OR :supplier = '' OR im.supplier LIKE '%' + :supplier + '%')
    AND (
          (:startDate IS NULL AND :endDate IS NULL)
          OR TRY_CONVERT(datetime, im.date_time_creation, 120)
             BETWEEN TRY_CONVERT(datetime, :startDate, 120)
                 AND TRY_CONVERT(datetime, :endDate, 120)
      )
    """, nativeQuery = true)
	Page<IncomingReportsDTO> getIncomingReports(@Param("partName") String partName,
			@Param("lotNumber") String lotNumber, @Param("qaStatus") String qaStatus,
			@Param("supplier") String supplier, @Param("startDate") String startDate, @Param("endDate") String endDate,
			Pageable pageable);

	@Query(value = """
			SELECT
				im.id As incomingMaterialId,
			    im.part_name AS partName,
			    im.quantity AS quantity,
			    im.supplier AS supplierName,
			    im.lot_name AS lotNumber,
			    im.mfg_date AS mfgDate,
			    im.expire_date AS expiryDate,
			    
			    im.date_time_creation AS dateTime,
			    sm.description AS description,
			    im.created_by AS createdBy,
			    im.quantity AS totalQty,
			    im.tagging_status AS taggingStatus,
			    smcm.category AS category,
			    q.qa_barcode AS qaBarcode,
			    im.box_no AS boxNo,
			    q.qa_status AS qaStatus
			FROM store_incoming_material im
			LEFT JOIN store_material_master sm
			    ON sm.material = im.part_name
			LEFT JOIN store_material_category_master smcm
			    ON sm.category_id = smcm.id
			      LEFT JOIN store_incoming_quality q
			    ON im.id = q.in_material
			    
			WHERE
			(:partName IS NULL OR :partName = '' OR im.part_name LIKE '%' + :partName + '%')
			AND (:lotNumber IS NULL OR :lotNumber = '' OR im.lot_name LIKE '%' + :lotNumber + '%')
			AND (:qaStatus IS NULL OR :qaStatus = '' OR q.qa_status LIKE '%' + :qaStatus + '%')
			AND (:supplier IS NULL OR :supplier = '' OR im.supplier LIKE '%' + :supplier + '%')

			AND (
			        (:startDate IS NULL AND :endDate IS NULL)
			        OR TRY_CONVERT(datetime, im.date_time_creation, 120)
			           BETWEEN TRY_CONVERT(datetime, :startDate, 120)
			               AND TRY_CONVERT(datetime, :endDate, 120)
			    ) ORDER By im.id DESC
			""",

			nativeQuery = true)
	List<IncomingReportsDTO> getIncomingReportsInList(@Param("partName") String partName,
			@Param("lotNumber") String lotNumber, @Param("qaStatus") String qaStatus,
			@Param("supplier") String supplier, @Param("startDate") String startDate, @Param("endDate") String endDate);

	@Query(value = """
			SELECT
				im.id As incomingMaterialId,
			    im.part_name AS partName,
			    im.quantity AS quantity,
			    im.supplier AS supplierName,
			    im.lot_name AS lotNumber,
			    im.mfg_date AS mfgDate,
			    im.expire_date AS expiryDate,
			 
			    im.date_time_creation AS dateTime,
			    sm.description AS description,
			    im.created_by AS createdBy,
			    im.quantity AS totalQty,
			    smcm.category AS category,
			    q.qa_barcode AS qaBarcode,
			    im.box_no AS boxNo
			FROM store_incoming_material im
			LEFT JOIN store_material_master sm
			    ON sm.material = im.part_name
			LEFT JOIN store_material_category_master smcm
			    ON sm.category_id = smcm.id
			      LEFT JOIN store_incoming_quality q
			    ON im.id = q.in_material
			WHERE
			(:partName IS NULL OR :partName = '' OR im.part_name LIKE '%' + :partName + '%')

			AND (:qaStatus IS NULL OR :qaStatus = '' OR q.qa_status LIKE '%' + :qaStatus + '%')

			AND (
			        (:startDate IS NULL AND :endDate IS NULL)
			        OR TRY_CONVERT(datetime, im.date_time_creation, 120)
			           BETWEEN TRY_CONVERT(datetime, :startDate, 120)
			               AND TRY_CONVERT(datetime, :endDate, 120)
			    ) ORDER By im.id DESC
			""",

			countQuery = """
						SELECT COUNT(*)
						FROM store_incoming_material im
						LEFT JOIN store_material_master sm
						    ON sm.material = im.part_name
						LEFT JOIN store_material_category_master smcm
						    ON sm.category_id = smcm.id
						WHERE
						(:partName IS NULL OR :partName = '' OR im.part_name LIKE '%' + :partName + '%')

						AND (:qaStatus IS NULL OR :qaStatus = '' OR im.qa_status LIKE '%' + :qaStatus + '%')

					AND (
					       (:startDate IS NULL AND :endDate IS NULL)
					       OR TRY_CONVERT(datetime, im.date_time_creation, 120)
					          BETWEEN TRY_CONVERT(datetime, :startDate, 120)
					              AND TRY_CONVERT(datetime, :endDate, 120)
					   )
						""", nativeQuery = true)
	Page<IncomingReportsDTO> getReleaseMaterialPendingReports(@Param("partName") String partName,
			@Param("qaStatus") String qaStatus, @Param("startDate") String startDate, @Param("endDate") String endDate,
			Pageable pageable);

	@Query(value = """
			SELECT
				im.id As incomingMaterialId,
			    im.part_name AS partName,
			    im.quantity AS quantity,
			    im.supplier AS supplierName,
			    im.lot_name AS lotNumber,
			    im.mfg_date AS mfgDate,
			    im.expire_date AS expiryDate,
			
			    im.date_time_creation AS dateTime,
			    sm.description AS description,
			    im.created_by AS createdBy,
			    im.quantity AS totalQty,
			    smcm.category AS category,
			    q.qa_barcode AS qaBarcode,
			    im.box_no AS boxNo
			FROM store_incoming_material im
			LEFT JOIN store_material_master sm
			    ON sm.material = im.part_name
			LEFT JOIN store_material_category_master smcm
			    ON sm.category_id = smcm.id
			      LEFT JOIN store_incoming_quality q
			    ON im.id = q.in_material
			WHERE
			(:partName IS NULL OR :partName = '' OR im.part_name LIKE '%' + :partName + '%')

			AND (:qaStatus IS NULL OR :qaStatus = '' OR q.qa_status LIKE '%' + :qaStatus + '%')
			AND (
			        (:startDate IS NULL AND :endDate IS NULL)
			        OR TRY_CONVERT(datetime, im.date_time_creation, 120)
			           BETWEEN TRY_CONVERT(datetime, :startDate, 120)
			               AND TRY_CONVERT(datetime, :endDate, 120)
			    )


			ORDER By im.id DESC
			""", nativeQuery = true)
	List<IncomingReportsDTO> getReleaseMaterialPendingReportsInList(@Param("partName") String partName,
			@Param("qaStatus") String qaStatus, @Param("startDate") String startDate, @Param("endDate") String endDate);

//	@Query(
//		    value = """
//		    		SELECT 
//					    im.part_name AS partName,
//					    sl.location_barcode AS storeLocation,
//					    sl.location_name AS locationName
//					    im.quantity AS quantity,
//					    im.supplier AS supplierName,
//					    im.lot_name AS lotNumber,
//					    im.mfg_date AS mfgDate,
//					    im.expire_date AS expiryDate,
//					    im.barcode AS barcode,
//					    im.date_time_creation AS dateTime,
//					    sm.description AS description,
//					    im.created_by AS createdBy,
//					    im.quantity AS totalQty,
//					    sl.status AS liveStatus,
//					    smcm.category AS category,
//				    CASE 
//				        WHEN TRY_CAST(im.expire_date AS DATETIME) IS NOT NULL
//				             AND TRY_CAST(im.expire_date AS DATETIME) < GETDATE()
//				             AND sl.material_barcode IS NULL
//				        THEN 'EXPIRED (INCOMING)'
//				
//				        WHEN TRY_CAST(im.expire_date AS DATETIME) IS NOT NULL
//				             AND TRY_CAST(im.expire_date AS DATETIME) < GETDATE()
//				             AND sl.material_barcode IS NOT NULL
//				        THEN 'EXPIRED (LOCATION)'
//				        ELSE 'VALID'
//				    END AS expiredStatus,
//				    CASE 
//				        WHEN TRY_CONVERT(DATETIME, im.expire_date, 105) IS NOT NULL
//				             AND TRY_CONVERT(DATETIME, im.expire_date, 105) < GETDATE()
//				        THEN DATEDIFF(
//				                DAY, 
//				                TRY_CONVERT(DATETIME, im.expire_date, 105), 
//				                GETDATE()
//				             )
//				        ELSE 0
//				    END AS expiredDays
//				FROM incoming_material im  
//				LEFT JOIN store_material_location sl
//				    ON sl.material_barcode = im.id
//				LEFT JOIN store_material_master sm 
//				    ON sm.material = im.part_name
//				    LEFT JOIN store_material_category_master smcm 
//					ON sm.category_id = smcm.id
//				     WHERE 
//			        (:partName IS NULL OR :partName = '' OR im.part_name LIKE '%' + :partName + '%')
//
//			        AND (
//			            :startDate IS NULL OR :endDate IS NULL
//			            OR TRY_CAST(im.date_time_creation AS DATETIME) 
//			               BETWEEN TRY_CAST(:startDate AS DATETIME) 
//			                   AND TRY_CAST(:endDate AS DATETIME)
//			        )
//		        """,
//		         countQuery = """
//		        SELECT COUNT(*)
//		       FROM incoming_material im  
//				LEFT JOIN store_material_location sl
//				    ON sl.material_barcode = im.id
//				LEFT JOIN store_material_master sm 
//				    ON sm.material = im.part_name
//				    LEFT JOIN store_material_category_master smcm 
//					ON sm.category_id = smcm.id
//				     WHERE 
//			        (:partName IS NULL OR :partName = '' OR im.part_name LIKE '%' + :partName + '%')
//
//			        AND (
//			            :startDate IS NULL OR :endDate IS NULL
//			            OR TRY_CAST(im.date_time_creation AS DATETIME) 
//			               BETWEEN TRY_CAST(:startDate AS DATETIME) 
//			                   AND TRY_CAST(:endDate AS DATETIME)
//			        )
//
//		        """,
//		    nativeQuery = true
//		)
//		Page<ExpiryReportsDTO> getExpiryReports(
//		        @Param("partName") String partName,
//		        @Param("startDate") String startDate,
//		        @Param("endDate") String endDate,
//		        Pageable pageable
//		);

	@Query(value = """

			SELECT
			    im.part_name AS partName,
			    sl.location_barcode AS storeLocation,
			    sl.location_name AS locationName,
			    im.quantity AS quantity,
			    im.supplier AS supplierName,
			    im.lot_name AS lotNumber,
			    im.mfg_date AS mfgDate,
			    im.expire_date AS expiryDate,
			    
			    im.date_time_creation AS dateTime,
			    sm.description AS description,
			    im.created_by AS createdBy,
			    im.quantity AS totalQty,
			    sl.status AS liveStatus,
			    smcm.category AS category,

			    CASE
			        WHEN TRY_CONVERT(date, im.expire_date, 105) IS NOT NULL
			             AND TRY_CONVERT(date, im.expire_date, 105) < CAST(GETDATE() AS date)
			             AND sl.material_barcode IS NULL
			        THEN 'EXPIRED (INCOMING)'

			        WHEN TRY_CONVERT(date, im.expire_date, 105) IS NOT NULL
			             AND TRY_CONVERT(date, im.expire_date, 105) < CAST(GETDATE() AS date)
			             AND sl.material_barcode IS NOT NULL
			        THEN 'EXPIRED (LOCATION)'

			        ELSE 'VALID'
			    END AS expiredStatus,

			    CASE
			        WHEN TRY_CONVERT(date, im.expire_date, 105) IS NOT NULL
			             AND TRY_CONVERT(date, im.expire_date, 105) < CAST(GETDATE() AS date)
			        THEN DATEDIFF(
			                DAY,
			                TRY_CONVERT(date, im.expire_date, 105),
			                CAST(GETDATE() AS date)
			             )
			        ELSE 0
			    END AS expiredDays

			FROM store_incoming_material im

			LEFT JOIN store_material_location sl
			    ON sl.material_barcode = im.id

			LEFT JOIN store_material_master sm
			    ON sm.material = im.part_name

			LEFT JOIN store_material_category_master smcm
			    ON sm.category_id = smcm.id

			WHERE
			    (:partName IS NULL OR :partName = '' OR im.part_name LIKE '%' + :partName + '%')
			    AND (:lotNumber IS NULL OR :lotNumber = '' OR im.lot_name LIKE '%' + :lotNumber + '%')
			    AND (:supplier IS NULL OR :supplier = '' OR im.supplier LIKE '%' + :supplier + '%')
			    AND (
			        (:startDate IS NULL AND :endDate IS NULL)
			        OR TRY_CONVERT(datetime, im.date_time_creation, 120)
			           BETWEEN TRY_CONVERT(datetime, :startDate, 120)
			               AND TRY_CONVERT(datetime, :endDate, 120)
			    )
			    AND TRY_CONVERT(date, im.expire_date, 105) < CAST(GETDATE() AS date)

			ORDER BY im.id DESC


						""",

			countQuery = """

									SELECT COUNT(*)
												FROM store_incoming_material im

					LEFT JOIN store_material_location sl
						ON sl.material_barcode = im.id

					LEFT JOIN store_material_master sm
					    ON sm.material = im.part_name

					LEFT JOIN store_material_category_master smcm
					    ON sm.category_id = smcm.id
					WHERE
					(:partName IS NULL OR :partName = '' OR im.part_name LIKE '%' + :partName + '%')
					AND (:lotNumber IS NULL OR :lotNumber = '' OR im.lot_name LIKE '%' + :lotNumber + '%')
					AND (:supplier IS NULL OR :supplier = '' OR im.supplier LIKE '%' + :supplier + '%')

					 AND (
					       (:startDate IS NULL AND :endDate IS NULL)
					       OR TRY_CONVERT(datetime, im.date_time_creation, 120)
					          BETWEEN TRY_CONVERT(datetime, :startDate, 120)
					              AND TRY_CONVERT(datetime, :endDate, 120)
					   )
					And TRY_CAST(im.expire_date AS DATETIME) < FORMAT(GETDATE(), 'dd-MM-yyyy')
					ORDER By im.id DESC


					""",

			nativeQuery = true)
	Page<ExpiryReportsDTO> getExpiryReports(@Param("partName") String partName, @Param("lotNumber") String lotNumber,
			@Param("supplier") String supplier, @Param("startDate") String startDate, @Param("endDate") String endDate,
			Pageable pageable);

	@Query(value = """

			SELECT
			    im.part_name AS partName,
			    sl.location_barcode AS storeLocation,
			    sl.location_name AS locationName,
			    im.quantity AS quantity,
			    im.supplier AS supplierName,
			    im.lot_name AS lotNumber,
			    im.mfg_date AS mfgDate,
			    im.expire_date AS expiryDate,
			
			    im.date_time_creation AS dateTime,
			    sm.description AS description,
			    im.created_by AS createdBy,
			    im.quantity AS totalQty,
			    sl.status AS liveStatus,
			    smcm.category AS category,

			    CASE
			        WHEN TRY_CONVERT(date, im.expire_date, 105) IS NOT NULL
			             AND TRY_CONVERT(date, im.expire_date, 105) < CAST(GETDATE() AS date)
			             AND sl.material_barcode IS NULL
			        THEN 'EXPIRED (INCOMING)'

			        WHEN TRY_CONVERT(date, im.expire_date, 105) IS NOT NULL
			             AND TRY_CONVERT(date, im.expire_date, 105) < CAST(GETDATE() AS date)
			             AND sl.material_barcode IS NOT NULL
			        THEN 'EXPIRED (LOCATION)'

			        ELSE 'VALID'
			    END AS expiredStatus,

			    CASE
			        WHEN TRY_CONVERT(date, im.expire_date, 105) IS NOT NULL
			             AND TRY_CONVERT(date, im.expire_date, 105) < CAST(GETDATE() AS date)
			        THEN DATEDIFF(
			                DAY,
			                TRY_CONVERT(date, im.expire_date, 105),
			                CAST(GETDATE() AS date)
			             )
			        ELSE 0
			    END AS expiredDays

			FROM store_incoming_material im

			LEFT JOIN store_material_location sl
			    ON sl.material_barcode = im.id

			LEFT JOIN store_material_master sm
			    ON sm.material = im.part_name

			LEFT JOIN store_material_category_master smcm
			    ON sm.category_id = smcm.id

			WHERE
			    (:partName IS NULL OR :partName = '' OR im.part_name LIKE '%' + :partName + '%')
			    AND (:lotNumber IS NULL OR :lotNumber = '' OR im.lot_name LIKE '%' + :lotNumber + '%')
			    AND (:supplier IS NULL OR :supplier = '' OR im.supplier LIKE '%' + :supplier + '%')
			    AND (
			        (:startDate IS NULL AND :endDate IS NULL)
			        OR TRY_CONVERT(datetime, im.date_time_creation, 120)
			           BETWEEN TRY_CONVERT(datetime, :startDate, 120)
			               AND TRY_CONVERT(datetime, :endDate, 120)
			    )
			    AND TRY_CONVERT(date, im.expire_date, 105) < CAST(GETDATE() AS date)

			ORDER BY im.id DESC


						""", nativeQuery = true)
	List<ExpiryReportsDTO> getExpiryReportsInList(@Param("partName") String partName,
			@Param("lotNumber") String lotNumber, @Param("supplier") String supplier,
			@Param("startDate") String startDate, @Param("endDate") String endDate);
	
	
	@Query(value = """

			SELECT
			    im.part_name AS partName,
			    sl.location_barcode AS storeLocation,
			    im.quantity AS quantity,
			    im.supplier AS supplierName,
			    im.lot_name AS lotNumber,
			    im.mfg_date AS mfgDate,
			    im.expire_date AS expiryDate,

			    im.qa_status AS currentStatus,

			    im.date_time_creation AS incomingDate,

			    sm.description AS description,

			    im.created_by AS createdBy,

			    im.quantity AS totalQty,

			    im.date_time_creation AS dateTime,

			    qi.release_date AS qualityReleaseDate,

			    im.date_time_modified AS lastActivityDate,
			    im.qa AS qa,

			    DATEDIFF(
			        DAY,
			        TRY_CAST(im.date_time_modified AS DATETIME),
			        GETDATE()
			    ) AS agingDays

			FROM store_incoming_material im

			LEFT JOIN store_material_location sl
			    ON im.id = sl.material_barcode

			LEFT JOIN store_material_master sm
			    ON sm.material = im.part_name

			LEFT JOIN (
			    SELECT
			        in_material,
			        MAX(date_time_creation) AS release_date
			    FROM quality_incoming_log
			    WHERE qa_status = 'RELEASED'
			    GROUP BY in_material
			) qi
			    ON qi.in_material = im.id

			WHERE

			(
			    :partName IS NULL
			    OR :partName = ''
			    OR im.part_name LIKE '%' + :partName + '%'
			)

			AND
			(
			    :startDate IS NULL
			    OR :endDate IS NULL
			    OR TRY_CAST(im.date_time_creation AS DATETIME)
			       BETWEEN TRY_CAST(:startDate AS DATETIME)
			           AND TRY_CAST(:endDate AS DATETIME)
			)

			AND
			(
			    :agingDays IS NULL
			    OR DATEDIFF(
			            DAY,
			            TRY_CAST(im.date_time_modified AS DATETIME),
			            GETDATE()
			       ) >= :agingDays
			)

			ORDER BY
			DATEDIFF(
			    DAY,
			    TRY_CAST(im.date_time_modified AS DATETIME),
			    GETDATE()
			) DESC

			""",

			countQuery = """

			SELECT COUNT(*)

			FROM store_incoming_material im

			LEFT JOIN store_material_location sl
			    ON im.id = sl.material_barcode

			LEFT JOIN store_material_master sm
			    ON sm.material = im.part_name

			WHERE

			(
			    :partName IS NULL
			    OR :partName = ''
			    OR im.part_name LIKE '%' + :partName + '%'
			)

			AND
			(
			    :startDate IS NULL
			    OR :endDate IS NULL
			    OR TRY_CAST(im.date_time_creation AS DATETIME)
			       BETWEEN TRY_CAST(:startDate AS DATETIME)
			           AND TRY_CAST(:endDate AS DATETIME)
			)

			AND
			(
			    :agingDays IS NULL
			    OR DATEDIFF(
			            DAY,
			            TRY_CAST(im.date_time_modified AS DATETIME),
			            GETDATE()
			       ) >= :agingDays
			)

			""",
			nativeQuery = true)
			Page<MovingReportDTO> getMovingReports(
			        @Param("partName") String partName,
			        @Param("startDate") String startDate,
			        @Param("endDate") String endDate,
			        @Param("agingDays") Integer agingDays,
			        Pageable pageable);
	
	
	
	
	
	@Query(value = """

			SELECT

			    rm.rack_code AS storeLocation,
			    im.supplier AS supplierName,
			    im.part_name AS partNumber,
			    smm.description AS description,
			    smm.uom AS uom,

			    CAST(im.quantity AS VARCHAR(50)) AS quantity,

			    im.lot_name AS lotNumber,

			    im.date_time_creation AS incomingDate,

			    siq.date_time_creation AS qualityReleaseDate,

			    sml.date_time_creation AS materialTaggingDate,

			    im.created_by AS operatorId,

			    CAST(im.id AS VARCHAR(50)) AS barcodeId,

			    sml.category AS materialCategory,

			      im.qa AS materialStatus,

			    im.date_time_creation AS issuanceDate,

			  im.quantity AS issuanceQty,

			   im.quantity AS qtyInStock,

			    im.created_by AS createdBy,

			    im.date_time_creation AS dateTime

			FROM store_incoming_material im

			LEFT JOIN store_material_location sml
			    ON sml.material_barcode = CAST(im.id AS VARCHAR(50))

			LEFT JOIN rack_master rm
			    ON rm.rack_code = sml.location_barcode

			LEFT JOIN store_incoming_quality siq
			    ON siq.qa_barcode = sml.qa_barcode

			LEFT JOIN store_material_master smm
			    ON smm.material = im.part_name


			WHERE
			    (:partNumber IS NULL
			        OR :partNumber = ''
			        OR im.part_name LIKE '%' + :partNumber + '%')

			AND (:lotNumber IS NULL
			        OR :lotNumber = ''
			        OR im.lot_name LIKE '%' + :lotNumber + '%')

			AND (:storeLocation IS NULL
			        OR :storeLocation = ''
			        OR rm.rack_code LIKE '%' + :storeLocation + '%')

			ORDER BY im.id DESC

			""",

			countQuery = """

			SELECT COUNT(*)

			FROM store_incoming_material im

			LEFT JOIN store_material_location sml
			    ON sml.material_barcode = CAST(im.id AS VARCHAR(50))

			LEFT JOIN rack_master rm
			    ON rm.rack_code = sml.location_barcode

			LEFT JOIN store_incoming_quality siq
			    ON siq.qa_barcode = sml.qa_barcode

			LEFT JOIN store_material_master smm
			    ON smm.material = im.part_name


			WHERE
			    (:partNumber IS NULL
			        OR :partNumber = ''
			        OR im.part_name LIKE '%' + :partNumber + '%')

			AND (:lotNumber IS NULL
			        OR :lotNumber = ''
			        OR im.lot_name LIKE '%' + :lotNumber + '%')

			AND (:storeLocation IS NULL
			        OR :storeLocation = ''
			        OR rm.rack_code LIKE '%' + :storeLocation + '%')

			""",
			nativeQuery = true)
			Page<MasterReportDTO> getMasterReport(
			        @Param("partNumber") String partNumber,
			        @Param("lotNumber") String lotNumber,
			        @Param("storeLocation") String storeLocation,
			        Pageable pageable);
	

//	@Query(value = """
//
//			SELECT
//			    im.part_name AS partName,
//			    sl.location_barcode AS storeLocation,
//			    im.quantity AS quantity,
//			    im.supplier AS supplierName,
//			    im.lot_name AS lotNumber,
//			    im.mfg_date AS mfgDate,
//			    im.expire_date AS expiryDate,
//			  
//			    im.date_time_creation AS incomingDate,
//			    sm.description AS description,
//			    im.created_by AS createdBy,
//			    im.quantity AS totalQty,
//			    im.date_time_creation AS dateTime,
//			    qi.release_date AS qualityReleaseDate
//			FROM store_incoming_material im
//			LEFT JOIN store_material_location sl
//			    ON im.id = sl.material_barcode
//			LEFT JOIN store_material_master sm
//			    ON sm.material = im.part_name
//			LEFT JOIN (
//			    SELECT in_material, MAX(date_time_creation) AS release_date
//			    FROM quality_incoming_log
//			    WHERE qa_status = 'RELEASED'
//			    GROUP BY in_material
//			) qi ON qi.in_material = im.id
//			      WHERE
//			      (:partName IS NULL OR :partName = '' OR im.part_name LIKE '%' + :partName + '%')
//
//			      AND (
//			          :startDate IS NULL OR :endDate IS NULL
//			          OR TRY_CAST(im.date_time_creation AS DATETIME)
//			             BETWEEN TRY_CAST(:startDate AS DATETIME)
//			                 AND TRY_CAST(:endDate AS DATETIME)
//			      )AND (
//     :agingDays IS NULL
//     OR DATEDIFF(DAY,
//                 TRY_CAST(im.date_time_creation AS DATETIME),
//                 GETDATE()) >= :agingDays
//)
//
//			      """, countQuery = """
//			      SELECT COUNT(*)
//			      FROM store_incoming_material im
//			LEFT JOIN store_material_location sl
//			    ON im.id = sl.material_barcode
//			LEFT JOIN store_material_master sm
//			    ON sm.material = im.part_name
//			LEFT JOIN (
//			    SELECT in_material, MAX(date_time_creation) AS release_date
//			    FROM quality_incoming_log
//			    WHERE qa_status = 'RELEASED'
//			    GROUP BY in_material
//			) qi ON qi.in_material = im.id
//			      WHERE
//			      (:partName IS NULL OR :partName = '' OR im.part_name LIKE '%' + :partName + '%')
//
//			      AND (
//			          :startDate IS NULL OR :endDate IS NULL
//			          OR TRY_CAST(im.date_time_creation AS DATETIME)
//			             BETWEEN TRY_CAST(:startDate AS DATETIME)
//			                 AND TRY_CAST(:endDate AS DATETIME)
//			      )AND (
//     :agingDays IS NULL
//     OR DATEDIFF(DAY,
//                 TRY_CAST(im.date_time_creation AS DATETIME),
//                 GETDATE()) >= :agingDays
//)
//			      """,
//
//			nativeQuery = true)
//	Page<MovingReportDTO> getMovingReports(@Param("partName") String partName, @Param("startDate") String startDate,
//			@Param("endDate") String endDate,@Param("agingDays") Integer agingDays, Pageable pageable);
//	
	
	

}
