package web.minda.project.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "cold_master")
public class ColdMaster {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long coldId;

	@Column(name = "cold_name")
	private String coldName;
	
	@Column(name = "status")
	private String status;
	
	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "date_time_creation")
	private String dateTimeCreation;

	@Column(name = "date_time_modified")
	private String dateTimeModified;

	@Column(name = "image")
	private String image;
	
	@ManyToOne
	@JoinColumn(name = "mould_id")
	private MouldMaster mould;

	public Long getColdId() {
		return coldId;
	}

	public void setColdId(Long coldId) {
		this.coldId = coldId;
	}

	public String getColdName() {
		return coldName;
	}

	public void setColdName(String coldName) {
		this.coldName = coldName;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
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

	public MouldMaster getMould() {
		return mould;
	}

	public void setMould(MouldMaster mould) {
		this.mould = mould;
	}

	public ColdMaster(Long coldId, String coldName, String status, String createdBy, String dateTimeCreation,
			String dateTimeModified, String image, MouldMaster mould) {
		super();
		this.coldId = coldId;
		this.coldName = coldName;
		this.status = status;
		this.createdBy = createdBy;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
		this.image = image;
		this.mould = mould;
	}

	public ColdMaster() {
		super();
		// TODO Auto-generated constructor stub
	}

	
	
	
	
	
	
}
