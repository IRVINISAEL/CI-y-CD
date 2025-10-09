
# Fase 1: Investigación (research.osbaldo)

## 1. Patrones de diseño GoF

### 1.1 Patrones Creacionales
Los patrones creacionales se enfocan en **cómo crear objetos** de manera flexible y reutilizable.  
**Ejemplos comunes:**  
- **Singleton:** garantiza que solo exista una instancia de una clase.  
- **Factory Method:** delega la creación de objetos a subclases.  
- **Builder:** separa la construcción de un objeto complejo de su representación.  
- **Prototype:** crea nuevos objetos copiando una instancia existente.  

**Ventajas:**  
- Mejoran la reutilización del código.  
- Reducen el acoplamiento entre clases.  
- Facilitan la extensión del sistema sin modificar código existente.  

**Desventajas:**  
- Pueden aumentar la complejidad del diseño.  
- Dificultan la depuración si se abusa de ellos.  

**Ejemplo en la industria:**  
El patrón **Singleton** se usa en frameworks como Spring para manejar un único `ApplicationContext`.

---

### 1.2 Patrones Estructurales
Los patrones estructurales se centran en **cómo componer clases y objetos** para formar estructuras más complejas.  
**Ejemplos comunes:**  
- **Adapter:** permite que dos clases incompatibles trabajen juntas.  
- **Composite:** trata objetos individuales y grupos de manera uniforme.  
- **Facade:** ofrece una interfaz simplificada para un subsistema complejo.  
- **Decorator:** añade funcionalidades sin alterar la clase original.  

**Ventajas:**  
- Facilitan la reutilización y mantenibilidad.  
- Reducen la dependencia entre módulos.  

**Desventajas:**  
- Añaden capas de abstracción que pueden ralentizar el rendimiento.  

**Ejemplo en la industria:**  
El patrón **Facade** es usado en librerías como `jQuery` o `React`, donde se oculta la complejidad interna tras una interfaz simple.

---

### 1.3 Patrones de Comportamiento
Estos patrones se enfocan en **cómo los objetos se comunican y colaboran**.  
**Ejemplos comunes:**  
- **Observer:** permite que varios objetos se actualicen automáticamente ante cambios.  
- **Strategy:** define una familia de algoritmos intercambiables.  
- **Command:** encapsula una acción como objeto.  
- **State:** cambia el comportamiento de un objeto según su estado interno.  

**Ventajas:**  
- Promueven la flexibilidad y extensibilidad del código.  
- Facilitan el mantenimiento de sistemas grandes.  

**Desventajas:**  
- Puede aumentar el número de clases y la complejidad.  

**Ejemplo en la industria:**  
El patrón **Observer** se usa en interfaces gráficas y frameworks como Angular o React, donde los componentes se actualizan ante cambios en los datos.

---

## 2. Patrones Emergentes

### 2.1 MVC (Model-View-Controller)
Divide la aplicación en tres partes:  
- **Model:** lógica de datos.  
- **View:** interfaz de usuario.  
- **Controller:** controla la interacción entre ambos.  
**Uso:** aplicaciones web (Django, Laravel).  

### 2.2 DAO (Data Access Object)
Separa la lógica de acceso a datos del resto del sistema.  
**Uso:** sistemas con bases de datos grandes, como aplicaciones bancarias.  

### 2.3 CQRS (Command Query Responsibility Segregation)
Separa las operaciones de lectura (Query) y escritura (Command) para optimizar rendimiento y escalabilidad.  
**Uso:** sistemas distribuidos o con microservicios.  

### 2.4 DDD (Domain-Driven Design)
Organiza el código según el dominio del negocio, no la tecnología.  
**Uso:** software empresarial con lógica de negocio compleja.  

### 2.5 MVVM (Model-View-ViewModel)
Similar a MVC, pero añade un **ViewModel** que gestiona el estado y la lógica de presentación.  
**Uso:** interfaces reactivas como en Angular o Flutter.  

---

## 3. Anti-patrones

### 3.1 God Object
Ocurre cuando una sola clase asume demasiadas responsabilidades.  
**Por qué es dañino:** dificulta el mantenimiento y pruebas.  
**Cómo evitarlo:** aplicar el principio de responsabilidad única (SRP).  

### 3.2 Spaghetti Code
Código desorganizado sin estructura clara ni modularidad.  
**Por qué es dañino:** difícil de entender y mantener.  
**Cómo evitarlo:** aplicar patrones de diseño y refactorización constante.  

---

## 4. CI/CD (Integración y Entrega Continua)

### 4.1 ¿Qué es CI/CD?
Es una práctica que automatiza el proceso de desarrollo, pruebas e implementación.  
- **CI (Continuous Integration):** integra cambios de código frecuentemente, ejecutando pruebas automáticas.  
- **CD (Continuous Delivery):** automatiza la entrega a entornos de prueba o staging.  
- **CD (Continuous Deployment):** automatiza el despliegue a producción tras pasar las pruebas.  

### 4.2 Herramientas más usadas
- **GitHub Actions**  
- **GitLab CI/CD**  
- **Jenkins**  
- **CircleCI**

### 4.3 Ejemplo de pipeline (YAML)
```yaml
name: CI Pipeline

on:
  push:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Clonar repositorio
        uses: actions/checkout@v3

      - name: Instalar dependencias
        run: npm install

      - name: Ejecutar pruebas
        run: npm test

      - name: Construir aplicación
        run: npm run build
```

**Explicación:**  
Este pipeline se ejecuta cuando se hace un *push* a la rama “main”. Instala dependencias, corre pruebas y construye la aplicación automáticamente.

**Beneficios en equipos profesionales:**  
- Reducción de errores humanos.  
- Mayor velocidad en entregas.  
- Detección temprana de fallos.  
- Integración continua entre desarrolladores.  

---

## 5. Selección personal de patrones

| Tipo | Patrón elegido | Justificación | Integración en el sistema |
|------|----------------|----------------|---------------------------|
| **Creacional** | **Factory Method** | Permite crear diferentes tipos de objetos sin acoplar el código a sus clases concretas. | Se usará para crear diferentes tipos de usuarios o entidades dentro del sistema automáticamente. |
| **Estructural** | **Facade** | Facilita una interfaz unificada para acceder a varios módulos del sistema. | Se implementará una fachada que centralice operaciones de base de datos, validaciones y lógica. |
| **De Comportamiento** | **Observer** | Ideal para notificar cambios en los datos a distintos componentes del sistema. | Se aplicará para actualizar las vistas de horarios o disponibilidad cuando haya modificaciones. |
| **Emergente** | **MVC** | Divide responsabilidades, haciendo el sistema más mantenible. | El sistema seguirá esta arquitectura para separar lógica (modelo), interfaz (vista) y control (controlador). |
