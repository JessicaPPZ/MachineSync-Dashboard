# MachineSync Dashboard

Una aplicación web para monitorear máquinas en una línea de producción. Permite registrar máquinas con un formulario, visualizarlas alrededor de una imagen isométrica con LEDs (verde para Activa, rojo para Inactiva), y mostrar estadísticas en una gráfica de barras. Los datos se guardan en una base de datos SQLite y son accesibles mediante una API REST.

## Características
- **Frontend**: Formulario para registrar máquinas (nombre, tipo, estado [Activa/Inactiva], tiempo activo, último error), imagen isométrica de una línea de producción, y máquinas con LEDs.
- **Backend**: API REST con FastAPI y base de datos SQLite (`machines.db`).
- **Gráfica**: Barra que muestra el número de máquinas por estado.
- **Persistencia**: Datos guardados en `machines.db`.
- **API**: Endpoints probados con Postman (`GET /machines`, `POST /machines`, `DELETE /machines/{id}`).

## Requisitos
- Python 3.11.9
- pip 25.1.1
- Git
- Postman (para probar la API)
- Navegador web (Chrome, Firefox, etc.)

## Instalación
1. Clona el repositorio:
   ```bash
   git clone https://github.com/JessicaPPZ/MachineSync-Dashboard.git
   cd MachineSync-Dashboard