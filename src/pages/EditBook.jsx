import React, { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const EditBooks = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const API_URL = import.meta.env.VITE_API_URL;  

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/${id}`);
        setTitle(res.data.title);
        setAuthor(res.data.author);
        setPublishYear(res.data.publishYear);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching book:', err);
        enqueueSnackbar('Failed to load book details!', { variant: 'error' });
        setLoading(false);
      }
    };

    fetchBook();
  }, [API_URL, id, enqueueSnackbar]);

  const handleEditBook = async () => {
    const data = {
      title,
      author,
      publishYear
    };

    setLoading(true);

    try {
      await axios.put(`${API_URL}/books/${id}`, data);
      enqueueSnackbar('Book edited successfully!', { variant: 'success' });
      navigate('/');
    } catch (err) {
      console.error('Error editing book:', err);
      enqueueSnackbar('Error editing book!', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Edit Book</h1>

      {loading ? (
        <Spinner />
      ) : (
        <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4'>
          <div className='my-4'>
            <label className='text-xl mr-4 text-gray-500'>Title</label>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='border-2 border-gray-500 px-4 py-2 w-full'
            />
          </div>
          <div className='my-4'>
            <label className='text-xl mr-4 text-gray-500'>Author</label>
            <input
              type='text'
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className='border-2 border-gray-500 px-4 py-2 w-full'
            />
          </div>
          <div className='my-4'>
            <label className='text-xl mr-4 text-gray-500'>Publish Year</label>
            <input
              type='number'
              value={publishYear}
              onChange={(e) => setPublishYear(e.target.value)}
              className='border-2 border-gray-500 px-4 py-2 w-full'
            />
          </div>
          <button
            className='p-2 bg-sky-300 m-8 hover:bg-sky-500 transition'
            onClick={handleEditBook}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default EditBooks;
