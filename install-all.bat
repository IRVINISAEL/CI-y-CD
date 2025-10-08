#!/bin/bash
echo "Instalando API Gateway..."
cd api-gateway && npm install && cd ..

echo "Instalando Auth Service..."
cd auth-service && npm install && cd ..

echo "Instalando Payments Service..."
cd payments-service && npm install && cd ..

echo "Instalación completada!"