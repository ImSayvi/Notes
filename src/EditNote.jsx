import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from './config';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import './AddNote.css'; // używa tych samych stylów co AddNote

function EditNote() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [content, setContent] = useState('');
    const [important, setImportant] = useState(false);
    const [date, setDate] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const noteRef = doc(db, 'notes', id);
                const noteSnap = await getDoc(noteRef);

                if (noteSnap.exists()) {
                    const data = noteSnap.data();
                    setTitle(data.title);
                    setCategory(data.category);
                    setContent(data.content);
                    setImportant(data.important);
                    const dateObj = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
                    setDate(dateObj.toISOString().slice(0, 16));
                } else {
                    setError('Notatka nie istnieje.');
                }
            } catch (err) {
                console.error('Błąd podczas pobierania notatki:', err);
                setError('Błąd podczas ładowania notatki.');
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!title.trim() || !category.trim() || !content.trim() || !date) {
            setError('Wszystkie pola są wymagane.');
            return;
        }

        try {
            const updatedAt = Timestamp.fromDate(new Date(date));
            await updateDoc(doc(db, 'notes', id), {
                title,
                category,
                content,
                important,
                createdAt: updatedAt,
            });

            navigate('/notes');
        } catch (err) {
            console.error('Błąd podczas zapisu:', err);
            setError('Coś poszło nie tak podczas zapisu.');
        }
    };

    if (loading) return <p>Ładowanie...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="add-note-container">
            <h2>Edytuj notatkę</h2>
            <form onSubmit={handleSubmit} className="add-note-form">

                <label>
                    Data notatki:
                    <input
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Tytuł:
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Kategoria:
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Treść:
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </label>

                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={important}
                        onChange={() => setImportant(!important)}
                    />
                    Ważna notatka
                </label>

                {error && <p className="error">{error}</p>}

                <button type="submit">Zapisz zmiany</button>
            </form>
        </div>
    );
}

export default EditNote;
