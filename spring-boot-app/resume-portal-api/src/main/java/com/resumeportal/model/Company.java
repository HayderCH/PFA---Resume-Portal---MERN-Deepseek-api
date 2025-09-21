package com.resumeportal.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

@Entity
@Table(name = "companies")
public class Company {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    @Column(unique = true)
    private String email;
    
    @NotBlank(message = "Image is required")
    private String image;
    
    @NotBlank(message = "Password is required")
    private String password;
    
    @ElementCollection
    private List<String> resume;
    
    public Company() {}
    
    public Company(String name, String email, String image, String password, List<String> resume) {
        this.name = name;
        this.email = email;
        this.image = image;
        this.password = password;
        this.resume = resume;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public List<String> getResume() { return resume; }
    public void setResume(List<String> resume) { this.resume = resume; }
}