import React, { useEffect, useState, useMemo } from 'react';
import API from '../axios';
import Spinner from '../components/Spinner';
import Searchbar from '../components/Searchbar';
import InsurancePlanTable from '../components/home/InsurancePlanTable';
import InsurancePlanCardView from '../components/home/InsurancePlanCardVIew';

const InsurancePlanFiltered = ({ filter }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showType, setShowType] = useState('table');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await API.get('/books');
        const allBooks = res.data.data;
        const filteredBooks = filter
          ? allBooks.filter((book) => book.financialClass === filter)
          : allBooks;
        setBooks(filteredBooks);
      } catch (err) {
        console.error('Error fetching plans:', err);
      } finally {
        setTimeout(() => setLoading(false), 500); // cute delay 💫
      }
    };
    fetchBooks();
  }, [filter]);

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
          <InsurancePlanCardView books={filteredBooks} />
        )}
      </div>
    </>
  );
};

export default InsurancePlanFiltered;
