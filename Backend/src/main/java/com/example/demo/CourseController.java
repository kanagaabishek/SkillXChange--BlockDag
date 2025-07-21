package com.example.demo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CourseController {
    private CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getAllCourses() {
        return courseService.getAllCourses();
    }
    @PostMapping("/courses/create")
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        Course createdCourse = courseService.createCourse(course);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCourse);
    }

    @DeleteMapping("/courses/delete/{cid}")
    public ResponseEntity<Void> deleteCourse(@PathVariable long cid,String walletAddress) {
        courseService.deleteCourse(cid,walletAddress);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/courses/owner/{ownerWalletAddress}")
    public ResponseEntity<List<Course>> getCoursesByOwner(@PathVariable String ownerWalletAddress) {
        List<Course> courses = courseService.getCoursesByOwner(ownerWalletAddress);
        if (courses.isEmpty()) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(courses);
        }
    }
    @GetMapping("/zoom/{id}")
    public ResponseEntity<String> getZoomLink(@PathVariable long id) {
        Course course = courseService.courseRepo.findById(id).orElse(null);
        if (course == null) {
            return ResponseEntity.notFound().build();
        }
        String zoomLink = course.getZoomLink();
        if (zoomLink == null || zoomLink.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(zoomLink);
    }

    @GetMapping("/course/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable long id) {
        Course course = courseService.courseRepo.findById(id).orElse(null);
        if (course == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(course);
    }
}
