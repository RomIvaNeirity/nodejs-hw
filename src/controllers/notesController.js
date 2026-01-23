// src/controllers/notesController.js
import createHttpError from 'http-errors';

import { Note } from '../models/note.js';

// Отримати список усіх нотаток
export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, tag, search } = req.query;
  const skip = (page - 1) * perPage;

  const notesQuery = Note.find();

  // Текстовий пошук
  if (search) {
    notesQuery.where({ $text: { $search: search } });
  }

  // Фільтр за тегом
  if (tag) {
    notesQuery.where('tag').equals(tag);
  }

  const [totalItems, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({ page, perPage, totalItems, totalPages, notes });
};

// Отримати одну нотатку за id
export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }
  res.status(200).json(note);
};

//Створення нової нотатки
export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

//Видалення нотатки

export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({ _id: noteId });

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }

  res.status(200).json(note);
};

//Оновлення нотатки

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndUpdate({ _id: noteId }, req.body, {
    new: true,
  });

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }

  res.status(200).json(note);
};
