
    const movies = [
     { title: "The Hidden World", imageUrl: "https://picsum.photos/320/180?random=1" },
     { title: "Space Odyssey", imageUrl: "https://picsum.photos/320/180?random=2" },
     { title: "Lost in Translation", imageUrl: "https://picsum.photos/320/180?random=3" },
     { title: "Cyberpunk City", imageUrl: "https://picsum.photos/320/180?random=4" },
     { title: "Mystery Island", imageUrl: "https://picsum.photos/320/180?random=5" },
     { title: "The Old Guard", imageUrl: "https://picsum.photos/320/180?random=6" },
     { title: "Silent Hill", imageUrl: "https://picsum.photos/320/180?random=7" },
     { title: "Crimson Peak", imageUrl: "https://picsum.photos/320/180?random=8" },
     { title: "Black Mirror", imageUrl: "https://picsum.photos/320/180?random=9" },
     { title: "Arcane", imageUrl: "https://picsum.photos/320/180?random=11" },
     { title: "Lupin", imageUrl: "https://picsum.photos/320/180?random=12" },
     { title: "Squid Game", imageUrl: "https://picsum.photos/320/180?random=13" },
        ];
const allContent = [
    { title: "Stranger Things", imageUrl: "./images/poster-stranger-things.png", category: "We Think You'll Love These" },
    { title: "The Rookie", imageUrl: "./images/posters-rookie.png", category: "We Think You'll Love These" },
    { title: "Frankenstein", imageUrl: "./images/poster-frankenstein.png", category: "We Think You'll Love These" },
    { title: "Money Heist", imageUrl: "./images/poster-money-heist.png", category: "We Think You'll Love These" },
    { title: "Breaking Bad", imageUrl: "./images/posters-breaking-bad.png", category: "We Think You'll Love These" },
    { title: "Bad Boys", imageUrl: "./images/posters-bad-boys.png", category: "We Think You'll Love These" },
    { title: "Dexter", imageUrl: "./images/poster-dexter.png", category: "Your Next Watch" },
    { title: "Lupin", imageUrl: "./images/poster-lupin.png", category: "Your Next Watch" },
    { title: "Young Sheldon", imageUrl: "./images/poster-young-sheldon.png", category: "Your Next Watch" },
    { title: "Suits", imageUrl: "./images/posters-suits.png", category: "Your Next Watch" },
    { title: "Shameless", imageUrl: "./images/poster-shameless.png", category: "Your Next Watch" },
    { title: "Caramelo", imageUrl: "./images/poster-caramelo.png", category: "Your Next Watch" },

    { title: "Monster", imageUrl: "./images/poster-monster.png", category: "Crime TV Shows" },
    { title: "Better Call Saul", imageUrl: "./images/poster-better-call-saul.jpg", category: "Crime TV Shows" },
    { title: "The Blacklist", imageUrl: "./images/poster-blacklist.png", category: "Crime TV Shows" },
    { title: "Wednesday", imageUrl: "./images/posters-wednesday.png", category: "Crime TV Shows" },
    { title: "Rulers of Fortune", imageUrl: "./images/posters-ruler-fortune.png", category: "Crime TV Shows" },
    { title: "Peaky Blinders", imageUrl: "./images/poster-peaky-blinders.png", category: "Crime TV Shows" },

    
    { title: "Game 1", imageUrl: "./images/sport-1.png", category: "Sports" },
    { title: "Game 2", imageUrl: "./images/sport-2.png", category: "Sports" },
    { title: "Game 3", imageUrl: "./images/sport-3.png", category: "Sports" },
    { title: "Game 4", imageUrl: "./images/sport-4.png", category: "Sports" },
    { title: "Game 5", imageUrl: "./images/sport-5.jpg", category: "Sports" },
    { title: "Game 6", imageUrl: "./images/sport-6.jpg", category: "Sports" },
];

function createContentCard(item) {
    return `<img src="${item.imageUrl}" alt="${item.title}" class="poster" loading="lazy">`;
}
function populateRows() {
    const categoryRows = document.querySelectorAll('.category-row');

    categoryRows.forEach((rowElement) => {
        const rowTitle = rowElement.querySelector('h2').textContent.trim();
        const rowContentItems = allContent.filter(item => item.category === rowTitle);
        const container = rowElement.querySelector('.poster-container');
        
        if (container && rowContentItems.length > 0) {
           
            const duplicatedContent = [...rowContentItems, ...rowContentItems];
            const rowHtml = duplicatedContent.map(createContentCard).join('');
            
             
        }
    });
    function populateRows() {
           
            const allRows = document.querySelectorAll('[data-row]');

            allRows.forEach((rowElement, index) => {
                
                const rowContent = [...movies, ...movies].map(createMovieCard).join('');
                rowElement.innerHTML = rowContent;
            });
        }    
        document.addEventListener('DOMContentLoaded', populateRows);
}
/**

 * * @param {string} containerId - 
 * @param {number} direction - 
 */
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