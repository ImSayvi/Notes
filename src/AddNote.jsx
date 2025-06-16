import React, { useState } from 'react';
import { db, auth } from './config';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './AddNote.css';

function AddNote() {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [content, setContent] = useState('');
    const [important, setImportant] = useState(false);
    const [date, setDate] = useState(() => {
        // Domyślnie ustaw aktualną datę w formacie YYYY-MM-DDTHH:mm (do input type=datetime-local)
        const now = new Date();
        return now.toISOString().slice(0, 16);
    });
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!title.trim() || !category.trim() || !content.trim() || !date) {
            setError('Wszystkie pola są wymagane.');
            return;
        }

        try {
            const notesRef = collection(db, 'notes');

            // Konwersja daty z input (string) na Firestore Timestamp
            const createdAt = Timestamp.fromDate(new Date(date));

            await addDoc(notesRef, {
                uid: auth.currentUser.uid,
                title,
                category,
                content,
                important,
                createdAt,
            });
            navigate('/notes');
        } catch (err) {
            setError('Coś poszło nie tak podczas dodawania notatki.');
            console.error(err);
        }
    };

    return (
        <div className="add-note-container">
            <h2>Dodaj nową notatkę</h2>
            <form onSubmit={handleSubmit} className="add-note-form">

                <label>
                    Data notatki:
                    <input
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        aria-label="Data notatki"
                    />
                </label>

                <label>
                    Tytuł:
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        aria-label="Tytuł notatki"
                    />
                </label>

                <label>
                    Kategoria:
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        aria-label="Kategoria notatki"
                    />
                </label>

                <label>
                    Treść:
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        aria-label="Treść notatki"
                    />
                </label>

                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={important}
                        onChange={() => setImportant(!important)}
                        aria-label="Oznacz jako ważne"
                    />
                    Ważna notatka
                </label>


                {error && <p className="error">{error}</p>}

                <button type="submit">Dodaj notatkę</button>
            </form>
        </div>
    );
}

export default AddNote;
