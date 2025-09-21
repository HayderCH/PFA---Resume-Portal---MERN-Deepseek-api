package com.resumeportal.controller;

import com.resumeportal.model.Job;
import com.resumeportal.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {
    
    @Autowired
    private JobRepository jobRepository;
    
    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        List<Job> jobs = jobRepository.findByVisibleTrue();
        return ResponseEntity.ok(jobs);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        Optional<Job> job = jobRepository.findById(id);
        return job.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
}