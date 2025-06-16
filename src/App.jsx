import './App.css';
import LoginForm from './LoginForm.jsx';
import RegisterForm from './RegisterForm.jsx';
import NotesList from './NotesList.jsx';
import AddNote from './AddNote';
import EditNote from './EditNote';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <div className="bg">
      <p>NOTES <i className="fa fa-clipboard"></i></p>
      <BrowserRouter>
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/notes" element={<NotesList />} />
            <Route path="/notes/new" element={<AddNote />} />
            <Route path="/notes/:id" element={<EditNote />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
