// const express = require('express');
// const fs = require('fs');
// const app = express();
// const port = 3000;

// document.addEventListener('DOMContentLoaded', () => {
//     document.getElementById('createTeamButton').addEventListener('click', onCreateTeamClick);
//     fetchTeams(); // Fetch initial data
// });


// app.use(express.json()); // To parse JSON bodies

// app.get('/teams', (req, res) => {
//     fs.readFile('db.json', 'utf8', (err, data) => {
//         if (err) {
//             console.error('Error reading file:', err);
//             return res.status(500).send('Internal Server Error');
//         }
//         const jsonData = JSON.parse(data);
//         res.json(jsonData.teams); // Make sure to return the teams array
//     });
// });

// app.post('/teams', (req, res) => {
//     fs.readFile('db.json', 'utf8', (err, data) => {
//         if (err) {
//             console.error('Error reading file:', err);
//             return res.status(500).send('Internal Server Error');
//         }
        
//         const jsonData = JSON.parse(data);
//         const newTeam = req.body; // Get the new team data from the request body
        
//         // Add the new team to the teams array
//         jsonData.teams.push(newTeam);

//         // Save the updated data back to db.json
//         fs.writeFile('db.json', JSON.stringify(jsonData, null, 2), (err) => {
//             if (err) {
//                 console.error('Error writing file:', err);
//                 return res.status(500).send('Internal Server Error');
//             }
//             res.json(newTeam); // Return the newly created team
//         });
//     });
// });

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });
