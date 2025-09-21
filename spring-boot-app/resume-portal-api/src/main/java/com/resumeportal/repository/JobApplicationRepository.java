package com.resumeportal.repository;

import com.resumeportal.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByUserId(String userId);
    List<JobApplication> findByCompanyId(Long companyId);
    boolean existsByUserIdAndJobId(String userId, Long jobId);
}