
    const defaultProfiles = [
      { name: "Thomas", image: "Peaky Blinders.jpeg" },
      { name: "Leonardo", image: "Leonardo.jpeg" },
      { name: "CR7", image: "Cr7.jpeg" },
      { name: "Mystery", image: "_.jpeg" }
    ];

    function loadProfiles() {
      const profiles = JSON.parse(localStorage.getItem("profiles")) || defaultProfiles;
      const container = document.getElementById("profileContainer");
      container.innerHTML = "";

      profiles.forEach((profile, index) => {
        const div = document.createElement("div");
        div.className = "profile";
        div.innerHTML = `
          <img src="${profile.image}" alt="${profile.name}">
          <div class="name">${profile.name}</div>
          <div class="actions">
            <button class="btn" onclick="editProfile(${index})">Edit</button>
            <button class="btn" onclick="deleteProfile(${index})">Delete</button>
          </div>
        `;
        container.appendChild(div);
      });

      localStorage.setItem("profiles", JSON.stringify(profiles));
    }

    function addProfile() {
      const name = prompt("New Profile Name:");
      if (!name) return;

      const image = prompt("Profile Photo File Name (örnek: Cr7.jpeg):");
      if (!image) return;

      const profiles = JSON.parse(localStorage.getItem("profiles")) || defaultProfiles;
      profiles.push({ name, image });
      localStorage.setItem("profiles", JSON.stringify(profiles));
      loadProfiles();
    }

    function editProfile(index) {
      const profiles = JSON.parse(localStorage.getItem("profiles"));
      const newName = prompt("Add New :", profiles[index].name);
      if (newName) profiles[index].name = newName;

      const newImage = prompt("Add New Image File (example: _.jpeg):", profiles[index].image);
      if (newImage) profiles[index].image = newImage;

      localStorage.setItem("profiles", JSON.stringify(profiles));
      loadProfiles();
    }

    function deleteProfile(index) {
      const profiles = JSON.parse(localStorage.getItem("profiles"));
      if (confirm(`${profiles[index].name} are you sure that you want to delete this profile?`)) {
        profiles.splice(index, 1);
        localStorage.setItem("profiles", JSON.stringify(profiles));
        loadProfiles();
      }
    }
    


const addProfileButton = document.getElementById('addProfileBtn');

if (addProfileButton) {
    addProfileButton.addEventListener('click', function() {
        window.location.href = '../LoginForm/metromovies-loginform.html';
        
      
    });
}