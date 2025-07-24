# Use an official OpenJDK runtime as a parent image
FROM eclipse-temurin:24-jdk

# Argument to define the JAR file path
ARG JAR_FILE=target/demo-0.0.1-SNAPSHOT.jar

# Copy the JAR file into the container
COPY ${JAR_FILE} app.jar

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
