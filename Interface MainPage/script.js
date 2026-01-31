

const featuredShows = [
    {
        title: "Peaky Blinders",
        tagline: "By order of the Peaky Blinders",
        imageUrl: "./images/hero-peaky-1.png",
        type: "TV",
        age: "18+",
        quality: "HD",
        imdb: "8.8",
        videoId: "ZDc_DErt9Rs"
    },
    {
        title: "Friends",
        tagline: "I'll be there for you",
        imageUrl: "./images/poster-friends.jpg",
        type: "TV",
        age: "14+",
        quality: "HD",
        imdb: "8.9",
        videoId: "s2TyVQGoCYo"
    },
    {
        title: "Stranger Things",
        tagline: "The world is turning upside down",
        imageUrl: "./images/poster-stranger-things.png",
        type: "TV",
        age: "16+",
        quality: "4K",
        imdb: "8.7",
        videoId: "TE27v5YigEM"
    },
    {
        title: "Breaking Bad",
        tagline: "Chemistry is the study of change",
        imageUrl: "./images/poster-breaking-bad.png",
        type: "TV",
        age: "18+",
        quality: "4K",
        imdb: "9.5",
        videoId: "T3x1tzOuXbQ",
        startSeconds: 70
    },
    {
        title: "Money Heist",
        tagline: "The biggest heist in history",
        imageUrl: "./images/poster-money-heist.png",
        type: "TV",
        age: "18+",
        quality: "4K",
        imdb: "8.2",
        videoId: "e0dea7qrLdk"
    },
    {
        title: "Champions League",
        tagline: "The home of elite football",
        imageUrl: "./images/sport-2.png",
        type: "SPORT",
        age: "ALL",
        quality: "Live",
        imdb: "-",
        videoId: "_4jqA-mz_Ig"
    }
];


let currentSlideIndex = 0;
let heroInterval;


function initHeroCarousel() {
    const slidesContainer = document.getElementById('hero-slides');
    const indicatorsContainer = document.getElementById('hero-indicators');

    if (!slidesContainer || !indicatorsContainer) return;


    slidesContainer.innerHTML = featuredShows.map((show, index) => {
        // Force Peaky Blinders ID if title matches (legacy logic, but good to keep)
        const PB_ID = 'ZDc_DErt9Rs';
        let targetVideoId = show.videoId;
        let startSeconds = show.startSeconds || 0;
        let hasVideo = false;
        let videoBg = '';

        if (show.title === 'Peaky Blinders') {
            targetVideoId = PB_ID;
            // Peaky Blinders might not have startSeconds in legacy object, default 0
        }

        // If show has videoId, add video container
        if (targetVideoId && targetVideoId !== 'dummy') {
            hasVideo = true;
            // Append &start=70 if startSeconds exists
            videoBg = `
                <div class="hero-video-bg">
                    <iframe 
                        src="https://www.youtube.com/embed/${targetVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${targetVideoId}&showinfo=0&modestbranding=1&start=${startSeconds}&enablejsapi=1" 
                        allow="autoplay; encrypted-media" 
                        frameborder="0"
                        style="pointer-events: none; width: 100%; height: 100%; object-fit: cover;">
                    </iframe>
                </div>`;
        }

        return `
        <div class="hero-slide ${index === 0 ? 'active' : ''} ${hasVideo ? 'has-video' : ''}" data-index="${index}">
            ${videoBg}
            <div class="hero-media" style="background-image: url('${show.imageUrl}');"></div>
            <div class="container hero-content">
                <h1 class="hero-logo">${show.title}</h1>
                <p class="hero-tagline">${show.tagline}</p>
                <div class="hero-actions">
                    <button class="btn btn-primary detail-play-btn">
                        <span class="btn-icon">▶</span> Play
                    </button>
                    <button class="detail-icon-btn btn-secondary" title="More Info">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>
                </div>
                <div class="hero-meta">
                    <span class="chip">${show.type}</span>
                    <span class="chip" style="background: rgba(100,100,100,0.6);">${show.age}</span>
                    <span class="chip">${show.quality}</span>
                    <span class="chip">IMDB: ${show.imdb}</span>
                </div>
            </div>
        </div>
    `}).join('');


    indicatorsContainer.innerHTML = featuredShows.map((_, index) => `
        <button class="hero-indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></button>
    `).join('');


    document.querySelectorAll('.hero-indicator').forEach(indicator => {
        indicator.addEventListener('click', () => {
            goToSlide(parseInt(indicator.dataset.index));
            resetAutoPlay();
        });
    });


    slidesContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn, .detail-icon-btn');
        if (!btn) return;

        const slide = btn.closest('.hero-slide');
        if (!slide) return;

        const index = parseInt(slide.dataset.index);
        const show = featuredShows[index];
        if (!show) return;


        if (btn.classList.contains('btn-primary')) {
            const fullShowData = (typeof allContent !== 'undefined') ? allContent.find(item => item.title.trim() === show.title.trim()) : null;

            if (fullShowData && fullShowData.videoId && fullShowData.videoId !== 'dummy') {
                const modal = document.getElementById('video-modal');
                const videoFrame = document.getElementById('video-frame');
                if (modal && videoFrame) {
                    const videoUrl = `https://www.youtube.com/embed/${fullShowData.videoId}?autoplay=1`;
                    modal.classList.add('active');
                    videoFrame.src = videoUrl;
                    document.body.style.overflow = 'hidden';
                }
            } else {
                alert(`▶ Playing: ${show.title}`);
            }
        }


        else if (btn.classList.contains('btn-secondary')) {
            const fullShowData = (typeof allContent !== 'undefined') ? allContent.find(item => item.title.trim() === show.title.trim()) : null;

            if (typeof showDetailModal === 'function') {
                if (fullShowData) {
                    showDetailModal(fullShowData);
                } else {

                    showDetailModal({
                        title: show.title,
                        tagline: show.tagline,
                        imageUrl: show.imageUrl,
                        year: "2024",
                        rating: show.age || "ALL",
                        quality: show.quality || "HD",
                        imdb: show.imdb || "N/A",
                        description: show.tagline || `Watch ${show.title} on Metro Movies.`,
                        type: show.type === "SPORT" ? "Sports" : "TV Series"
                    });
                }
            } else {
                console.error("showDetailModal function not found. More Info component might still be loading.");
            }
        }
    });


    // Add hover listeners for video pausing
    const slides = document.querySelectorAll('.hero-slide');
    slides.forEach(slide => {
        slide.addEventListener('mouseenter', () => {
            if (slide.classList.contains('has-video')) {
                const iframe = slide.querySelector('iframe');
                if (iframe) {
                    // Send pause command to YouTube
                    iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                    // Hide video container so static image shows (via CSS or logic below)
                    const videoBg = slide.querySelector('.hero-video-bg');
                    const heroMedia = slide.querySelector('.hero-media');
                    if (videoBg) videoBg.style.opacity = '0';
                    if (heroMedia) heroMedia.style.opacity = '1';
                }
            }
        });

        slide.addEventListener('mouseleave', () => {
            if (slide.classList.contains('has-video')) {
                const iframe = slide.querySelector('iframe');
                if (iframe) {
                    // Send play command to YouTube
                    iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                    // Show video container
                    const videoBg = slide.querySelector('.hero-video-bg');
                    const heroMedia = slide.querySelector('.hero-media');
                    if (videoBg) videoBg.style.opacity = '1';
                    if (heroMedia) heroMedia.style.opacity = '0';
                }
            }
        });
    });

    // Audio Toggle Logic
    const audioToggle = document.getElementById('audio-toggle');
    const audioIconMuted = document.getElementById('audio-icon-muted');
    const audioIconUnmuted = document.getElementById('audio-icon-unmuted');

    // Global mute state, start true (muted)
    window.heroIsMuted = true;

    if (audioToggle) {
        audioToggle.addEventListener('click', () => {
            // Toggle global state
            window.heroIsMuted = !window.heroIsMuted;

            // Update Icon
            if (window.heroIsMuted) {
                audioIconMuted.style.display = 'block';
                audioIconUnmuted.style.display = 'none';
            } else {
                audioIconMuted.style.display = 'none';
                audioIconUnmuted.style.display = 'block';
            }

            // Apply to CURRENT active slide
            const activeSlide = document.querySelector('.hero-slide.active');
            if (activeSlide) {
                const iframe = activeSlide.querySelector('iframe');
                if (iframe) {
                    const command = window.heroIsMuted ? 'mute' : 'unMute';
                    iframe.contentWindow.postMessage(`{"event":"command","func":"${command}","args":""}`, '*');
                }
            }
        });
    }

    startAutoPlay();
}

function initProfileSwitcher() {
    const profileOptions = document.querySelectorAll('.profile-option');
    const mainAvatar = document.querySelector('.profile-trigger .avatar-image');

    if (!profileOptions.length || !mainAvatar) return;

    profileOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const newSrc = option.querySelector('img').src;

            mainAvatar.src = newSrc;

            const dropdown = document.getElementById('profile-dropdown');
            if (dropdown) dropdown.classList.remove('active');
        });
    });
}
document.addEventListener('DOMContentLoaded', initProfileSwitcher);

function goToSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.hero-indicator');

    // Manage all slides
    slides.forEach((slide, idx) => {
        const iframe = slide.querySelector('iframe');

        if (idx === index) {
            // New Active Slide
            slide.classList.add('active');

            if (iframe) {
                // Determine mute state
                const shouldMute = (typeof window.heroIsMuted !== 'undefined') ? window.heroIsMuted : true;
                const muteCommand = shouldMute ? 'mute' : 'unMute';

                // Play and apply mute state
                // Small timeout allows transition to process?
                setTimeout(() => {
                    iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                    iframe.contentWindow.postMessage(`{"event":"command","func":"${muteCommand}","args":""}`, '*');
                }, 100);
            }
        } else {
            // Inactive Slide
            slide.classList.remove('active');

            // Stop/Mute previous
            if (iframe) {
                iframe.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
                // Optional: pauseVideo to save resources, but pure mute is requested "sesi dursun". 
                // If we pause, it restarts from where applied? 
                // User says "sesi dursun" (Audio stop). 
                // Let's use mute for audio safety, and pauseVideo for resource safety.
                iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            }
        }
    });

    indicators.forEach(ind => ind.classList.remove('active'));
    if (indicators[index]) indicators[index].classList.add('active');

    currentSlideIndex = index;
    // Removed duplicate code below this block
}

function nextSlide() {
    const nextIndex = (currentSlideIndex + 1) % featuredShows.length;
    goToSlide(nextIndex);
}

function startAutoPlay() {
    // 55 seconds interval as requested
    heroInterval = setInterval(nextSlide, 55000);
}

function resetAutoPlay() {
    clearInterval(heroInterval);
    startAutoPlay();
}


document.addEventListener('DOMContentLoaded', initHeroCarousel);

const allContent = [

    {
        title: "Stranger Things",
        imageUrl: "./images/poster-stranger-things.png",
        category: "We Think You'll Love These",
        videoId: "b9EkMc79ZSU",
        type: "TV Series",
        year: 2016,
        rating: "16+",
        quality: "4K",
        imdb: "8.7",
        seasons: 5,
        duration: "50m",
        description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
        cast: "Millie Bobby Brown, Finn Wolfhard, Winona Ryder, David Harbour",
        genres: "Sci-Fi, Horror, Drama",
        moods: "Suspenseful, Exciting, Dark",
        warnings: "violence, frightening scenes",
        episodes: [
            { num: 1, title: "Chapter One: The Vanishing of Will Byers", desc: "On his way home from a friend's house, young Will sees something terrifying. Nearby, a sinister secret lurks in the depths of a government lab.", duration: "47m" },
            { num: 2, title: "Chapter Two: The Weirdo on Maple Street", desc: "Lucas, Mike and Dustin try to talk to the girl they found in the woods. Hopper questions an anxious Joyce about an unsettling phone call.", duration: "55m" },
            { num: 3, title: "Chapter Three: Holly, Jolly", desc: "An increasingly concerned Nancy looks for Barb and finds out what Jonathan's been up to. Joyce is convinced Will is trying to talk to her.", duration: "51m" },
            { num: 4, title: "Chapter Four: The Body", desc: "Refusing to believe Will is dead, Joyce tries to connect with her son. The boys give Eleven a makeover. Nancy and Jonathan form an unlikely alliance.", duration: "51m" }
        ]
    },
    {
        title: "How I Met Your Mother",
        imageUrl: "./images/poster-how-i-met-your-mother.png",
        category: "We Think You'll Love These",
        videoId: "3hvGBibGccg",
        type: "TV Series",
        year: 2005,
        rating: "TV-PG",
        seasons: 9,
        duration: "22m",
        description: "A father recounts to his children the journey he and his four best friends took leading up to him meeting their mother.",
        cast: "Josh Radnor, Jason Segel, Neil Patrick Harris, Cobie Smulders, Alyson Hannigan",
        genres: "Comedy, Romance",
        moods: "Witty, Heartfelt, Feel-good",
        warnings: "adult humor",
        episodes: [
            { num: 1, title: "Pilot", desc: "In 2030, Ted tells his kids how he met their mother, starting with when he and Marshall were living together.", duration: "22m" },
            { num: 2, title: "Purple Giraffe", desc: "Ted throws a party, hoping Robin will show up. When she doesn't come, he throws another party...and another.", duration: "22m" },
            { num: 3, title: "Sweet Taste of Liberty", desc: "Barney convinces Ted to go to the airport and catch a random flight. They end up in Philadelphia but the adventure doesn't end there.", duration: "22m" }
        ]
    },
    {
        title: "The Rookie",
        imageUrl: "./images/posters-rookie.png",
        category: "We Think You'll Love These",
        videoId: "iBe-zZ3l1Qk",
        type: "TV Series",
        year: 2018,
        rating: "TV-14",
        seasons: 6,
        duration: "43m",
        description: "John Nolan, the oldest rookie in the LAPD, must navigate the challenges of starting a new career while dealing with criminals who don't believe an old rookie can cut it.",
        cast: "Nathan Fillion, Alyssa Diaz, Richard T. Jones, Melissa O'Neil",
        genres: "Crime, Drama, Action",
        moods: "Exciting, Suspenseful",
        warnings: "violence, language"
    },
    {
        title: "Frankenstein",
        imageUrl: "./images/poster-frankenstein.png",
        category: "We Think You'll Love These",
        videoId: "b_YHe444S10",
        type: "Movie",
        year: 2025,
        rating: "R",
        duration: "1h 57m",
        description: "A brilliant but troubled scientist creates a grotesque creature in an unorthodox experiment. The 2025 reimagining explores themes of creation, isolation and what it means to be human.",
        cast: "Jacob Elordi, Oscar Isaac, Mia Goth, Christoph Waltz",
        genres: "Horror, Drama, Sci-Fi",
        moods: "Dark, Atmospheric, Chilling",
        warnings: "violence, disturbing imagery"
    },
    {
        title: "Money Heist",
        imageUrl: "./images/poster-money-heist.png",
        category: "We Think You'll Love These",
        videoId: "46cXFUzR9XM",
        type: "TV Series",
        year: 2017,
        rating: "TV-MA",
        seasons: 5,
        duration: "45m",
        description: "A criminal mastermind who goes by 'The Professor' has a plan to pull off the biggest heist in recorded history — to print billions of euros in the Royal Mint of Spain.",
        cast: "Úrsula Corberó, Álvaro Morte, Itziar Ituño, Pedro Alonso, Alba Flores",
        genres: "Crime, Thriller, Drama",
        moods: "Suspenseful, Dark, Exciting",
        warnings: "violence, language, sexual content",
        episodes: [
            { num: 1, title: "Efectuar lo acordado", desc: "A mysterious man recruits eight thieves to carry out an ambitious heist at the Royal Mint of Spain.", duration: "50m" },
            { num: 2, title: "Imprudencias letales", desc: "With their preparation complete, the robbers enter the Royal Mint and take hostages. The Professor oversees from an outside location.", duration: "43m" },
            { num: 3, title: "Errar al disparar", desc: "The police surround the Royal Mint. Inside, tensions rise as the thieves work to keep their hostages under control.", duration: "48m" }
        ]
    },
    {
        title: "Breaking Bad",
        imageUrl: "./images/poster-breaking-bad.png",
        category: "We Think You'll Love These",
        videoId: "HhesaQXLuRY",
        type: "TV Series",
        year: 2008,
        rating: "18+",
        quality: "4K",
        imdb: "9.5",
        seasons: 5,
        duration: "47m",
        description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
        cast: "Bryan Cranston, Aaron Paul, Anna Gunn, Dean Norris, Bob Odenkirk",
        genres: "Crime, Drama, Thriller",
        moods: "Dark, Suspenseful, Gritty",
        warnings: "drug use, violence, language",
        episodes: [
            { num: 1, title: "Pilot", desc: "Diagnosed with terminal lung cancer, chemistry teacher Walter White teams up with a former student to cook and sell crystal meth.", duration: "58m" },
            { num: 2, title: "Cat's in the Bag...", desc: "Walt and Jesse try to dispose of the two bodies in the RV, but things don't go as planned.", duration: "48m" },
            { num: 3, title: "...And the Bag's in the River", desc: "Walt must decide what to do about a drug distributor who's threatening to kill him and Jesse.", duration: "48m" }
        ]
    },
    {
        title: "Bad Boys",
        imageUrl: "./images/posters-bad-boys.png",
        category: "We Think You'll Love These",
        videoId: "nEf2ML7wkBE",
        type: "Movie",
        year: 1995,
        rating: "R",
        duration: "1h 59m",
        description: "Two hip detectives protect a murder witness while investigating a case of stolen heroin from the evidence lockup of their station.",
        cast: "Will Smith, Martin Lawrence, Téa Leoni, Tchéky Karyo",
        genres: "Action, Comedy, Crime",
        moods: "Exciting, Funny, Action-packed",
        warnings: "violence, language"
    },

    {
        title: "Dexter",
        imageUrl: "./images/poster-dexter.png",
        category: "Your Next Watch",
        videoId: "SCJbYJzqVTE",
        type: "TV Series",
        year: 2006,
        rating: "TV-MA",
        seasons: 8,
        duration: "55m",
        description: "By day, mild-mannered Dexter is a blood-spatter analyst for the Miami police. But at night, he is a serial killer who only targets other murderers.",
        cast: "Michael C. Hall, Jennifer Carpenter, David Zayas, James Remar",
        genres: "Crime, Drama, Mystery",
        moods: "Dark, Suspenseful, Psychological",
        warnings: "violence, gore"
    },
    {
        title: "Lupin",
        imageUrl: "./images/poster-lupin.png",
        category: "Your Next Watch",
        videoId: "ga1m0wjz6GQ",
        type: "TV Series",
        year: 2021,
        rating: "14+",
        quality: "4K",
        imdb: "7.5",
        seasons: 3,
        duration: "45m",
        description: "Inspired by the adventures of Arsène Lupin, gentleman thief Assane Diop sets out to avenge his father for an injustice inflicted by a wealthy family.",
        cast: "Omar Sy, Ludivine Sagnier, Clotilde Hesme, Hervé Pierre",
        genres: "Crime, Drama, Mystery",
        moods: "Stylish, Suspenseful, Clever",
        warnings: "violence, language"
    },
    {
        title: "Friends",
        imageUrl: "./images/poster-friends.jpg",
        category: "Your Next Watch",
        videoId: "hDNNmeeJs1Q",
        type: "TV Series",
        year: 1994,
        rating: "14+",
        quality: "HD",
        imdb: "8.9",
        seasons: 10,
        duration: "22m",
        description: "Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.",
        cast: "Jennifer Aniston, Courteney Cox, Lisa Kudrow, Matt LeBlanc, Matthew Perry, David Schwimmer",
        genres: "Comedy, Romance",
        moods: "Feel-good, Witty, Heartfelt",
        warnings: "adult humor",
        episodes: [
            { num: 1, title: "The Pilot", desc: "Monica's high school friend Rachel moves in after leaving her fiancé at the altar. The gang welcomes her to New York.", duration: "22m" },
            { num: 2, title: "The One with the Sonogram at the End", desc: "Ross finds out his ex-wife is pregnant. Rachel returns her engagement ring to Barry.", duration: "22m" },
            { num: 3, title: "The One with the Thumb", desc: "Monica dates a guy everyone likes but her. Chandler starts smoking again after Phoebe finds a thumb in her soda.", duration: "22m" }
        ]
    },
    {
        title: "Young Sheldon",
        imageUrl: "./images/poster-young-sheldon.png",
        category: "Your Next Watch",
        videoId: "Lhpu3GdlV3w",
        type: "TV Series",
        year: 2017,
        rating: "10+",
        quality: "HD",
        imdb: "7.6",
        seasons: 7,
        duration: "22m",
        description: "Meet a child genius named Sheldon Cooper and his family. This spin-off of The Big Bang Theory follows Sheldon at nine years old in small-town Texas.",
        cast: "Iain Armitage, Zoe Perry, Lance Barber, Montana Jordan, Raegan Revord",
        genres: "Comedy, Drama",
        moods: "Heartfelt, Funny, Nostalgic",
        warnings: ""
    },
    {
        title: "Suits",
        imageUrl: "./images/posters-suits.png",
        category: "Your Next Watch",
        videoId: "LUcolckODbg",
        type: "TV Series",
        year: 2011,
        rating: "14+",
        quality: "HD",
        imdb: "8.4",
        seasons: 9,
        duration: "44m",
        description: "On the run from a drug deal gone bad, Mike Ross, a brilliant young man, becomes a law associate of Harvey Specter despite never actually attending law school.",
        cast: "Gabriel Macht, Patrick J. Adams, Meghan Markle, Rick Hoffman, Sarah Rafferty",
        genres: "Drama, Comedy",
        moods: "Stylish, Witty, Dramatic",
        warnings: "language",
        episodes: [
            { num: 1, title: "Pilot", desc: "Mike Ross impresses Harvey Specter during a drug deal gone wrong and is hired as an associate at Pearson Hardman, despite not having a law degree.", duration: "44m" },
            { num: 2, title: "Errors and Omissions", desc: "Mike's first case goes sideways. Harvey teaches him the importance of research and thinking on his feet.", duration: "43m" }
        ]
    },
    {
        title: "Shameless",
        imageUrl: "./images/poster-shameless.png",
        category: "Your Next Watch",
        videoId: "81J12J43E78",
        type: "TV Series",
        year: 2011,
        rating: "18+",
        quality: "HD",
        imdb: "8.5",
        seasons: 11,
        duration: "46m",
        description: "The Gallagher family are not your typical Chicago family. With an absent mother and a father who prefers to sleep off benders, eldest daughter Fiona leads her family.",
        cast: "Emmy Rossum, William H. Macy, Jeremy Allen White, Ethan Cutkosky",
        genres: "Comedy, Drama",
        moods: "Raw, Dramatic, Darkly Comic",
        warnings: "language, sexual content, drug use"
    },
    { title: "Caramelo", imageUrl: "./images/poster-caramelo.png", category: "Your Next Watch", videoId: "dummy" },

    {
        title: "Snowfall",
        imageUrl: "./images/poster-snowfall.png",
        category: "Crime TV Shows",
        videoId: "NYiSURoYnMI",
        type: "TV Series",
        year: 2017,
        rating: "18+",
        quality: "HD",
        imdb: "8.4",
        seasons: 6,
        duration: "47m",
        description: "Set in 1983 Los Angeles, a drama follows the crack cocaine epidemic and its impact on the culture of the city and the nation.",
        cast: "Damson Idris, Carter Hudson, Emily Rios, Sergio Peris-Mencheta",
        genres: "Crime, Drama, Thriller",
        moods: "Gritty, Intense, Historical",
        warnings: "violence, drug use, language"
    },
    {
        title: "Peaky Blinders",
        imageUrl: "./images/poster-peaky-blinders.png",
        category: "Crime TV Shows",
        videoId: "L02hwp6mGsk",
        type: "TV Series",
        year: 2013,
        rating: "TV-MA",
        seasons: 6,
        duration: "58m",
        description: "A gangster family epic set in 1900s England, centering on a gang who sew razor blades in the peaks of their caps. Follows their rise to power in Birmingham.",
        cast: "Cillian Murphy, Helen McCrory, Paul Anderson, Tom Hardy, Sam Neill",
        genres: "Crime, Drama",
        moods: "Dark, Stylish, Intense",
        warnings: "violence, language, smoking",
        episodes: [
            { num: 1, title: "Episode 1", desc: "Thomas Shelby hatches a plan with the Peaky Blinders to steal a cache of guns. Chief Inspector Campbell arrives from Belfast.", duration: "57m" },
            { num: 2, title: "Episode 2", desc: "Thomas Shelby plans to commit a crime that will make him wealthy but dangerous enemies lurk in the shadows.", duration: "57m" },
            { num: 3, title: "Episode 3", desc: "Thomas Shelby strikes a deal with IRA sympathizers, but Campbell intensifies his search for the stolen guns.", duration: "55m" }
        ]
    },
    {
        title: "The GodFather",
        imageUrl: "./images/poster-the-god-father.jpg",
        category: "Crime TV Shows",
        videoId: "UaVTIH8mujA",
        type: "Movie",
        year: 1972,
        rating: "18+",
        quality: "HD",
        imdb: "9.2",
        duration: "2h 55m",
        description: "The aging patriarch of an organized crime dynasty in post-war New York City transfers control of his clandestine empire to his reluctant youngest son.",
        cast: "Marlon Brando, Al Pacino, James Caan, Robert Duvall, Diane Keaton",
        genres: "Crime, Drama",
        moods: "Epic, Dark, Masterful",
        warnings: "violence, language"
    },
    {
        title: "Scarface",
        imageUrl: "./images/poster-scarface.jpg",
        category: "Crime TV Shows",
        videoId: "Olgn9sXNdl0",
        type: "Movie",
        year: 1983,
        rating: "18+",
        quality: "HD",
        imdb: "8.3",
        duration: "2h 50m",
        description: "In 1980 Miami, a Cuban refugee named Tony Montana becomes a powerful drug lord through ambition, ruthlessness, and violence. His rise to the top is matched only by his dramatic fall.",
        cast: "Al Pacino, Michelle Pfeiffer, Steven Bauer, Mary Elizabeth Mastrantonio",
        genres: "Crime, Drama, Thriller",
        moods: "Intense, Violent, Iconic",
        warnings: "extreme violence, drug use, language"
    },
    {
        title: "Better Call Saul",
        imageUrl: "./images/poster-better-call-saul.jpg",
        category: "Crime TV Shows",
        videoId: "PuZ34IeY_L0",
        type: "TV Series",
        year: 2015,
        rating: "18+",
        quality: "4K",
        imdb: "9.0",
        seasons: 6,
        duration: "47m",
        description: "The trials and tribulations of criminal lawyer Jimmy McGill in the years before he becomes the man known as Saul Goodman, the colorful attorney from Breaking Bad.",
        cast: "Bob Odenkirk, Rhea Seehorn, Jonathan Banks, Michael McKean, Giancarlo Esposito",
        genres: "Crime, Drama",
        moods: "Clever, Dark, Emotional",
        warnings: "violence, language"
    },
    {
        title: "The Blacklist",
        imageUrl: "./images/poster-blacklist.png",
        category: "Crime TV Shows",
        videoId: "OLMylqsQew0",
        type: "TV Series",
        year: 2013,
        rating: "14+",
        quality: "HD",
        imdb: "7.9",
        seasons: 10,
        duration: "43m",
        description: "A new FBI profiler goes on the hunt for notorious criminals with help from 'Red', one of the FBI's most wanted fugitives who offers to help on the condition of working only with her.",
        cast: "James Spader, Megan Boone, Diego Klattenhoff, Ryan Eggold",
        genres: "Crime, Drama, Mystery",
        moods: "Suspenseful, Mysterious, Thrilling",
        warnings: "violence"
    },
    {
        title: "Wednesday",
        imageUrl: "./images/posters-wednesday.png",
        category: "Crime TV Shows",
        videoId: "Di310WS8zLk",
        type: "TV Series",
        year: 2022,
        rating: "14+",
        quality: "4K",
        imdb: "8.1",
        seasons: 1,
        duration: "45m",
        description: "Follows Wednesday Addams at Nevermore Academy, where she attempts to master her psychic abilities, thwart a killing spree, and solve the mystery of her parents.",
        cast: "Jenna Ortega, Gwendoline Christie, Riki Lindhome, Jamie McShane, Catherine Zeta-Jones",
        genres: "Comedy, Crime, Fantasy",
        moods: "Dark Comedy, Quirky, Mysterious",
        warnings: "violence, frightening scenes"
    },
    { title: "Ruler of Fortune", imageUrl: "./images/posters-ruler-fortune.png", category: "Crime TV Shows", videoId: "dummy" },

    { title: "Juventus vs Inter", imageUrl: "./images/sport-1.png", category: "Sports", videoId: "ZE_HAk7cIuo", type: "Sports", year: 2024 },
    { title: "Manchester City vs Liverpool", imageUrl: "./images/sport-2.png", category: "Sports", videoId: "_4jqA-mz_Ig", type: "Sports", year: 2024 },
    { title: "Real Madrid vs Barcelona", imageUrl: "./images/sport-3.png", category: "Sports", videoId: "k2hXVxvZP7E", type: "Sports", year: 2024 },
    { title: "Atletico Madrid vs Real Madrid", imageUrl: "./images/sport-4.png", category: "Sports", videoId: "BpHPcqiKwps", type: "Sports", year: 2024 },
    { title: "Chelsea vs Barcelona", imageUrl: "./images/sport-5.jpg", category: "Sports", videoId: "8MgbHaTL7_U", type: "Sports", year: 2024 },
    { title: "Arsenal vs Bayern Munich", imageUrl: "./images/sport-6.jpg", category: "Sports", videoId: "B49XGblhRQY", type: "Sports", year: 2024 },

    {
        title: "Frankenstein",
        imageUrl: "./images/poster-frankenstein.png",
        category: "New Releases",
        videoId: "b_YHe444S10",
        type: "Movie",
        year: 2025,
        rating: "R",
        duration: "1h 57m",
        description: "A brilliant but troubled scientist creates a grotesque creature in an unorthodox experiment.",
        cast: "Jacob Elordi, Oscar Isaac, Mia Goth",
        genres: "Horror, Drama, Sci-Fi",
        moods: "Dark, Chilling, Atmospheric",
        warnings: "violence"
    },
    {
        title: "Wednesday",
        imageUrl: "./images/posters-wednesday.png",
        category: "New Releases",
        videoId: "Di310WS8zLk",
        type: "TV Series",
        year: 2022,
        rating: "TV-14",
        seasons: 1,
        duration: "45m",
        description: "Wednesday Addams attempts to master her psychic ability, thwart a killing spree, and solve a mystery.",
        cast: "Jenna Ortega, Gwendoline Christie, Riki Lindhome",
        genres: "Comedy, Fantasy, Crime",
        moods: "Quirky, Dark, Mystery",
        warnings: "violence"
    },
    {
        title: "The Rookie",
        imageUrl: "./images/posters-rookie.png",
        category: "New Releases",
        videoId: "iBe-zZ3l1Qk",
        type: "TV Series",
        year: 2018,
        rating: "TV-14",
        seasons: 6,
        duration: "43m",
        description: "Starting over isn't easy, especially for John Nolan who, after a life-altering incident, pursues his dream of jumping the ranks of the LAPD.",
        cast: "Nathan Fillion, Alyssa Diaz, Richard T. Jones",
        genres: "Crime, Drama",
        moods: "Exciting, Inspiring",
        warnings: "violence"
    },
    {
        title: "Better Call Saul",
        imageUrl: "./images/poster-better-call-saul.jpg",
        category: "New Releases",
        videoId: "PuZ34IeY_L0",
        type: "TV Series",
        year: 2015,
        rating: "TV-MA",
        seasons: 6,
        duration: "47m",
        description: "The trials and tribulations of criminal lawyer Jimmy McGill in the years before he becomes Saul Goodman.",
        cast: "Bob Odenkirk, Rhea Seehorn, Jonathan Banks",
        genres: "Crime, Drama, Black Comedy",
        moods: "Witty, Dark, Clever",
        warnings: "language, violence"
    },
    {
        title: "Lupin",
        imageUrl: "./images/poster-lupin.png",
        category: "New Releases",
        videoId: "ga1m0wjz6GQ",
        type: "TV Series",
        year: 2021,
        rating: "TV-MA",
        seasons: 3,
        duration: "45m",
        description: "Assane Diop sets out to avenge his father for an injustice inflicted by a wealthy family.",
        cast: "Omar Sy, Ludivine Sagnier",
        genres: "Crime, Mystery, Thriller",
        moods: "Clever, Suspenseful",
        warnings: "violence"
    },

    {
        title: "Friends",
        imageUrl: "./images/poster-friends.jpg",
        category: "Watch It Again",
        videoId: "hDNNmeeJs1Q",
        type: "TV Series",
        year: 1994,
        rating: "TV-14",
        seasons: 10,
        description: "Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.",
        cast: "Jennifer Aniston, Courteney Cox, Lisa Kudrow",
        genres: "Comedy, Romance",
        moods: "Feel-good, Witty",
        warnings: "adult humor"
    },
    {
        title: "Peaky Blinders",
        imageUrl: "./images/poster-peaky-blinders.png",
        category: "Watch It Again",
        videoId: "oVzVdvGIC7U",
        type: "TV Series",
        year: 2013,
        rating: "TV-MA",
        seasons: 6,
        description: "A gangster family epic set in 1900s England, centering on a gang who sew razor blades in the peaks of their caps.",
        cast: "Cillian Murphy, Helen McCrory",
        genres: "Crime, Drama",
        moods: "Dark, Intense",
        warnings: "violence"
    },
    {
        title: "Breaking Bad",
        imageUrl: "./images/poster-breaking-bad.png",
        category: "Watch It Again",
        videoId: "HhesaQXLuRY",
        type: "TV Series",
        year: 2008,
        rating: "TV-MA",
        seasons: 5,
        description: "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.",
        cast: "Bryan Cranston, Aaron Paul",
        genres: "Crime, Drama",
        moods: "Gritty, Suspenseful",
        warnings: "drugs, violence"
    },
    {
        title: "Suits",
        imageUrl: "./images/posters-suits.png",
        category: "Watch It Again",
        videoId: "LUcolckODbg",
        type: "TV Series",
        year: 2011,
        rating: "TV-14",
        seasons: 9,
        description: "On the run from a drug deal gone bad, Mike Ross becomes a law associate of Harvey Specter.",
        cast: "Gabriel Macht, Patrick J. Adams",
        genres: "Drama, Comedy",
        moods: "Witty, Stylish",
        warnings: "language"
    },
    {
        title: "How I Met Your Mother",
        imageUrl: "./images/poster-how-i-met-your-mother.png",
        category: "Watch It Again",
        videoId: "3hvGBibGccg",
        type: "TV Series",
        year: 2005,
        rating: "TV-PG",
        seasons: 9,
        description: "A father recounts to his children the journey he and his four best friends took leading up to him meeting their mother.",
        cast: "Josh Radnor, Jason Segel",
        genres: "Comedy, Romance",
        moods: "Heartfelt, Funny",
        warnings: "adult humor"
    },

    {
        title: "Stranger Things",
        imageUrl: "./images/poster-stranger-things.png",
        category: "Sci-Fi & Fantasy",
        videoId: "b9EkMc79ZSU",
        type: "TV Series",
        year: 2016,
        rating: "TV-14",
        seasons: 5,
        description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments and supernatural forces.",
        cast: "Millie Bobby Brown, Finn Wolfhard",
        genres: "Sci-Fi, Horror",
        moods: "Suspenseful, Dark",
        warnings: "frightening scenes"
    },
    {
        title: "Wednesday",
        imageUrl: "./images/posters-wednesday.png",
        category: "Sci-Fi & Fantasy",
        videoId: "Di310WS8zLk",
        type: "TV Series",
        year: 2022,
        rating: "TV-14",
        seasons: 1,
        description: "Wednesday Addams attempts to master her psychic ability at Nevermore Academy.",
        cast: "Jenna Ortega, Gwendoline Christie",
        genres: "Fantasy, Comedy",
        moods: "Quirky, Dark",
        warnings: "violence"
    },
    {
        title: "Frankenstein",
        imageUrl: "./images/poster-frankenstein.png",
        category: "Sci-Fi & Fantasy",
        videoId: "b_YHe444S10",
        type: "Movie",
        year: 2025,
        rating: "R",
        description: "A brilliant but troubled scientist creates a grotesque creature in an unorthodox experiment.",
        cast: "Jacob Elordi, Oscar Isaac",
        genres: "Sci-Fi, Horror",
        moods: "Chilling, Atmospheric",
        warnings: "disturbing imagery"
    },
    {
        title: "Arcane",
        imageUrl: "https://picsum.photos/320/180?random=11",
        category: "Sci-Fi & Fantasy",
        videoId: "fXmAurh012s",
        type: "TV Series",
        year: 2021,
        rating: "TV-14",
        seasons: 2,
        description: "Amid the stark discord of twin cities Piltover and Zaun, two sisters fight on rival sides of a war between magic technologies and clashing convictions.",
        cast: "Hailee Steinfeld, Ella Purnell",
        genres: "Animation, Action, Fantasy",
        moods: "Visually Stunning, Emotional",
        warnings: "violence"
    },
    {
        title: "Black Mirror",
        imageUrl: "https://picsum.photos/320/180?random=9",
        category: "Sci-Fi & Fantasy",
        videoId: "5ELQ6u_5YYM",
        type: "TV Series",
        year: 2011,
        rating: "TV-MA",
        seasons: 6,
        description: "An anthology series exploring a twisted, high-tech multiverse where humanity's greatest innovations and darkest instincts collide.",
        cast: "Various",
        genres: "Sci-Fi, Drama, Thriller",
        moods: "Mind-bending, Dark",
        warnings: "disturbing content"
    },
    {
        title: "Champions League",
        imageUrl: "./images/sport-2.png",
        category: "Sports",
        videoId: "ZE_HAk7cIuo",
        type: "Sports",
        year: 2024,
        rating: "ALL",
        description: "Experience the thrill of the UEFA Champions League, where the world's best football clubs compete for the ultimate club trophy.",
        cast: "Various Teams",
        genres: "Sports, Football",
        moods: "Exciting, High-Stakes",
        warnings: ""
    }
];


function getFormattedMyList() {
    const list = localStorage.getItem('myList');
    return list ? JSON.parse(list) : [];
}

function saveMyList(list) {
    localStorage.setItem('myList', JSON.stringify(list));
    window.dispatchEvent(new Event('storage'));
}

function addToMyList(item) {
    const list = getFormattedMyList();
    if (!list.some(i => i.title === item.title)) {
        list.push(item);
        saveMyList(list);
        return true;
    }
    return false;
}

function removeFromMyList(title) {
    let list = getFormattedMyList();
    const initialLength = list.length;
    list = list.filter(i => i.title !== title);
    if (list.length !== initialLength) {
        saveMyList(list);
        return true;
    }
    return false;
}

function isInMyList(title) {
    const list = getFormattedMyList();
    return list.some(i => i.title === title);
}

function createContentCard(item) {

    return `
        <div class="poster-item" tabindex="0">
            <img src="${item.imageUrl}" alt="${item.title}" class="poster" loading="lazy">
            <p class="poster-title" style="display:none;">${item.title}</p>
        </div>
    `;
}

function populateRows() {
    const categoryRows = document.querySelectorAll('.category-row');

    categoryRows.forEach((rowElement) => {
        const rowTitle = rowElement.querySelector('h2').textContent.trim();
        const rowContentItems = allContent.filter(item => item.category === rowTitle);
        const container = rowElement.querySelector('.poster-container');

        if (container && rowContentItems.length > 0) {

            let contentToRender = rowContentItems;
            if (rowContentItems.length < 10) {
                contentToRender = [...rowContentItems, ...rowContentItems, ...rowContentItems];
            }

            const rowHtml = contentToRender.map(createContentCard).join('');
            container.innerHTML = rowHtml;
        }
    });
}
document.addEventListener('DOMContentLoaded', populateRows);

function scrollContent(containerId, direction) {

    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`FAILURE: ID'si ${containerId} olan kaydırma kapsayıcısı bulunamadı.`);
        return;
    }


    const firstCard = container.querySelector('.poster');

    if (!firstCard) {

        var scrollDistance = 260;
        var cardsInView = 3;
    } else {

        var scrollDistance = firstCard.offsetWidth + 8;


        var cardsInView = Math.floor(container.offsetWidth / scrollDistance);


        if (cardsInView < 1) cardsInView = 1;
    }


    const scrollAmount = direction * scrollDistance * cardsInView;


    container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('video-modal');
    const closeBtn = document.querySelector('.close-btn');
    const videoFrame = document.getElementById('video-frame');

    if (modal && closeBtn && videoFrame) {


        document.body.addEventListener('click', (e) => {

            const posterItem = e.target.closest('.poster-item');

            if (posterItem) {

                const titleElement = posterItem.querySelector('.poster-title');
                if (titleElement) {
                    const titleText = titleElement.textContent.trim();



                    const contentData = allContent.find(item => item.title.trim() === titleText);

                    if (contentData && contentData.videoId && contentData.videoId !== "dummy") {
                        const videoUrl = `https://www.youtube.com/embed/${contentData.videoId}?autoplay=1`;

                        modal.classList.add('active');
                        videoFrame.src = videoUrl;
                        document.body.style.overflow = 'hidden';
                    } else {
                        console.warn(`No video found for title: ${titleText}`);

                    }
                }
            }
        });


        const closeModal = () => {
            modal.classList.remove('active');
            videoFrame.src = "";
            document.body.style.overflow = '';
        };


        closeBtn.addEventListener('click', closeModal);


        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });


        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    } else {
        console.warn("Modal elements not found");
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const hoverCard = document.getElementById('hover-card');
    const hoverVideoFrame = document.getElementById('hover-video-frame');
    const hoverTitle = document.getElementById('hover-title');

    let hoverTimeout;
    let isHovering = false;
    let currentHoverContent = null;


    const hoverPlayBtn = document.getElementById('hover-play-btn');
    const hoverAddBtn = document.getElementById('hover-add-btn');
    const hoverLikeBtn = document.getElementById('hover-like-btn');
    const hoverMoreBtn = document.getElementById('hover-more-btn');


    if (hoverPlayBtn) {
        hoverPlayBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentHoverContent && currentHoverContent.videoId && currentHoverContent.videoId !== 'dummy') {
                const modal = document.getElementById('video-modal');
                const videoFrame = document.getElementById('video-frame');
                if (modal && videoFrame) {
                    const videoUrl = `https://www.youtube.com/embed/${currentHoverContent.videoId}?autoplay=1`;
                    modal.classList.add('active');
                    videoFrame.src = videoUrl;
                    document.body.style.overflow = 'hidden';
                }
            }
        });
    }

    if (hoverAddBtn) {
        hoverAddBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentHoverContent) {
                if (isInMyList(currentHoverContent.title)) {
                    if (removeFromMyList(currentHoverContent.title)) {
                        hoverAddBtn.classList.remove('active');
                        hoverAddBtn.style.backgroundColor = '';
                        hoverAddBtn.style.borderColor = '';
                    }
                } else {
                    if (addToMyList(currentHoverContent)) {
                        hoverAddBtn.classList.add('active');
                        hoverAddBtn.style.backgroundColor = '#46d369';
                        hoverAddBtn.style.borderColor = '#46d369';
                    }
                }
            }
        });
    }

    if (hoverPlayBtn) {
        hoverPlayBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentHoverContent && currentHoverContent.videoId) {
                const videoModal = document.getElementById('video-modal');
                const videoFrame = document.getElementById('video-frame');

                if (videoModal && videoFrame) {

                    let vId = currentHoverContent.videoId;

                    const videoUrl = `https://www.youtube.com/embed/${vId}?autoplay=1&mute=0&rel=0`;
                    videoFrame.src = videoUrl;
                    videoModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }


                hoverCard.classList.remove('active');
            }
        });
    }
    if (hoverLikeBtn) {
        hoverLikeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            hoverLikeBtn.classList.toggle('active');
            const isLiked = hoverLikeBtn.classList.contains('active');
            const svgPath = hoverLikeBtn.querySelector('path');
            if (isLiked) {
                hoverLikeBtn.style.backgroundColor = '#46d369';
                hoverLikeBtn.style.borderColor = '#46d369';
                if (svgPath) svgPath.setAttribute('fill', 'currentColor');
            } else {
                hoverLikeBtn.style.backgroundColor = '';
                hoverLikeBtn.style.borderColor = '';
                if (svgPath) svgPath.setAttribute('fill', 'none');
            }
        });
    }

    if (hoverMoreBtn) {
        hoverMoreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentHoverContent) {
                showDetailModal(currentHoverContent);

                hoverCard.classList.remove('active');
                hoverCard.style.display = 'none';
                setTimeout(() => { hoverCard.style.display = ''; }, 100);
            }
        });
    }


    const hideHoverCard = () => {
        isHovering = false;
        hoverCard.classList.remove('active');

        if (hoverAddBtn) {
            hoverAddBtn.classList.remove('active');
            hoverAddBtn.style.backgroundColor = '';
            hoverAddBtn.style.borderColor = '';
        }
        if (hoverLikeBtn) {
            hoverLikeBtn.classList.remove('active');
            hoverLikeBtn.style.backgroundColor = '';
            hoverLikeBtn.style.borderColor = '';
            const svgPath = hoverLikeBtn.querySelector('path');
            if (svgPath) svgPath.setAttribute('fill', 'none');
        }

        setTimeout(() => {
            if (!isHovering) hoverVideoFrame.src = "";
        }, 300);
    };


    document.body.addEventListener('mouseover', (e) => {
        const posterItem = e.target.closest('.poster-item');


        if (posterItem) {

            clearTimeout(hoverTimeout);
            isHovering = true;


            hoverTimeout = setTimeout(() => {
                if (!isHovering) return;


                let titleText = posterItem.dataset.title;


                if (!titleText) {
                    const titleElement = posterItem.querySelector('.poster-title');
                    if (!titleElement) return;

                    titleText = titleElement.textContent.split(' - ')[0].trim();
                }

                const contentData = allContent.find(item => item.title.trim() === titleText);

                if (contentData && contentData.videoId) {
                    currentHoverContent = contentData;


                    if (hoverAddBtn) {
                        const inList = isInMyList(contentData.title);
                        if (inList) {
                            hoverAddBtn.classList.add('active');
                            hoverAddBtn.style.backgroundColor = '#46d369';
                            hoverAddBtn.style.borderColor = '#46d369';
                        } else {
                            hoverAddBtn.classList.remove('active');
                            hoverAddBtn.style.backgroundColor = '';
                            hoverAddBtn.style.borderColor = '';
                        }
                    }


                    hoverTitle.textContent = contentData.title;


                    const hoverMeta = hoverCard.querySelector('.hover-meta');
                    if (hoverMeta) {
                        hoverMeta.innerHTML = `
                            <span class="match-score">${Math.floor(Math.random() * 10) + 90}% Match</span>
                            <span class="age-rating">${contentData.rating || '16+'}</span>
                            <span class="duration">${contentData.seasons ? contentData.seasons + (contentData.seasons > 1 ? ' Seasons' : ' Season') : contentData.duration || '2h'}</span>
                            <span class="quality">${contentData.quality || 'HD'}</span>
                        `;
                    }



                    // Use Preview Video ID if available, else fallback to Main Video ID
                    const pId = contentData.preview_video_id || contentData.videoId;
                    const videoUrl = `https://www.youtube.com/embed/${pId}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1`;
                    hoverVideoFrame.src = videoUrl;


                    const rect = posterItem.getBoundingClientRect();
                    const scrollY = window.scrollY;
                    const scrollX = window.scrollX;




                    const cardWidth = 320;

                    const cardHeight = 350;


                    let left = rect.left + scrollX + (rect.width / 2) - (cardWidth / 2);
                    let top = rect.top + scrollY - 20;


                    if (left < 10) left = 10;
                    if (left + cardWidth > document.body.clientWidth - 10) {
                        left = document.body.clientWidth - cardWidth - 10;
                    }

                    hoverCard.style.left = `${left}px`;
                    hoverCard.style.top = `${top}px`;


                    hoverCard.classList.add('active');
                }
            }, 600);
        }
    });

    document.body.addEventListener('mouseout', (e) => {
        const posterItem = e.target.closest('.poster-item');
        const relatedTarget = e.relatedTarget;

        if (posterItem) {

            if (relatedTarget && (relatedTarget === hoverCard || hoverCard.contains(relatedTarget))) {
                return;
            }

            clearTimeout(hoverTimeout);
            hideHoverCard();
        }
    });


    hoverCard.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimeout);
        hideHoverCard();
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








(function initSearch() {
    const searchWrapper = document.getElementById('search-wrapper');
    const searchToggle = document.getElementById('search-toggle');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    if (!searchWrapper || !searchToggle || !searchInput || !searchResults) return;


    searchToggle.addEventListener('click', () => {
        searchWrapper.classList.toggle('active');
        if (searchWrapper.classList.contains('active')) {
            setTimeout(() => searchInput.focus(), 300);
        } else {
            searchInput.value = '';
            searchResults.classList.remove('active');
        }
    });


    document.addEventListener('click', (e) => {
        if (!searchWrapper.contains(e.target)) {
            searchWrapper.classList.remove('active');
            searchResults.classList.remove('active');
        }
    });


    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        const query = searchInput.value.trim().toLowerCase();

        if (query.length < 2) {
            searchResults.classList.remove('active');
            return;
        }

        searchTimeout = setTimeout(() => {

            const filteredResults = allContent.filter(item =>
                item.title.toLowerCase().includes(query) ||
                (item.genres && item.genres.toLowerCase().includes(query)) ||
                (item.cast && item.cast.toLowerCase().includes(query))
            );


            const uniqueMap = new Map();
            filteredResults.forEach(item => {
                if (!uniqueMap.has(item.title)) {
                    uniqueMap.set(item.title, item);
                }
            });

            const results = Array.from(uniqueMap.values()).slice(0, 8);

            if (results.length > 0) {
                searchResults.innerHTML = results.map(item => `
                    <div class="search-result-item" data-title="${item.title}">
                        <img src="${item.imageUrl}" alt="${item.title}" class="search-result-poster">
                        <div class="search-result-info">
                            <div class="search-result-title">${item.title}</div>
                            <div class="search-result-meta">${item.year || ''} • ${item.rating || ''}</div>
                        </div>
                    </div>
                `).join('');
            } else {
                searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
            }
            searchResults.classList.add('active');
        }, 200);
    });


    searchResults.addEventListener('click', (e) => {
        const resultItem = e.target.closest('.search-result-item');
        if (resultItem) {
            const title = resultItem.dataset.title;
            const contentData = allContent.find(item => item.title === title);
            if (contentData && window.showDetailModal) {
                window.showDetailModal(contentData);
            }
            searchWrapper.classList.remove('active');
            searchResults.classList.remove('active');
            searchInput.value = '';
        }
    });


    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchWrapper.classList.remove('active');
            searchResults.classList.remove('active');
        }
    });
})();




(function initNotifications() {
    const notificationsWrapper = document.getElementById('notifications-wrapper');
    const notificationsToggle = document.getElementById('notifications-toggle');
    const notificationsList = document.getElementById('notifications-list');
    const notificationBadge = document.querySelector('.notification-badge');

    if (!notificationsWrapper || !notificationsToggle || !notificationsList) return;


    const notifications = [
        {
            id: 1,
            title: "New Season Available",
            message: "Stranger Things Season 5 is now streaming!",
            poster: "./images/poster-stranger-things.png",
            time: "2 hours ago",
            unread: true
        },
        {
            id: 2,
            title: "Continue Watching",
            message: "You left off at Peaky Blinders S6:E3",
            poster: "./images/poster-peaky-blinders.png",
            time: "Yesterday",
            unread: true
        },
        {
            id: 3,
            title: "New Arrival",
            message: "Wednesday has been added to your recommendations",
            poster: "./images/posters-wednesday.png",
            time: "3 days ago",
            unread: true
        },
        {
            id: 4,
            title: "Match Starting Soon",
            message: "Real Madrid vs Barcelona starts in 1 hour",
            poster: "./images/sport-3.png",
            time: "1 week ago",
            unread: false
        }
    ];


    function renderNotifications() {
        notificationsList.innerHTML = notifications.map(n => `
            <div class="notification-item ${n.unread ? 'unread' : ''}" data-id="${n.id}">
                <img src="${n.poster}" alt="${n.title}" class="notification-poster">
                <div class="notification-content">
                    <div class="notification-title">${n.title}</div>
                    <div class="notification-message">${n.message}</div>
                    <div class="notification-time">${n.time}</div>
                </div>
            </div>
        `).join('');


        const unreadCount = notifications.filter(n => n.unread).length;
        if (notificationBadge) {
            notificationBadge.textContent = unreadCount;
            notificationBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    }

    renderNotifications();


    notificationsToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationsWrapper.classList.toggle('open');


        document.querySelector('.search-wrapper')?.classList.remove('active');
        document.querySelector('.profile-dropdown-wrapper')?.classList.remove('open');
    });


    document.addEventListener('click', (e) => {
        if (!notificationsWrapper.contains(e.target)) {
            notificationsWrapper.classList.remove('open');
        }
    });


    notificationsList.addEventListener('click', (e) => {
        const item = e.target.closest('.notification-item');
        if (item) {
            const id = parseInt(item.dataset.id);
            const notification = notifications.find(n => n.id === id);
            if (notification) {
                notification.unread = false;
                renderNotifications();
            }
        }
    });
})();




(function initContinueWatching() {

    let continueWatching = JSON.parse(localStorage.getItem('continueWatching')) || [];


    if (continueWatching.length === 0) {
        continueWatching = [
            {
                title: "Peaky Blinders",
                imageUrl: "./images/poster-peaky-blinders.png",
                episode: "S6:E3",
                progress: 65
            },
            {
                title: "Breaking Bad",
                imageUrl: "./images/poster-breaking-bad.png",
                episode: "S5:E14",
                progress: 35
            },
            {
                title: "Stranger Things",
                imageUrl: "./images/poster-stranger-things.png",
                episode: "S4:E7",
                progress: 80
            }
        ];
        localStorage.setItem('continueWatching', JSON.stringify(continueWatching));
    }


    const contentRows = document.querySelector('.content-rows');
    if (!contentRows || continueWatching.length === 0) return;


    const continueWatchingHTML = `
        <div class="category-wrapper continue-watching-section">
            <section class="category-row">
                <h2>Continue Watching</h2>
                <div class="poster-container" id="continue-watching-row">
                    ${continueWatching.map(item => `
                        <div class="poster-item continue-watching-item" data-title="${item.title}">
                            <img src="${item.imageUrl}" alt="${item.title}" class="poster">
                            <div class="progress-bar-container">
                                <div class="progress-bar" style="width: ${item.progress}%"></div>
                            </div>
                            <p class="poster-title">${item.title} - ${item.episode}</p>
                        </div>
                    `).join('')}
                </div>
            </section>
            <button class="scroll-btn left" onclick="scrollContent('continue-watching-row', -1)"> &lt; </button>
            <button class="scroll-btn right" onclick="scrollContent('continue-watching-row', 1)"> &gt; </button>
        </div>
    `;


    contentRows.insertAdjacentHTML('afterbegin', continueWatchingHTML);
})();




(function initVolumeControl() {
    const volumeControl = document.querySelector('.hover-volume-control');
    const volumeIcon = document.querySelector('.volume-icon');
    const hoverVideoFrame = document.getElementById('hover-video-frame');

    if (!volumeControl || !volumeIcon) return;

    let isMuted = true;

    volumeControl.addEventListener('click', (e) => {
        e.stopPropagation();
        isMuted = !isMuted;
        if (isMuted) {
            volumeIcon.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4v6h3l5 5v-2.33l4.22 4.22a.996.996 0 101.41-1.41L3.63 3.63zM10 16.51l-4.21-4.21L5 11.79V10h1.79l3.21 3.21v3.3zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71z"/></svg>`;
        } else {
            volumeIcon.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
        }


        if (hoverVideoFrame && hoverVideoFrame.src) {
            const url = new URL(hoverVideoFrame.src);
            url.searchParams.set('mute', isMuted ? '1' : '0');
            hoverVideoFrame.src = url.toString();
        }
    });
})();




(function initScrollReveal() {
    const revealElements = document.querySelectorAll('.category-wrapper');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        el.classList.add('reveal-on-scroll');
        observer.observe(el);
    });
})();




(function initHamburgerMenu() {
    const nav = document.querySelector('.nav');
    const primaryNav = document.querySelector('.primary-nav');

    if (!nav || !primaryNav) return;


    if (document.querySelector('.hamburger-menu')) return;


    const hamburger = document.createElement('div');
    hamburger.className = 'hamburger-menu';
    hamburger.innerHTML = `
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
    `;


    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    mobileNav.innerHTML = primaryNav.innerHTML;


    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';


    nav.insertBefore(hamburger, nav.firstChild);
    document.body.appendChild(mobileNav);
    document.body.appendChild(overlay);


    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = hamburger.classList.contains('active') ? 'hidden' : '';
    });


    overlay.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });


    mobileNav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
})();