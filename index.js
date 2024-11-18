    let teams = [];
    const PORT = 3000;
    const url = `http://localhost:${PORT}/teams`;
    
    document.addEventListener('DOMContentLoaded', () => {
        const createTeamButton = document.getElementById('createTeamButton');
        const updateTeamButton = document.getElementById('updateTeamButton');
        const teamForm = document.getElementById('team-form');
        const teamsContainer = document.getElementById('teams-container');
        const teamList = [];
        let teamId = null; // Store the selected teamId for updates

        createTeamButton.addEventListener('click', onCreateTeamClick);
        updateTeamButton.addEventListener('click', onUpdateTeamClick);

        teamsContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('update-button')) {
                const teamId = event.target.dataset.teamId;  // Fixed: Changed from dataset.index to dataset.teamId
                setUpEditForm(teamId);  // Populate the form with the team's current data
            }
        });

        function setUpEditForm(teamId) {
            const team = teamList.find(t => t.id === parseInt(teamId));
            if (team) {
                // Set form fields to the team data
                document.getElementById('teamName').value = team.name;
                document.getElementById('teamOwner').value = team.owner;
                document.getElementById('teamWins').value = team.wins;
                document.getElementById('teamLosses').value = team.losses;
                document.getElementById('teamId').value = team.id; // Set the team ID in hidden input
                createTeamButton.style.display = 'none'; // Hide Create button
                updateTeamButton.style.display = 'inline-block'; // Show Update button
            }
        }
    
        // Fetch all teams from the DB
        async function fetchTeams() {
            try {
                const response = await fetch(url);
                const data = await response.json();
                teamList.length = 0; // Clear the team list
                teamList.push(...data); // Add the fetched teams to the team list
                renderTeams();
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        }

        // Render the teams
        function renderTeams() {
            teamsContainer.innerHTML = ''; // Clear current teams
            console.log('Rendering teams:', teamList);
            teamList.forEach((team) => {
                const teamDiv = document.createElement('div');
                teamDiv.classList.add('team');
                teamDiv.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h3 class="card-title">${team.name}</h3>
                            <p class="card-text">Owner: ${team.owner}</p>
                            <p class="card-text">Wins: ${team.wins}</p>
                            <p class="card-text">Losses: ${team.losses}</p>
                            <button class="btn btn-primary update-button" data-team-id="${team.id}">Update</button>
                            <button class="btn btn-danger delete-button" data-team-id="${team.id}">Delete</button>
                        </div>
                    </div>
                `;
                teamsContainer.appendChild(teamDiv);
            });
        }

        // Create a new team
        async function createTeam(team) {
            createTeamButton.disabled = true; // Disable the button
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(team),
                });
        
                if (!response.ok) throw new Error('Failed to create team');
        
                const newTeam = await response.json();
                teamList.push(newTeam);
                renderTeams();
            } catch (error) {
                console.error(error);
            } finally {
                createTeamButton.disabled = false; // Re-enable the button
            }
        }
        

        // Handle create or update team logic
        async function onCreateTeamClick() {
            const teamName = document.getElementById('teamName').value;
            const teamOwner = document.getElementById('teamOwner').value;
            const teamWins = parseInt(document.getElementById('teamWins').value) || 0;
            const teamLosses = parseInt(document.getElementById('teamLosses').value) || 0;

            if (teamList.some(t => t.name === teamName && t.owner === teamOwner)) {
                alert('Team already exists!');
                return;
            }
            
            const newTeam = {
                name: teamName,
                owner: teamOwner,
                wins: teamWins,
                losses: teamLosses,
            };

            await createTeam(newTeam); // Create the team
            teamForm.reset(); // Reset the form
            fetchTeams(); // Refetch teams
        }

        // Handle update team logic
        async function onUpdateTeamClick() {
            const teamName = document.getElementById('teamName').value;
            const teamOwner = document.getElementById('teamOwner').value;
            const teamWins = parseInt(document.getElementById('teamWins').value) || 0;
            const teamLosses = parseInt(document.getElementById('teamLosses').value) || 0;
            const teamId = document.getElementById('teamId').value;

            if (teamId) {
                // Update existing team
                const updatedTeam = {
                    id: parseInt(teamId),
                    name: teamName,
                    owner: teamOwner,
                    wins: teamWins,
                    losses: teamLosses,
                };
                await updateTeam(updatedTeam);
            } else {
                // If no ID exists, create a new team
                await createTeam({ name: teamName, owner: teamOwner, wins: teamWins, losses: teamLosses });
            }

            // Reset the form and fetch teams again
            teamForm.reset();
            createTeamButton.style.display = 'inline-block'; // Show Create button
            updateTeamButton.style.display = 'none'; // Hide Update button
            fetchTeams();
        }

        // Update an existing team
        async function updateTeam(team) {
            try {
                const response = await fetch(`${url}/${team.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(team),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const updatedTeamData = await response.json();
                const index = teamList.findIndex((t) => t.id === team.id);
                if (index !== -1) {
                    teamList[index] = updatedTeamData; // Update the team in the list
                    renderTeams(); // Re-render the teams
                }
            } catch (error) {
                console.error('Error updating team:', error);
            }
        }

        // Delete a team
        async function deleteTeam(teamId) {
            try {
                const response = await fetch(`${url}/${teamId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    const index = teamList.findIndex(t => t.id === parseInt(teamId));
                    if (index !== -1) {
                        teamList.splice(index, 1); // Remove the team from the list
                        renderTeams(); // Re-render the team list
                    }
                } else {
                    console.error('Failed to delete team');
                }
            } catch (error) {
                console.error('Error deleting team:', error);
            }
        }

        // Handle delete button click to delete a team
        teamsContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('delete-button')) {
                const teamId = event.target.dataset.teamId;
                deleteTeam(teamId);
            }
        });

        // Fetch teams when page loads
        fetchTeams();
    });