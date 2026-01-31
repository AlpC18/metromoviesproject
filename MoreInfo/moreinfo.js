
(function () {
    let currentDetailContent = null;

    // Helper to get modal element and initialize it if needed
    function getModal() {
        const modal = document.getElementById('detail-modal');
        if (modal && !modal.dataset.initialized) {
            const closeBtn = modal.querySelector('.detail-close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', hideDetailModal);
            }
            modal.addEventListener('click', (e) => {
                if (e.target === modal) hideDetailModal();
            });

            // Add escape key listener once
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    hideDetailModal();
                }
            });

            // Initialize buttons inside modal
            const detailPlayBtn = modal.querySelector('#detail-play-btn');
            if (detailPlayBtn) {
                detailPlayBtn.addEventListener('click', () => {
                    if (currentDetailContent) {
                        const videoModal = document.getElementById('video-modal');
                        const videoFrame = document.getElementById('video-frame');
                        if (currentDetailContent.videoId && currentDetailContent.videoId !== 'dummy' && videoModal && videoFrame) {
                            const videoUrl = `https://www.youtube.com/embed/${currentDetailContent.videoId}?autoplay=1`;
                            videoModal.classList.add('active');
                            videoFrame.src = videoUrl;
                        } else {
                            alert(`▶ Playing: ${currentDetailContent.title}`);
                        }
                    }
                });
            }

            const detailAddBtn = modal.querySelector('#detail-add-btn');
            if (detailAddBtn) {
                detailAddBtn.addEventListener('click', () => {
                    if (currentDetailContent) {
                        if (typeof isInMyList === 'function' && typeof addToMyList === 'function' && typeof removeFromMyList === 'function') {
                            if (isInMyList(currentDetailContent.title)) {
                                if (removeFromMyList(currentDetailContent.title)) {
                                    detailAddBtn.classList.remove('active');
                                    detailAddBtn.style.backgroundColor = '';
                                    detailAddBtn.style.borderColor = '';
                                }
                            } else {
                                if (addToMyList(currentDetailContent)) {
                                    detailAddBtn.classList.add('active');
                                    detailAddBtn.style.backgroundColor = '#46d369';
                                    detailAddBtn.style.borderColor = '#46d369';
                                }
                            }
                        }
                    }
                });
            }

            const detailLikeBtn = modal.querySelector('#detail-like-btn');
            if (detailLikeBtn) {
                detailLikeBtn.addEventListener('click', () => {
                    detailLikeBtn.classList.toggle('active');
                    const isLiked = detailLikeBtn.classList.contains('active');
                    const svgPath = detailLikeBtn.querySelector('path');
                    if (isLiked) {
                        detailLikeBtn.style.backgroundColor = '#46d369';
                        detailLikeBtn.style.borderColor = '#46d369';
                        if (svgPath) svgPath.setAttribute('fill', 'currentColor');
                    } else {
                        detailLikeBtn.style.backgroundColor = '';
                        detailLikeBtn.style.borderColor = '';
                        if (svgPath) svgPath.setAttribute('fill', 'none');
                    }
                });
            }

            modal.dataset.initialized = 'true';
        }
        return modal;
    }

    function hideDetailModal() {
        const modal = document.getElementById('detail-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            currentDetailContent = null;
        }
    }

    window.showDetailModal = function (contentData) {
        const modal = getModal();
        if (!contentData || !modal) return;

        currentDetailContent = contentData;

        // Populate content
        const headerBg = modal.querySelector('#detail-header-bg');
        if (headerBg) headerBg.style.backgroundImage = `url('${contentData.imageUrl}')`;
        const detailTitle = modal.querySelector('#detail-title');
        if (detailTitle) detailTitle.textContent = contentData.title;

        const matchEl = modal.querySelector('#detail-match');
        if (matchEl) matchEl.textContent = `${Math.floor(Math.random() * 10) + 90}% Match`;

        const yearEl = modal.querySelector('#detail-year');
        if (yearEl) yearEl.textContent = contentData.year || 'N/A';

        const ratingEl = modal.querySelector('#detail-rating');
        if (ratingEl) ratingEl.textContent = contentData.rating || '16+';

        const qualityEl = modal.querySelector('.detail-quality');
        if (qualityEl) qualityEl.textContent = contentData.quality || 'HD';

        const audioEl = modal.querySelector('.detail-audio');
        if (audioEl) {
            if (contentData.imdb) {
                audioEl.textContent = `IMDB: ${contentData.imdb}`;
                audioEl.style.width = 'auto';
                audioEl.style.padding = '0 6px';
            } else {
                audioEl.textContent = '5.1';
            }
        }

        const seasonsEl = modal.querySelector('#detail-seasons');
        if (seasonsEl) {
            if (contentData.type === 'TV Series' && contentData.seasons) {
                seasonsEl.textContent = `${contentData.seasons} Season${contentData.seasons > 1 ? 's' : ''}`;
                seasonsEl.style.display = 'inline';
            } else if (contentData.type === 'Movie' && contentData.duration) {
                seasonsEl.textContent = contentData.duration;
                seasonsEl.style.display = 'inline';
            } else {
                seasonsEl.style.display = 'none';
            }
        }

        const warningsEl = modal.querySelector('#detail-warnings');
        if (warningsEl) {
            warningsEl.textContent = contentData.warnings || '';
            warningsEl.style.display = contentData.warnings ? 'block' : 'none';
        }

        const descEl = modal.querySelector('#detail-description');
        if (descEl) descEl.textContent = contentData.description || 'No description available.';

        const castEl = modal.querySelector('#detail-cast');
        if (castEl) castEl.textContent = contentData.cast || 'Unknown';

        const genresEl = modal.querySelector('#detail-genres');
        if (genresEl) genresEl.textContent = contentData.genres || 'Unknown';

        const moodsEl = modal.querySelector('#detail-moods');
        if (moodsEl) moodsEl.textContent = contentData.moods || 'Unknown';

        // Episodes
        const episodesSection = modal.querySelector('#detail-episodes-section');
        const episodesList = modal.querySelector('#detail-episodes-list');
        const seasonLabel = modal.querySelector('#detail-season-label');

        if (episodesSection && episodesList) {
            if (contentData.type === 'TV Series' && contentData.episodes && contentData.episodes.length > 0) {
                episodesSection.style.display = 'block';
                if (seasonLabel) seasonLabel.textContent = 'Season 1';
                episodesList.innerHTML = contentData.episodes.map(ep => `
                    <div class="episode-item">
                        <span class="episode-number">${ep.num}</span>
                        <img class="episode-thumb" src="${contentData.imageUrl}" alt="${ep.title}">
                        <div class="episode-info">
                            <h4 class="episode-title">${ep.title}</h4>
                            <p class="episode-desc">${ep.desc}</p>
                        </div>
                        <span class="episode-duration">${ep.duration}</span>
                    </div>
                `).join('');
            } else {
                episodesSection.style.display = 'none';
                episodesList.innerHTML = '';
            }
        }

        // More Like This
        const moreLikeThisGrid = modal.querySelector('#more-like-this-grid');
        if (moreLikeThisGrid && typeof allContent !== 'undefined') {
            let relatedContent = [];
            if (contentData.category === 'Sports') {
                relatedContent = allContent.filter(item => item.title !== contentData.title && item.category === 'Sports');
            } else {
                relatedContent = allContent.filter(item => {
                    if (item.title === contentData.title || !item.description) return false;
                    if (item.category === contentData.category) return true;
                    if (contentData.genres && item.genres) {
                        const curG = contentData.genres.split(', ');
                        const itemG = item.genres.split(', ');
                        return curG.some(g => itemG.includes(g));
                    }
                    return false;
                }).slice(0, 9);
            }

            if (relatedContent.length > 0) {
                moreLikeThisGrid.innerHTML = relatedContent.map(item => `
                    <div class="more-like-item" data-title="${item.title}">
                        <img class="more-like-item-poster" src="${item.imageUrl}" alt="${item.title}">
                        <div class="more-like-item-info">
                            <div class="more-like-item-meta">
                                <span class="more-like-item-match">${Math.floor(Math.random() * 15) + 85}% Match</span>
                                <span class="more-like-item-rating">${item.rating || 'NR'}</span>
                                <span class="more-like-item-year">${item.year || ''}</span>
                            </div>
                            <div class="more-like-item-title">${item.title}</div>
                            <p class="more-like-item-desc">${item.description || ''}</p>
                        </div>
                    </div>
                `).join('');

                moreLikeThisGrid.querySelectorAll('.more-like-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const found = allContent.find(c => c.title === item.dataset.title);
                        if (found) showDetailModal(found);
                    });
                });
            } else {
                moreLikeThisGrid.innerHTML = '<p style="color: #aaa;">No related content found.</p>';
            }
        }

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Close hover card if open
        const hoverCard = document.getElementById('hover-card');
        if (hoverCard) hoverCard.classList.remove('active');
    };

    // Global listener for hover card more info button
    document.addEventListener('click', (e) => {
        const moreInfoBtn = e.target.closest('.hover-btn[title="More Info"]');
        if (moreInfoBtn) {
            e.stopPropagation();
            const hoverTitleEl = document.getElementById('hover-title');
            if (hoverTitleEl && typeof allContent !== 'undefined') {
                const found = allContent.find(item => item.title === hoverTitleEl.textContent);
                if (found) showDetailModal(found);
            }
        }
    });

})();
