document.addEventListener('DOMContentLoaded', () => {

    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    if (emailParam) {
        const emailInput = document.getElementById("email");
        if (emailInput) {
            emailInput.value = decodeURIComponent(emailParam);
        }
    }


    const form = document.getElementById("signupForm");
    const firstNameInput = document.getElementById("firstName");
    const surnameInput = document.getElementById("surname");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmError = document.getElementById("confirmError");
    const result = document.getElementById("result");


    const passwordStrength = document.getElementById("passwordStrength");
    const strengthFill = document.getElementById("strengthFill");
    const strengthText = document.getElementById("strengthText");

    const hidePasswordIcon = document.getElementById('hidePasswordIcon');
    const showPasswordIcon = document.getElementById('showPasswordIcon');

    const hideConfirmIcon = document.getElementById('hideConfirmIcon');
    const showConfirmIcon = document.getElementById('showConfirmIcon');

    if (!passwordInput || !confirmPasswordInput || !hidePasswordIcon || !showPasswordIcon || !hideConfirmIcon || !showConfirmIcon) {
        console.error("CRITICAL ERROR: Some HTML elements could not be found. Check the IDs—especially ensure that icon IDs are unique!");
    }


    const createCapsLockWarning = (inputElement) => {
        if (!inputElement || !inputElement.parentElement) return;

        const capsLockMsg = document.createElement('div');
        capsLockMsg.className = "caps-lock-warning";
        capsLockMsg.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M7.27 1.047a1 1 0 0 1 1.46 0l6.345 6.77c.6.638.146 1.683-.73 1.683H11.5v1a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1H1.654C.78 9.5.326 8.455.926 7.816L7.27 1.047zM14.346 8.5 8 1.731 1.654 8.5H4.5a1 1 0 0 1 1 1v2.5a1 1 0 0 1-1 1h-1v3a1 1 0 0 1-1 1h8a1 1 0 0 1 1-1v-3h-1a1 1 0 0 1-1-1v-2.5a1 1 0 0 1 1-1h2.846z"/>
            </svg>
            <span>CAPS LOCK is On</span>
        `;


        inputElement.parentElement.parentNode.insertBefore(capsLockMsg, inputElement.parentElement.nextSibling);

        const checkCapsLock = (event) => {
            if (event.getModifierState("CapsLock")) {
                capsLockMsg.style.display = "flex";
            } else {
                capsLockMsg.style.display = "none";
            }
        };

        inputElement.addEventListener("keyup", checkCapsLock);
        inputElement.addEventListener("mousedown", checkCapsLock);
        inputElement.addEventListener("blur", () => {
            capsLockMsg.style.display = "none";
        });
        inputElement.addEventListener("focus", (event) => {
            if (event.getModifierState("CapsLock")) {
                capsLockMsg.style.display = "flex";
            }
        });
    };

    createCapsLockWarning(passwordInput);
    createCapsLockWarning(confirmPasswordInput);


    const checkPasswordStrength = (password) => {
        let strength = 0;
        let feedback = [];


        if (password.length >= 8) {
            strength += 1;
        } else {
            feedback.push("at least 8 characters");
        }


        if (/[A-Z]/.test(password)) {
            strength += 1;
        } else {
            feedback.push("uppercase letter");
        }


        if (/[a-z]/.test(password)) {
            strength += 1;
        } else {
            feedback.push("lowercase letter");
        }


        if (/\d/.test(password)) {
            strength += 1;
        } else {
            feedback.push("number");
        }


        if (/[@$!%*?&]/.test(password)) {
            strength += 1;
        } else {
            feedback.push("symbol (@$!%*?&)");
        }

        return { strength, feedback };
    };

    const updateStrengthIndicator = () => {
        const password = passwordInput.value;

        if (password.length === 0) {
            passwordStrength.style.display = "none";
            passwordError.style.display = "none";
            return;
        }

        passwordStrength.style.display = "flex";
        const { strength, feedback } = checkPasswordStrength(password);


        strengthFill.className = "strength-fill";
        strengthText.className = "strength-text";

        if (strength <= 2) {

            strengthFill.classList.add("weak");
            strengthText.classList.add("weak");
            strengthText.textContent = "Weak";


            if (feedback.length > 0) {
                passwordError.innerHTML = `<span style="color: #ff6b6b;">Add: ${feedback.join(", ")}</span>`;
                passwordError.style.display = "block";
            }
        } else if (strength <= 4) {

            strengthFill.classList.add("medium");
            strengthText.classList.add("medium");
            strengthText.textContent = "Medium";

            if (feedback.length > 0) {
                passwordError.innerHTML = `<span style="color: #ffcc00;">Add: ${feedback.join(", ")}</span>`;
                passwordError.style.display = "block";
            } else {
                passwordError.style.display = "none";
            }
        } else {

            strengthFill.classList.add("strong");
            strengthText.classList.add("strong");
            strengthText.textContent = "Strong ✓";
            passwordError.style.display = "none";
        }
    };

    passwordInput.addEventListener('input', updateStrengthIndicator);


    const checkMatch = () => {
        const pass = passwordInput.value;
        const confirm = confirmPasswordInput.value;

        if (confirm.length > 0) {
            if (pass !== confirm) {
                confirmError.textContent = "Passwords do not match.";
                confirmError.className = "msg error";
                confirmError.style.display = "block";
            } else {

                confirmError.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style="vertical-align: middle; margin-right: 6px;">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                    Passwords match!
                `;
                confirmError.className = "msg success";
                confirmError.style.display = "block";
            }
        } else {
            confirmError.style.display = "none";
        }
    };

    passwordInput.addEventListener('input', checkMatch);
    confirmPasswordInput.addEventListener('input', checkMatch);

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
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            emailError.style.display = passwordError.style.display = confirmError.style.display = "none";
            result.textContent = "";
            result.className = "msg";

            const firstNameVal = firstNameInput.value.trim();
            const surnameVal = surnameInput.value.trim();
            const emailVal = emailInput.value.trim();
            const passwordVal = passwordInput.value.trim();
            const confirmVal = confirmPasswordInput.value.trim();
            let hasError = false;

            if (!firstNameVal) {
                emailError.textContent = "Name cannot be empty.";
                emailError.style.display = "block";
                hasError = true;
            }

            if (!surnameVal) {
                emailError.textContent = "Surname cannot be empty.";
                emailError.style.display = "block";
                hasError = true;
            }

            if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(emailVal)) {
                emailError.textContent = "Email address is not valid.";
                emailError.style.display = "block";
                hasError = true;
            }

            const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

            if (!strongPasswordRegex.test(passwordVal)) {
                passwordError.textContent = "Password must be at least 8 characters, including one uppercase letter, one lowercase letter, one number and one symbol.";
                passwordError.style.display = "block";
                hasError = true;
            }

            if (passwordVal !== confirmVal) {
                confirmError.textContent = "Passwords do not match.";
                confirmError.style.display = "block";
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

                submitBtn.textContent = "Creating account...";
                submitBtn.disabled = true;
                result.textContent = "Creating account...";
                result.style.color = "var(--muted)";


                if (window.MetroMoviesAuth) {
                    window.MetroMoviesAuth.init();
                }


                const data = await window.MetroMoviesAuth.signUp(emailVal, passwordVal, firstNameVal, surnameVal);

                if (data && data.user) {

                    if (data.user.identities && data.user.identities.length === 0) {
                        result.textContent = "This email is already registered!";
                        result.className = "msg error";
                        submitBtn.textContent = originalBtnText;
                        submitBtn.disabled = false;
                        return;
                    }

                    result.textContent = "Account created! Please check your email to verify, then log in.";
                    result.className = "msg success";


                    setTimeout(() => {
                        window.location.href = "../LoginForm/metromovies-loginform.html?registered=true&email=" + encodeURIComponent(emailVal);
                    }, 2000);
                }
            } catch (error) {
                console.error('Signup error:', error);


                if (error.message.includes('already registered') || error.message.includes('already exists')) {
                    result.textContent = "This email is already registered!";
                } else if (error.message.includes('valid email')) {
                    result.textContent = "Please enter a valid email address.";
                } else if (error.message.includes('password')) {
                    result.textContent = "Password is too weak. Please choose a stronger password.";
                } else {
                    result.textContent = error.message || "Signup failed. Please try again.";
                }
                result.className = "msg error";


                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});