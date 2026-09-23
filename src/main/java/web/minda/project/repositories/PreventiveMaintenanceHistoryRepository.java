package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.dto.PreventiveMaintenanceDTO;
import web.minda.project.entity.MouldMaster;
import web.minda.project.entity.MouldPreventiveMaintenanceMaster;
import web.minda.project.entity.PreventiveMaintenanceHistoryMaster;
import web.minda.project.entity.MouldMaster;

public interface PreventiveMaintenanceHistoryRepository
		extends JpaRepository<PreventiveMaintenanceHistoryMaster, Long> {

	@Query(value = """
			SELECT pmhm.*
			FROM preventive_maintenance_history_master pmhm
			WHERE (:mouldName IS NULL OR :mouldName = '' OR pmhm.mould_name LIKE '%' + :mouldName + '%')
			AND (:childPartName IS NULL OR :childPartName = '' OR pmhm.child_part_name LIKE '%' + :childPartName + '%')
			ORDER BY pmhm.id DESC
			""", countQuery = """
			SELECT COUNT(*)
			FROM preventive_maintenance_history_master pmhm
			WHERE (:mouldName IS NULL OR :mouldName = '' OR pmhm.mould_name LIKE '%' + :mouldName + '%')
			AND (:childPartName IS NULL OR :childPartName = '' OR pmhm.child_part_name LIKE '%' + :childPartName + '%')
			""", nativeQuery = true)
	Page<PreventiveMaintenanceHistoryMaster> getLikeMouldPreventiveMaintenanceHistory(
			@Param("childPartName") String childPartName, @Param("mouldName") String mouldName, Pageable pageable);

	@Query(value = """
			SELECT pmhm.*
			FROM preventive_maintenance_history_master pmhm
			WHERE (:mouldName IS NULL OR :mouldName = '' OR pmhm.mould_name LIKE '%' + :mouldName + '%')
			AND (:childPartName IS NULL OR :childPartName = '' OR pmhm.child_part_name LIKE '%' + :childPartName + '%')
			ORDER BY pmhm.id DESC
			""", nativeQuery = true)
	List<PreventiveMaintenanceHistoryMaster> getAllMouldPreventiveMaintenanceHistoryMaster(
			@Param("childPartName") String childPartName, @Param("mouldName") String mouldName);

}
