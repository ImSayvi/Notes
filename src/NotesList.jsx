import React, { useEffect, useState } from 'react';
import { db, auth } from './config';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import './NotesList.css';

function NotesList() {
    const [notes, setNotes] = useState([]);
    const [user, setUser] = useState(null);
    const [filterCategory, setFilterCategory] = useState('');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');
    const [filterImportant, setFilterImportant] = useState(false);
    const [importantNotes, setImportantNotes] = useState([]);
    const [currentImportantIndex, setCurrentImportantIndex] = useState(0);
    const [sortOrder, setSortOrder] = useState('desc'); // domyślnie malejąco (najnowsze najpierw)
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                const notesRef = collection(db, 'notes');
                const q = query(notesRef, where('uid', '==', user.uid));
                const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
                    const notesData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                    setNotes(notesData);
                });
                return () => unsubscribeSnapshot();
            } else {
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    useEffect(() => {
        const filteredImportant = notes.filter(note => note.important);
        setImportantNotes(filteredImportant);
        setCurrentImportantIndex(0);
    }, [notes]);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'notes', id));
        } catch (error) {
            console.error('Błąd usuwania notatki:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Błąd podczas wylogowywania:', error);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString('pl-PL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredNotes = notes.filter(note => {
        const categoryMatch = filterCategory
            ? note.category.toLowerCase().includes(filterCategory.toLowerCase())
            : true;

        const noteDate = note.createdAt?.toDate ? note.createdAt.toDate() : new Date(note.createdAt);
        const fromDate = filterDateFrom ? new Date(filterDateFrom) : null;
        const toDate = filterDateTo ? new Date(filterDateTo) : null;

        const fromMatch = fromDate ? noteDate >= fromDate : true;
        const toMatch = toDate ? noteDate <= toDate : true;

        const importantMatch = filterImportant ? note.important === true : true;

        return categoryMatch && fromMatch && toMatch && importantMatch;
    });

    const sortedNotes = filteredNotes.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);

        if (sortOrder === 'asc') {
            return dateA - dateB;
        } else {
            return dateB - dateA;
        }
    });

    const nextImportantNote = () => {
        setCurrentImportantIndex((prevIndex) =>
            (prevIndex + 1) % importantNotes.length
        );
    };

    const prevImportantNote = () => {
        setCurrentImportantIndex((prevIndex) =>
            (prevIndex - 1 + importantNotes.length) % importantNotes.length
        );
    };

    const currentImportantNote = importantNotes[currentImportantIndex];

    return (
        <>
            {importantNotes.length > 0 && currentImportantNote && (
                <div className="important-note-card" aria-label="Losowa ważna notatka">
                    <h3>Ważna notatka</h3>
                    <h4>{currentImportantNote.title}</h4>
                    <h6>{formatDate(currentImportantNote.createdAt)}</h6>
                    <p className="note-content">
                        {currentImportantNote.content.length > 200
                            ? currentImportantNote.content.slice(0, 200) + '...'
                            : currentImportantNote.content}
                    </p>
                    <div className="important-note-navigation">
                        <button onClick={prevImportantNote} aria-label="Poprzednia ważna notatka"><i className="fa-solid fa-left-long"></i></button>
                        <button onClick={nextImportantNote} aria-label="Następna ważna notatka"><i className="fa-solid fa-right-long"></i></button>
                    </div>
                </div>
            )}

            <div className="notes-list">
                <h2>Twoje notatki</h2>

                <div className="filters">

                    <label>
                        Sortuj po dacie:
                        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                            <option value="desc">Najnowsze najpierw</option>
                            <option value="asc">Najstarsze najpierw</option>
                        </select>
                    </label>
                    <label>
                        Kategoria:
                        <input
                            type="text"
                            placeholder="Filtruj po kategorii"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        />
                    </label>
                    <label>
                        Od daty:
                        <input
                            type="datetime-local"
                            value={filterDateFrom}
                            onChange={(e) => setFilterDateFrom(e.target.value)}
                        />
                    </label>
                    <label>
                        Do daty:
                        <input
                            type="datetime-local"
                            value={filterDateTo}
                            onChange={(e) => setFilterDateTo(e.target.value)}
                        />
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                            type="checkbox"
                            checked={filterImportant}
                            onChange={e => setFilterImportant(e.target.checked)}
                        />
                        Pokaż tylko ważne notatki
                    </label>


                    <button
                        onClick={() => {
                            setFilterCategory('');
                            setFilterDateFrom('');
                            setFilterDateTo('');
                            setFilterImportant(false);
                            setSortOrder('desc');
                        }}
                    >
                        Wyczyść filtry
                    </button>
                </div>

                <button
                    className="add-note-button"
                    onClick={() => navigate('/notes/new')}
                >
                    <i className="fa-solid fa-note-sticky"></i> Dodaj notatkę
                </button>

                {sortedNotes.length === 0 ? (
                    <p>Brak notatek.</p>
                ) : (
                    <ul className="notes">
                        {sortedNotes.map(note => (
                            <li key={note.id} className={note.important ? 'important' : ''}>
                                <Link to={`/notes/${note.id}`} className="note-link">
                                    <div className="note-header">
                                        <strong className="note-title">{note.title} </strong>
                                        <span className="note-category">{note.category}</span>
                                    </div>
                                    <div className="note-date">{formatDate(note.createdAt)}</div>
                                    <div className="note-content">
                                        {note.content.length > 100
                                            ? note.content.slice(0, 100) + '...'
                                            : note.content}
                                    </div>
                                </Link>
                                <button onClick={() => handleDelete(note.id)}>Usuń</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Stopka z wylogowaniem */}
            <footer className="footer">
                <button onClick={handleLogout}>Wyloguj się</button>
            </footer>
        </>
    );
}

export default NotesList;
