const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//ste strength circle color to grey
setIndicator("#ccc")


// set password length
// is fxn ka kam itna h ki password length ko ui me reflect krwata hai
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    // slider k kitne part ko violet krna h kitne ko nhi krn  color 
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min))+"% 100%"
}
// iska kam itna h ki setindicator ka color set krta hai
function setIndicator(color){
    indicator.style.backgroundColor = color;
    // shadow property
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
// min max k range me ek integer find krk deta h
function getRndInteger(min,max){
    // min->Include
    // max->exclude
    return Math.floor(Math.random() * (max-min)) + min
}
// 0 se 9 k beech me ek random nmbr generate krk deta h 
function generateRandomNumber(){
    return getRndInteger(0,9);
}
// a-z k meech me ek random charactor generate krk deta hai
function generateLowerCase(){
        return String.fromCharCode(getRndInteger(97,123));
}
// A-Z k meech me ek random charactor generate krk deta hai
function generateUpperCase(){
        return String.fromCharCode(getRndInteger(65,91))
}
//ek random charactor generate krk deta hai
function generateSymbol(){
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}
// check box k select k adhar pe unka strength calculate krta h 
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >=8){
        setIndicator("#0f0");
    }
    else if(
        (hasLower || hasUpper) &&
        (hasNum || hasSym) && passwordLength >= 6
    ){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}
// password display ka content copy krta h 
//write text k adhar pr using of promises
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";

    }
    // to make copy wala span visible
    copyMsg.classList.add("active");
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000)
}
function shufflePassword(array){
     //fisher yates method for suffling
     for(let i = array.length  - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
     }
     let str="";
     array.forEach((el) => (str += el));
     return str;
}
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox) =>{
        if(checkbox.checked){
            checkCount++;
        }
    });
    // Speial Condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}
allCheckBox.forEach((checkbox) =>{
    checkbox.addEventListener('change', handleCheckBoxChange);
});
// slider ki value change k liye 
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

// copy button click pr handle krne liye
copyBtn.addEventListener('click', () => {
    // password visible h to copy content in clicpboard
    if(passwordDisplay.value)
       copyContent();
});
 
generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected
    if(checkCount == 0) 
        return;
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the journey to find the new password

    // Remove the old password
    password = "";

    //let's put the stuff mentioned by checkboxes
    // if(uppercaseCheck.checked){
    //     password+=generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password+=generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password+=generateSymbol();
    // }
    let funcArr = [];
    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }
    // Compulsary addition
    for(let i=0;i<funcArr.length;i++){
        password +=funcArr[i]();
    }
    // remaining addition
    for(let i=0; i<passwordLength-funcArr.length;i++){
        let randIndex = getRndInteger(0,funcArr.length);
        password += funcArr[randIndex]();
    }
    //shuffle the password
    password = shufflePassword(Array.from(password));

    //show in ui
    passwordDisplay.value = password;
    //calculate strength
    calcStrength();




});


