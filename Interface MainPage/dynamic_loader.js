
// ==========================================
// DYNAMIC CONTENT LOADING FROM DATABASE
// ==========================================

async function loadDatabaseContent() {
    try {
        console.log('Fetching content from database...');
        const response = await fetch('../php_auth/public/api_movies.php');
        if (!response.ok) throw new Error('Network response was not ok');

        const dbMovies = await response.json();
        console.log('Loaded movies:', dbMovies);

        // Convert DB format to App format
        const newContent = dbMovies.map(movie => ({
            title: movie.title,
            imageUrl: movie.poster_url.startsWith('./') ? movie.poster_url : movie.poster_url, // Adjusted paths if needed
            category: movie.category,
            videoId: movie.video_id,
            type: movie.type,
            year: parseInt(movie.release_year),
            rating: movie.rating || "N/A",
            quality: movie.quality || "HD",
            imdb: movie.imdb || "N/A",
            duration: movie.duration,
            description: movie.description,
            // Add other fields if useful
            tagline: movie.tagline,
            cast: movie.cast,
            genres: movie.genres,
            moods: movie.moods,
            warnings: movie.warnings,
            seasons: movie.seasons
        }));

        // Merge into allContent (avoid duplicates based on ID or Title?)
        // Simple merge:
        // We might want to clear allContent if we want pure DB state, 
        // but for now let's append NEW ones or replace if ID matches.
        // Since hardcoded ones don't have numeric IDs, we just append.

        dbMovies.forEach(dbItem => {
            // Check if already in allContent (by title)
            const exists = allContent.some(c => c.title === dbItem.title);
            if (!exists) {
                const mapped = {
                    title: dbItem.title,
                    // Fix path traversal: ./php_auth from here is wrong.
                    // If stored as /php_auth/... then it is relative to domain root, which is perfect.
                    // If stored as ./php_auth/... then we need to fix it.
                    imageUrl: dbItem.poster_url.startsWith('./') ? '.' + dbItem.poster_url : dbItem.poster_url,
                    category: dbItem.category,
                    videoId: dbItem.video_id,
                    type: dbItem.type,
                    year: dbItem.release_year,
                    rating: dbItem.rating,
                    quality: dbItem.quality,
                    imdb: dbItem.imdb,
                    duration: dbItem.duration,
                    description: dbItem.description,
                    tagline: dbItem.tagline,
                    cast: dbItem.cast,
                    genres: dbItem.genres,
                    moods: dbItem.moods,
                    warnings: dbItem.warnings,
                    seasons: dbItem.seasons
                };
                allContent.push(mapped);

                // Also add to featuredShows if it has a tagline (hero eligible)
                if (dbItem.tagline) {
                    featuredShows.unshift(mapped); // Add to beginning of slider
                }
            }
        });

        // Re-render
        renderDynamicRows();
        initHeroCarousel(); // Re-init slider with new data

    } catch (error) {
        console.error('Failed to load database content:', error);
    }
}

function renderDynamicRows() {
    const container = document.querySelector('.content-rows');
    if (!container) return;

    // Group by Category
    const categories = {};
    allContent.forEach(item => {
        if (!categories[item.category]) {
            categories[item.category] = [];
        }
        categories[item.category].push(item);
    });

    // For each category, ensure a row exists
    Object.keys(categories).forEach(catTitle => {
        // Normalize title for ID
        const rowId = catTitle.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-row';

        let rowContainer = document.getElementById(rowId);

        if (!rowContainer) {
            // Create new Row Section
            const wrapper = document.createElement('div');
            wrapper.className = 'category-wrapper';
            wrapper.innerHTML = `
                <section class="category-row">
                    <h2>${catTitle}</h2>
                    <div class="poster-container" id="${rowId}"></div>
                </section>
                <button class="scroll-btn left" onclick="scrollContent('${rowId}', -1)"> &lt; </button>
                <button class="scroll-btn right" onclick="scrollContent('${rowId}', 1)"> &gt; </button>
            `;
            container.appendChild(wrapper);

            // Re-init intersection observer for this new element
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('revealed'));
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
            observer.observe(wrapper);

            rowContainer = wrapper.querySelector('.poster-container');
        }

        // Render Items
        const items = categories[catTitle];
        rowContainer.innerHTML = items.map(createContentCard).join('');
    });
}

// Call on load
document.addEventListener('DOMContentLoaded', loadDatabaseContent);
