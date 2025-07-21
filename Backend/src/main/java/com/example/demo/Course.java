package com.example.demo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@Entity
@Table(name = "courses")
@CrossOrigin(origins = "http://localhost:3000")
public class Course {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private long cid;

    private String title;

    private String description;

    private String ownerWalletAddress;

    private String level;

    private String type;

    private String location;

    private String fees;

    private String zoomLink;

    private List<String> JoinedStudents;

    public Course() {
    }
    public Course(long cid, String title, String description) {
        this.cid = cid;
        this.title = title;
        this.description = description;
    }

    public long getCid() {
        return cid;
    }
    public void setCid(long cid) {
        this.cid = cid;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public String getOwnerWalletAddress() {
        return ownerWalletAddress;
    }
    public void setOwnerWalletAddress(String ownerWalletAddress) {
        this.ownerWalletAddress = ownerWalletAddress;
    }
    public String getLevel() {
        return level;
    }
    public void setLevel(String level) {
        this.level = level;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }

    public String getLocation() {
        return location;
    }
    public void setLocation(String location) {
        this.location = location;
    }

    public Course(String title, String description, String ownerWalletAddress, String level, String type, String location,String fees) {
        this.title = title;
        this.description = description;
        this.ownerWalletAddress = ownerWalletAddress;
        this.level = level;
        this.type = type;
        this.location = location;
        this.fees = fees;
    }

    public String getFees() {
        return fees;
    }
    public void setFees(String fees) {
        this.fees = fees;
    }
    public String getZoomLink() {
        return zoomLink;
    }
    public void setZoomLink(String zoomLink) {
        this.zoomLink = zoomLink;
    }
    public List<String> getJoinedStudents() {
        return JoinedStudents;
    }
    public void setJoinedStudents(List<String> joinedStudents) {
        JoinedStudents = joinedStudents;
    }
}
