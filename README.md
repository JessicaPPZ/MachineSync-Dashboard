# MachineSync Dashboard
A web app for monitoring production line machines, built with Python (FastAPI), SQLite, and HTML/CSS/JavaScript.

## Installation
1. Install Python 3.10+: https://python.org
2. Clone repository: `git clone https://github.com/JessicaPPZ/MachineSync-Dashboard.git`
3. Navigate to project: `cd MachineSync-Dashboard`
4. Create virtual environment: `python -m venv venv`
5. Activate virtual environment: `venv\Scripts\activate`
6. Install dependencies: `pip install -r requirements.txt`
7. Run application: `uvicorn app:app --reload`
8. Open: `http://localhost:8000`

## Features
- Form to register machines at the top.
- Isometric production line image centered at the bottom.
- Machines displayed around the image with LED indicators (green for Activa, red for Inactiva).
- Bar chart summarizing machine statuses.