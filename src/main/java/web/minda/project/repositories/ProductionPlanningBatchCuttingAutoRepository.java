package web.minda.project.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import web.minda.project.entity.ProductionPlanningBatchCuttingAuto;

public interface ProductionPlanningBatchCuttingAutoRepository extends JpaRepository<ProductionPlanningBatchCuttingAuto, Long>{


    Optional<ProductionPlanningBatchCuttingAuto>
    findByChangeoverIdAndMachineNameAndArticleAndMouldNameAndCompoundCode(
            Long changeoverId,
            String machineName,
            String article,
            String mouldName,
            String compoundCode
    );
	
}
