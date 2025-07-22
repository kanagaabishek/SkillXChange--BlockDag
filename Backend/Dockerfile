FROM ubuntu:latest
LABEL authors="abi"

ENTRYPOINT ["top", "-b"]

FROM eclipse-temurin:24-jdk

# Set working directory
WORKDIR /app

# Copy JAR file into the container
COPY target/demo-0.0.1-SNAPSHOT.jar app.jar

# Expose the port your Spring Boot app runs on
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
