package web.minda.project.entity;

import java.util.LinkedHashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "store_material_category_master")
public class StoreMaterialCategoryMaster {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long storeMaterialCategoryId;

	@Column(name = "category")
	private String category;

	@Column(name = "description")
	private String description;

	@Column(name = "box_input")
	private String boxInput;

	@Column(name = "max_box")
	private String maxBox;

	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "status")
	private String status;

	@Column(name = "date_time_creation")
	private String dateTimeCreation;

	@Column(name = "date_time_modified")
	private String dateTimeModified;

	@Column(name = "image")
	private String image;

	@OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnoreProperties("category")
	private Set<StoreMaterial> storeMaterial = new LinkedHashSet<>();

	@OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnoreProperties("category")
	private Set<StoreCategoryMapping> storeCategoryMappings = new LinkedHashSet<>();

	public Long getStoreMaterialCategoryId() {
		return storeMaterialCategoryId;
	}

	public void setStoreMaterialCategoryId(Long storeMaterialCategoryId) {
		this.storeMaterialCategoryId = storeMaterialCategoryId;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getBoxInput() {
		return boxInput;
	}

	public void setBoxInput(String boxInput) {
		this.boxInput = boxInput;
	}

	public String getMaxBox() {
		return maxBox;
	}

	public void setMaxBox(String maxBox) {
		this.maxBox = maxBox;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getDateTimeCreation() {
		return dateTimeCreation;
	}

	public void setDateTimeCreation(String dateTimeCreation) {
		this.dateTimeCreation = dateTimeCreation;
	}

	public String getDateTimeModified() {
		return dateTimeModified;
	}

	public void setDateTimeModified(String dateTimeModified) {
		this.dateTimeModified = dateTimeModified;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public Set<StoreMaterial> getStoreMaterial() {
		return storeMaterial;
	}

	public void setStoreMaterial(Set<StoreMaterial> storeMaterial) {
		this.storeMaterial = storeMaterial;
	}

	public Set<StoreCategoryMapping> getStoreCategoryMappings() {
		return storeCategoryMappings;
	}

	public void setStoreCategoryMappings(Set<StoreCategoryMapping> storeCategoryMappings) {
		this.storeCategoryMappings = storeCategoryMappings;
	}

	public StoreMaterialCategoryMaster(Long storeMaterialCategoryId, String category, String description,
			String boxInput, String maxBox, String createdBy, String status, String dateTimeCreation,
			String dateTimeModified, String image, Set<StoreMaterial> storeMaterial,
			Set<StoreCategoryMapping> storeCategoryMappings) {
		super();
		this.storeMaterialCategoryId = storeMaterialCategoryId;
		this.category = category;
		this.description = description;
		this.boxInput = boxInput;
		this.maxBox = maxBox;
		this.createdBy = createdBy;
		this.status = status;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
		this.image = image;
		this.storeMaterial = storeMaterial;
		this.storeCategoryMappings = storeCategoryMappings;
	}

	public StoreMaterialCategoryMaster() {
		super();
		// TODO Auto-generated constructor stub
	}

}
