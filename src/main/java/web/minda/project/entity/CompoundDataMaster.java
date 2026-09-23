package web.minda.project.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "compound_data_master")
public class CompoundDataMaster {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long compoundDataId;

	@Column(name = "compound")
	private String compound;

	@Column(name = "batch_weight")
	private String batchWeight;

	@Column(name = "load_time")
	private String loadtime;

	@Column(name = "Mix_time")
	private String mixTime;

	@Column(name = "blend_time")
	private String blendTime;

	@Column(name = "handle_time")
	private String handleTime;

	@Column(name = "re_load_time")
	private String reLoadTime;

	@Column(name = "re_mix_time")
	private String reMixTime;

	@Column(name = "re_blend_time")
	private String reBlendTime;

	@Column(name = "re_handle_time")
	private String reHandleTime;

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

	public Long getCompoundDataId() {
		return compoundDataId;
	}

	public void setCompoundDataId(Long compoundDataId) {
		this.compoundDataId = compoundDataId;
	}

	public String getCompound() {
		return compound;
	}

	public void setCompound(String compound) {
		this.compound = compound;
	}

	public String getBatchWeight() {
		return batchWeight;
	}

	public void setBatchWeight(String batchWeight) {
		this.batchWeight = batchWeight;
	}

	public String getLoadtime() {
		return loadtime;
	}

	public void setLoadtime(String loadtime) {
		this.loadtime = loadtime;
	}

	public String getMixTime() {
		return mixTime;
	}

	public void setMixTime(String mixTime) {
		this.mixTime = mixTime;
	}

	public String getBlendTime() {
		return blendTime;
	}

	public void setBlendTime(String blendTime) {
		this.blendTime = blendTime;
	}

	public String getHandleTime() {
		return handleTime;
	}

	public void setHandleTime(String handleTime) {
		this.handleTime = handleTime;
	}

	public String getReLoadTime() {
		return reLoadTime;
	}

	public void setReLoadTime(String reLoadTime) {
		this.reLoadTime = reLoadTime;
	}

	public String getReMixTime() {
		return reMixTime;
	}

	public void setReMixTime(String reMixTime) {
		this.reMixTime = reMixTime;
	}

	public String getReBlendTime() {
		return reBlendTime;
	}

	public void setReBlendTime(String reBlendTime) {
		this.reBlendTime = reBlendTime;
	}

	public String getReHandleTime() {
		return reHandleTime;
	}

	public void setReHandleTime(String reHandleTime) {
		this.reHandleTime = reHandleTime;
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

	public CompoundDataMaster(Long compoundDataId, String compound, String batchWeight, String loadtime, String mixTime,
			String blendTime, String handleTime, String reLoadTime, String reMixTime, String reBlendTime,
			String reHandleTime, String createdBy, String status, String dateTimeCreation, String dateTimeModified,
			String image) {
		super();
		this.compoundDataId = compoundDataId;
		this.compound = compound;
		this.batchWeight = batchWeight;
		this.loadtime = loadtime;
		this.mixTime = mixTime;
		this.blendTime = blendTime;
		this.handleTime = handleTime;
		this.reLoadTime = reLoadTime;
		this.reMixTime = reMixTime;
		this.reBlendTime = reBlendTime;
		this.reHandleTime = reHandleTime;
		this.createdBy = createdBy;
		this.status = status;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
		this.image = image;
	}

	public CompoundDataMaster() {
		super();
		// TODO Auto-generated constructor stub
	}

}
