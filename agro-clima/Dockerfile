# Estágio 1: Build (Compila o código e baixa dependências)
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Copia o arquivo de dependências
COPY pom.xml .
# Baixa as dependências offline para acelerar builds futuros
RUN mvn dependency:go-offline

# Copia o código-fonte da sua API e compila
COPY src ./src
RUN mvn clean package -DskipTests

# Estágio 2: Execução (Imagem final otimizada)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Pega apenas o arquivo .jar compilado no Estágio 1
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]