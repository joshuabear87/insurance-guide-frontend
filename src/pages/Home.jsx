import React, { useEffect, useState, useMemo } from 'react';
import API from '../axios';
import Spinner from '../components/Spinner';
import Searchbar from '../components/Searchbar';
import InsurancePlanTable from '../components/home/InsurancePlanTable';
import InsurancePlanCardSection from '../components/home/InsurancePlanCardSection';

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
        setTimeout(() => setLoading(false), 500);
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
      <>
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
          <InsurancePlanTable books={filteredBooks} />
        ) : (
          <InsurancePlanCardSection books={filteredBooks} />
        )}
      </div>
        </>
  );
};

export default Home;
