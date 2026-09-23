package web.minda.project.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.dto.ProductionPlanningDTO;
import web.minda.project.entity.MouldMaster;
import web.minda.project.entity.ProductionPlanning;
import web.minda.project.entity.ProductionPlanningChangeoverPlan;
import web.minda.project.entity.MouldMaster;

public interface ProductionPlanningChangeoverPlanRepository
		extends JpaRepository<ProductionPlanningChangeoverPlan, Long> {

	Optional<ProductionPlanningChangeoverPlan> findTopByMachineNameOrderBySequenceNoDesc(String machineName);
	
	Optional<ProductionPlanningChangeoverPlan> findByChangeoverId(Long changeoverId);
	
	@Query(value = "SELECT MIN(CAST(defined_life AS INT)) " +
	        "FROM mould_childpart_master " +
	        "WHERE mould_name = :mould",
	        nativeQuery = true)
	Integer getMinShotsByMould(@Param("mould") String mould);

//    @Query(value = "SELECT ISNULL(SUM(planned_shots),0) FROM production_planning_changeover_plan WHERE mould_name = :mould AND planned_date = :plannedDate",
//            nativeQuery = true)
//    Integer getUsedShotsByMouldAndDate(@Param("mould") String mould,
//                                       @Param("plannedDate") LocalDate plannedDate);
//
//    @Query(value = "SELECT article FROM production_planning_changeover_plan WHERE mould_name = :mould AND planned_date = :plannedDate AND article <> :article",
//            nativeQuery = true)
//    List<String> findOtherArticleUsingMould(@Param("mould") String mould,
//                                           @Param("plannedDate") LocalDate plannedDate,
//                                           @Param("article") String article);
    
    @Query(value = "SELECT ISNULL(SUM(planned_shots),0) " +
            "FROM production_planning_changeover_plan " +
            "WHERE mould_name = :mould " +
            "AND planned_date = :plannedDate",
            nativeQuery = true)
    Integer getUsedShotsByMouldAndDate(@Param("mould") String mould,
                                       @Param("plannedDate") String plannedDate);
    
    
    @Query(value =
            "SELECT TOP 1 machine_name " +
            "FROM production_planning_changeover_plan " +
            "WHERE planned_date = :plannedDate " +
            "AND machine_name <> :machineName " +
            "AND (mould_name = :mould OR duplicate_mould_name = :mould)",
            nativeQuery = true)
    String findOtherMachineUsingMouldOrDuplicate(@Param("mould") String mould,
                                                 @Param("plannedDate") String plannedDate,
                                                 @Param("machineName") String machineName);

    void deleteByMachineName(String machineName);

    void deleteByMachineNameAndPlanType(String machineName, String planType);

    
    void deleteByMachineNameAndPlannedDate(String machineName, String plannedDate);

    void deleteByMachineNameAndPlannedDateAndPlanType(String machineName, String plannedDate, String planType);

    List<ProductionPlanningChangeoverPlan> 
    findByMachineNameAndPlannedDate(String machineName, String plannedDate);


    List<ProductionPlanningChangeoverPlan>
    findByMachineNameAndPlannedDateAndPlanType(
        String machineName,
        String plannedDate,
        String planType
    );
    
    
    Optional<ProductionPlanningChangeoverPlan>
    findTopByMachineNameAndPlanIdIsNotNull(String machineName);

}
