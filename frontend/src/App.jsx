import { useState, useEffect } from "react";
import {
  getBooks,
  createBook,
  deleteBook,
  updateBook,
  getStats,
  getBookById,
} from "./api";

function App() {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState(null);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    year: "",
    read: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [bookFound, setBookFound] = useState(null);
  const [error, setError] = useState("");

  // filtros
  const [filterTitle, setFilterTitle] = useState("");
  const [filterAuthor, setFilterAuthor] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterRead, setFilterRead] = useState("all");

  // cargar libros y stats
  useEffect(() => {
    loadBooks();
    loadStats();
  }, []);

  const loadBooks = async () => {
    const data = await getBooks();
    setBooks(data);
  };

  const loadStats = async () => {
    const data = await getStats();
    setStats(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateBook(editingId, newBook);
      setEditingId(null);
    } else {
      await createBook(newBook);
    }
    setNewBook({ title: "", author: "", year: "", read: false });
    loadBooks();
    loadStats();
  };

  const handleDelete = async (id) => {
    if (confirm("¿Seguro que quieres eliminar este libro?")) {
      await deleteBook(id);
      loadBooks();
      loadStats();
    }
  };

  const handleEdit = (book) => {
    setNewBook(book);
    setEditingId(book.id);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const book = await getBookById(searchId);
      setBookFound(book);
      setError("");
    } catch (err) {
      setBookFound(null);
      setError("❌ Libro no encontrado");
    }
  };

  // aplicar filtros
  const filteredBooks = books.filter((book) => {
    const matchTitle = filterTitle
      ? book.title.toLowerCase().includes(filterTitle.toLowerCase())
      : true;

    const matchAuthor = filterAuthor
      ? book.author.toLowerCase().includes(filterAuthor.toLowerCase())
      : true;

    const matchYear = filterYear ? book.year === parseInt(filterYear) : true;

    const matchRead =
      filterRead === "all"
        ? true
        : filterRead === "true"
        ? book.read
        : !book.read;

    return matchTitle && matchAuthor && matchYear && matchRead;
  });

  return (
    <div style={{ padding: "20px" }}>
      <h1>📚 Mini Library</h1>

      {/* formulario */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Título"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Autor"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Año"
          value={newBook.year}
          onChange={(e) =>
            setNewBook({ ...newBook, year: parseInt(e.target.value) })
          }
          required
        />
        <label>
          <input
            type="checkbox"
            checked={newBook.read}
            onChange={(e) => setNewBook({ ...newBook, read: e.target.checked })}
          />
          Leído
        </label>
        <button type="submit">
          {editingId ? "Guardar cambios" : "Agregar"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setNewBook({ title: "", author: "", year: "", read: false });
              setEditingId(null);
            }}
            style={{ marginLeft: "10px" }}
          >
            Cancelar
          </button>
        )}
      </form>

      {/* filtros */}
      <h2>🔎 Filtros</h2>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Filtrar por título"
          value={filterTitle}
          onChange={(e) => setFilterTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filtrar por autor"
          value={filterAuthor}
          onChange={(e) => setFilterAuthor(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
        <input
          type="number"
          placeholder="Filtrar por año"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
        <select
          value={filterRead}
          onChange={(e) => setFilterRead(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option value="all">Todos</option>
          <option value="true">Leídos</option>
          <option value="false">No leídos</option>
        </select>
      </div>

      {/* lista */}
      <h2>Lista de libros</h2>
      {filteredBooks.length === 0 ? (
        <p>No hay libros que coincidan con el filtro.</p>
      ) : (
        <ul>
          {filteredBooks.map((book) => (
            <li key={book.id}>
              <b>{book.title}</b> - {book.author} ({book.year}) [
              {book.read ? "✅ leído" : "❌ no leído"}]
              <button
                onClick={() => handleEdit(book)}
                style={{ marginLeft: "10px", color: "blue" }}
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(book.id)}
                style={{ marginLeft: "10px", color: "red" }}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* búsqueda por ID */}
      <h2>Buscar libro por ID</h2>
      <form onSubmit={handleSearch}>
        <input
          type="number"
          placeholder="ID del libro"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {bookFound && (
        <p>
          <b>{bookFound.title}</b> - {bookFound.author} ({bookFound.year}) [
          {bookFound.read ? "✅ leído" : "❌ no leído"}]
        </p>
      )}

      {/* stats */}
      <h2>📊 Estadísticas</h2>
      {stats && (
        <ul>
          <li>Total libros: {stats.total_books}</li>
          <li>Libros leídos: {stats.read_books}</li>
          <li>Libros no leídos: {stats.unread_books}</li>
        </ul>
      )}
    </div>
  );
}

export default App;
