package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.dto.PreventiveMaintenanceDTO;
import web.minda.project.entity.MouldChildPartMaster;
import web.minda.project.entity.MouldMaster;
import web.minda.project.entity.MouldPreventiveMaintenanceMaster;
import web.minda.project.entity.MouldMaster;

public interface PreventiveMaintenanceRepository extends JpaRepository<MouldPreventiveMaintenanceMaster, Long> {

	@Query(value = """
			SELECT
			    mm.mould_name AS mouldName,

			    mcp.child_part_name AS childPartName,
			    mcp.description AS description,

			    mcp.defined_life AS totalLife,
			    mcp.alarm_life AS alarmLife,

			    mpmm.pm_date AS pmDate,
			    mpmm.alert_days AS alertDays,
			    mpmm.current_life AS currentLife,


			    -- Days Remaining
			    DATEDIFF(DAY, GETDATE(), mpmm.pm_date) AS daysRemaining,

			    CASE
			        WHEN DATEDIFF(DAY, GETDATE(), mpmm.pm_date) < 0 THEN 'Overdue'
			        WHEN DATEDIFF(DAY, GETDATE(), mpmm.pm_date) <= mpmm.alert_days THEN 'High'
			        ELSE 'Normal'
			    END AS priority,

			    mpmm.date_time_modified AS last,

			    mpmm.pm_date AS next,

			    CASE
					WHEN TRY_CAST(mcp.defined_life AS INT) > TRY_CAST(mpmm.current_life AS INT)
						THEN 'Remain'
					ELSE 'Over'
				END AS lifeStatus

			FROM mould_preventive_maintenance_master mpmm

			LEFT JOIN mould_childpart_master mcp
			    ON mpmm.mould_childpart_id = mcp.id

			LEFT JOIN mould_master mm
			    ON mcp.mould_id = mm.id

			WHERE (:mouldName IS NULL OR mpmm.mould_name LIKE '%' + :mouldName + '%')
			OR (:childPartName IS NULL OR mpmm.child_part_name LIKE '%' + :childPartName + '%')

			""", countQuery = """
			SELECT COUNT(*)
			FROM mould_preventive_maintenance_master mpmm

			LEFT JOIN mould_childpart_master mcp
			    ON mpmm.mould_childpart_id = mcp.id

			LEFT JOIN mould_master mm
			    ON mcp.mould_id = mm.id

			WHERE (:mouldName IS NULL OR mpmm.mould_name LIKE '%' + :mouldName + '%')
			OR (:childPartName IS NULL OR mpmm.child_part_name LIKE '%' + :childPartName + '%')

			""", nativeQuery = true)
	Page<PreventiveMaintenanceDTO> getLikePreventiveMaintenance(@Param("mouldName") String mouldname,
			@Param("childPartName") String childPartName, Pageable pageable);
	
	
	
	@Query(value = """
			SELECT
			    mm.mould_name AS mouldName,

			    mcp.child_part_name AS childPartName,
			    mcp.description AS description,

			    mcp.defined_life AS totalLife,
			    mcp.alarm_life AS alarmLife,

			    mpmm.pm_date AS pmDate,
			    mpmm.alert_days AS alertDays,
			    mpmm.current_life AS currentLife,


			    -- Days Remaining
			    DATEDIFF(DAY, GETDATE(), mpmm.pm_date) AS daysRemaining,

			    CASE
			        WHEN DATEDIFF(DAY, GETDATE(), mpmm.pm_date) < 0 THEN 'Overdue'
			        WHEN DATEDIFF(DAY, GETDATE(), mpmm.pm_date) <= mpmm.alert_days THEN 'High'
			        ELSE 'Normal'
			    END AS priority,

			    mpmm.date_time_modified AS last,

			    mpmm.pm_date AS next,

			    CASE
					WHEN TRY_CAST(mcp.defined_life AS INT) > TRY_CAST(mpmm.current_life AS INT)
						THEN 'Remain'
					ELSE 'Over'
				END AS lifeStatus

			FROM mould_preventive_maintenance_master mpmm

			LEFT JOIN mould_childpart_master mcp
			    ON mpmm.mould_childpart_id = mcp.id

			LEFT JOIN mould_master mm
			    ON mcp.mould_id = mm.id

			WHERE (:mouldName IS NULL OR mpmm.mould_name LIKE '%' + :mouldName + '%')
			OR (:childPartName IS NULL OR mpmm.child_part_name LIKE '%' + :childPartName + '%')

			""", countQuery = """
			SELECT COUNT(*)
			FROM mould_preventive_maintenance_master mpmm

			LEFT JOIN mould_childpart_master mcp
			    ON mpmm.mould_childpart_id = mcp.id

			LEFT JOIN mould_master mm
			    ON mcp.mould_id = mm.id

			WHERE (:mouldName IS NULL OR mpmm.mould_name LIKE '%' + :mouldName + '%')
			OR (:childPartName IS NULL OR mpmm.child_part_name LIKE '%' + :childPartName + '%')

			""", nativeQuery = true)
	List<PreventiveMaintenanceDTO> getAllPreventiveMaintenanceMaster(@Param("mouldName") String mouldname,
			@Param("childPartName") String childPartName);

	public Optional<MouldPreventiveMaintenanceMaster> findByMouldNameAndChildPartName(String mouldName,
			String childPartName);

}
