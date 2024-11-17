// index.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
require('dotenv').config();
const usersRoutes = require('./routes/users');
const eventsRoutes = require('./routes/events');
const clientsRoutes = require('./routes/clients');
const teamsRoutes = require('./routes/teams');
const venuesRoutes = require('./routes/venues');
const participantsRoutes = require('./routes/participants');
const registrationRoutes = require('./routes/registration');
const paymentsRoutes = require('./routes/payment');
const tasksRoutes = require('./routes/tasks');

// Oracle connection configuration
const dbConfig = {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECT_STRING
};

// Initialize Oracle connection pool
async function initializeDatabase() {
    try {
        await oracledb.createPool({
            ...dbConfig,
            poolIncrement: 0,
            poolMax: 4,
            poolMin: 0
        });
        console.log('Connected to Oracle Database');
    } catch (err) {
        console.error('Oracle Database connection error:', err);
        process.exit(1);
    }
}

// Initialize the database pool
initializeDatabase();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

app.use('/users', usersRoutes);
app.use('/events', eventsRoutes);
app.use('/clients', clientsRoutes);
app.use('/teams', teamsRoutes);
app.use('/venues', venuesRoutes);
app.use('/participants', participantsRoutes);
app.use('/registration', registrationRoutes);
app.use('/payments', paymentsRoutes);
app.use('/tasks', tasksRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Cleanup on app termination
process.on('SIGINT', async () => {
    try {
        await oracledb.getPool().close(10);
        process.exit(0);
    } catch(err) {
        console.error('Error closing Oracle connection pool:', err);
        process.exit(1);
    }
});
