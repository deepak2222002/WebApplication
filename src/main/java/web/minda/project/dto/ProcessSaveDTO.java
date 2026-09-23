package web.minda.project.dto;

import java.util.List;

public class ProcessSaveDTO {

    private Long articleId;
    private String articleNo;
    private List<ProcessRowDTO> processes;

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

    public List<ProcessRowDTO> getProcesses() {
        return processes;
    }

    public void setProcesses(List<ProcessRowDTO> processes) {
        this.processes = processes;
    }
}