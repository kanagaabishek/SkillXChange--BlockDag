package com.example.demo;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {
    public final CourseRepo courseRepo;

    public CourseService(CourseRepo courseRepo) {
        this.courseRepo = courseRepo;
    }

    public ResponseEntity<List<Course>> getAllCourses(){
        List<Course> courses = courseRepo.findAll();
        if (courses.isEmpty()) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(courses);
        }
    }

    public Course createCourse(Course course) {
        return courseRepo.save(course);
    }

    public ResponseEntity<?> deleteCourse(long cid,String walletAddress) {
        Course course = courseRepo.findById(cid).get();
        if (course == null) {
            return ResponseEntity.notFound().build();
        }
        if (walletAddress.equals(course.getOwnerWalletAddress())) {
            courseRepo.deleteById(cid);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(403).body("Unauthorized");
        }
    }

    public List<Course> getCoursesByOwner(String ownerWalletAddress) {
        return courseRepo.findByOwnerWalletAddress(ownerWalletAddress);
    }
}
