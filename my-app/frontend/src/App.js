import React, { useState, useEffect } from 'react';
import {
  Container, Typography, FormControl, InputLabel, Select, MenuItem, Grid, Button, Paper, List, ListItem, ListItemText,
  Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

function App() {
  const [classrooms, setClassrooms] = useState([]);
  const [block, setBlock] = useState('');
  const [time, setTime] = useState('');
  const [day, setDay] = useState('');
  const [floor, setFloor] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await fetch('/api/classrooms');
        if (!response.ok) {
          throw new Error('Failed to fetch classrooms');
        }
        const data = await response.json();
        setClassrooms(data);
      } catch (err) {
        setError('Error fetching classrooms');
        setSnackbarOpen(true);
        console.error('Error fetching classrooms:', err);
      }
    };
    fetchClassrooms();
  }, []);

  const handleBlockChange = (event) => setBlock(event.target.value);
  const handleTimeChange = (event) => setTime(event.target.value);
  const handleDayChange = (event) => setDay(event.target.value);
  const handleFloorChange = (event) => setFloor(event.target.value);

  const handlePresentlyClick = () => {
    const { currentSlot, currentDay } = getCurrentTimeSlotAndDay();
    if (currentSlot) {
      setTime(currentSlot);
      setDay(currentDay);
    }
  };

  const getCurrentTimeSlotAndDay = () => {
    const now = new Date();
    const hours = now.getHours();
    const dayIndex = now.getDay();

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = daysOfWeek[dayIndex];

    const timeSlots = [
      '8:00 AM - 9:00 AM',
      '9:00 AM - 10:00 AM',
      '10:00 AM - 11:00 AM',
      '11:00 AM - 12:00 PM',
      '12:00 PM - 1:00 PM',
      '1:00 PM - 2:00 PM',
      '2:00 PM - 3:00 PM',
      '3:00 PM - 4:00 PM',
      '4:00 PM - 5:00 PM',
      '5:00 PM - 6:00 PM',
      '6:00 PM - 7:00 PM',
      '7:00 PM - 8:00 PM',
    ];

    let currentSlot = null;

    for (let i = 0; i < timeSlots.length; i++) {
      const [start, end] = timeSlots[i].split(' - ');
      const startHour = parseInt(start.split(':')[0]) + (start.includes('PM') && start.split(':')[0] !== '12' ? 12 : 0);
      const endHour = parseInt(end.split(':')[0]) + (end.includes('PM') && end.split(':')[0] !== '12' ? 12 : 0);

      if (hours >= startHour && hours < endHour) {
        currentSlot = timeSlots[i];
        break;
      }
    }

    return { currentSlot, currentDay };
  };

  const filteredClassrooms = classrooms.filter(room => {
    return (
      (!block || room.location === block) &&
      (!time || room.availableTimes.includes(time)) &&
      (!day || room.day === day) &&
      (!floor || room.floor === parseInt(floor))
    );
  });

  const timeSlots = [
    '8:00 AM - 9:00 AM',
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 1:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM',
    '5:00 PM - 6:00 PM',
    '6:00 PM - 7:00 PM',
    '7:00 PM - 8:00 PM',
  ];

  const getFloorsForBlock = (block) => {
    switch (block) {
      case 'AB1':
      case 'AB2':
        return Array.from({ length: 4 }, (_, i) => i + 1);
      case 'CB':
        return Array.from({ length: 10 }, (_, i) => i + 1);
      default:
        return [];
    }
  };

  const floors = getFloorsForBlock(block);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();

      if (response.ok && result.success) {
        handleDialogClose();
        navigate('/booking');
      } else {
        setError(result.message || 'Invalid credentials');
        setSnackbarOpen(true);
      }
    } catch (err) {
      setError('Error logging in');
      setSnackbarOpen(true);
    }
  };

  return (
    <Container maxWidth="lg" style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom style={{ color: '#2196f3', textAlign: 'center' }}>CLASSROOM AVAILABILITY</Typography>

      <Grid container spacing={3}>
        {/* Filters */}
        <Grid container item spacing={3}>
          {/* Block Filter */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel style={{ color: '#2196f3' }}>Block</InputLabel>
              <Select value={block} onChange={handleBlockChange}>
                <MenuItem value=""><em>All Blocks</em></MenuItem>
                <MenuItem value="AB1">AB1</MenuItem>
                <MenuItem value="AB2">AB2</MenuItem>
                <MenuItem value="CB">CB</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Floor Filter */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel style={{ color: '#2196f3' }}>Floor</InputLabel>
              <Select value={floor} onChange={handleFloorChange}>
                <MenuItem value=""><em>All Floors</em></MenuItem>
                {floors.map(floorNumber => (
                  <MenuItem key={floorNumber} value={floorNumber}>{floorNumber}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Check Presently Available Button */}
          <Grid item xs={12} sm={12} md={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
            <Button variant="contained" color="primary" onClick={handlePresentlyClick}>Check Presently Available</Button>
          </Grid>
        </Grid>

        <Grid container item spacing={3}>
          {/* Day Filter */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel style={{ color: '#2196f3' }}>Day</InputLabel>
              <Select value={day} onChange={handleDayChange}>
                <MenuItem value=""><em>All Days</em></MenuItem>
                <MenuItem value="Tuesday">Tuesday</MenuItem>
                <MenuItem value="Wednesday">Wednesday</MenuItem>
                <MenuItem value="Thursday">Thursday</MenuItem>
                <MenuItem value="Friday">Friday</MenuItem>
                <MenuItem value="Saturday">Saturday</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Time Filter */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel style={{ color: '#2196f3' }}>Time</InputLabel>
              <Select value={time} onChange={handleTimeChange}>
                <MenuItem value=""><em>All Times</em></MenuItem>
                {timeSlots.map((slot, index) => (
                  <MenuItem key={index} value={slot}>{slot}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Available Classrooms */}
        <Grid item xs={12}>
          <Paper style={{ padding: '20px' }}>
            <List>
              {filteredClassrooms.length > 0 ? (
                filteredClassrooms.map((room, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={`Classroom ${room.number}`} secondary={`Available: ${room.availableTimes.join(', ')}`} />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body1" style={{ textAlign: 'center' }}>No classrooms available for the selected filters.</Typography>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Book a Classroom Button */}
        <Grid item xs={12} style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button variant="contained" color="secondary" onClick={handleDialogOpen}>Book a Classroom</Button>
        </Grid>
      </Grid>

      {/* Snackbar for error/success messages */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity={error ? 'error' : 'success'}>
          {error || success}
        </MuiAlert>
      </Snackbar>

      {/* Login Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogin} color="primary">
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
