package com.resumeportal.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
public class Job {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "File URL is required")
    private String fileUrl;
    
    @Enumerated(EnumType.STRING)
    @NotNull(message = "File type is required")
    private FileType fileType;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    private Boolean visible = true;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
    
    public enum FileType {
        IMAGE, PDF
    }
    
    public Job() {
        this.createdAt = LocalDateTime.now();
    }
    
    public Job(String title, String fileUrl, FileType fileType, Boolean visible, Company company) {
        this.title = title;
        this.fileUrl = fileUrl;
        this.fileType = fileType;
        this.visible = visible;
        this.company = company;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    
    public FileType getFileType() { return fileType; }
    public void setFileType(FileType fileType) { this.fileType = fileType; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public Boolean getVisible() { return visible; }
    public void setVisible(Boolean visible) { this.visible = visible; }
    
    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }
}