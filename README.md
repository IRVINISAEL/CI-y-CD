# Actividad 5
# Investigación y Aplicación de Patrones de Diseño + CI/CD

## 1. Patrones de diseño GoF

### 1.1 Patrones Creacionales
- **Definición:** Se enfocan en cómo crear objetos de manera flexible y reutilizable.  
- **Ejemplos:**
  - *Singleton:* Garantiza que solo exista una instancia de una clase.  
  - *Factory Method:* Permite crear objetos sin especificar su clase exacta.  
  - *Builder:* Separa la construcción de un objeto complejo de su representación.  
- **Ventajas:** Flexibilidad en la creación de objetos, reducción de dependencias rígidas.  
- **Desventajas:** Pueden incrementar la complejidad del código.  
- **Uso en la industria:** El patrón *Singleton* es usado en frameworks para manejar conexiones a bases de datos o configuración global.  

### 1.2 Patrones Estructurales
- **Definición:** Se centran en la composición de clases y objetos para formar estructuras más grandes.  
- **Ejemplos:**
  - *Adapter:* Permite que dos interfaces incompatibles trabajen juntas.  
  - *Decorator:* Añade dinámicamente funcionalidades sin modificar la clase original.  
  - *Facade:* Simplifica la interacción con un sistema complejo mediante una interfaz única.  
- **Ventajas:** Facilitan la reutilización de código y la interoperabilidad.  
- **Desventajas:** Si se abusa, pueden ocultar demasiada lógica y dificultar el mantenimiento.  
- **Uso en la industria:** *Facade* es común en APIs para ofrecer métodos simples que internamente usan múltiples servicios.  

### 1.3 Patrones de Comportamiento
- **Definición:** Describen cómo interactúan y se comunican los objetos.  
- **Ejemplos:**
  - *Observer:* Notifica a múltiples objetos cuando cambia el estado de otro.  
  - *Strategy:* Permite intercambiar algoritmos en tiempo de ejecución.  
  - *Command:* Encapsula una solicitud como objeto para su ejecución flexible.  
- **Ventajas:** Promueven flexibilidad y reutilización del comportamiento.  
- **Desventajas:** Pueden introducir demasiados objetos adicionales.  
- **Uso en la industria:** *Observer* se aplica en interfaces gráficas y sistemas de eventos (ej. notificaciones push).  

---

## 2. Patrones Emergentes

- **MVC (Model-View-Controller):** Separación entre lógica de negocio, interfaz y control. Usado en frameworks como *Spring* o *Laravel*.  
- **DAO (Data Access Object):** Abstracción del acceso a datos. Facilita el cambio de motor de base de datos.  
- **CQRS (Command Query Responsibility Segregation):** Separa operaciones de lectura y escritura. Útil en sistemas distribuidos y de alta escala.  
- **DDD (Domain-Driven Design):** Organiza el software alrededor del dominio del negocio. Usado en sistemas bancarios o ERP.  
- **MVVM (Model-View-ViewModel):** Facilita el data-binding entre UI y lógica, muy usado en *WPF* o *Angular*.  

---

## 3. Anti-patrones

- **God Object**
  - *Problema:* Una clase concentra demasiadas responsabilidades.  
  - *Consecuencia:* Difícil de mantener y probar.  
  - *Solución:* Aplicar principios SOLID y dividir responsabilidades.  

- **Spaghetti Code**
  - *Problema:* Código desorganizado con dependencias caóticas.  
  - *Consecuencia:* Dificulta el mantenimiento y escalabilidad.  
  - *Solución:* Usar patrones de diseño y arquitectura modular.  

---

## 4. CI/CD (Integración y Entrega Continua)

### 4.1 Definición
- **CI (Continuous Integration):** Integración frecuente de cambios en un repositorio compartido, con ejecución automática de pruebas.  
- **CD (Continuous Delivery):** Automatiza la preparación del software para despliegue.  
- **CD (Continuous Deployment):** Automatiza también el despliegue a producción.  

### 4.2 Herramientas
- GitHub Actions  
- GitLab CI  
- Jenkins  
- CircleCI  

### 4.3 Ejemplo de pipeline (GitHub Actions en YAML)

```yaml
name: CI Pipeline

on:
  push:
    branches: [ "main" ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3


### Explicación:

- Se activa cuando se hace push a main.

- Instala dependencias y ejecuta pruebas automáticas.

### 4.4 Beneficios

- Detección temprana de errores.

- Mayor confianza en el código.

- Entregas rápidas y seguras.

### 5. Selección personal de patrones

- **Creacional: Factory Method → Para crear objetos de diferentes tipos de usuarios en el sistema.

- **Estructural: Facade → Para ofrecer una API simple a funciones complejas del backend.

- **Comportamiento: Observer → Para manejar notificaciones de eventos (ej. nuevas actividades).

- **Emergente: MVC → Para mantener clara la separación entre lógica, interfaz y controladores.

### Integración en el sistema

- **Factory Method: Creación de instancias de usuarios (administrador, visitante).

- **Facade: Unificar servicios de base de datos y envío de correos en una sola interfaz.

- **Observer: Implementar notificaciones automáticas cuando se agregue una nueva cita o actividad.

- **MVC: Organizar el sistema en capas claras para escalabilidad.
