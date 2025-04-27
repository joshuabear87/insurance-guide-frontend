import React from 'react';
import { Routes, Route } from 'react-router-dom'; // ✅ Only import Routes and Route
import CreateBook from './pages/CreateBook';
import DeleteBook from './pages/DeleteBook';
import EditBook from './pages/EditBook';
import Home from './pages/Home';
import ShowBook from './pages/ShowBook';
import ProtectedRoute from './components/ProtectedRoute'; // ✅

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/books/details/:id" element={<ShowBook />} />

      {/* Protected Routes */}
      <Route
        path="/books/create"
        element={
          <ProtectedRoute>
            <CreateBook />
          </ProtectedRoute>
        }
      />
      <Route
        path="/books/edit/:id"
        element={
          <ProtectedRoute>
            <EditBook />
          </ProtectedRoute>
        }
      />
      <Route
        path="/books/delete/:id"
        element={
          <ProtectedRoute>
            <DeleteBook />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
