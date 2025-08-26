# Mini Library 2.0
Integrantes: Samuel Salazar Trujillo, Roiman Urrego Zuñiga, Isabela Cabezas Obregón.
Una aplicación **fullstack** para gestionar tu biblioteca personal.  
Construida con **FastAPI** en el backend y **React + Vite** en el frontend.

---

## Características de la Mini Library 2.0

### Backend (FastAPI)  
- GET /books → Listar todos los libros.
- POST /books → Agregar un nuevo libro.
- GET /books/{book_id} → Consultar un libro por ID.
- PUT /books/{book_id} → Editar libro existente.
- DELETE /books/{book_id} → Eliminar un libro.
- GET /books/stats → Obtener estadísticas generales.
  
## Terminal Backend
    cd backend
    python -m venv venv
    source venv/bin/activate   # En Linux/Mac
    venv\Scripts\activate      # En Windows
    pip install -r requirements.txt
    uvicorn app.main:app --reload --port 8000

### Frontend (React + Vite)  
- Interfaz sencilla e intuitiva.  
- CRUD completo: agregar, listar, editar (toggle), eliminar.  
- Búsqueda en tiempo real.  
- Ordenar libros por título, autor o año.  
- Paginación de resultados.  
- Debounce en búsquedas.  
- Manejo de errores y estados de carga.
  
## Terminal Frontend
    cd frontend
    npm install
    npm run dev

---

## Tecnologías usadas

- **Backend**
  - [Python 3.11+](https://www.python.org/)
  - [FastAPI](https://fastapi.tiangolo.com/)
  - [Uvicorn](https://www.uvicorn.org/)

- **Frontend**
  - [React](https://react.dev/)
  - [Vite](https://vitejs.dev/)


