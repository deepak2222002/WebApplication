package web.minda.project.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "rack_master")
public class RackMaster {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long rackId;

	@Column(name = "bin_name")
	private String binName;

	@Column(name = "rack_name")
	private String rackName;

	@Column(name = "rack_number")
	private String rackNumber;

	@Column(name = "rack_code")
	private String rackCode;

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

	@ManyToOne
	@JoinColumn(name = "location_id")
	@JsonIgnoreProperties("racks")
	private LocationMaster location;

	public Long getRackId() {
		return rackId;
	}

	public void setRackId(Long rackId) {
		this.rackId = rackId;
	}

	public String getBinName() {
		return binName;
	}

	public void setBinName(String binName) {
		this.binName = binName;
	}

	public String getRackName() {
		return rackName;
	}

	public void setRackName(String rackName) {
		this.rackName = rackName;
	}

	public String getRackNumber() {
		return rackNumber;
	}

	public void setRackNumber(String rackNumber) {
		this.rackNumber = rackNumber;
	}

	public String getRackCode() {
		return rackCode;
	}

	public void setRackCode(String rackCode) {
		this.rackCode = rackCode;
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

	public LocationMaster getLocation() {
		return location;
	}

	public void setLocation(LocationMaster location) {
		this.location = location;
	}

	public RackMaster(Long rackId, String binName, String rackName, String rackNumber, String rackCode,
			String createdBy, String status, String dateTimeCreation, String dateTimeModified, String image,
			LocationMaster location) {
		super();
		this.rackId = rackId;
		this.binName = binName;
		this.rackName = rackName;
		this.rackNumber = rackNumber;
		this.rackCode = rackCode;
		this.createdBy = createdBy;
		this.status = status;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
		this.image = image;
		this.location = location;
	}

	public RackMaster() {
		super();
		// TODO Auto-generated constructor stub
	}

}
