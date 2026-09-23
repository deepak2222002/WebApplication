package web.minda.project.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.MasterDetails;

public interface MasterDetailsRepository extends CrudRepository<MasterDetails, Integer> {

	@Query("select m_d from MasterDetails m_d where m_d.masterId= :masterId")
	public MasterDetails getDataById(@Param("masterId") int masterId);

	@Query("select module from MasterDetails m_d WHERE m_d.module IS NOT NULL GROUP BY m_d.module ORDER By FIELD(module, 'User','ME', 'PE', 'Material','Engineering','Inspection','RQC','Reports','Others')")
	public List<String> getAllModule();

	@Query("select m_d.masterId from MasterDetails m_d where m_d.masterIdS= :masterIdS")
	public String getIdByMasterName(@Param("masterIdS") String masterIdS);

}
