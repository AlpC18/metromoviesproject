

const newThisWeek = [
    { title: "Frankenstein", image: "../Interface MainPage/images/poster-frankenstein.png", year: 2024, isNew: true },
    { title: "Wednesday", image: "../Interface MainPage/images/posters-wednesday.png", year: 2024, isNew: true },
    { title: "Bad Boys", image: "../Interface MainPage/images/posters-bad-boys.png", year: 2024, isNew: true }
];

const trending = [
    { title: "Stranger Things", image: "../Interface MainPage/images/poster-stranger-things.png", year: 2016 },
    { title: "Peaky Blinders", image: "../Interface MainPage/images/poster-peaky-blinders.png", year: 2013 },
    { title: "Breaking Bad", image: "../Interface MainPage/images/poster-breaking-bad.png", year: 2008 },
    { title: "Money Heist", image: "../Interface MainPage/images/poster-money-heist.png", year: 2017 }
];

const comingSoon = [
    { title: "Stranger Things Season 5", image: "../Interface MainPage/images/poster-stranger-things.png", year: 2025 },
    { title: "Peaky Blinders Movie", image: "../Interface MainPage/images/poster-peaky-blinders.png", year: 2025 }
];

function renderGrid(container, items) {
    container.innerHTML = items.map(item => `
        <div class="grid-item" data-title="${item.title}">
            ${item.isNew ? '<span class="new-badge">New</span>' : ''}
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="grid-item-title">${item.title}</div>
            <div class="grid-item-meta">${item.year}</div>
        </div>
    `).join('');
}

renderGrid(document.getElementById('new-this-week'), newThisWeek);
renderGrid(document.getElementById('trending-now'), trending);
renderGrid(document.getElementById('coming-soon'), comingSoon);


document.querySelectorAll('.content-grid').forEach(grid => {
    grid.addEventListener('click', (e) => {
        const item = e.target.closest('.grid-item');
        if (item) {
            const title = item.dataset.title;
            window.location.href = `../Interface MainPage/index.html?show=${encodeURIComponent(title)}`;
        }
    });
});
