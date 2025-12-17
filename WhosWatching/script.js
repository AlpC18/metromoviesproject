const manageButton = document.getElementById('manageBtn');
if (manageButton) {
    manageButton.addEventListener('click', function() {
        
        window.location.href = '/ManageProfile/manageprofile.html';
    });
} else {
    console.error("ERROR: 'manageBtn' Didn't found a button owned by this ID.");