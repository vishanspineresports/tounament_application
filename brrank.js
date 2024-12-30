const DEPLOY_CODE = 'AKfycbwJgu20tOYkdiNC2iMGctNayPU08EWvsBMaLI_XaKW_S4cdwnliEhIpkic0qnBfZQ7z';

async function fetchTournaments() {
    document.getElementById('loader').style.display = 'flex';

    try {
        const response = await fetch(`https://script.google.com/macros/s/${DEPLOY_CODE}/exec`, {
            method: 'GET'
        });
        const data = await response.json();
        displayTournaments(data);
    } catch (error) {
        console.error('Error fetching tournaments:', error);
    } finally {
        document.getElementById('loader').style.display = 'none';
    }
}

function displayTournaments(tournaments) {
    const container = document.getElementById('tournamentContainer');
    tournaments.forEach(tournament => {
        const card = createTournamentCard(tournament);
        container.appendChild(card);
    });
}

function createTournamentCard(tournament) {
    const card = document.createElement('div');
    card.className = 'tournament-card';
    card.innerHTML = `
        <div class="disco-card">
        <img src="${tournament.image}" alt="${tournament.title}">
        <div class="details">
        <h2>${tournament.title}</h2>
        <p><b>Price:</b> ${tournament.price}</p>
        <p><b>Mode:</b> ${tournament.mode}</p>
        <p><b>Prize:</b> ${tournament.prize}</p>
        <p><b>Slots Available:</b> ${tournament.slot}</p>
        </div>
        </div>
        <button class="join-btn" id="joinBtn-${tournament.title}" onclick="handleJoin('${tournament.title}', ${tournament.slot}, '${tournament.price}', this)" ${tournament.slot <= 0 ? 'disabled' : ''}>
            ${tournament.slot <= 0 ? 'No Slots' : 'Join'}
        </button>
    `;
    return card;
}

async function handleJoin(tournamentTitle, slots, price, button) {
    if (slots <= 0) {
        alert('Sorry, no slots available!');
        return;
    }

    const confirmed = confirm('Do you want to join this tournament?');
    if (!confirmed) return;

    const username = localStorage.getItem('vishal_local');
    if (!username) {
        alert('Please log in first!');
        return;
    }

    try {
        const response = await fetch(`https://script.google.com/macros/s/${DEPLOY_CODE}/exec`, {
            method: 'POST',
            body: JSON.stringify({
                action: 'join',
                username: username,
                tournament: tournamentTitle,
                price: price
            })
        });

        const result = await response.json();
        if (result.success) {
            alert('Registration successful! Details have been sent to your email.');
            button.disabled = true;
            button.textContent = 'Joined';
            button.previousElementSibling.textContent = 'Slots Available: ' + (slots - 1);
        } else {
            alert(result.message || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred during registration. Please try again.');
    }
}

fetchTournaments();