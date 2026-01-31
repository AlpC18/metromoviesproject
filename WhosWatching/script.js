
const profiles = document.querySelectorAll('.profile');
profiles.forEach(profile => {
    profile.addEventListener('click', () => {
        const profileName = profile.getAttribute('data-name');

        localStorage.setItem('selectedProfile', profileName);

        window.location.href = '../Interface MainPage/index.html';
    });
});


const manageButton = document.getElementById('manageBtn');
if (manageButton) {
    manageButton.addEventListener('click', () => {
        window.location.href = '../ManageProfile/manageprofile.html';
    });
} else {
    console.error("ERROR: Element with ID 'manageBtn' not found.");
}