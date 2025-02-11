const socket = io();
const chatBox = document.getElementById('chatbox');
const messageInput = document.getElementById('message');
const chatContent = document.getElementById('chat-content');

function watchMovie() {
    alert('This content is not available in your region.');
}

document.getElementById('search').addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && this.value === 'unlock') {
        chatBox.style.display = 'block';
        chatBox.classList.remove('hidden');
    }
});

function sendMessage() {
    const message = messageInput.value;
    if (message.trim() !== '') {
        socket.emit('chat message', message);
        messageInput.value = '';
    }
}

socket.on('chat message', (msg) => {
    const div = document.createElement('div');
    div.textContent = msg;
    div.style.marginBottom = '10px';
    div.style.padding = '10px';
    div.style.background = 'rgba(255, 255, 255, 0.1)';
    div.style.borderRadius = '10px';
    chatContent.appendChild(div);
    chatContent.scrollTop = chatContent.scrollHeight; // Auto-scroll to the latest message
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
