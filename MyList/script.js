


let myListContent = JSON.parse(localStorage.getItem('myList')) || [];

if (myListContent.length === 0) {

    const sampleData = [
        {
            title: "Stranger Things",
            imageUrl: "../Interface MainPage/images/poster-stranger-things.png",
            year: 2016,
            rating: "TV-14",
            type: "TV Series",
            seasons: "4 Seasons",
            description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
            cast: "Millie Bobby Brown, Finn Wolfhard, David Harbour",
            genres: "Sci-Fi, Horror, Drama",
            moods: "Suspenseful, Exciting, Dark",
            liked: false
        },
        {
            title: "Breaking Bad",
            imageUrl: "../Interface MainPage/images/poster-breaking-bad.png",
            year: 2008,
            rating: "TV-MA",
            type: "TV Series",
            seasons: "5 Seasons",
            description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.",
            cast: "Bryan Cranston, Aaron Paul, Anna Gunn",
            genres: "Crime, Drama, Thriller",
            moods: "Dark, Intense, Suspenseful",
            liked: false
        },
        {
            title: "Peaky Blinders",
            imageUrl: "../Interface MainPage/images/poster-peaky-blinders.png",
            year: 2013,
            rating: "TV-MA",
            type: "TV Series",
            seasons: "6 Seasons",
            description: "A gangster family epic set in 1900s England, centering on a gang who sew razor blades in the peaks of their caps.",
            cast: "Cillian Murphy, Paul Anderson, Helen McCrory",
            genres: "Crime, Drama",
            moods: "Dark, Gritty, Intense",
            liked: false
        }
    ];
    myListContent = sampleData;
    localStorage.setItem('myList', JSON.stringify(myListContent));
}


const myListGrid = document.getElementById('mylist-grid');
const myListEmpty = document.getElementById('mylist-empty');
const detailModal = document.getElementById('detail-modal');


function saveMyList() {
    localStorage.setItem('myList', JSON.stringify(myListContent));
}


function renderMyList() {



    if (myListContent.length === 0) {
        myListGrid.style.display = 'none';
        myListEmpty.classList.add('show');
        return;
    }

    myListEmpty.classList.remove('show');
    myListGrid.style.display = 'grid';

    myListGrid.innerHTML = myListContent.map((item, index) => {

        const correctedImageUrl = item.imageUrl.startsWith('./')
            ? item.imageUrl.replace('./', '../Interface MainPage/')
            : item.imageUrl;

        return `
        <div class="mylist-item" data-index="${index}">
            <img class="mylist-item-poster" src="${correctedImageUrl}" alt="${item.title}">
            <div class="mylist-item-overlay">
                <div class="mylist-item-title">${item.title}</div>
                <div class="mylist-item-meta">${item.year} • ${item.rating}</div>
                <div class="mylist-item-actions">
                    <button class="mylist-action-btn play" title="Play">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                    </button>
                    <button class="mylist-action-btn like ${item.liked ? 'active' : ''}" title="Like" data-index="${index}">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="${item.liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                        </svg>
                    </button>
                    <button class="mylist-action-btn more-info" title="More Info" data-index="${index}">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"/>
                        </svg>
                    </button>
                    <button class="mylist-action-btn remove" title="Remove from My List" data-index="${index}">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `}).join('');


    addEventHandlers();
}

function addEventHandlers() {

    document.querySelectorAll('.mylist-action-btn.remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            removeFromMyList(index);
        });
    });


    document.querySelectorAll('.mylist-action-btn.like').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            toggleLike(index);
        });
    });


    document.querySelectorAll('.mylist-action-btn.more-info').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            showDetailModal(myListContent[index]);
        });
    });


    document.querySelectorAll('.mylist-action-btn.play').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();







            const itemElement = btn.closest('.mylist-item');
            if (itemElement) {
                const index = parseInt(itemElement.dataset.index);
                const item = myListContent[index];
                if (item && item.videoId) {
                    showVideoModal(item.videoId);
                } else {
                    console.warn("No videoId found for item", item);



                }
            }
        });
    });
}


function toggleLike(index) {
    myListContent[index].liked = !myListContent[index].liked;
    saveMyList();
    renderMyList();
}


function removeFromMyList(index) {
    myListContent.splice(index, 1);
    saveMyList();
    renderMyList();
}


function showDetailModal(contentData) {

    document.getElementById('detail-header-bg').style.backgroundImage = `url('${contentData.imageUrl}')`;
    document.getElementById('detail-title').textContent = contentData.title;
    document.getElementById('detail-match').textContent = `${Math.floor(Math.random() * 15) + 85}% Match`;
    document.getElementById('detail-year').textContent = contentData.year;
    document.getElementById('detail-rating').textContent = contentData.rating;
    document.getElementById('detail-seasons').textContent = contentData.seasons || contentData.duration || '';
    document.getElementById('detail-description').textContent = contentData.description;
    document.getElementById('detail-cast').textContent = contentData.cast;
    document.getElementById('detail-genres').textContent = contentData.genres;
    document.getElementById('detail-moods').textContent = contentData.moods;


    document.getElementById('detail-episodes-section').style.display = 'none';


    detailModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}


function hideDetailModal() {
    detailModal.classList.remove('active');
    document.body.style.overflow = '';
}


function showVideoModal(videoId) {
    const videoModal = document.getElementById('video-modal');
    const videoFrame = document.getElementById('video-frame');

    if (videoModal && videoFrame && videoId) {
        const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0&modestbranding=1`;
        videoFrame.src = videoUrl;
        videoModal.classList.add('active');
    }
}


function hideVideoModal() {
    const videoModal = document.getElementById('video-modal');
    const videoFrame = document.getElementById('video-frame');
    if (videoModal && videoFrame) {
        videoModal.classList.remove('active');
        setTimeout(() => {
            videoFrame.src = "";
        }, 300);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    renderMyList();


    window.addEventListener('scroll', () => {
        const header = document.querySelector('.site-header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    const closeBtn = document.querySelector('.detail-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', hideDetailModal);
    }


    if (detailModal) {
        detailModal.addEventListener('click', (e) => {
            if (e.target === detailModal) {
                hideDetailModal();
            }
        });
    }


    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && detailModal.classList.contains('active')) {
            hideDetailModal();
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const profileWrapper = document.querySelector('.profile-dropdown-wrapper');
    const profileTrigger = document.querySelector('.profile-trigger');

    if (profileTrigger && profileWrapper) {
        profileTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            profileWrapper.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!profileWrapper.contains(e.target)) {
                profileWrapper.classList.remove('open');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                profileWrapper.classList.remove('open');
            }
        });
    }
});
