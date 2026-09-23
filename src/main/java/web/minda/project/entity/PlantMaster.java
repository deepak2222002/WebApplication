package web.minda.project.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "plant_master")
public class PlantMaster {

	@Id
	@Column(name = "id")
	private Long plantId;

	@Column(name = "plant_name")
	private String plantName;

	@Column(name = "plant_code")
	private String plantCode;

	@Column(name = "plant_description")
	private String plantDescription;

	@Column(name = "plant_address")
	private String plantAddress;

	@Column(name = "plant_city")
	private String plantCity;

	@Column(name = "plant_state")
	private String plantState;

	@Column(name = "plant_pincode")
	private String plantPincode;

	@Column(name = "plant_contact_person")
	private String plantContactPerson;

	@Column(name = "plant_mobile_no")
	private String plantMobileNo;

	@Column(name = "plant_email")
	private String plantEmail;

	@Column(name = "plant_logopath")
	private String plantLogopath;

	@Column(name = "image")
	private String image;

	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "status")
	private String status;

	@Column(name = "date_time_creation")
	private String dateTimeCreation;

	@Column(name = "date_time_modified")
	private String dateTimeModified;

	public Long getPlantId() {
		return plantId;
	}

	public void setPlantId(Long plantId) {
		this.plantId = plantId;
	}

	public String getPlantName() {
		return plantName;
	}

	public void setPlantName(String plantName) {
		this.plantName = plantName;
	}

	public String getPlantCode() {
		return plantCode;
	}

	public void setPlantCode(String plantCode) {
		this.plantCode = plantCode;
	}

	public String getPlantDescription() {
		return plantDescription;
	}

	public void setPlantDescription(String plantDescription) {
		this.plantDescription = plantDescription;
	}

	public String getPlantAddress() {
		return plantAddress;
	}

	public void setPlantAddress(String plantAddress) {
		this.plantAddress = plantAddress;
	}

	public String getPlantCity() {
		return plantCity;
	}

	public void setPlantCity(String plantCity) {
		this.plantCity = plantCity;
	}

	public String getPlantState() {
		return plantState;
	}

	public void setPlantState(String plantState) {
		this.plantState = plantState;
	}

	public String getPlantPincode() {
		return plantPincode;
	}

	public void setPlantPincode(String plantPincode) {
		this.plantPincode = plantPincode;
	}

	public String getPlantContactPerson() {
		return plantContactPerson;
	}

	public void setPlantContactPerson(String plantContactPerson) {
		this.plantContactPerson = plantContactPerson;
	}

	public String getPlantMobileNo() {
		return plantMobileNo;
	}

	public void setPlantMobileNo(String plantMobileNo) {
		this.plantMobileNo = plantMobileNo;
	}

	public String getPlantEmail() {
		return plantEmail;
	}

	public void setPlantEmail(String plantEmail) {
		this.plantEmail = plantEmail;
	}

	public String getPlantLogopath() {
		return plantLogopath;
	}

	public void setPlantLogopath(String plantLogopath) {
		this.plantLogopath = plantLogopath;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
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

	public PlantMaster(Long plantId, String plantName, String plantCode, String plantDescription, String plantAddress,
			String plantCity, String plantState, String plantPincode, String plantContactPerson, String plantMobileNo,
			String plantEmail, String plantLogopath, String image, String createdBy, String status,
			String dateTimeCreation, String dateTimeModified) {
		super();
		this.plantId = plantId;
		this.plantName = plantName;
		this.plantCode = plantCode;
		this.plantDescription = plantDescription;
		this.plantAddress = plantAddress;
		this.plantCity = plantCity;
		this.plantState = plantState;
		this.plantPincode = plantPincode;
		this.plantContactPerson = plantContactPerson;
		this.plantMobileNo = plantMobileNo;
		this.plantEmail = plantEmail;
		this.plantLogopath = plantLogopath;
		this.image = image;
		this.createdBy = createdBy;
		this.status = status;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
	}

	public PlantMaster() {
		super();
		// TODO Auto-generated constructor stub
	}

}
