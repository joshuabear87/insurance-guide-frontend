import React from 'react';
import { useSnackbar } from 'notistack';
import API from '../axios';

const SendPdfButton = () => {
  const { enqueueSnackbar } = useSnackbar();

  const sendPdf = async () => {

    try {
      const res = await API.post('/send-pdf/');
      enqueueSnackbar(res.data.message || 'Email sent successfully!', { variant: 'success' });
    } catch (err) {
      console.error('❌ PDF send error:', err);
      enqueueSnackbar('Failed to send email. Please try again.', { variant: 'error' });
    } 
  };

  return (
    <button className="btn btn-login" onClick={sendPdf}>
      📤 Send PDF to Admin
    </button>
  );
};

export default SendPdfButton;
