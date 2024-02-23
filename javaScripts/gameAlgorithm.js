let arrayOfWords = [];
let copyArray;
let timesBeen = [];

var pochwaly = ["Dobrze!", "Nieźle!", "Całkiem calkiem!", "Tak trzymaj!", "Udało się!"];
var policzek = ["Nie tym razem!", "Prawie!", "Postaraj się...", "Prawie było", "Ahhhh..."];
let multiplication = 0;




/* Animations */
const tl = gsap.timeline({defaults: {duration: 0.18, ease: "power1.out"}});
    // tl.fromTo('.instruction', {y : -500, opacity: 0}, {y: 0, opacity: 1, duration: 0.50});
    tl.fromTo('.title', {y: -30, opacity: 0}, {y: 0, opacity: 1, duration: 0.40}) 

    var tr = document.querySelectorAll('.instruction span');
    tr.forEach(function(element) {
        tl.fromTo(element, {y: -30, opacity: 0}, {y: 0, opacity: 1, duration: 0.20})
    })
    tl.to(".close-button", {y: -8, yoyo: true, duration: 0.60, scale: 1.2, repeat: -1}, {y: 0})
    


let actualWord, frequency = 1, indexChecked = 0, genNumber;
let queueType = true;
displayLocalstorageWords();

//Klawisz enter listener
document.addEventListener('keydown', function getEnter(event) {
    if (event.key === 'Enter') 
        checkIfCorrect();
}); 

/*zapis pierwszego stage*/
const firstStage = {
        st1 : document.querySelector('#words').innerHTML,
        st2 : document.querySelector('.words-div').innerHTML,
        st3 : document.querySelector('.secondBody').innerHTML
    }
localStorage.setItem("firstStage", JSON.stringify(firstStage));

/*Instrukcja*/
const closeInstructionsButtons = document.querySelectorAll('[data-instruction-close]');


closeInstructionsButtons.forEach(button => {
    button.addEventListener('click', () => {
        const instruction = button.closest('.instruction');
        closeInstruction(instruction);
    })
})

function closeInstruction(instruction) {
    if (instruction == null) return
    instruction.classList.remove('active');
    document.querySelector('.container1').style.opacity = 1;
    document.querySelector('.container1').style.pointerEvents = 'all';
    document.querySelector('.container2').style.opacity = 1;
    // document.querySelector('.words-div2').style.opacity = 1;
    // document.querySelector('.secondBody').style.opacity = 1;
    document.querySelector('.container2').style.pointerEvents = 'all';

    // const ele = gsap.timeline();
    // ele.fromTo('.container3', {y: -30, opacity: 0}, {y: 0, opacity: 1, duration: 0.30}) 
    // ele.fromTo('.words-div2', {y: -30, opacity: 0}, {y: 0, opacity: 1, duration: 0.30}) 
    // ele.fromTo('.secondBody', {y: -30, opacity: 0}, {y: 0, opacity: 1, duration: 0.30}) 


}

function getWords() {
    // gsap.fromTo('body', {x: 0, opacity: 1}, {x: -300, opacity: 0});
    if (localStorage.getItem("words") !== null) 
        arrayOfWords = JSON.parse(localStorage.getItem("words"));
    
    const w1 = document.querySelectorAll('#w1');
    const t1 = document.querySelectorAll('#t1');
    
    for (let i = 0; i < t1.length; i++) {
        const woEn = w1[i].value;
        const woPl = t1[i].value;

        let ob = {
            english: woEn,
            polish: woPl
        };
        if (woEn != ""  &&  woPl != "") 
            arrayOfWords.push(ob);
    }

    localStorage.setItem("words", JSON.stringify(arrayOfWords));
    timesBeen.length = arrayOfWords.length;
    timesBeen.fill(0);

    document.querySelector('.container').innerHTML = ` <div class="row">
                                                        <div class="input-group my-2 col-lg-6"> 
                                                            <input type="text" class="form-control play" name="word"  placeholder="English word - " disabled>
                                                        </div>
                                                        <div class="input-group my-2 col-lg-6"> 
                                                            <input type="text" class="form-control play" name="answear" placeholder="Your answear"> 
                                                        </div>
                                                        <div class="summary">
                                                            <button type="button" onclick="goBack()" class="btn btn-light checkButton">Powrót</button> 
                                                            <button type="button" onclick="switchLabel()" class="btn btn-light checkButton mx-2"><img src="icons/DataTransfer.png" width="20" style="scale: 1.6;"></button> 
                                                            <button type="button" onclick="checkIfCorrect()" class="do-not-hide-keyboard btn btn-primary checkButton">Sprawdź</button>

                                                        </div>
                                                       <div class="Score">
                                                        <div class="Score">
                                                        </div>
                                                    </div>`;
    document.querySelector('.score').innerHTML = `<div class="cards">
                                                    <div class="card-body correct">
                                                        Correct <br>
                                                        <div id="correctPoints">0</div>
                                                    </div>
                                
                                                    <div class="card-body wrong">
                                                        Wrong <br>
                                                        <div id="wrongPoints">0</div>
                                                    </div>`;                                               
                                                

    dontHideKeyboardMobile();
    playGame();
}

function addRowForWord() {
    const w1 = document.querySelector('#w1');
    const t1 = document.querySelector('#t1');

    let arrayLocal = [];
    if (localStorage.getItem("words") !== null) 
        arrayLocal = JSON.parse(localStorage.getItem("words"))

    let ob = {
        english: w1.value,
        polish: t1.value
    };

    arrayLocal.push(ob);
    console.log(arrayLocal);
    localStorage.setItem("words", JSON.stringify(arrayLocal));
    document.querySelector('#w1').value = "";
    document.querySelector('#t1').value = "";

    displayLocalstorageWords();

    // let z = document.createElement('div');
    // z.classList.add('input-group');
    // z.classList.add('my-2');

    // let a = document.createElement('div');           
    // z.innerHTML = `${document.querySelector('.wordsInputs').innerHTML}`;
    // document.querySelector('.row').appendChild(z);          


}

function playGame() {
    document.querySelector('.words-div').innerHTML = ``;
    // document.querySelector('.secondBody').innerHTML = '';
    document.querySelector('.secondBody').style.display = "none";
    document.querySelector('.footer-basic').style.marginTop = "20%";
    document.getElementsByName('answear')[0].value = "";

    genNumber = (Math.floor(Math.random() * arrayOfWords.length));
    let generatedWord = arrayOfWords[genNumber];

    while (frequency === timesBeen[genNumber]) {
        // console.log("losuje ponownie");
        genNumber = Math.floor(Math.random() * arrayOfWords.length);
        generatedWord = arrayOfWords[genNumber];
    }
    // console.log('wylosowany numer - ' + genNumber);
    timesBeen[genNumber]++;
    indexChecked++;
    // console.log(timesBeen);

   
    if (check()) 
        frequency++;
    
    function check() {
        let previousNumber = timesBeen[0];
        for (let i = 1; i < timesBeen.length; i++) {
            if (previousNumber !== timesBeen[i]) {
                return false;
            }
            previousNumber = timesBeen[i];
        }
        return true;
    }
    // console.log(timesBeen);
    // console.log("index checkek" + indexChecked + "    lenght " + timesBeen.length);
    // console.log("Największę frequency to - " + frequency);
    actualWord = generatedWord;

    if (queueType)
        document.getElementsByName('word')[0].placeholder = generatedWord.english;
    else
        document.getElementsByName('word')[0].placeholder = generatedWord.polish;

}

function checkIfCorrect() {
    let answerUser = document.getElementsByName('answear')[0].value;

    if ((answerUser.toLowerCase() === actualWord.polish.toLowerCase()  &&  queueType)  ||
        (answerUser.toLowerCase() === actualWord.english.toLowerCase() &&  !queueType)) {
        gsap.fromTo('#correctPoints', {y: -30, scale: 1.3, duration: 0.70, yoyo: true, repeat: 1}, {y: 0, scale: 1});

        multiplication++;

        let genPoint = JSON.parse(localStorage.getItem("generalPoints"));
        let corr = document.getElementById('correctPoints').innerText;
        if (document.querySelector('.combo').style.opacity == 0) {
            corr++;
            genPoint++;
        } 
        if (multiplication >= 3  &&  multiplication < 5) {
            document.querySelector('.combo').style.opacity = 1;
            corr++;
            corr++;
            genPoint++;
            genPoint++;
        }
        if (document.querySelector('.combo').style.opacity == 1  &&  multiplication >= 5  &&  multiplication < 10) {
            document.querySelector('.combo').style.setProperty('-webkit-animation-duration', '0.5s');
            document.querySelector('#com').innerText = `Combo X3!`;

            corr++;
            corr++;
            corr++;
            genPoint++;
            genPoint++;
            genPoint++;
        }
        if (document.querySelector('.combo').style.opacity == 1  &&  multiplication >= 10) {
            document.querySelector('.combo').style.setProperty('-webkit-animation-duration', '0.2s');
            document.querySelector('#com').innerText = `Combo X5!!!`;

            corr++;
            corr++;
            corr++;
            corr++;
            corr++;
            genPoint++;
            genPoint++;
            genPoint++;
            genPoint++;
            genPoint++;
        }
       

        document.getElementById('correctPoints').innerText = `${corr}`;
        document.getElementById("generalPoints").innerText = `${genPoint}`;
        localStorage.setItem("generalPoints", JSON.parse(genPoint));
     
        say(true);
        hideSuggestion(true);       
        playGame();
    } else {
        multiplication = 0;
        document.querySelector('.combo').style.opacity = 0;
        document.querySelector('.combo').style.setProperty('-webkit-animation-duration', '0.7s');
        document.querySelector('#com').innerText = `Combo X2!`;


        gsap.fromTo('#wrongPoints', {y: -30, scale: 1.3, duration: 0.70, yoyo: true, repeat: 1}, {y: 0, scale: 1});
        say(false);
        hideSuggestion(false);
        const shouldRepeat = Math.random() >= 0.5;
        if (shouldRepeat) {
            playGame();
        } else {
            document.getElementsByName('answear')[0].value = "";
            if (queueType)
                document.getElementsByName('word')[0].placeholder = actualWord.english;
            else
                document.getElementsByName('word')[0].placeholder = actualWord.polish;

        }
        let corr = document.getElementById('wrongPoints').innerText;
        corr++;
        document.getElementById('wrongPoints').innerText = `${corr}`;
    }
}

function displayLocalstorageWords() {
    document.getElementById("generalPoints").innerText = JSON.parse(localStorage.getItem("generalPoints"));
    if (document.getElementById("generalPoints").innerText < 100) {
        document.getElementById("tournamentButton").disabled = true;
    }

    if (localStorage.getItem("words") !== null) {
        let words = JSON.parse(localStorage.getItem("words"));
        let word = `<li>WORDS IN OUR DATABASE</li>`;
        
        for (let i = 0; i < words.length; i++) {
            if (i == 0) 
                word += "\n";
            word += `<li>${words[i].english} - ${words[i].polish}</li>`;
        }
        document.querySelector('.words-div2').innerHTML = word;
    }
}

function hideSuggestion(type) {
    if (type) {
        document.querySelector('.alert').classList.remove('alert-danger');
        document.querySelector('.alert').classList.add('alert-success');
        document.querySelector('.alert').innerText = `Dobrze! ${actualWord.english + " - " + actualWord.polish}`;

        document.querySelector('.suggestions').style.display = "block";
    } else {
        document.querySelector('.alert').classList.remove('alert-success');
        document.querySelector('.alert').classList.add('alert-danger');
        document.querySelector('.alert').innerText = `ZLE! ${actualWord.english + " - " + actualWord.polish}`;

        document.querySelector('.suggestions').style.display = "block";
    }

    setTimeout(() => {
        document.querySelector('.suggestions').style.display = "none";
    }, 4000);
}

function switchLabel() {
        const newWord = document.getElementsByName('answear')[0];
        const newAns = document.getElementsByName("word")[0];

    if (queueType) {
        queueType = false;
        newAns.removeAttribute("disabled");
        newAns.placeholder = 'Your answear';
        newAns.setAttribute("name", "answear");
        
        newWord.setAttribute("name", "word");
        newWord.setAttribute("disabled", "");
        newWord.placeholder = actualWord.polish;
        // newWord.placeholder = "";
    } else {
        queueType = true;
        newWord.setAttribute("disabled", "");
        newWord.placeholder = actualWord.english;
        // newWord.placeholder = "";
        newWord.setAttribute("name", "word");
        
        newAns.setAttribute("name", "answear");
        newAns.removeAttribute("disabled");
        newAns.placeholder = "Your answear";
    }

    // playGame();
}

function goBack() {
    const ft = localStorage.getItem("firstStage");
    const st1 = JSON.parse(ft);
    document.querySelector('.combo').style.opacity = 0;

    

    document.querySelector('.cards').innerHTML = ``;
    document.querySelector('.container').innerHTML = st1.st1;
    document.querySelector('.words-div').innerHTML = st1.st2;
    document.querySelector('.footer-basic').style.marginTop = "5%";
    // document.querySelector('.secondBody').innerHTML = st1.st3;
    document.querySelector('.secondBody').style.display = "block";

    if (JSON.parse(localStorage.getItem("generalPoints")) >= 100) {
        document.getElementById("tournamentButton").disabled = false;
    }

    displayLocalstorageWords();

    // location.reload();
}

function getPropose(name) {
    copyArray = [];
    if (localStorage.getItem("words") !== null) 
        copyArray = JSON.parse(localStorage.getItem('words'));
    arrayOfWords = [];

    let wordsHTML = document.getElementsByName(`${name}`)[0].innerText;
    const wo = wordsHTML.split("\n");

    for (let i = 0; i < wo.length; i++) {
        const w1 = wo[i].split(' - ');

        let ob = {
            english: w1[0],
            polish: w1[1]
        };
        arrayOfWords.push(ob);
    }

    let fillCopyArray = [];
    for (let i = 0; i < copyArray.length; i++) {
        fillCopyArray += `<li>${copyArray[i].english + " - " + copyArray[i].polish}</li>`;
        
    }
    document.getElementsByName(`${name}`)[0].innerHTML = fillCopyArray;
    

    localStorage.setItem("words", JSON.stringify(arrayOfWords));
    timesBeen.length = arrayOfWords.length;
    timesBeen.fill(0);

    displayLocalstorageWords();
}

function dontHideKeyboardMobile() {
    console.log("Zapobiegam chowaniu sie klawiatury")
    const acceptsInput = (elem) => {
        if (!elem) { return false }
      
        let tag = elem.tagName
        return tag == 'INPUT' || tag == 'SELECT' || tag == 'TEXTAREA' || elem.isContentEditable || elem.tabIndex >= 0
      }
      
      document.addEventListener('touchend', (e) => {
        let target = e.target
        let dontDiscardKeyboard = target.classList.contains('do-not-hide-keyboard')
      
        // On iOS tapping anywhere doesn’t
        // automatically discard keyboard
        if (dontDiscardKeyboard) {
         e.preventDefault();
         checkIfCorrect();
         // DO ACTION HERE
        } else if (!acceptsInput(target)) {
         document.activeElement.blur()
        }
      })
      
}

function say(czyDobrze) {
    document.querySelector('.motivate').style.left = `${Math.floor(Math.random() * 30) + 30}%`;

    if (czyDobrze) {
        document.querySelector('.motivate').innerText = `${pochwaly[Math.floor(Math.random() * pochwaly.length)]}`;
        gsap.fromTo('.motivate', {y: 150, scale: 1.3, opacity: 1, color: "green"}, {y: -150, scale: 1, duration: 2.00, opacity: 0});
    } else {
        document.querySelector('.motivate').innerText = `${policzek[Math.floor(Math.random() * policzek.length)]}`;
        gsap.fromTo('.motivate', {y: 150, scale: 1.3, opacity: 1, color: "red"}, {y: -150, scale: 1, duration: 2.00, opacity: 0});
    }

}