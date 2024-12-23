# ProyectoWeb

## Introducción
ProyectoWeb es una aplicación basada en microservicios diseñada para gestionar productos, compras y usuarios. Está compuesta por un Frontend, un API Gateway y varios microservicios independientes.

---

## Estructura del Proyecto
1. **Frontend**
2. **API Gateway**
3. **Microservicio Productos**
4. **Microservicio Compras**
5. **Microservicio Usuarios**

---

## Frontend

### Descripción
El frontend está desarrollado en **React**, una biblioteca de JavaScript para construir interfaces de usuario.

### Requisitos
- **Node.js** (versión 14 o superior)

### Pasos para ejecutar
1. Accede al directorio del frontend:
   ```bash
   cd frontend\tienda
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor:
   ```bash
   npm start
   ```

---

## API Gateway

### Requisitos
- **Node.js** (versión 14 o superior)

### Pasos para ejecutar
1. Accede al directorio del API Gateway:
   ```bash
   cd api-gateway
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el microservicio:
   ```bash
   npm start
   ```

---

## Microservicio Productos

### Descripción
Este microservicio permite gestionar productos utilizando Elasticsearch.

### Requisitos
- **Node.js** (versión 14 o superior)
- **Docker** (para ejecutar Elasticsearch)

### Pasos para ejecutar
1. Accede al directorio del microservicio:
   ```bash
   cd microservicios\my-elasticsearch-productos
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Asegúrate de que Docker Desktop esté abierto.
4. Ejecuta Elasticsearch con Docker:
   ```bash
   docker-compose up -d
   ```
5. Inicia el microservicio:
   ```bash
   npm start
   ```

---

## Microservicio Compras

### Descripción
Este microservicio permite gestionar las compras realizadas por los usuarios.

### Requisitos
- **Node.js** (versión 14 o superior)

### Pasos para ejecutar
1. Accede al directorio del microservicio:
   ```bash
   cd microservicios\compras
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el microservicio:
   ```bash
   npm start
   ```

---

## Microservicio Usuarios

### Descripción
Este microservicio permite gestionar los usuarios del sistema.

### Requisitos
- **Python** (versión 3.8 o superior)

### Pasos para ejecutar
1. Accede al directorio del microservicio:
   ```bash
   cd microservicios\usuarios
   ```
2. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```
3. Inicia el microservicio:
   ```bash
   python app.py
   ```

---

## Requisitos Generales
- **Docker Desktop** (para ejecutar servicios con contenedores)

---



