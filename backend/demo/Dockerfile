# Use an official Maven/Java image to build the app, then run with JRE only
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/demo-*.jar app.jar
EXPOSE 8080
ENV SPRING_PROFILES_ACTIVE=prod
ENV DB_USERNAME=root
ENV DB_PASSWORD=password
ENV DB_URL=jdbc:mysql://mysql:3306/springapp
ENTRYPOINT ["java", "-jar", "app.jar"]
