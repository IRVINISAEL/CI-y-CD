## Actividad 5 Patrones de Diseño  + CI/CD
----
## 1. Patrones de diseño GoF

## 1.1 Creacionales

 Definición: Proveen mecanismos para crear objetos de manera controlada y flexible.

 Ejemplos:

 Singleton: Asegura una sola instancia global.

 Abstract Factory: Crea familias de objetos relacionados sin especificar su clase concreta.

 Prototype: Permite copiar objetos existentes sin depender de sus clases.
 
 Ventajas: Centralizan la creación y reducen dependencias.

 Desventajas: Pueden complicar la comprensión si se abusa.

 Uso común: Singleton en servicios globales como logging o conexión a bases de datos.


## 1.2 Estructurales

Definición: Enfocados en la composición de clases para crear estructuras escalables.

Ejemplos:

 Adapter: Convierte la interfaz de una clase a otra esperada.

 Proxy: Controla el acceso a un objeto real.

 Composite: Permite tratar objetos individuales y grupos de forma uniforme.

 Ventajas: Reutilización y bajo acoplamiento.

 Desventajas: Pueden introducir capas innecesarias.

 Uso común: Proxy en servicios de seguridad o control de acceso.


## 1.3 Comportamiento


Definición: Se centran en cómo los objetos se comunican entre sí.

Ejemplos:

 Observer: Gestiona dependencias entre objetos con eventos.

 State: Permite que un objeto cambie su comportamiento según su estado.

 Mediator: Centraliza la comunicación entre múltiples objetos.

 Ventajas: Código más modular y flexible.

 Desventajas: Complejidad al tener muchos objetos intermediarios.

 Uso común: State en sistemas de gestión de pedidos o procesos.

---
## 2. Patrones Emergentes

## MVC: Divide el sistema en modelo, vista y controlador.

Repository: Separa la lógica de acceso a datos.

Microkernel: Núcleo central extensible mediante plugins.

CQRS: Distingue comandos de lectura y escritura.

MVVM: Facilita el enlace de datos en interfaces modernas.

---
## 3. Anti-patrones

God Class: Una clase hace “todo” → refactorizar y aplicar SOLID.

Golden Hammer: Usar un patrón para todo, incluso donde no aplica.

Lava Flow: Código antiguo y sin mantenimiento → eliminar y documentar.

---
## 4. CI/CD

Definición: Automatiza la integración, prueba y despliegue del software.

Herramientas: GitHub Actions, Jenkins, GitLab CI, Travis CI.


## Ejemplo YAML:

```bash

name: Build and Test
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
```

Beneficios: Acelera entregas, mejora la calidad y reduce errores humanos.


## 5. Aplicación práctica

Creacional: Singleton para configuración global.

Estructural: Adapter para compatibilidad entre módulos.

Comportamiento: Observer para actualizaciones en tiempo real.


Emergente: MVC para separación lógica del proyecto.
