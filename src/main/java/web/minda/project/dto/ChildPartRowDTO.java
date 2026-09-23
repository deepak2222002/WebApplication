package web.minda.project.dto;

public class ChildPartRowDTO {

    private String childPart;
    private String subChildPart;
    private String description;
    private String issuenceCategory;

    public String getChildPart() {
        return childPart;
    }

    public void setChildPart(String childPart) {
        this.childPart = childPart;
    }

    public String getSubChildPart() {
        return subChildPart;
    }

    public void setSubChildPart(String subChildPart) {
        this.subChildPart = subChildPart;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIssuenceCategory() {
        return issuenceCategory;
    }

    public void setIssuenceCategory(String issuenceCategory) {
        this.issuenceCategory = issuenceCategory;
    }
}