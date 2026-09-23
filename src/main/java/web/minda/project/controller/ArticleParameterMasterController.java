package web.minda.project.controller;


import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import web.minda.project.entity.ArticleParameterMaster;
import web.minda.project.repositories.ArticleParameterRepository;
import web.minda.project.service.DateTimeService;

@RestController
@RequestMapping("/Controllers")
public class ArticleParameterMasterController {
	
	@Autowired
    ArticleParameterRepository articleParameterRepository;
	
	@Autowired
	private DateTimeService dateTimeService;
	
	
	@PostMapping("/insertArticleParameterMaster")
	public ResponseEntity<Object> insertArticleParameterMaster(
	        @RequestBody ArticleParameterMaster articleParameter) {

	    try {
	        boolean exists = articleParameterRepository
	                .existsByInternalArticleNameAndCustomerArticleName(articleParameter.getInternalArticleName().trim().toUpperCase(),articleParameter.getCustomerArticleName().trim().toUpperCase());

	        if (exists) {
	            return new ResponseEntity<>(
	                    "Internal Article already exists.",
	                    HttpStatus.NOT_ACCEPTABLE);
	        }

	        articleParameter.setInternalArticleName(
	                articleParameter.getInternalArticleName().trim().toUpperCase());

	        if (articleParameter.getCustomerArticleName() != null) {
	            articleParameter.setCustomerArticleName(
	                    articleParameter.getCustomerArticleName().trim().toUpperCase());
	        }

	        if (articleParameter.getCustomerName() != null) {
	            articleParameter.setCustomerName(
	                    articleParameter.getCustomerName().trim().toUpperCase());
	        }

	        if (articleParameter.getPackageType() != null) {
	            articleParameter.setPackageType(
	                    articleParameter.getPackageType().trim().toUpperCase());
	        }

	        if (articleParameter.getLotNumber() != null) {
	            articleParameter.setLotNumber(
	                    articleParameter.getLotNumber().trim().toUpperCase());
	        }

	        if (articleParameter.getSupplierCode() != null) {
	            articleParameter.setSupplierCode(
	                    articleParameter.getSupplierCode().trim().toUpperCase());
	        }

	        if (articleParameter.getSupplierNumber() != null) {
	            articleParameter.setSupplierNumber(
	                    articleParameter.getSupplierNumber().trim().toUpperCase());
	        }

	        if (articleParameter.getSupplierAddressLine2() != null) {
	            articleParameter.setSupplierAddressLine2(
	                    articleParameter.getSupplierAddressLine2().trim().toUpperCase());
	        }

	        if (articleParameter.getSupplierAddressLine3() != null) {
	            articleParameter.setSupplierAddressLine3(
	                    articleParameter.getSupplierAddressLine3().trim().toUpperCase());
	        }

	        if (articleParameter.getSupplierAddressLine4() != null) {
	            articleParameter.setSupplierAddressLine4(
	                    articleParameter.getSupplierAddressLine4().trim().toUpperCase());
	        }

	        if (articleParameter.getDestination() != null) {
	            articleParameter.setDestination(
	                    articleParameter.getDestination().trim().toUpperCase());
	        }

	        articleParameter.setDateTimeCreation(
	                dateTimeService.getCurrentDateAndTime());

	        articleParameter.setDateTimeModified(
	                dateTimeService.getCurrentDateAndTime());

	        articleParameterRepository.save(articleParameter);

	        return new ResponseEntity<>(
	                "Data added successfully.",
	                HttpStatus.OK);

	    } catch (Exception e) {
	        e.printStackTrace();

	        return new ResponseEntity<>(
	                "Something went wrong.",
	                HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	
	@PostMapping("/getLikeArticleParameter/{pageNum}/{pageSize}")
	public ResponseEntity<Object> getLikeArticleParameter(
	        @PathVariable("pageNum") int page,
	        @PathVariable("pageSize") int pageSize,
	        @RequestBody ArticleParameterMaster jsonObject) {

	    try {

	        Pageable pageable = PageRequest.of(page, pageSize);

	        Page<ArticleParameterMaster> object =
	                articleParameterRepository.getLikeArticleParameter(
	                        jsonObject.getInternalArticleName(),
	                        jsonObject.getCustomerArticleName(),
	                        jsonObject.getSupplierCode(),
	                        pageable);

	        return new ResponseEntity<>(object, HttpStatus.OK);

	    } catch (Exception e) {

	        e.printStackTrace();

	        return new ResponseEntity<>(
	                "Something went wrong.",
	                HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	
	
	@PostMapping("/editArticleParameterMaster")
	public ResponseEntity<Object> editArticleParameterMaster(
	        @RequestBody ArticleParameterMaster jsonObject) {

	    try {

	        if (jsonObject.getArticleParameterId() == null) {
	            return new ResponseEntity<>(
	                    "Article Parameter ID missing.",
	                    HttpStatus.NOT_ACCEPTABLE);
	        }

	        Optional<ArticleParameterMaster> articleOpt =
	                articleParameterRepository.findById(jsonObject.getArticleParameterId());

	        if (articleOpt.isEmpty()) {
	            return new ResponseEntity<>(
	                    "Article Parameter not found.",
	                    HttpStatus.NOT_ACCEPTABLE);
	        }

	        boolean exists = articleParameterRepository
	                .existsByInternalArticleNameAndCustomerArticleNameAndArticleParameterIdNot(
	                        jsonObject.getInternalArticleName().trim().toUpperCase(),
	                        jsonObject.getCustomerArticleName().trim().toUpperCase(),
	                        jsonObject.getArticleParameterId());

	        if (exists) {
	            return new ResponseEntity<>(
	                    "Internal Article and Customer Article already exist.",
	                    HttpStatus.NOT_ACCEPTABLE);
	        }

	        ArticleParameterMaster article = articleOpt.get();

	        article.setInternalArticleName(
	                jsonObject.getInternalArticleName().trim().toUpperCase());

	        if (jsonObject.getCustomerArticleName() != null) {
	            article.setCustomerArticleName(
	                    jsonObject.getCustomerArticleName().trim().toUpperCase());
	        }

	        if (jsonObject.getCustomerName() != null) {
	            article.setCustomerName(
	                    jsonObject.getCustomerName().trim().toUpperCase());
	        }

	        if (jsonObject.getPackageType() != null) {
	            article.setPackageType(
	                    jsonObject.getPackageType().trim().toUpperCase());
	        }

	        if (jsonObject.getLotNumber() != null) {
	            article.setLotNumber(
	                    jsonObject.getLotNumber().trim().toUpperCase());
	        }

	        if (jsonObject.getSupplierCode() != null) {
	            article.setSupplierCode(
	                    jsonObject.getSupplierCode().trim().toUpperCase());
	        }

	        if (jsonObject.getSupplierNumber() != null) {
	            article.setSupplierNumber(
	                    jsonObject.getSupplierNumber().trim().toUpperCase());
	        }

	        if (jsonObject.getSupplierAddressLine2() != null) {
	            article.setSupplierAddressLine2(
	                    jsonObject.getSupplierAddressLine2().trim().toUpperCase());
	        }

	        if (jsonObject.getSupplierAddressLine3() != null) {
	            article.setSupplierAddressLine3(
	                    jsonObject.getSupplierAddressLine3().trim().toUpperCase());
	        }

	        if (jsonObject.getSupplierAddressLine4() != null) {
	            article.setSupplierAddressLine4(
	                    jsonObject.getSupplierAddressLine4().trim().toUpperCase());
	        }

	        if (jsonObject.getDestination() != null) {
	            article.setDestination(
	                    jsonObject.getDestination().trim().toUpperCase());
	        }

	        article.setUnitWeightInGram(jsonObject.getUnitWeightInGram());
	        article.setToleranceInGram(jsonObject.getToleranceInGram());
	        article.setPiecesPerBox(jsonObject.getPiecesPerBox());
	        article.setAverageNumberOfPieces(jsonObject.getAverageNumberOfPieces());
	        article.setMultiplePackSize(jsonObject.getMultiplePackSize());
	        article.setMultipleBoxPackage(jsonObject.getMultipleBoxPackage());
	        article.setBoxWeightInKilogram(jsonObject.getBoxWeightInKilogram());
	        article.setBoxCount(jsonObject.getBoxCount());

	        article.setMedicalLabelExpiryInMonths(
	                jsonObject.getMedicalLabelExpiryInMonths());

	        article.setPrintCountryOfOrigin(
	                jsonObject.getPrintCountryOfOrigin());

	        article.setPrintMedicalLabel(
	                jsonObject.getPrintMedicalLabel());

	        article.setPrintMatLabel(
	                jsonObject.getPrintMatLabel());

	        article.setExternalSupplier(
	                jsonObject.getExternalSupplier());

	        article.setUnitSamples(
	                jsonObject.getUnitSamples());

	        article.setDateTimeModified(
	                dateTimeService.getCurrentDateAndTime());

	        articleParameterRepository.save(article);

	        return new ResponseEntity<>(
	                "Data updated successfully.",
	                HttpStatus.OK);

	    } catch (Exception e) {

	        e.printStackTrace();

	        return new ResponseEntity<>(
	                "Something went wrong.",
	                HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	
	@DeleteMapping("/deleteArticleParameter/{id}")
	public ResponseEntity<Object> deleteArticleParameter(@PathVariable Long id) {
		System.out.println("ok1");

	    try {

	        articleParameterRepository.deleteById(id);

	        return new ResponseEntity<>(
	                "Data deleted successfully.",
	                HttpStatus.OK);

	    } catch (DataIntegrityViolationException e) {

	        return new ResponseEntity<>(
	                "Unable to delete data due to mapping.",
	                HttpStatus.CONFLICT);

	    } catch (Exception e) {

	        return new ResponseEntity<>(
	                "Something went wrong.",
	                HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

}
