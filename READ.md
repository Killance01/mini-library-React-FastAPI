Mini Library 2.0
Integrantes: Roiman Urrego Zuñiga, Isabela Cabezas Obregon, Samuel Salazar Trujillo. Universidad Autonoma de Occidente
Este es un proyecto en el que construimos una mini biblioteca digital.
Nuestro objetivo fue tener un espacio sencillo para agregar, editar, eliminar, buscar y filtrar libros, además de mostrar estadísticas sobre cuántos libros han sido leídos y cuántos no.
Decidimos separar Frontend y Backend para practicar la integración entre React y FastAPI.
Lo que hace la app:
Frontend (React)
Formulario para agregar libros (título, autor, año, leído/no leído).
Lista interactiva con opción de editar o eliminar libros.
Filtros dinámicos por título, autor, año y estado (leído/no leído).
Búsqueda directa por ID.
Estadísticas en tiempo real: total de libros, leídos y no leídos.

Backend (FastAPI)
API REST con operaciones CRUD:
GET /books → Listar todos los libros.
POST /books → Agregar un nuevo libro.
GET /books/{book_id} → Consultar un libro por ID.
PUT /books/{book_id} → Editar libro existente.
DELETE /books/{book_id} → Eliminar un libro.
GET /books/stats → Obtener estadísticas generales.
Documentación automática con Swagger UI (/docs) y ReDoc (/redoc).

Tecnologías que usamos
Frontend: React.js, HTML, CSS, JavaScript.
Backend: FastAPI, Pydantic, Uvicorn.
