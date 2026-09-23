package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.CompoundDataMaster;

public interface CompoundDataRepository extends JpaRepository<CompoundDataMaster, Long> {

	@Query(value = """
			select compound from compound_data_master
			""", nativeQuery = true)
	public List<String> getAllCompoundList();

	@Query(value = "SELECT * FROM compound_data_master ", nativeQuery = true)
	List<CompoundDataMaster> getAllCompoundDataMasters();

//	@Query(value="select * from compound_data_master  WHERE id = :compoundDataId",nativeQuery = true)
//	public CompoundDataMaster findBycompoundDataIds(@Param("compoundDataId") Long compoundDataId);
//	
//	@Query(value="select * from compound_data_master  WHERE compound = :compound",nativeQuery = true)
//	public CompoundDataMaster findBycompounds(@Param("compound") Long compound);
//	
//	@Query(value="select * from compound_data_master  WHERE address = :address",nativeQuery = true)
//	public CompoundDataMaster findByAddresss(@Param("address") Long address);

	Optional<CompoundDataMaster> findByCompoundDataId(Long compoundDataId);

	Optional<CompoundDataMaster> findByCompound(String compound);

	Optional<CompoundDataMaster> findByCompoundAndBatchWeightAndLoadtimeAndMixTimeAndBlendTimeAndHandleTimeAndReLoadTimeAndReMixTimeAndReBlendTimeAndReHandleTime(
			String compound, String batchWeight, String loadtime, String mixTime, String blendTime, String handleTime,
			String reLoadTime, String reMixTime, String reBlendTime, String reHandleTime);

	boolean existsByCompoundDataId(Long Id);

	boolean existsByCompound(String compound);

	boolean existsByCompoundAndBatchWeightAndLoadtimeAndMixTimeAndBlendTimeAndHandleTimeAndReLoadTimeAndReMixTimeAndReBlendTimeAndReHandleTime(
			String compound, String batchWeight, String loadtime, String mixTime, String blendTime, String handleTime,
			String reLoadTime, String reMixTime, String reBlendTime, String reHandleTime);

	@Query(value = """
			SELECT CONCAT_WS(';',compound, batch_weight, load_time,Mix_time,blend_time,handle_time,re_load_time,re_mix_time,re_blend_time,re_handle_time, status,created_by,
			 date_time_modified) FROM compound_data_master
			""", nativeQuery = true)
	List<CompoundDataMaster> getalldata();
	
	@Query(
			value = """
			SELECT *
			FROM compound_data_master cdm
			WHERE (:compound IS NULL OR :compound = '' OR cdm.compound LIKE '%' + :compound + '%')
			AND (:batch_weight IS NULL OR :batch_weight = '' OR cdm.batch_weight LIKE '%' + :batch_weight + '%')
			AND (:load_time IS NULL OR :load_time = '' OR cdm.load_time LIKE '%' + :load_time + '%')
			AND (:mix_time IS NULL OR :mix_time = '' OR cdm.mix_time LIKE '%' + :mix_time + '%')
			AND (:blend_time IS NULL OR :blend_time = '' OR cdm.blend_time LIKE '%' + :blend_time + '%')
			AND (:handle_time IS NULL OR :handle_time = '' OR cdm.handle_time LIKE '%' + :handle_time + '%')
			AND (:re_load_time IS NULL OR :re_load_time = '' OR cdm.re_load_time LIKE '%' + :re_load_time + '%')
			AND (:re_mix_time IS NULL OR :re_mix_time = '' OR cdm.re_mix_time LIKE '%' + :re_mix_time + '%')
			AND (:re_blend_time IS NULL OR :re_blend_time = '' OR cdm.re_blend_time LIKE '%' + :re_blend_time + '%')
			AND (:re_handle_time IS NULL OR :re_handle_time = '' OR cdm.re_handle_time LIKE '%' + :re_handle_time + '%')
			AND (:status IS NULL OR :status = '' OR cdm.status LIKE '%' + :status + '%')
			AND (:created_by IS NULL OR :created_by = '' OR cdm.created_by LIKE '%' + :created_by + '%')
			""",

			countQuery = """
			SELECT COUNT(*)
			FROM compound_data_master cdm
			WHERE (:compound IS NULL OR :compound = '' OR cdm.compound LIKE '%' + :compound + '%')
			AND (:batch_weight IS NULL OR :batch_weight = '' OR cdm.batch_weight LIKE '%' + :batch_weight + '%')
			AND (:load_time IS NULL OR :load_time = '' OR cdm.load_time LIKE '%' + :load_time + '%')
			AND (:mix_time IS NULL OR :mix_time = '' OR cdm.mix_time LIKE '%' + :mix_time + '%')
			AND (:blend_time IS NULL OR :blend_time = '' OR cdm.blend_time LIKE '%' + :blend_time + '%')
			AND (:handle_time IS NULL OR :handle_time = '' OR cdm.handle_time LIKE '%' + :handle_time + '%')
			AND (:re_load_time IS NULL OR :re_load_time = '' OR cdm.re_load_time LIKE '%' + :re_load_time + '%')
			AND (:re_mix_time IS NULL OR :re_mix_time = '' OR cdm.re_mix_time LIKE '%' + :re_mix_time + '%')
			AND (:re_blend_time IS NULL OR :re_blend_time = '' OR cdm.re_blend_time LIKE '%' + :re_blend_time + '%')
			AND (:re_handle_time IS NULL OR :re_handle_time = '' OR cdm.re_handle_time LIKE '%' + :re_handle_time + '%')
			AND (:status IS NULL OR :status = '' OR cdm.status LIKE '%' + :status + '%')
			AND (:created_by IS NULL OR :created_by = '' OR cdm.created_by LIKE '%' + :created_by + '%')
			""",

			nativeQuery = true
			)
			Page<CompoundDataMaster> getLikeCompound(
			        @Param("compound") String compound,
			        @Param("batch_weight") String batch_weight,
			        @Param("load_time") String load_time,
			        @Param("mix_time") String mix_time,
			        @Param("blend_time") String blend_time,
			        @Param("handle_time") String handle_time,
			        @Param("re_load_time") String re_load_time,
			        @Param("re_mix_time") String re_mix_time,
			        @Param("re_blend_time") String re_blend_time,
			        @Param("re_handle_time") String re_handle_time,
			        @Param("status") String status,
			        @Param("created_by") String created_by,
			        Pageable pageable
			);
	
	
//	@Query(value = """
//			SELECT * FROM compound_data_master
//			WHERE (:compound IS NULL OR :compound = '' OR compound LIKE CONCAT('%', :compound, '%'))
//			AND (:batch_weight IS NULL OR :batch_weight = '' OR batch_weight LIKE CONCAT('%', :batch_weight, '%'))
//			AND (:load_time IS NULL OR :load_time = '' OR load_time LIKE CONCAT('%', :load_time, '%'))
//			 AND (:Mix_time IS NULL OR :Mix_time = '' OR Mix_time LIKE CONCAT('%', :Mix_time, '%'))
//			  AND (:blend_time IS NULL OR :blend_time = '' OR blend_time LIKE CONCAT('%', :blend_time, '%'))
//			   AND (:handle_time IS NULL OR :handle_time = '' OR handle_time LIKE CONCAT('%', :handle_time, '%'))
//			    AND (:re_load_time IS NULL OR :re_load_time = '' OR re_load_time LIKE CONCAT('%', :re_load_time, '%'))
//			     AND (:re_mix_time IS NULL OR :re_mix_time = '' OR re_mix_time LIKE CONCAT('%', :re_mix_time, '%'))
//			      AND (:re_blend_time IS NULL OR :re_blend_time = '' OR re_blend_time LIKE CONCAT('%', :re_blend_time, '%'))
//			        AND (:re_handle_time IS NULL OR :re_handle_time = '' OR re_handle_time LIKE CONCAT('%', :re_handle_time, '%'))
//			AND (:status IS NULL OR :status = '' OR status LIKE CONCAT('%', :status, '%'))
//			AND (:created_by IS NULL OR :createdBy = '' OR created_by LIKE CONCAT('%', :created_by, '%'))
//			""", nativeQuery = true)
//	Page<CompoundDataMaster> getLikeCompound(@Param("compound") String compound,
//			@Param("batch_weight") String batch_weight, @Param("load_time") String load_time,
//			@Param("Mix_time") String Mix_time, @Param("blend_time") String blend_time,
//			@Param("handle_time") String handle_time, @Param("re_load_time") String re_load_time,
//			@Param("re_mix_time") String re_mix_time, @Param("re_blend_time") String re_blend_time,
//			@Param("re_handle_time") String re_handle_time, @Param("status") String status,
//			@Param("created_by") String created_by, Pageable pageable);
	
	
	@Query(value = """
		    SELECT *
		    FROM compound_data_master cdm
		    WHERE (:compound IS NULL OR :compound = '' 
		           OR LOWER(cdm.compound) LIKE LOWER(CONCAT('%', :compound, '%')))
		    AND (:batch_weight IS NULL OR :batch_weight = '' 
		         OR LOWER(cdm.batch_weight) LIKE LOWER(CONCAT('%', :batch_weight, '%')))
		    AND (:load_time IS NULL OR :load_time = '' 
		         OR LOWER(cdm.load_time) LIKE LOWER(CONCAT('%', :load_time, '%')))
		    AND (:mix_time IS NULL OR :mix_time = '' 
		         OR LOWER(cdm.mix_time) LIKE LOWER(CONCAT('%', :mix_time, '%')))
		    AND (:blend_time IS NULL OR :blend_time = '' 
		         OR LOWER(cdm.blend_time) LIKE LOWER(CONCAT('%', :blend_time, '%')))
		    AND (:handle_time IS NULL OR :handle_time = '' 
		         OR LOWER(cdm.handle_time) LIKE LOWER(CONCAT('%', :handle_time, '%')))
		    AND (:re_load_time IS NULL OR :re_load_time = '' 
		         OR LOWER(cdm.re_load_time) LIKE LOWER(CONCAT('%', :re_load_time, '%')))
		    AND (:re_mix_time IS NULL OR :re_mix_time = '' 
		         OR LOWER(cdm.re_mix_time) LIKE LOWER(CONCAT('%', :re_mix_time, '%')))
		    AND (:re_blend_time IS NULL OR :re_blend_time = '' 
		         OR LOWER(cdm.re_blend_time) LIKE LOWER(CONCAT('%', :re_blend_time, '%')))
		    AND (:re_handle_time IS NULL OR :re_handle_time = '' 
		         OR LOWER(cdm.re_handle_time) LIKE LOWER(CONCAT('%', :re_handle_time, '%')))
		    AND (:status IS NULL OR :status = '' 
		         OR LOWER(cdm.status) LIKE LOWER(CONCAT('%', :status, '%')))
		    AND (:created_by IS NULL OR :created_by = '' 
		         OR LOWER(cdm.created_by) LIKE LOWER(CONCAT('%', :created_by, '%')))
		    """,
		    nativeQuery = true
		)
		List<CompoundDataMaster> getAllCompoundMaster(
		        @Param("compound") String compound,
		        @Param("batch_weight") String batch_weight,
		        @Param("load_time") String load_time,
		        @Param("mix_time") String mix_time,
		        @Param("blend_time") String blend_time,
		        @Param("handle_time") String handle_time,
		        @Param("re_load_time") String re_load_time,
		        @Param("re_mix_time") String re_mix_time,
		        @Param("re_blend_time") String re_blend_time,
		        @Param("re_handle_time") String re_handle_time,
		        @Param("status") String status,
		        @Param("created_by") String created_by
		);

}
