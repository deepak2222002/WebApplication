package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.BinLocationAndQuantityMaster;
import web.minda.project.entity.PackingHistoryMaster;
import web.minda.project.entity.PackingSystemHardwareDetailMaster;

public interface PackingSystemHardwareDetailRepository extends JpaRepository<PackingSystemHardwareDetailMaster, Long> {

	   @Query(value = "SELECT * FROM packing_system_hardware_detail", nativeQuery = true)
	    List<PackingSystemHardwareDetailMaster> findAllHardwareDetails();
	   
	   @Query(value = "SELECT * FROM packing_system_hardware_detail where system_address = :systemAddress ", nativeQuery = true)
	    List<PackingSystemHardwareDetailMaster> findAllPackingSystemData(@Param("systemAddress") String systemAddress);
	   
	   public boolean existsByConnectionIpAndHardwareAndLabelType(String connectionIp, String hardwareName, String labelType);
	   
}
