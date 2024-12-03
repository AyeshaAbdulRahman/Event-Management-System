const Employee = require('../models/employeeModel');

async function getEmployeeTeam(req, res) {
    try {
        const userId = req.params.userId;
        const team = await Employee.getEmployeeTeam(userId);
        
        if (team) {
            res.json({ teamName: team.Team_Name });
        } else {
            res.status(404).json({ message: 'Team not found for this employee' });
        }
    } catch (error) {
        console.error('Error fetching employee team:', error);
        res.status(500).json({ message: 'Error fetching team information' });
    }
}

async function getTeamMembers(req, res) {
    try {
        const userId = req.params.userId;
        const team = await Employee.getEmployeeTeam(userId);
        
        if (team) {
            const members = await Employee.getTeamMembers(team.Team_Id);
            res.json({ 
                teamName: team.Team_Name,
                members: members 
            });
        } else {
            res.status(404).json({ message: 'Team not found for this employee' });
        }
    } catch (error) {
        console.error('Error fetching team members:', error);
        res.status(500).json({ message: 'Error fetching team information' });
    }
}

module.exports = {
    getEmployeeTeam,
    getTeamMembers
}; 