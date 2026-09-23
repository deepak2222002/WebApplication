package web.minda.project.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "article_parameter_master")
public class ArticleParameterMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long articleParameterId;

    @Column(name = "internal_article_name")
    private String internalArticleName;
    
    @Column(name = "article_description")
    private String articleDescription;

    @Column(name = "customer_article_name")
    private String customerArticleName;

    @Column(name = "package_type")
    private String packageType;

    @Column(name = "unit_weight_in_gram")
    private Float unitWeightInGram;

    @Column(name = "tolerance_in_gram")
    private Float toleranceInGram;

    @Column(name = "pieces_per_box")
    private Integer piecesPerBox;

    @Column(name = "lot_number")
    private String lotNumber;

    @Column(name = "average_number_of_pieces")
    private Integer averageNumberOfPieces;

    @Column(name = "multiple_box_package")
    private String multipleBoxPackage;

    @Column(name = "multiple_pack_size")
    private Integer multiplePackSize;

    @Column(name = "box_weight_in_kilogram")
    private Float boxWeightInKilogram;

    @Column(name = "box_count")
    private Integer boxCount;

    @Column(name = "medical_label_expiry_in_months")
    private String medicalLabelExpiryInMonths;

    @Column(name = "print_country_of_origin")
    private Boolean printCountryOfOrigin;

    @Column(name = "print_medical_label")
    private Boolean printMedicalLabel;

    @Column(name = "print_mat_label")
    private Boolean printMatLabel;

    @Column(name = "external_supplier")
    private Boolean externalSupplier;

    @Column(name = "supplier_code")
    private String supplierCode;

    @Column(name = "supplier_number")
    private String supplierNumber;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "destination")
    private String destination;

    @Column(name = "supplier_address_line_2")
    private String supplierAddressLine2;

    @Column(name = "supplier_address_line_3")
    private String supplierAddressLine3;

    @Column(name = "supplier_address_line_4")
    private String supplierAddressLine4;

    @Column(name = "unit_samples")
    private Integer unitSamples;
    
    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "date_time_creation")
    private String dateTimeCreation;

    @Column(name = "modified_by")
    private String modifiedBy;

    @Column(name = "date_time_modified")
    private String dateTimeModified;
    
    @Column(name = "image")
    private String image;

	public Long getArticleParameterId() {
		return articleParameterId;
	}

	public void setArticleParameterId(Long articleParameterId) {
		this.articleParameterId = articleParameterId;
	}

	public String getInternalArticleName() {
		return internalArticleName;
	}

	public void setInternalArticleName(String internalArticleName) {
		this.internalArticleName = internalArticleName;
	}

	public String getArticleDescription() {
		return articleDescription;
	}

	public void setArticleDescription(String articleDescription) {
		this.articleDescription = articleDescription;
	}

	public String getCustomerArticleName() {
		return customerArticleName;
	}

	public void setCustomerArticleName(String customerArticleName) {
		this.customerArticleName = customerArticleName;
	}

	public String getPackageType() {
		return packageType;
	}

	public void setPackageType(String packageType) {
		this.packageType = packageType;
	}

	public Float getUnitWeightInGram() {
		return unitWeightInGram;
	}

	public void setUnitWeightInGram(Float unitWeightInGram) {
		this.unitWeightInGram = unitWeightInGram;
	}

	public Float getToleranceInGram() {
		return toleranceInGram;
	}

	public void setToleranceInGram(Float toleranceInGram) {
		this.toleranceInGram = toleranceInGram;
	}

	public Integer getPiecesPerBox() {
		return piecesPerBox;
	}

	public void setPiecesPerBox(Integer piecesPerBox) {
		this.piecesPerBox = piecesPerBox;
	}

	public String getLotNumber() {
		return lotNumber;
	}

	public void setLotNumber(String lotNumber) {
		this.lotNumber = lotNumber;
	}

	public Integer getAverageNumberOfPieces() {
		return averageNumberOfPieces;
	}

	public void setAverageNumberOfPieces(Integer averageNumberOfPieces) {
		this.averageNumberOfPieces = averageNumberOfPieces;
	}

	public String getMultipleBoxPackage() {
		return multipleBoxPackage;
	}

	public void setMultipleBoxPackage(String multipleBoxPackage) {
		this.multipleBoxPackage = multipleBoxPackage;
	}

	public Integer getMultiplePackSize() {
		return multiplePackSize;
	}

	public void setMultiplePackSize(Integer multiplePackSize) {
		this.multiplePackSize = multiplePackSize;
	}

	public Float getBoxWeightInKilogram() {
		return boxWeightInKilogram;
	}

	public void setBoxWeightInKilogram(Float boxWeightInKilogram) {
		this.boxWeightInKilogram = boxWeightInKilogram;
	}

	public Integer getBoxCount() {
		return boxCount;
	}

	public void setBoxCount(Integer boxCount) {
		this.boxCount = boxCount;
	}

	public String getMedicalLabelExpiryInMonths() {
		return medicalLabelExpiryInMonths;
	}

	public void setMedicalLabelExpiryInMonths(String medicalLabelExpiryInMonths) {
		this.medicalLabelExpiryInMonths = medicalLabelExpiryInMonths;
	}

	public Boolean getPrintCountryOfOrigin() {
		return printCountryOfOrigin;
	}

	public void setPrintCountryOfOrigin(Boolean printCountryOfOrigin) {
		this.printCountryOfOrigin = printCountryOfOrigin;
	}

	public Boolean getPrintMedicalLabel() {
		return printMedicalLabel;
	}

	public void setPrintMedicalLabel(Boolean printMedicalLabel) {
		this.printMedicalLabel = printMedicalLabel;
	}

	public Boolean getPrintMatLabel() {
		return printMatLabel;
	}

	public void setPrintMatLabel(Boolean printMatLabel) {
		this.printMatLabel = printMatLabel;
	}

	public Boolean getExternalSupplier() {
		return externalSupplier;
	}

	public void setExternalSupplier(Boolean externalSupplier) {
		this.externalSupplier = externalSupplier;
	}

	public String getSupplierCode() {
		return supplierCode;
	}

	public void setSupplierCode(String supplierCode) {
		this.supplierCode = supplierCode;
	}

	public String getSupplierNumber() {
		return supplierNumber;
	}

	public void setSupplierNumber(String supplierNumber) {
		this.supplierNumber = supplierNumber;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public String getDestination() {
		return destination;
	}

	public void setDestination(String destination) {
		this.destination = destination;
	}

	public String getSupplierAddressLine2() {
		return supplierAddressLine2;
	}

	public void setSupplierAddressLine2(String supplierAddressLine2) {
		this.supplierAddressLine2 = supplierAddressLine2;
	}

	public String getSupplierAddressLine3() {
		return supplierAddressLine3;
	}

	public void setSupplierAddressLine3(String supplierAddressLine3) {
		this.supplierAddressLine3 = supplierAddressLine3;
	}

	public String getSupplierAddressLine4() {
		return supplierAddressLine4;
	}

	public void setSupplierAddressLine4(String supplierAddressLine4) {
		this.supplierAddressLine4 = supplierAddressLine4;
	}

	public Integer getUnitSamples() {
		return unitSamples;
	}

	public void setUnitSamples(Integer unitSamples) {
		this.unitSamples = unitSamples;
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

	public String getModifiedBy() {
		return modifiedBy;
	}

	public void setModifiedBy(String modifiedBy) {
		this.modifiedBy = modifiedBy;
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

	public ArticleParameterMaster(Long articleParameterId, String internalArticleName, String articleDescription,
			String customerArticleName, String packageType, Float unitWeightInGram, Float toleranceInGram,
			Integer piecesPerBox, String lotNumber, Integer averageNumberOfPieces, String multipleBoxPackage,
			Integer multiplePackSize, Float boxWeightInKilogram, Integer boxCount, String medicalLabelExpiryInMonths,
			Boolean printCountryOfOrigin, Boolean printMedicalLabel, Boolean printMatLabel, Boolean externalSupplier,
			String supplierCode, String supplierNumber, String customerName, String destination,
			String supplierAddressLine2, String supplierAddressLine3, String supplierAddressLine4, Integer unitSamples,
			String createdBy, String dateTimeCreation, String modifiedBy, String dateTimeModified, String image) {
		super();
		this.articleParameterId = articleParameterId;
		this.internalArticleName = internalArticleName;
		this.articleDescription = articleDescription;
		this.customerArticleName = customerArticleName;
		this.packageType = packageType;
		this.unitWeightInGram = unitWeightInGram;
		this.toleranceInGram = toleranceInGram;
		this.piecesPerBox = piecesPerBox;
		this.lotNumber = lotNumber;
		this.averageNumberOfPieces = averageNumberOfPieces;
		this.multipleBoxPackage = multipleBoxPackage;
		this.multiplePackSize = multiplePackSize;
		this.boxWeightInKilogram = boxWeightInKilogram;
		this.boxCount = boxCount;
		this.medicalLabelExpiryInMonths = medicalLabelExpiryInMonths;
		this.printCountryOfOrigin = printCountryOfOrigin;
		this.printMedicalLabel = printMedicalLabel;
		this.printMatLabel = printMatLabel;
		this.externalSupplier = externalSupplier;
		this.supplierCode = supplierCode;
		this.supplierNumber = supplierNumber;
		this.customerName = customerName;
		this.destination = destination;
		this.supplierAddressLine2 = supplierAddressLine2;
		this.supplierAddressLine3 = supplierAddressLine3;
		this.supplierAddressLine4 = supplierAddressLine4;
		this.unitSamples = unitSamples;
		this.createdBy = createdBy;
		this.dateTimeCreation = dateTimeCreation;
		this.modifiedBy = modifiedBy;
		this.dateTimeModified = dateTimeModified;
		this.image = image;
	}

	public ArticleParameterMaster() {
		super();
		// TODO Auto-generated constructor stub
	}

	
	
    
    
}