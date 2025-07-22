# Use an official OpenJDK runtime as a parent image
FROM eclipse-temurin:24-jdk

# Set working directory inside the container
WORKDIR /app

# Copy the jar file to the container
COPY target/demo-0.0.1-SNAPSHOT.jar app.jar

# Expose the Spring Boot default port
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]


