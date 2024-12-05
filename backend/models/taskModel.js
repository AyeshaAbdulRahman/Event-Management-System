const { pool } = require('../db');

async function createTasksForEvent(eventId, eventType) {
    let connection;
    try {
        // Get all teams first
        connection = await pool.getConnection();
        const [teams] = await connection.execute('SELECT Team_Id, Team_Name FROM teams');
        
        // Create team map
        const teamMap = {};
        teams.forEach(team => {
            teamMap[team.Team_Name] = team.Team_Id;
        });

        // Define tasks based on event type
        let tasksToCreate = [];
        switch(eventType.toLowerCase()) {
            case 'concert':
                tasksToCreate = [
                    { Task_Name: 'Arrange Audio and Lighting Equipment', Team_Name: 'Media' },
                    { Task_Name: 'Sell/Distribute Tickets', Team_Name: 'Marketing' },
                    { Task_Name: 'Handle Registrations', Team_Name: 'Participant Relations' },
                    { Task_Name: 'Organize Backstage Catering', Team_Name: 'Guest Relation' },
                    { Task_Name: 'Design Event Promo Content', Team_Name: 'Media' }
                ];
                break;
            case 'festival':
                tasksToCreate = [
                    { Task_Name: 'Coordinate Venue Layout', Team_Name: 'Event Management' },
                    { Task_Name: 'Create Event Marketing Campaign', Team_Name: 'Marketing' },
                    { Task_Name: 'Allocate Participant Booths', Team_Name: 'Participant Relations' },
                    { Task_Name: 'Organize Security and Crowd Control', Team_Name: 'Guest Relation' },
                    { Task_Name: 'Manage Event Schedule', Team_Name: 'Event Management' }
                ];
                break;
            case 'qawali':
                tasksToCreate = [
                    { Task_Name: 'Book Accommodation for Artists', Team_Name: 'Guest Relation' },
                    { Task_Name: 'Arrange Seating for Audience', Team_Name: 'Event Management' },
                    { Task_Name: 'Prepare Stage Setup for Musicians', Team_Name: 'Event Management' },
                    { Task_Name: 'Promote Event on Social Media', Team_Name: 'Marketing' },
                    { Task_Name: 'Check Sound System and Mics', Team_Name: 'Media' }
                ];
                break;
            case 'formal':
                tasksToCreate = [
                    { Task_Name: 'Send Invitations to Guests', Team_Name: 'Marketing' },
                    { Task_Name: 'Plan Event Agenda', Team_Name: 'Event Management' },
                    { Task_Name: 'Manage Registrations', Team_Name: 'Participant Relations' },
                    { Task_Name: 'Setup Formal Decor', Team_Name: 'Event Management' },
                    { Task_Name: 'Record Event Coverage', Team_Name: 'Media' }
                ];
                break;
        }

        // Insert tasks one by one
        for (const task of tasksToCreate) {
            const teamId = teamMap[task.Team_Name];
            if (teamId) {
                try {
                    const query = 'INSERT INTO tasks (Task_Name, Event_Id, Team_Id) VALUES (?, ?, ?)';
                    const values = [task.Task_Name, eventId, teamId];
                    
                    console.log('Inserting task:', {
                        Task_Name: task.Task_Name,
                        Event_Id: eventId,
                        Team_Id: teamId
                    });

                    await connection.execute(query, values);
                } catch (err) {
                    console.error('Error inserting task:', task.Task_Name, err);
                }
            } else {
                console.error('Team not found:', task.Team_Name);
            }
        }

        return true;
    } catch (error) {
        console.error('Error in createTasksForEvent:', error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

async function getTasksByTeam(teamId) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT 
                t.Task_Id,
                t.Task_Name,
                e.Event_Name,
                tm.Team_Name
            FROM tasks t
            JOIN events e ON t.Event_Id = e.Event_Id
            JOIN teams tm ON t.Team_Id = tm.Team_Id
            WHERE t.Team_Id = ?
            ORDER BY e.Date DESC
        `, [teamId]);
        return rows;
    } finally {
        connection.release();
    }
}

async function getEventTasks(eventId) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT 
                t.Task_Id,
                t.Task_Name,
                t.Event_Id,
                tm.Team_Name
            FROM tasks t
            JOIN teams tm ON t.Team_Id = tm.Team_Id
            WHERE t.Event_Id = ?
            ORDER BY tm.Team_Name
        `, [eventId]);
        return rows;
    } finally {
        connection.release();
    }
}

module.exports = {
    createTasksForEvent,
    getTasksByTeam,
    getEventTasks
}; 