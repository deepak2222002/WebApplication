package web.minda.project.dto;

import java.util.List;

public class ChildPartSaveDTO {

    private Long articleId;
    private String articleNo;
    private List<ChildPartRowDTO> childParts;

    public Long getArticleId() {
        return articleId;
    }

    public void setArticleId(Long articleId) {
        this.articleId = articleId;
    }

    public String getArticleNo() {
        return articleNo;
    }

    public void setArticleNo(String articleNo) {
        this.articleNo = articleNo;
    }

    public List<ChildPartRowDTO> getChildParts() {
        return childParts;
    }

    public void setChildParts(List<ChildPartRowDTO> childParts) {
        this.childParts = childParts;
    }
}