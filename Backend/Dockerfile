# First stage: build the JAR
FROM eclipse-temurin:24-jdk AS builder
WORKDIR /app
COPY . .
RUN ./mvnw package -DskipTests

# Second stage: run the app
FROM eclipse-temurin:24-jdk
WORKDIR /app
COPY --from=builder /app/target/demo-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
