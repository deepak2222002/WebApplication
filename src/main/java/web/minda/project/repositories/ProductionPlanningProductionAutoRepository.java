package web.minda.project.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import web.minda.project.entity.ProductionPlanningProductionAuto;

public interface ProductionPlanningProductionAutoRepository extends JpaRepository<ProductionPlanningProductionAuto, Long>{
	
//	
//	Optional<ProductionPlanningProductionAuto>
//	findByChangeoverIdAndMachineNameAndArticleAndMouldNameAndCompoundCode(
//	        Long changeoverId,
//	        String machineName,
//	        String article,
//	        String mouldName,
//	        String compoundCode
//	);
	

    Optional<ProductionPlanningProductionAuto>
    findByChangeoverIdAndMachineNameAndArticleAndMouldNameAndPartNo(
            Long changeoverId,
            String machineName,
            String article,
            String mouldName,
            String partNo
    );

}
