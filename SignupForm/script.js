document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById("signupForm");
    const nameInput = document.getElementById("name"); 
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmError = document.getElementById("confirmError");
    const result = document.getElementById("result"); 

    const hidePasswordIcon = document.getElementById('hidePasswordIcon');
    const showPasswordIcon = document.getElementById('showPasswordIcon');
    
    const hideConfirmIcon = document.getElementById('hideConfirmIcon'); 
    const showConfirmIcon = document.getElementById('showConfirmIcon'); 

    if (!passwordInput || !confirmPasswordInput || !hidePasswordIcon || !showPasswordIcon || !hideConfirmIcon || !showConfirmIcon) {
        console.error("CRITICAL ERROR: Some HTML elements could not be found. Check the IDs—especially ensure that icon IDs are unique!");
    }

    const setupPasswordToggle = (inputElement, hideIcon, showIcon) => {
        if (!inputElement || !hideIcon || !showIcon) return;

        const toggleVisibility = () => {
            const currentType = inputElement.getAttribute('type');
            
            if (currentType === 'password') {
                inputElement.setAttribute('type', 'text');
                hideIcon.classList.add('hidden');
                showIcon.classList.remove('hidden');
            } else {
                inputElement.setAttribute('type', 'password');
                showIcon.classList.add('hidden');
                hideIcon.classList.remove('hidden');
            }
        };

        hideIcon.addEventListener('click', toggleVisibility);
        showIcon.addEventListener('click', toggleVisibility);
    };

    setupPasswordToggle(passwordInput, hidePasswordIcon, showPasswordIcon);
    setupPasswordToggle(confirmPasswordInput, hideConfirmIcon, showConfirmIcon); 
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
    
            emailError.style.display = passwordError.style.display = confirmError.style.display = "none";
            result.textContent = "";
            result.className = "msg";

            const nameVal = nameInput.value.trim();
            const emailVal = emailInput.value.trim();
            const passwordVal = passwordInput.value.trim();
            const confirmVal = confirmPasswordInput.value.trim();
            let hasError = false;


            if (!nameVal) {
                emailError.textContent = "Emri nuk mund të lihet bosh.";
                emailError.style.display = "block";
                console.error("Emri nuk mund të lihet bosh"); 
                hasError = true;
            }
            

            if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(emailVal)) {
                emailError.textContent = "Adresa e emailit nuk është e vlefshme.";
                emailError.style.display = "block";
                hasError = true;
            }


            const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            
            if (!strongPasswordRegex.test(passwordVal)) {
                passwordError.textContent = "Fjalëkalimi duhet të jetë të paktën 8 karakter, duke përfshirë një shkronjë të madhe, një shkronjë të vogël, një numër dhe bir simbol.";
                passwordError.style.display = "block";
                hasError = true;
            }

            if (passwordVal !== confirmVal) {
                confirmError.textContent = "Fjalëkalimet nuk përputhen.";
                confirmError.style.display = "block";
                hasError = true;
            }

            if (hasError) return;

            result.textContent = "Po krijohet llogaria...";
            result.style.color = "var(--muted)";
            
            setTimeout(() => {
                const firstName = nameInput.value.trim().split(" ")[0] || "Mik"; 
                result.textContent = `Mirësevjen, ${firstName}! (Welcome, ${firstName}!)`;
                result.classList.add("success");
            }, 900);
        });
    }
});