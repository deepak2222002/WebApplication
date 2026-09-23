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
@Table(name = "location_master")
public class LocationMaster {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long locationId;

	@Column(name = "location_name")
	private String locationName;

	@Column(name = "description")
	private String description;

	@Column(name = "code")
	private String code;

	@Column(name = "label_file_path")
	private String labelFilePath;

	@Column(name = "maximum_racks")
	private String maximumRacks;

	@Column(name = "reprint")
	private String reprint;

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

	@OneToMany(mappedBy = "location", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnoreProperties("location")
	private Set<RackMaster> racks = new LinkedHashSet<>();

	public Long getLocationId() {
		return locationId;
	}

	public void setLocationId(Long locationId) {
		this.locationId = locationId;
	}

	public String getLocationName() {
		return locationName;
	}

	public void setLocationName(String locationName) {
		this.locationName = locationName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getLabelFilePath() {
		return labelFilePath;
	}

	public void setLabelFilePath(String labelFilePath) {
		this.labelFilePath = labelFilePath;
	}

	public String getMaximumRacks() {
		return maximumRacks;
	}

	public void setMaximumRacks(String maximumRacks) {
		this.maximumRacks = maximumRacks;
	}

	public String getReprint() {
		return reprint;
	}

	public void setReprint(String reprint) {
		this.reprint = reprint;
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

	public Set<RackMaster> getRacks() {
		return racks;
	}

	public void setRacks(Set<RackMaster> racks) {
		this.racks = racks;
	}

	public LocationMaster(Long locationId, String locationName, String description, String code, String labelFilePath,
			String maximumRacks, String reprint, String createdBy, String status, String dateTimeCreation,
			String dateTimeModified, String image, Set<RackMaster> racks) {
		super();
		this.locationId = locationId;
		this.locationName = locationName;
		this.description = description;
		this.code = code;
		this.labelFilePath = labelFilePath;
		this.maximumRacks = maximumRacks;
		this.reprint = reprint;
		this.createdBy = createdBy;
		this.status = status;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
		this.image = image;
		this.racks = racks;
	}

	public LocationMaster() {
		super();
		// TODO Auto-generated constructor stub
	}

}
