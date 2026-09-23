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
@Table(name = "mould_childpart_master")
public class MouldChildPartMaster {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long mouldChildPartId;
	
	@Column(name = "mould_name")
	private String mouldName;
	
	@Column(name = "child_part_name")
	private String childPartName;

	@Column(name = "description")
	private String description;

	@Column(name = "child_part_type")
	private String childPartType;
	
	@Column(name = "defined_life")
	private String definedLife;

	@Column(name = "alarm_life")
	private String alarmLife;

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
	@JoinColumn(name = "mould_id")
	private MouldMaster mould;

	public Long getMouldChildPartId() {
		return mouldChildPartId;
	}

	public void setMouldChildPartId(Long mouldChildPartId) {
		this.mouldChildPartId = mouldChildPartId;
	}

	public String getMouldName() {
		return mouldName;
	}

	public void setMouldName(String mouldName) {
		this.mouldName = mouldName;
	}

	public String getChildPartName() {
		return childPartName;
	}

	public void setChildPartName(String childPartName) {
		this.childPartName = childPartName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getChildPartType() {
		return childPartType;
	}

	public void setChildPartType(String childPartType) {
		this.childPartType = childPartType;
	}

	public String getDefinedLife() {
		return definedLife;
	}

	public void setDefinedLife(String definedLife) {
		this.definedLife = definedLife;
	}

	public String getAlarmLife() {
		return alarmLife;
	}

	public void setAlarmLife(String alarmLife) {
		this.alarmLife = alarmLife;
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

	public MouldMaster getMould() {
		return mould;
	}

	public void setMould(MouldMaster mould) {
		this.mould = mould;
	}

	public MouldChildPartMaster(Long mouldChildPartId, String mouldName, String childPartName, String description,
			String childPartType, String definedLife, String alarmLife, String createdBy, String status,
			String dateTimeCreation, String dateTimeModified, String image, MouldMaster mould) {
		super();
		this.mouldChildPartId = mouldChildPartId;
		this.mouldName = mouldName;
		this.childPartName = childPartName;
		this.description = description;
		this.childPartType = childPartType;
		this.definedLife = definedLife;
		this.alarmLife = alarmLife;
		this.createdBy = createdBy;
		this.status = status;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
		this.image = image;
		this.mould = mould;
	}

	public MouldChildPartMaster() {
		super();
		// TODO Auto-generated constructor stub
	}

	
	
}
