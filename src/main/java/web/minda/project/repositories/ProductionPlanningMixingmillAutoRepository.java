package web.minda.project.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import web.minda.project.entity.ProductionMouldMaster;
import web.minda.project.entity.ProductionPlanningMixingmillAuto;

public interface ProductionPlanningMixingmillAutoRepository extends JpaRepository<ProductionPlanningMixingmillAuto, Long>{


    Optional<ProductionPlanningMixingmillAuto>
    findByChangeoverIdAndMachineNameAndArticleAndMouldNameAndCompoundCode(
            Long changeoverId,
            String machineName,
            String article,
            String mouldName,
            String compoundCode
    );

}
