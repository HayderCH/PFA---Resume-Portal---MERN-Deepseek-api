package com.resumeportal.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    private String id;
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    @Column(unique = true)
    private String email;
    
    @ElementCollection
    private List<String> resume;
    
    @NotBlank(message = "Image is required")
    private String image;
    
    public User() {}
    
    public User(String id, String name, String email, List<String> resume, String image) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.resume = resume;
        this.image = image;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public List<String> getResume() { return resume; }
    public void setResume(List<String> resume) { this.resume = resume; }
    
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
}