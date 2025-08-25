from fastapi import APIRouter, HTTPException, Query, Response
from typing import List, Optional
from app.models.schemas import Book, BookCreate, BookUpdate
from collections import Counter
from statistics import mean
import json
from pathlib import Path

router = APIRouter()

# --- Persistencia en JSON ---
DATA_FILE = Path("books.json")


def load_books():
    if DATA_FILE.exists():
        return json.loads(DATA_FILE.read_text(encoding="utf-8"))
    return []


def save_books():
    DATA_FILE.write_text(
        json.dumps(books_db, indent=4, ensure_ascii=False),
        encoding="utf-8"
    )


# --- Base de datos en memoria inicial ---
books_db = load_books()
id_counter = max([b["id"] for b in books_db], default=0) + 1


# ============================
# 📌 ENDPOINTS
# ============================

# 📊 Estadísticas (debe ir antes de /books/{id})
@router.get("/books/stats")
def get_stats():
    if not books_db:
        return {
            "total_books": 0,
            "read_books": 0,
            "unread_books": 0,
            "average_year": None,
            "most_common_author": None
        }

    total = len(books_db)
    read_books = sum(1 for b in books_db if b["read"])
    unread_books = total - read_books
    average_year = round(mean(b["year"] for b in books_db), 2)

    # Autor más repetido
    authors = [b["author"] for b in books_db]
    most_common_author = Counter(authors).most_common(1)[0][0]

    return {
        "total_books": total,
        "read_books": read_books,
        "unread_books": unread_books,
        "average_year": average_year,
        "most_common_author": most_common_author
    }


# Crear un libro
@router.post("/books", response_model=Book, status_code=201)
def create_book(book: BookCreate):
    global id_counter

    # Verificar duplicados
    for b in books_db:
        if b["title"].lower() == book.title.lower() and b["author"].lower() == book.author.lower():
            raise HTTPException(status_code=409, detail="El libro ya existe")

    new_book = book.dict()
    new_book["id"] = id_counter
    id_counter += 1

    books_db.append(new_book)
    save_books()  # persistencia

    return new_book


# Listar libros con búsqueda, orden y paginación
@router.get("/books", response_model=List[Book])
def list_books(
    response: Response,
    q: Optional[str] = Query(None, description="Buscar por título o autor"),
    sort: Optional[str] = Query(None, regex="^(title|author|year)$"),
    order: Optional[str] = Query("asc", regex="^(asc|desc)$"),
    offset: int = 0,
    limit: int = 10
):
    results = books_db

    # Búsqueda
    if q:
        results = [b for b in results if q.lower() in b["title"].lower() or q.lower() in b["author"].lower()]

    # Orden
    if sort:
        results = sorted(results, key=lambda x: x[sort], reverse=(order == "desc"))

    # Total para headers
    response.headers["X-Total-Count"] = str(len(results))

    # Paginación
    return results[offset: offset + limit]


# Obtener libro por ID
@router.get("/books/{book_id}", response_model=Book)
def get_book(book_id: int):
    for b in books_db:
        if b["id"] == book_id:
            return b
    raise HTTPException(status_code=404, detail="Libro no encontrado")


# Actualizar libro
@router.put("/books/{book_id}", response_model=Book)
def update_book(book_id: int, book: BookUpdate):
    for index, b in enumerate(books_db):
        if b["id"] == book_id:
            update_data = book.dict(exclude_unset=True)

            # Verificar duplicados
            if "title" in update_data or "author" in update_data:
                new_title = update_data.get("title", b["title"])
                new_author = update_data.get("author", b["author"])
                for other in books_db:
                    if other["id"] != book_id and other["title"].lower() == new_title.lower() and other["author"].lower() == new_author.lower():
                        raise HTTPException(status_code=409, detail="Ya existe un libro con ese título y autor")

            books_db[index].update(update_data)
            save_books()
            return books_db[index]

    raise HTTPException(status_code=404, detail="Libro no encontrado")


# Eliminar libro
@router.delete("/books/{book_id}", status_code=204)
def delete_book(book_id: int):
    for index, b in enumerate(books_db):
        if b["id"] == book_id:
            del books_db[index]
            save_books()
            return
    raise HTTPException(status_code=404, detail="Libro no encontrado")
