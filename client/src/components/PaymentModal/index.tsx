import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Divider, CircularProgress } from '@mui/material';
import { CreditCard as CreditCardIcon, Lock as LockIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { FaCcVisa, FaCcMastercard } from 'react-icons/fa'; // Import icons from react-icons
import { useEnrollMutation } from '../../services/courseServices'; // Assuming RTK service
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  coursePrice: number; // The price passed as a parameter
  courseId: string; // Pass courseId to enroll
}

const PaymentModal: React.FC<PaymentModalProps> = ({ open, onClose, coursePrice, courseId }) => {

  const navigate=useNavigate()
  const [cardNumber, setCardNumber] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false); // To handle loading state
  const [paymentSuccess, setPaymentSuccess] = useState(false); // To show success message
  const [enrollInCourse] = useEnrollMutation(); // RTK Mutation Hook

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => setCardNumber(e.target.value);
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => setPin(e.target.value);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      // Simulate card details processing, in real use case, the details should be sent to a payment gateway API
      const accessToken = localStorage.getItem('accessToken') || '';

      if(!accessToken){
        toast("Please Log-In first");
       setTimeout(() => {
         navigate('/user/auth')
       }, 3000);
      }
      const response = await enrollInCourse({ accessToken, courseId }).unwrap();

      // Assuming response success status is true
      if (response.success) {
        setTimeout(() => {
          
          setPaymentSuccess(true);

        }, 2000);
        setTimeout(() => {
          onClose(); // Close modal after success
          navigate(`/`)

        }, 5000);
      } else {
        // Handle error case if needed
        console.error('Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box
        sx={{
          backgroundColor: 'white',
          width: 400,
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" align="center" gutterBottom>
          Complete Your Payment
        </Typography>

        {/* Price */}
        <Typography variant="h5" align="center" color="primary" gutterBottom>
          ${coursePrice.toFixed(2)}
        </Typography>

        {/* Payment Method Icons */}
        <Box display="flex" justifyContent="center" gap={2} mb={2}>
          <FaCcVisa size={40} color="#1a73e8" /> {/* Visa Icon */}
          <FaCcMastercard size={40} color="#3e8e41" /> {/* Mastercard Icon */}
        </Box>

        <Divider sx={{ margin: '20px 0' }} />

        {/* Card Details Form */}
        <TextField
          label="Card Number"
          variant="outlined"
          fullWidth
          value={cardNumber}
          onChange={handleCardNumberChange}
          InputProps={{
            startAdornment: <CreditCardIcon sx={{ color: 'gray', marginRight: 1 }} />,
          }}
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label="PIN"
          variant="outlined"
          fullWidth
          value={pin}
          onChange={handlePinChange}
          type="password"
          InputProps={{
            startAdornment: <LockIcon sx={{ color: 'gray', marginRight: 1 }} />,
          }}
          sx={{ marginBottom: 2 }}
        />

        {/* Skeleton or Payment Success */}
        {isLoading ? (
          <CircularProgress size={40} sx={{ display: 'block', margin: '20px auto' }} />
        ) : paymentSuccess ? (
          <CheckCircleIcon color="success" sx={{ display: 'block', margin: '20px auto', fontSize: '40px' }} />
        ) : null}

        {/* Pay Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handlePayment}
          sx={{ padding: '12px', fontSize: '16px', marginBottom: 2 }}
          disabled={isLoading || paymentSuccess}
        >
          Pay Now
        </Button>
      </Box>
    </Modal>
  );
};

export default PaymentModal;
