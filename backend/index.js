const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users');
const eventsRoutes = require('./routes/events');
const clientsRoutes = require('./routes/clients');
const teamsRoutes = require('./routes/teams');
const venuesRoutes = require('./routes/venue');
const participantsRoutes = require('./routes/participants');
const registrationRoutes = require('./routes/registration');
const paymentsRoutes = require('./routes/payment');
const tasksRoutes = require('./routes/tasks');
const suppliesRoutes = require('./routes/supplies');
const adminRoutes = require('./routes/admin');
const vendorRoutes = require('./routes/vendors');

app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.send('Welcome to the Event Management System');
});

// Use the routes
app.use('/users', usersRoutes);
app.use('/events', eventsRoutes);
app.use('/clients', clientsRoutes);
app.use('/teams', teamsRoutes);
app.use('/venues', venuesRoutes);
app.use('/participants', participantsRoutes);
app.use('/registration', registrationRoutes);
app.use('/payments', paymentsRoutes);
app.use('/tasks', tasksRoutes);
app.use('/supplies', suppliesRoutes);
app.use('/admins', adminRoutes);
app.use('/vendors', vendorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
