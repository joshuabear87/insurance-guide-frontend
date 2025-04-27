import React, { useEffect, useState } from 'react';
import API from '../axios'; // ✅ Use your protected API
import Spinner from '../components/Spinner';
import BooksCard from '../components/home/BooksCard';
import BooksTable from '../components/home/BooksTable';
import Navbar from '../components/NavBar';
import Searchbar from '../components/Searchbar';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState('table');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await API.get('/books');
        setBooks(res.data.data);
      } catch (err) {
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };

    setTimeout(fetchBooks, 1000); // Optional: just to show spinner for 1 second
  }, []);

  const filteredBooks = books.filter((book) =>
    Object.values(book).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div
      className="container-fluid min-vh-100 bg-light"
      style={{ paddingTop: '120px', paddingLeft: '60px', paddingRight: '60px' }}
    >
      <Navbar />
      <Searchbar
        showType={showType}
        setShowType={setShowType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div>
        {loading ? (
          <Spinner />
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
