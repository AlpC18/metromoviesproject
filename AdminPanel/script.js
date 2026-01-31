const moviesTableBody = document.getElementById('moviesTableBody');
const addMovieForm = document.getElementById('addMovieForm');
const formTitle = document.getElementById('formTitle');

const movieIdInput = document.getElementById('movieId');
const titleInput = document.getElementById('title');
const descInput = document.getElementById('description');
const posterInput = document.getElementById('poster_url');
const categoryInput = document.getElementById('category');
const yearInput = document.getElementById('release_year');
const durationInput = document.getElementById('duration');

document.addEventListener('DOMContentLoaded', loadMovies);

async function loadMovies() {
    try {
        const response = await fetch('../php_auth/public/api_movies.php');
        const data = await response.json();

        if (data.success) {
            renderMovies(data.movies);
        }
    } catch (error) {
        console.error('Error loading movies:', error);
    }
}

function renderMovies(movies) {
    moviesTableBody.innerHTML = '';

    movies.forEach(movie => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${movie.poster_url}" alt="poster" onerror="this.src='default_poster.jpg'"></td>
            <td>${movie.title}</td>
            <td>${movie.category}</td>
            <td>${movie.release_year}</td>
            <td>
                <button class="edit-btn" onclick='editMovie(${JSON.stringify(movie)})'>Edit</button>
                <button class="delete-btn" onclick="deleteMovie(${movie.id})">Delete</button>
            </td>
        `;
        moviesTableBody.appendChild(tr);
    });
}

function toggleForm() {
    addMovieForm.style.display = addMovieForm.style.display === 'none' || addMovieForm.style.display === '' ? 'block' : 'none';
    clearForm();
}

function clearForm() {
    movieIdInput.value = '';
    titleInput.value = '';
    descInput.value = '';
    posterInput.value = '';
    categoryInput.value = '';
    yearInput.value = '';
    durationInput.value = '';
    formTitle.textContent = 'Add Movie';
}

function editMovie(movie) {
    addMovieForm.style.display = 'block';
    formTitle.textContent = 'Edit Movie';

    movieIdInput.value = movie.id;
    titleInput.value = movie.title;
    descInput.value = movie.description;
    posterInput.value = movie.poster_url;
    categoryInput.value = movie.category;
    yearInput.value = movie.release_year;
    durationInput.value = movie.duration;

    window.scrollTo(0, 0);
}

async function saveMovie() {
    const id = movieIdInput.value;
    const title = titleInput.value;

    if (!title) return alert("Title is required");

    const movieData = {
        title,
        description: descInput.value,
        poster_url: posterInput.value,
        category: categoryInput.value,
        release_year: yearInput.value,
        duration: durationInput.value
    };

    if (id) movieData.id = id;

    const method = id ? 'PUT' : 'POST';

    try {
        const response = await fetch('../php_auth/public/api_movies.php', {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(movieData)
        });

        const result = await response.json();

        if (result.success) {
            alert(result.message);
            toggleForm();
            loadMovies();
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error('Error saving movie:', error);
    }
}

async function deleteMovie(id) {
    if (!confirm("Are you sure?")) return;

    try {
        const response = await fetch('../php_auth/public/api_movies.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });

        const result = await response.json();
        if (result.success) {
            loadMovies();
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error('Error deleting movie:', error);
    }
}

// Episode Management
function addEpisodeField(data = null) {
    const container = document.getElementById('episodes-list');
    const div = document.createElement('div');
    div.className = 'episode-row';
    div.style.cssText = 'display: grid; grid-template-columns: 0.5fr 0.5fr 2fr 2fr auto; gap: 8px; align-items: center; background: rgba(255,255,255,0.03); padding: 10px; border-radius: 4px;';

    const sVal = data ? data.season : '';
    const eVal = data ? data.episode : '';
    const tVal = data ? data.title : '';
    const vVal = data ? data.video_id : ''; // or link

    div.innerHTML = `
        <input type="number" class="form-input ep-season" placeholder="S#" value="${sVal}" style="padding: 5px;">
        <input type="number" class="form-input ep-num" placeholder="E#" value="${eVal}" style="padding: 5px;">
        <input type="text" class="form-input ep-title" placeholder="Title" value="${tVal}" style="padding: 5px;">
        <input type="text" class="form-input ep-link" placeholder="YouTube ID/Link" value="${vVal}" style="padding: 5px;">
        <button type="button" class="btn-delete" style="width: 24px; height: 24px; border-radius: 4px;" onclick="this.parentElement.remove()">×</button>
    `;
    container.appendChild(div);
}

// Update Clear Form
const _originalClear = clearForm;
clearForm = function () {
    _originalClear();
    document.getElementById('episodes-list').innerHTML = '';
    // Reset Preview Video Inputs
    const pvInput = document.getElementById('preview_video_input');
    const pvId = document.getElementById('preview_video_id');
    if (pvInput) pvInput.value = '';
    if (pvId) pvId.value = '';
}

// Update Edit Movie
const _originalEdit = editMovie;
editMovie = function (movie) {
    _originalEdit(movie);
    const list = document.getElementById('episodes-list');
    list.innerHTML = '';

    // Check if movie has episodes (array)
    // Assuming backend returns 'episodes' array or we parse it
    if (movie.episodes && Array.isArray(movie.episodes)) {
        movie.episodes.forEach(ep => addEpisodeField(ep));
    }

    // Handle Preview Video
    const pvInput = document.getElementById('preview_video_input');
    const pvIdInput = document.getElementById('preview_video_id');

    // We try 'preview_video_id' first
    const pVid = movie.preview_video_id || '';
    if (pvIdInput) pvIdInput.value = pVid;
    if (pvInput) pvInput.value = pVid ? `https://www.youtube.com/watch?v=${pVid}` : '';
}

// Update Save Movie
const _originalSave = saveMovie;
saveMovie = async function () {
    const id = movieIdInput.value;
    const title = titleInput.value;

    if (!title) return alert("Title is required");

    // Collect Episodes
    const episodeRows = document.querySelectorAll('.episode-row');
    const episodes = [];
    episodeRows.forEach(row => {
        episodes.push({
            season: row.querySelector('.ep-season').value,
            episode: row.querySelector('.ep-num').value,
            title: row.querySelector('.ep-title').value,
            video_id: row.querySelector('.ep-link').value
        });
    });

    const movieData = {
        title,
        description: descInput.value,
        poster_url: posterInput.value,
        category: categoryInput.value,
        release_year: yearInput.value,
        duration: durationInput.value,
        type: document.getElementById('type').value,
        rating: document.getElementById('rating').value,
        quality: document.getElementById('quality').value,
        imdb: document.getElementById('imdb').value,
        cast: document.getElementById('cast').value,
        genres: document.getElementById('genres').value,
        moods: document.getElementById('moods').value,
        warnings: document.getElementById('warnings').value,
        seasons: document.getElementById('seasons').value,
        episodes: episodes
    };

    // YouTube Link main logic
    // Simple id extraction helper
    const extractYtId = (url) => {
        if (!url) return '';
        if (url.includes('v=')) return url.split('v=')[1].split('&')[0];
        if (url.includes('youtu.be/')) return url.split('youtu.be/')[1];
        return url; // assume id
    };

    const vUrl = document.getElementById('video_url_input').value;
    let vId = document.getElementById('video_id').value;
    if (!vId || !vUrl.includes(vId)) {
        vId = extractYtId(vUrl);
    }
    movieData.video_id = vId;

    // Preview Video Logic
    const pvUrl = document.getElementById('preview_video_input') ? document.getElementById('preview_video_input').value : '';
    movieData.preview_video_id = extractYtId(pvUrl);

    if (id) movieData.id = id;
    const method = id ? 'PUT' : 'POST';

    try {
        const response = await fetch('../php_auth/public/api_movies.php', {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(movieData)
        });

        const result = await response.json();

        if (result.success) {
            alert(result.message);
            toggleForm();
            loadMovies();
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error('Error saving movie:', error);
    }
}
