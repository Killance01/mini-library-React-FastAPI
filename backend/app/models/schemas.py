from pydantic import BaseModel, Field, validator
from typing import Optional


class BookBase(BaseModel):
    title: str = Field(..., min_length=1, description="Título del libro")
    author: str = Field(..., min_length=1, description="Autor del libro")
    year: int = Field(..., ge=1500, le=2100, description="Año entre 1500 y 2100")
    read: Optional[bool] = False

    @validator("title", "author")
    def not_empty(cls, v):
        if not v.strip():
            raise ValueError("No puede estar vacío")
        return v


class BookCreate(BookBase):
    """Modelo para crear libros"""
    pass


class BookUpdate(BaseModel):
    """Modelo para actualizar libros"""
    title: Optional[str] = None
    author: Optional[str] = None
    year: Optional[int] = Field(None, ge=1500, le=2100)
    read: Optional[bool] = None


class Book(BookBase):
    id: int

    class Config:
        orm_mode = True
