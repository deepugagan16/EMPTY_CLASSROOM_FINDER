// frontend/src/components/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useAuth } from '../AuthContext';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Example authentication logic; replace with actual implementation
        if (username && password) {
            login();
            navigate(redirectTo);
        } else {
            alert('Please enter valid credentials');
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Login</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Username"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button variant="contained" color="primary" type="submit">Login</Button>
            </form>
        </Container>
    );
};

export default LoginPage;
