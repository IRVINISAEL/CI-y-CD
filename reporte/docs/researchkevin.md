## Actividad patrones de diseño CI/CD

## 1. Patrones GoF

## 1.1 Creacionales

## Objetivo: Crear objetos sin depender de clases concretas.

Ejemplos:

Singleton: Una sola instancia global.

Builder: Construye objetos paso a paso.

Factory Method: Permite extensibilidad en la creación.


## 1.2 Estructurales

Objetivo: Facilitar la composición de objetos.

Ejemplos:

Adapter: Traductor entre clases incompatibles.

Decorator: Añade funciones extra sin heredar.

Facade: Simplifica el uso de sistemas complejos.


## 1.3 Comportamiento

Objetivo: Controlar la comunicación entre objetos.


## Ejemplos:

Strategy: Cambia algoritmos en tiempo real.

Observer: Notificaciones automáticas.

Command: Encapsula acciones como objetos.


## 2. Patrones Modernos

MVC: Divide vista, lógica y control.

Repository: Manejo centralizado de datos.

Event Sourcing: Guarda cada cambio como un evento.

DDD: Enfoca el desarrollo en el dominio del negocio.


## 3. Anti-patrones comunes

Spaghetti Code: Falta de estructura → usar modularidad.

God Object: Sobrecarga de funciones → dividir clases.

Copy-Paste Programming: Falta de reutilización → aplicar herencia o componentes.


## 4. CI/CD

Permite compilar, probar y desplegar automáticamente.


## Ejemplo:

Desarrollador hace push.

GitHub ejecuta pruebas.

Si pasan, se despliega a producción.

Beneficios: Menos errores, mayor velocidad y control.


## 5. Aplicación en proyecto

Factory Method: Crear usuarios según rol.

Facade: Unificar funciones del backend.

Observer: Enviar notificaciones a alumnos.

MVC: Separar frontend y backend claramente.