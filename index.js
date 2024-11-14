const inputSlider = document.querySelector("[pass-lenSlider]");
const displayLenght = document.querySelector("[pass-lenNumber]");

const displayPassword = document.querySelector("[data-passwordDisplay]");
const msgCopied = document.querySelector("[data-copyMsg]");
const copybtn = document.querySelector("[data-copy]");

const upperCase = document.querySelector("#uppercase");
const lowerCase = document.querySelector("#lowercase");
const Numbers = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");

const indicator = document.querySelector("[data-indicator]");
const generateButton = document.querySelector(".generate-btn");
const allcheckbox = document.querySelectorAll("input[type=checkbox]");

const symbols = '`~^&*$%#@!()/-_=+.,\|:;?<>{}[]';

let Password = "";
let passwordLenght = 10;
let checkboxCount = 0;

handleSlider();
// sets the lenght of the password using slider

function shufflePassword(array){
    //Fisher Yates Method

    for(let i = array.lenght-1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleSlider(){
    inputSlider.value = passwordLenght;
    displayLenght.innerText = passwordLenght;
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    // shadow
}

function getRndInteger(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

// to generate random int from 0 to 9
function generateRndNumber(){
    return getRndInteger(0, 9);
}

function generateLowercase(){
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUppercase(){
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol(){
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum); 
}

function strengthPassword(){
    let hasUpper = false;
    let hasLower = false;
    let hasSymbols = false;
    let hasNumbers = false;

    if(upperCase.checked) hasUpper = true;
    if(lowerCase.checked) hasLower = true;
    if(symbolCheck.checked) hasSymbols = true;
    if(Numbers.checked) hasNumbers = true;

    if(hasUpper && hasLower && (hasNumbers || hasSymbols) && passwordLenght >= 8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNumbers || hasSymbols) && passwordLenght >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00")
    }
}

async function copyContent() {
    try{
        await navigator.clipboard.writeText(displayPassword.value);
        msgCopied.innerText = "Copied!";
    }
    catch(e){
        msgCopied.innerText = "Failed!";
    }

    // to make the copied msg visible
    msgCopied.classList.add("active");

    setTimeout(() => {
        msgCopied.classList.remove("active");
    }, 2000);
    
}

// applying eventListener on the slider w.r.t passwordlength

inputSlider.addEventListener('input', (e)=> {
    passwordLenght = e.target.value;
    handleSlider();
}); 

copybtn.addEventListener('click', () => {
    if(displayPassword.value)
        copyContent();
});


// eventlistener on num of checkbox checked
function handleCheckBoxChange(){
    checkboxCount = 0;

    allcheckbox.forEach((checkbox) => {
        if(checkbox.checked)
            checkboxCount++;
    });

    // special condn when all checkbox are checked but the lenght is less than it
    if(passwordLenght < checkboxCount){
        passwordLenght = checkboxCount;
        handleSlider();
    }
}

allcheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

generateButton.addEventListener('click', () => {
    if(checkboxCount == 0)return;

    if(passwordLenght < checkboxCount){
        passwordLenght = checkboxCount;
        handleSlider();
    }

    // now starting journey to find new password

    // remove old password

    Password = "";

    // putting the stuff into the password based on no. of box checked

    // if(upperCase.checked){
    //     password += generateUppercase();
    // }

    // if(lowerCase.checked){
    //     password += generateLowercase();
    // }

    // if(symbolCheck.checked){
    //     password += generateSymbol();
    // }

    // if(Numbers.checked){
    //     password += generateRndNumber();
    // }

    let funcArr = [];

    if(upperCase.checked){
        funcArr.push(generateUppercase);
    }

    if(lowerCase.checked){
        funcArr.push(generateLowercase);
    }

    if(symbolCheck.checked){
        funcArr.push(generateSymbol);
    }

    if(Numbers.checked){
        funcArr.push(generateRndNumber);
    }

    // compulsory addition
    for (let i = 0; i < funcArr.length; i++){
        Password += funcArr[i]();
    }

    //remaining addition
    for(let i = 0; i < passwordLenght - funcArr.length; i++){
        let randomIdx = getRndInteger(0, funcArr.length);
        Password += funcArr[randomIdx]();
    }

    //shuffle the password
    Password = shufflePassword(Array.from(Password));
    // show on UI
    displayPassword.value = Password;
    //calcStrength of password
    strengthPassword();
    
});
