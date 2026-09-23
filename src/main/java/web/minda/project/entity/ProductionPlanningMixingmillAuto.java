package web.minda.project.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "production_planning_mixingmill_auto")
public class ProductionPlanningMixingmillAuto {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="changeover_id")
    private Long changeoverId;

    @Column(name="machine_name")
    private String machineName;
    
    @Column(name="article")
    private String article;
    
    @Column(name="mould_name")
    private String mouldName;
    
    @Column(name="compound_code")
    private String compoundCode;
    
    @Column(name="batch_weight")
    private Double batchWeight;
    
    @Column(name="shot_per_day")
    private Double shotPerDay;
    
    @Column(name="per_shot_weight")
    private Double perShotWeight;
    
    @Column(name="total_weight")
    private Double totalWeight;
    
    @Column(name="suggestive_batch")
    private Double suggestiveBatch;

    @Column(name="actual_batch")
    private String actualBatch;

    
	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "status")
	private String status;

	@Column(name = "date_time_creation")
	private String dateTimeCreation;

	@Column(name = "date_time_modified")
	private String dateTimeModified;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getChangeoverId() {
		return changeoverId;
	}

	public void setChangeoverId(Long changeoverId) {
		this.changeoverId = changeoverId;
	}

	public String getMachineName() {
		return machineName;
	}

	public void setMachineName(String machineName) {
		this.machineName = machineName;
	}

	public String getArticle() {
		return article;
	}

	public void setArticle(String article) {
		this.article = article;
	}

	public String getMouldName() {
		return mouldName;
	}

	public void setMouldName(String mouldName) {
		this.mouldName = mouldName;
	}

	public String getCompoundCode() {
		return compoundCode;
	}

	public void setCompoundCode(String compoundCode) {
		this.compoundCode = compoundCode;
	}

	public Double getBatchWeight() {
		return batchWeight;
	}

	public void setBatchWeight(Double batchWeight) {
		this.batchWeight = batchWeight;
	}

	public Double getShotPerDay() {
		return shotPerDay;
	}

	public void setShotPerDay(Double shotPerDay) {
		this.shotPerDay = shotPerDay;
	}

	public Double getPerShotWeight() {
		return perShotWeight;
	}

	public void setPerShotWeight(Double perShotWeight) {
		this.perShotWeight = perShotWeight;
	}

	public Double getTotalWeight() {
		return totalWeight;
	}

	public void setTotalWeight(Double totalWeight) {
		this.totalWeight = totalWeight;
	}

	public Double getSuggestiveBatch() {
		return suggestiveBatch;
	}

	public void setSuggestiveBatch(Double suggestiveBatch) {
		this.suggestiveBatch = suggestiveBatch;
	}

	public String getActualBatch() {
		return actualBatch;
	}

	public void setActualBatch(String actualBatch) {
		this.actualBatch = actualBatch;
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

	public ProductionPlanningMixingmillAuto(Long id, Long changeoverId, String machineName, String article,
			String mouldName, String compoundCode, Double batchWeight, Double shotPerDay, Double perShotWeight,
			Double totalWeight, Double suggestiveBatch, String actualBatch, String createdBy, String status,
			String dateTimeCreation, String dateTimeModified) {
		super();
		this.id = id;
		this.changeoverId = changeoverId;
		this.machineName = machineName;
		this.article = article;
		this.mouldName = mouldName;
		this.compoundCode = compoundCode;
		this.batchWeight = batchWeight;
		this.shotPerDay = shotPerDay;
		this.perShotWeight = perShotWeight;
		this.totalWeight = totalWeight;
		this.suggestiveBatch = suggestiveBatch;
		this.actualBatch = actualBatch;
		this.createdBy = createdBy;
		this.status = status;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
	}

	public ProductionPlanningMixingmillAuto() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	
}
