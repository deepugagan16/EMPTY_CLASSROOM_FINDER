// src/components/BookingPage.js
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

function BookingPage() {
    const [booking, setBooking] = useState({ classroomId: '', startTime: '', endTime: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleBookingChange = (e) => {
        const { name, value } = e.target;
        setBooking(prev => ({ ...prev, [name]: value }));
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(booking),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.success) {
                setSuccess('Booking successful!');
                setSnackbarOpen(true);
                // Clear the form or redirect as needed
                setBooking({ classroomId: '', startTime: '', endTime: '' });
            } else {
                setError('Booking failed: ' + data.message);
                setSnackbarOpen(true);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            setSnackbarOpen(true);
            console.error('Booking error:', err);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Book a Classroom</Typography>
            <Paper style={{ padding: '20px', marginTop: '20px' }}>
                <form onSubmit={handleBookingSubmit}>
                    <TextField
                        label="Classroom ID"
                        name="classroomId"
                        value={booking.classroomId}
                        onChange={handleBookingChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Start Time"
                        name="startTime"
                        type="datetime-local"
                        value={booking.startTime}
                        onChange={handleBookingChange}
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="End Time"
                        name="endTime"
                        type="datetime-local"
                        value={booking.endTime}
                        onChange={handleBookingChange}
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Book
                    </Button>
                </form>
            </Paper>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <MuiAlert onClose={handleSnackbarClose} severity={error ? 'error' : 'success'}>
                    {error || success}
                </MuiAlert>
            </Snackbar>
        </Container>
    );
}

export default BookingPage;
