const socket = io();
const chatBox = document.getElementById('chatbox');
const messageInput = document.getElementById('message');
const chatContent = document.getElementById('chat-content');

function watchMovie() {
    alert('This content is not available in your region.');
}

let username = '';

document.getElementById('search').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        if (this.value.trim().toLowerCase() === 'unlock') {
            username = 'Aaki';
        } else if (this.value.trim().toLowerCase() === 'iljiya') {
            username = 'Akira';
        } else {
            return;
        }

        const chatBox = document.getElementById('chatbox');
        chatBox.classList.add('show');
        chatBox.classList.remove('hidden');
        socket.emit('user login', username);
    }
});

document.getElementById('search-btn').addEventListener('click', function() {
    let searchValue = document.getElementById('search').value.trim().toLowerCase();

    if (searchValue === 'unlock') {
        username = 'Aaki';
    } else if (searchValue === 'iljiya') {
        username = 'Akira';
    } else {
        return;
    }

    const chatBox = document.getElementById('chatbox');
    chatBox.classList.add('show');
    chatBox.classList.remove('hidden');
    socket.emit('user login', username);
});



document.getElementById('settings-btn').addEventListener('click', function() {
    window.location.href = "settings.html"; // Redirect to settings page
});


function sendMessage() {
    const message = messageInput.value.trim();
    if (message !== '') {
        socket.emit('chat message', { username, message });
        messageInput.value = '';
    }
}


socket.on('chat message', (data) => {
    const div = document.createElement('div');
    div.classList.add('chat-message');

    div.innerHTML = `<span class="red">${data.username}</span>${data.message}`;
    
    // Append to chat container
    chatContent.appendChild(div);
    chatContent.scrollTop = chatContent.scrollHeight; // Auto-scroll
});


async function loadMovies() {
    try {
        const response = await fetch('/api/movies');
        const movies = await response.json();
        const moviesContainer = document.getElementById('movies');
        moviesContainer.innerHTML = ''; // Clear existing movies

        movies.forEach(movie => {
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('movie');
            movieDiv.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
                <p>${movie.title}</p>
            `;
            moviesContainer.appendChild(movieDiv);
        });
    } catch (error) {
        console.error('Error loading movies:', error);
    }
}

loadMovies(); // Call function on page load


