document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const hideIcon = document.getElementById('hidePasswordIcon');
    const showIcon = document.getElementById('showPasswordIcon');

    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    if (!passwordInput || !hideIcon || !showIcon) {
        console.error("error: html elements missing");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('registered') === 'true') {
        const result = document.createElement('div');
        result.className = "msg success";
        result.textContent = "Account created successfully! Please log in.";
        result.style.marginBottom = "15px";
        result.style.textAlign = "center";
        form.insertBefore(result, form.firstChild);

        const registeredEmail = urlParams.get('email');
        if (registeredEmail && emailInput) {
            emailInput.value = decodeURIComponent(registeredEmail);
        }

        window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (urlParams.get('error') === 'invalid_credentials') {
        if (passwordError) {
            passwordError.textContent = "Wrong email or password.";
            passwordError.style.display = "block";
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    const capsLockMsg = document.createElement('span');
    capsLockMsg.id = "capsLockWarning";
    capsLockMsg.className = "caps-lock-inline";
    capsLockMsg.textContent = "CAPS LOCK ON";
    capsLockMsg.style.display = "none";

    const passwordContainer = passwordInput.parentElement;
    if (passwordContainer) {
        passwordContainer.insertBefore(capsLockMsg, hideIcon);
    }

    const checkCapsLock = (event) => {
        if (event.getModifierState("CapsLock")) {
            capsLockMsg.style.display = "inline";
        } else {
            capsLockMsg.style.display = "none";
        }
    };

    passwordInput.addEventListener("keyup", checkCapsLock);
    passwordInput.addEventListener("keydown", checkCapsLock);
    passwordInput.addEventListener("blur", () => {
        capsLockMsg.style.display = "none";
    });
    passwordInput.addEventListener("focus", (event) => {
        if (event.getModifierState("CapsLock")) {
            capsLockMsg.style.display = "inline";
        }
    });


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


    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        emailError.style.display = "none";
        passwordError.style.display = "none";

        const emailVal = emailInput.value.trim();
        const passwordVal = passwordInput.value.trim();
        let hasError = false;

        if (!emailVal) {
            emailError.textContent = "Email is required.";
            emailError.style.display = "block";
            hasError = true;
        } else if (!/^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(emailVal)) {
            emailError.textContent = "Email format is invalid.";
            emailError.style.display = "block";
            hasError = true;
        }

        if (!passwordVal) {
            passwordError.textContent = "Password is required.";
            passwordError.style.display = "block";
            hasError = true;
        } else if (passwordVal.length < 6) {
            passwordError.textContent = "Password must be at least 6 characters.";
            passwordError.style.display = "block";
            hasError = true;
        }

        if (hasError) return;

        const recaptchaResponse = grecaptcha.getResponse();
        const recaptchaError = document.getElementById('recaptchaError');

        if (!recaptchaResponse) {
            if (recaptchaError) {
                recaptchaError.style.display = 'block';
            }
            return;
        }
        if (recaptchaError) {
            recaptchaError.style.display = 'none';
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;

        try {
            submitBtn.textContent = "Logging in...";
            submitBtn.disabled = true;

            const response = await fetch('../php_auth/public/api_login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailVal, password: passwordVal })
            });

            const result = await response.json();

            if (result.success) {
                window.location.href = result.redirect || "../WhosWatching/profile.html";
            } else {
                throw new Error(result.message || "Invalid credentials");
            }

        } catch (error) {
            console.error('Login error:', error);

            passwordError.textContent = error.message;
            passwordError.style.display = "block";

            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    });
});