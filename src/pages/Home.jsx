import React, { useEffect, useState, useMemo } from 'react';
import API from '../axios';
import Spinner from '../components/Spinner';
import BooksCard from '../components/home/BooksCard';
import BooksTable from '../components/home/BooksTable';
import Navbar from '../components/NavBar';
import Searchbar from '../components/Searchbar';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showType, setShowType] = useState('table');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await API.get('/books');
        setBooks(res.data.data);
      } catch (err) {
        console.error('Error fetching books:', err);
      } finally {
        setTimeout(() => setLoading(false), 500); // Only delay hiding the spinner, not fetching!
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    return books.filter((book) =>
      Object.values(book).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [books, searchQuery]);

  return (
    <div className="container-fluid min-vh-100 bg-light page-container">
      <Navbar />
      <Searchbar
        showType={showType}
        setShowType={setShowType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div>
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner />
          </div>
        ) : showType === 'table' ? (
          <BooksTable books={filteredBooks} />
        ) : (
          <BooksCard books={filteredBooks} />
        )}
      </div>
    </div>
  );
};

export default Home;
