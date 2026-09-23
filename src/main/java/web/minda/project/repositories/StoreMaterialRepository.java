package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.StoreMaterial;

public interface StoreMaterialRepository extends JpaRepository<StoreMaterial, Long> {

	@Query(value="""
			select material from store_material_master 
			""",nativeQuery = true)
	public List<String> getAllStoreMaterialInList();
	


    @Query("""
        SELECT sm 
        FROM StoreMaterial sm
        ORDER BY sm.material ASC
    """)
    List<StoreMaterial> getAllActiveStoreMaterial();
	
	
	@Query(value="SELECT * FROM store_material_master ",nativeQuery = true)
	List<StoreMaterial> getAllStoreMaterialMasters();

//	@Query(value="select * from store_material_master  WHERE id = :storeMaterialId",nativeQuery = true)
//	public StoreMaterial findBystoreMaterialIds(@Param("storeMaterialId") Long rackId);
//	
//	@Query(value="select * from store_material_master  WHERE material = :material",nativeQuery = true)
//	public StoreMaterial findBymaterials(@Param("material") Long material);

	
	@Query(value = """
			SELECT * FROM store_material_master st left join store_material_category_master smcm on smcm.id=st.category_id where smcm.category =:category
			""",nativeQuery = true)
	List<StoreMaterial> getAllStoreMaterialFromCategory(@Param("category") String category);
	
	
	Optional<StoreMaterial> findByStoreMaterialId(Long storeMaterialId);
	Optional<StoreMaterial> findByCategory_Category(String category);
	Optional<StoreMaterial> findByMaterial(String material);
	Optional<StoreMaterial>  findByMaterialAndCategory_Category(String material,String category);
	


	boolean existsByStoreMaterialId(Long Id);
	boolean existsByCategory_Category(String category);
	boolean existsByMaterial(String material);
	boolean existsByMaterialAndCategory_Category(String material,String category);
	
	
	@Query(value = """
			SELECT CONCAT_WS(';',st.material,st.description,smcm.category ,st.status,st.created_by,
			 st.date_time_modified) FROM store_material_master st left join store_material_category_master smcm on smcm.id = st.category_id
			""",
		       nativeQuery = true)
		List<StoreMaterial> getalldata();

	@Query(
			value = """
			SELECT st.*
			FROM store_material_master st
			LEFT JOIN store_material_category_master smcm 
			       ON smcm.id = st.category_id
			WHERE (:material IS NULL OR :material = '' OR st.material LIKE '%' + :material + '%')
			AND (:description IS NULL OR :description = '' OR st.description LIKE '%' + :description + '%')
			AND (:category IS NULL OR :category = '' OR smcm.category LIKE '%' + :category + '%')
			AND (:createdBy IS NULL OR :createdBy = '' OR st.created_by LIKE '%' + :createdBy + '%')
			""",
			countQuery = """
			SELECT COUNT(*)
			FROM store_material_master st
			LEFT JOIN store_material_category_master smcm 
			       ON smcm.id = st.category_id
			WHERE (:material IS NULL OR :material = '' OR st.material LIKE '%' + :material + '%')
			AND (:description IS NULL OR :description = '' OR st.description LIKE '%' + :description + '%')
			AND (:category IS NULL OR :category = '' OR smcm.category LIKE '%' + :category + '%')
			AND (:createdBy IS NULL OR :createdBy = '' OR st.created_by LIKE '%' + :createdBy + '%')
			""",
			nativeQuery = true
			)
			Page<StoreMaterial> getLikeStoreMaterial(
			        @Param("material") String material,
			        @Param("description") String description,
			        @Param("category") String category,
			        @Param("createdBy") String createdBy,
			        Pageable pageable);
//	@Query(value = """
//	        SELECT * FROM store_material_master st left join store_material_category_master smcm on smcm.id = st.category_id
//	        WHERE (:material IS NULL OR :material = '' OR st.material LIKE CONCAT('%', :material, '%'))
//	        AND (:description IS NULL OR :description = '' OR st.description LIKE CONCAT('%', :description, '%'))
//	        AND (:category IS NULL OR :category = '' OR smcm.category LIKE CONCAT('%', :category, '%'))
//	        AND (:createdBy IS NULL OR :createdBy = '' OR st.created_by LIKE CONCAT('%', :createdBy, '%'))
//	        """,
//	        nativeQuery = true)
//	Page<StoreMaterial> getLikeStoreMaterial(
//	        @Param("material") String material,
//	        @Param("description") String description,	
//	        @Param("category") String category,
//	        @Param("createdBy") String createdBy,
//	        Pageable pageable);
	
	
	@Query(value = """
		    SELECT st.*
		    FROM store_material_master st
		    LEFT JOIN store_material_category_master smcm 
		           ON smcm.id = st.category_id
		    WHERE (:material IS NULL OR :material = '' 
		           OR LOWER(st.material) LIKE LOWER(CONCAT('%', :material, '%')))
		    AND (:description IS NULL OR :description = '' 
		         OR LOWER(st.description) LIKE LOWER(CONCAT('%', :description, '%')))
		    AND (:category IS NULL OR :category = '' 
		         OR LOWER(smcm.category) LIKE LOWER(CONCAT('%', :category, '%')))
		    AND (:allowMultiple IS NULL
                 OR st.allow_multiple = :allowMultiple)
		    AND (:createdBy IS NULL OR :createdBy = '' 
		         OR LOWER(st.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
		    """,
		    nativeQuery = true
		)
		List<StoreMaterial> getAllStoreMaterialMaster(
		        @Param("material") String material,
		        @Param("description") String description,
		        @Param("category") String category,
		        @Param("allowMultiple") Boolean allowMultiple,
		        @Param("createdBy") String createdBy
		);
	
//	@Query(value = """
//		    SELECT st.*
//		    FROM store_material_master st
//		    LEFT JOIN store_material_category_master smcm 
//		           ON smcm.id = st.category_id
//		    WHERE (:material IS NULL OR :material = '' 
//		           OR LOWER(st.material) LIKE LOWER(CONCAT('%', :material, '%')))
//		    AND (:description IS NULL OR :description = '' 
//		         OR LOWER(st.description) LIKE LOWER(CONCAT('%', :description, '%')))
//		    AND (:category IS NULL OR :category = '' 
//		         OR LOWER(smcm.category) LIKE LOWER(CONCAT('%', :category, '%')))
//		    AND (:createdBy IS NULL OR :createdBy = '' 
//		         OR LOWER(st.created_by) LIKE LOWER(CONCAT('%', :createdBy, '%')))
//		    """,
//		    nativeQuery = true
//		)
//		List<StoreMaterial> getAllStoreMaterialMaster(
//		        @Param("material") String material,
//		        @Param("description") String description,
//		        @Param("category") String category,
//		        @Param("createdBy") String createdBy
//		);
//	
	
	@Query(
			value = """
			SELECT  st.* FROM store_material_master st
			LEFT JOIN store_material_category_master smcm ON smcm.id = st.category_id
			WHERE  st.status = '0' And (:material IS NULL OR :material = '' OR st.material LIKE CONCAT('%', :material, '%'))
			AND (:description IS NULL OR :description = '' OR st.description LIKE CONCAT('%', :description, '%'))
			AND (:category IS NULL OR :category = '' OR smcm.category LIKE CONCAT('%', :category, '%'))
			AND (:createdBy IS NULL OR :createdBy = '' OR st.created_by LIKE CONCAT('%', :createdBy, '%'))
			""",
			countQuery = """
			SELECT COUNT(*) FROM store_material_master st
			LEFT JOIN store_material_category_master smcm ON smcm.id = st.category_id
			WHERE st.status = '0' And (:material IS NULL OR :material = '' OR st.material LIKE CONCAT('%', :material, '%'))
			AND (:description IS NULL OR :description = '' OR st.description LIKE CONCAT('%', :description, '%'))
			AND (:category IS NULL OR :category = '' OR smcm.category LIKE CONCAT('%', :category, '%'))
			AND (:createdBy IS NULL OR :createdBy = '' OR st.created_by LIKE CONCAT('%', :createdBy, '%'))
			""",
			nativeQuery = true
			)
			Page<StoreMaterial> getLikeStoreMaterial2(
			        @Param("material") String material,
			        @Param("description") String description,
			        @Param("category") String category,
			        @Param("createdBy") String createdBy,
			        Pageable pageable);



	public Optional<StoreMaterial> findByMaterialIgnoreCase(String partName);
	
	
}
