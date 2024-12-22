# ProyectoWeb
# FrontEnd
cd frontend
npm start

# Api Gateway
cd api-gateway
npm install express axios
npm install cors
npm start

# Microservicio Productos
cd microservicios\my-elasticsearch-productos

Este es un microservicio simple para gestionar productos utilizando Elasticsearch. A continuación se detallan los pasos necesarios para ejecutar el microservicio.

# Requisitos

- **Node.js** (versión 14 o superior)
- **Docker** (para ejecutar Elasticsearch)

1.Instalar dependencias:
npm install
2.Tener docker descktop abierto
3.Ejecutar Elasticsearch con Docker
docker-compose up -d
4.Ejecutar el microservicio
npm start
Microservicio Compras
cd microservicios\compras

# Microservicio Usuarios
cd microservicios\usuarios
pip install -r requirements.txt
python app.py