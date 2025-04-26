import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      axios.get(`${API_URL}/books`)
        .then((res) => {
          setBooks(res.data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }, 1000); // just to see the spinner for 1 second
  }, [API_URL]);

  const filteredBooks = books.filter((book) =>
    Object.values(book).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="container-fluid min-vh-100 bg-light" style={{ paddingTop: '120px', paddingLeft: '60px', paddingRight: '60px' }}>
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
