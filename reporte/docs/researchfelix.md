## 🧠 Actividad 5
Investigación y Aplicación de Patrones de Diseño + CI/CD

## 1. Patrones de Diseño GoF (Gang of Four)

Los patrones de diseño propuestos por el grupo GoF representan soluciones probadas a problemas comunes de la programación orientada a objetos. Se dividen en tres grandes categorías:

## 1.1 Patrones Creacionales

Objetivo: Simplificar y estandarizar la creación de objetos.


##Ejemplos:

## 🧱 Singleton: Ideal para mantener una única instancia, como una conexión global a la base de datos.

## 🏭 Factory Method: Permite crear distintos tipos de objetos (por ejemplo, usuarios “alumno”, “docente”, “administrador”) sin modificar el código base.

## 🔧 Builder: Separa la construcción de objetos complejos, como formularios dinámicos o reportes personalizados.

Ventajas: Favorecen la escalabilidad y reducen la duplicación de código.

Desventajas: Añaden capas de abstracción que pueden ser difíciles de entender para desarrolladores nuevos.

## 1.2 Patrones Estructurales

Objetivo: Organizar las relaciones entre clases y objetos.


## Ejemplos:

## 🔌 Adapter: Permite que dos sistemas con interfaces distintas trabajen juntos, por ejemplo, integrar una API externa.

## 🎨 Decorator: Añade funcionalidades adicionales (como validaciones o seguridad) sin modificar el código original.

## 🏠 Facade: Simplifica sistemas complejos ofreciendo una única interfaz de acceso, útil en backend con múltiples servicios.

Ventajas: Promueven la reutilización y claridad.

Desventajas: Si se usan en exceso, pueden ocultar errores internos difíciles de rastrear.

## 1.3 Patrones de Comportamiento

Objetivo: Definir cómo los objetos se comunican y cooperan.

Ejemplos:

## 🔔 Observer: Notifica automáticamente a varios componentes cuando ocurre un evento (como un nuevo pago o una cita agendada).

## ⚙️ Strategy: Permite elegir el algoritmo adecuado en tiempo de ejecución (por ejemplo, distintos métodos de cálculo o validación).

📝 Command: Encapsula solicitudes como objetos para ejecutarlas o deshacerlas fácilmente.

Ventajas: Promueven bajo acoplamiento y flexibilidad.

Desventajas: Pueden incrementar el número de clases, haciendo el sistema más complejo.

## 2. Patrones Arquitectónicos Modernos

Estos patrones emergentes amplían las ideas GoF a nivel de arquitectura y diseño de sistemas completos:

MVC (Model-View-Controller): Separa la lógica, interfaz y control. Base de frameworks como Express, Laravel y Django.

DAO (Data Access Object): Centraliza el acceso a datos, ideal para cambiar motores de base sin reescribir toda la lógica.

CQRS: Divide las operaciones de lectura y escritura para mejorar el rendimiento.

DDD (Domain-Driven Design): Estructura el software en torno al negocio real, facilitando su evolución.

Microservicios: Divide el sistema en componentes independientes y fácilmente desplegables.

## 3. Anti-patrones (Errores comunes en el diseño)

God Object: Clase que asume demasiadas funciones.

🔧 Solución: Dividir responsabilidades y aplicar principios SOLID.

Spaghetti Code: Código desordenado y dependiente.

🔧 Solución: Modularizar el sistema, usar MVC y patrones de comportamiento.

Copy-Paste Programming: Reutilización incorrecta de código.

🔧 Solución: Crear componentes reutilizables y aplicar herencia


## 4. CI/CD 

## 4.1 ¿Qué es?

El enfoque CI/CD (Continuous Integration / Continuous Delivery / Deployment) automatiza las etapas del desarrollo de software: integración, pruebas y despliegue.

CI: Cada vez que un desarrollador sube código, se ejecutan pruebas automáticamente.

CD: El sistema prepara y distribuye nuevas versiones sin intervención manual.

CD (Deployment): Despliega directamente a producción con controles automáticos.



## 4.2 Herramientas Populares

🧩 GitHub Actions

⚙️ GitLab CI/CD

🧱 Jenkins

🚀 CircleCI


## 4.3 Ejemplo de Pipeline (GitHub Actions)

```
name: Test and Deploy

on:
  push:
    branches: [ "main" ]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - name: Obtener código
        uses: actions/checkout@v3
      - name: Instalar dependencias
        run: npm install
      - name: Ejecutar pruebas
        run: ppm test


## ✅ Explicación:
Cada vez que se hace push a la rama main, el sistema instala dependencias y ejecuta pruebas con Jest. Si todas pasan, puede proceder al despliegue.

```

## 4.4 Beneficios


Detección temprana de errores.

Integración continua de nuevas funciones.

Despliegues rápidos y sin intervención humana.

Mayor confianza y estabilidad del sistema.


## 5. Aplicación de Patrones en el Sistema Web de Pagos Escolares

Factory Method: Crear diferentes tipos de usuarios (alumno, docente, administrador).

Facade: Unificar servicios de base de datos, correo y autenticación bajo una sola interfaz.

Observer: Enviar notificaciones automáticas a los usuarios cuando se registren nuevos pagos o eventos.

MVC: Mantener la estructura del proyecto ordenada y modular.

CI/CD con GitHub Actions: Ejecutar pruebas unitarias con Jest en cada actualización para garantizar calidad continua.