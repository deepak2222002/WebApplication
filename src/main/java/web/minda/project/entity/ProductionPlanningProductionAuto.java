package web.minda.project.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "production_planning_production_auto")
public class ProductionPlanningProductionAuto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long productionPlanningProductionAutoId;

    @Column(name="changeover_id")
    private Long changeoverId;
    
    @Column(name="machine_name")
    private String machineName;
    
    @Column(name="article")
    private String article;
    
    @Column(name="mould_name")
    private String mouldName;

    
    @Column(name="part_no")
    private String partNo;
    
    @Column(name="category")
    private String category;

    @Column(name="shots_per_day")
    private Double shotsPerDay;
    
    @Column(name="per_shot_pcs")
    private Double perShotPcs;
    
    @Column(name="total_pcs")
    private Double totalPcs;
    
    @Column(name="suggestivePcs")
    private Double suggestivePcs;

    @Column(name="actual_box")
    private String actualBox;
    
	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "status")
	private String status;

	@Column(name = "date_time_creation")
	private String dateTimeCreation;

	@Column(name = "date_time_modified")
	private String dateTimeModified;

	public Long getProductionPlanningProductionAutoId() {
		return productionPlanningProductionAutoId;
	}

	public void setProductionPlanningProductionAutoId(Long productionPlanningProductionAutoId) {
		this.productionPlanningProductionAutoId = productionPlanningProductionAutoId;
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

	public String getPartNo() {
		return partNo;
	}

	public void setPartNo(String partNo) {
		this.partNo = partNo;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public Double getShotsPerDay() {
		return shotsPerDay;
	}

	public void setShotsPerDay(Double shotsPerDay) {
		this.shotsPerDay = shotsPerDay;
	}

	public Double getPerShotPcs() {
		return perShotPcs;
	}

	public void setPerShotPcs(Double perShotPcs) {
		this.perShotPcs = perShotPcs;
	}

	public Double getTotalPcs() {
		return totalPcs;
	}

	public void setTotalPcs(Double totalPcs) {
		this.totalPcs = totalPcs;
	}

	public Double getSuggestivePcs() {
		return suggestivePcs;
	}

	public void setSuggestivePcs(Double suggestivePcs) {
		this.suggestivePcs = suggestivePcs;
	}

	public String getActualBox() {
		return actualBox;
	}

	public void setActualBox(String actualBox) {
		this.actualBox = actualBox;
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

	public ProductionPlanningProductionAuto(Long productionPlanningProductionAutoId, Long changeoverId,
			String machineName, String article, String mouldName, String partNo, String category, Double shotsPerDay,
			Double perShotPcs, Double totalPcs, Double suggestivePcs, String actualBox, String createdBy, String status,
			String dateTimeCreation, String dateTimeModified) {
		super();
		this.productionPlanningProductionAutoId = productionPlanningProductionAutoId;
		this.changeoverId = changeoverId;
		this.machineName = machineName;
		this.article = article;
		this.mouldName = mouldName;
		this.partNo = partNo;
		this.category = category;
		this.shotsPerDay = shotsPerDay;
		this.perShotPcs = perShotPcs;
		this.totalPcs = totalPcs;
		this.suggestivePcs = suggestivePcs;
		this.actualBox = actualBox;
		this.createdBy = createdBy;
		this.status = status;
		this.dateTimeCreation = dateTimeCreation;
		this.dateTimeModified = dateTimeModified;
	}

	public ProductionPlanningProductionAuto() {
		super();
		// TODO Auto-generated constructor stub
	}


	
}
