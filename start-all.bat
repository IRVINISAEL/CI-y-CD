#!/bin/bash
echo "Iniciando servicios..."

# Iniciar API Gateway
cd api-gateway && npm start &
sleep 2

# Iniciar Auth Service
cd auth-service && npm start &
sleep 2

# Iniciar Payments Service
cd payments-service && npm start &

echo "Todos los servicios están iniciando..."
echo "API Gateway: http://localhost:3000"
echo "Auth Service: http://localhost:3001"
echo "Payments Service: http://localhost:3002"