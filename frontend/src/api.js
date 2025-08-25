const API_URL = "http://127.0.0.1:8000"; // Ajusta si el backend corre en otro host o puerto

// Obtener todos los libros
export async function getBooks() {
  const res = await fetch(`${API_URL}/books`);
  if (!res.ok) throw new Error("Error al obtener libros");
  return res.json();
}

// Crear un nuevo libro
export async function createBook(book) {
  const res = await fetch(`${API_URL}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error("Error al crear libro");
  return res.json();
}

// Actualizar un libro por ID
export async function updateBook(id, book) {
  const res = await fetch(`${API_URL}/books/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error("Error al actualizar libro");
  return res.json();
}

// Eliminar un libro por ID
export async function deleteBook(id) {
  const res = await fetch(`${API_URL}/books/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar libro");
  return res.json();
}

// Obtener estadísticas
export async function getStats() {
  const res = await fetch(`${API_URL}/books/stats`);
  if (!res.ok) throw new Error("Error al obtener estadísticas");
  return res.json();
}
// Obtener un libro por ID
export async function getBookById(id) {
  const res = await fetch(`${API_URL}/books/${id}`);
  if (!res.ok) {
    throw new Error("Libro no encontrado");
  }
  return res.json();
}

