const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createPool, initializeDatabase, registerUser, pool } = require('./db');
const eventController = require('./controllers/eventController');
const venueController = require('./controllers/venueController');
const userController = require('./controllers/userController');
const vendorController = require('./controllers/vendorController');
const suppliesController = require('./controllers/suppliesController');
const employeeController = require('./controllers/employeeController');
const participantController = require('./controllers/participantController');

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,  
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Initialize database connection
async function startServer() {
    try {
        const dbPool = await createPool();
        await initializeDatabase();

        // Register endpoint
        app.post('/api/register', async (req, res) => {
            console.log('Received registration request:', req.body);
            
            try {
                const { firstName, lastName, email, role, password } = req.body;
                
                // Enhanced validation
                if (!firstName || firstName.trim().length < 2) {
                    return res.status(400).json({ message: 'First name must be at least 2 characters long' });
                }

                if (!lastName || lastName.trim().length < 2) {
                    return res.status(400).json({ message: 'Last name must be at least 2 characters long' });
                }

                if (!email || !email.includes('@')) {
                    return res.status(400).json({ message: 'Please provide a valid email address' });
                }

                if (!role || !['employee', 'client'].includes(role)) {
                    return res.status(400).json({ message: 'Please select a valid role' });
                }

                if (!password || password.length < 6) {
                    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
                }

                const result = await registerUser(
                    firstName.trim(), 
                    lastName.trim(), 
                    email.trim(), 
                    role.trim(), 
                    password
                );
                
                res.status(201).json({ message: 'Registration successful', userId: result.userId });
            } catch (error) {
                console.error('Registration error:', error);
                
                if (error.message.includes('Email already exists')) {
                    return res.status(400).json({ message: 'This email is already registered' });
                }
                
                res.status(500).json({ message: 'An error occurred during registration' });
            }
        });

        // Login endpoint
        app.post('/api/login', async (req, res) => {
            console.log('Received login request:', req.body);
            
            try {
                const { email, password } = req.body;
                
                if (!email || !password) {
                    return res.status(400).json({ message: 'Email and password are required' });
                }

                const connection = await dbPool.getConnection();
                try {
                    // First get the user details
                    const [users] = await connection.execute(
                        'SELECT User_Id, First_Name, Last_Name, Email, Role FROM users WHERE Email = ? AND Password = ?',
                        [email, password]
                    );

                    if (users.length === 0) {
                        return res.status(401).json({ message: 'Invalid email or password' });
                    }

                    const user = users[0];

                    // If user is a client, get their Client_Id
                    let clientId = null;
                    if (user.Role === 'client') {
                        const [clients] = await connection.execute(
                            'SELECT Client_Id FROM clients WHERE User_Id = ?',
                            [user.User_Id]
                        );
                        if (clients.length > 0) {
                            clientId = clients[0].Client_Id;
                        }
                    }

                    res.json({
                        message: 'Login successful',
                        userId: user.User_Id,
                        clientId: clientId,
                        firstName: user.First_Name,
                        lastName: user.Last_Name,
                        email: user.Email,
                        role: user.Role
                    });
                } finally {
                    connection.release();
                }
            } catch (error) {
                console.error('Login error:', error);
                res.status(500).json({ message: 'An error occurred during login' });
            }
        });

        app.get('/api/events', eventController.getAllEvents);
        app.post('/api/events', eventController.createEvent);
        app.put('/api/events/:id/status', eventController.updateEventStatus);
        app.post('/api/events/create', eventController.createNewEvent);
        app.get('/api/venues', venueController.getAllVenues);
        app.get('/api/bookings/:clientId', eventController.getClientBookings);
        app.get('/api/profile/:userId', userController.getUserProfile);
        app.put('/api/profile/update', userController.updateUserProfile);
        app.get('/api/vendors', vendorController.getAllVendors);
        app.get('/api/vendors/:vendorId/items', vendorController.getVendorItems);
        app.post('/api/supplies/create', suppliesController.createSupplies);
        app.get('/api/events/:eventId/supplies', suppliesController.getEventSupplies);
        app.get('/api/vendors/:vendorId/supplies', vendorController.getVendorSupplies);
        app.post('/api/venues/create', venueController.createVenue);
        app.get('/api/employee/team/:userId', employeeController.getTeamMembers);
        app.post('/api/participants/create', participantController.createParticipant);
        app.get('/api/events/:eventId/participants', participantController.getParticipantsByEvent);
        app.get('/api/participants', participantController.getAllParticipants);
        app.post('/api/payments/create', participantController.createPayment);
        app.get('/api/participants/:participantId', participantController.getParticipantById);
        app.get('/api/events/:eventId/payment', eventController.getEventPayment);

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer(); 