document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    
    const hideIcon = document.getElementById('hidePasswordIcon');
    const showIcon = document.getElementById('showPasswordIcon');

    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    if (!passwordInput || !hideIcon || !showIcon) {
        console.error("CRITICAL ERROR: One or more HTML elements (password input or icons) were not found. CHECK YOUR IDs!");
        return; 
    }
    
   
    const togglePasswordVisibility = () => {
        const currentType = passwordInput.getAttribute('type');
        
        if (currentType === 'password') {

            passwordInput.setAttribute('type', 'text');
            hideIcon.classList.add('hidden');   
            showIcon.classList.remove('hidden'); 
        } else {
      
            passwordInput.setAttribute('type', 'password');
            showIcon.classList.add('hidden');  
            hideIcon.classList.remove('hidden'); 
        }
    };


    hideIcon.addEventListener('click', togglePasswordVisibility);
    showIcon.addEventListener('click', togglePasswordVisibility);

  
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        

        emailError.style.display = "none";
        passwordError.style.display = "none";

        const emailVal = emailInput.value.trim();
        const passwordVal = passwordInput.value.trim();
        let hasError = false;


        if (!emailVal) {
            emailError.textContent = "Email është i nevojshëm.";
            emailError.style.display = "block";
            hasError = true;
        } else if (!/^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(emailVal)) {
            emailError.textContent = "Formati i email-it është i pavlefshëm.";
            emailError.style.display = "block";
            hasError = true;
        }


        if (!passwordVal) {
            passwordError.textContent = "Fjalëkalimi është i nevojshëm.";
            passwordError.style.display = "block";
            hasError = true;
        } else if (passwordVal.length < 6) {
            passwordError.textContent = "Fjalëkalimi duhet të ketë të paktën 6 karaktere.";
            passwordError.style.display = "block";
            hasError = true;
        }

        if (hasError) return; 
        setTimeout(() => {
            window.location.href = "../Interface MainPage/index.html"; 
        }, 800);

    });
});