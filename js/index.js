
const btnInit = document.querySelector(".btn-init");
const addWord = document.querySelector(".add-word");
let word = '';
let inicio = false;
let erros = [];
let count = 14; 
let words = [];


(async () => {
    words = await fetch('https://raw.githubusercontent.com/trainingOracle/jogo-da-forca/main/js/wordlist_pt_br.txt')
    .then(response => response.text())
    .then((response) => response.split('\n'))
    .catch(err => ['ERRO']);
})();


const reset = (desistir) => {
    for(let i = 14; i < 24; i++) {
        document.getElementById(`r${i}`).style.background = 'white';
    }
    count = 14;
    document.querySelector('.msg-final').innerHTML = '';
    document.querySelector('.erros').innerHTML = erros = [];
    document.getElementById('new-word').style.display = desistir ? 'block' : 'none';
    document.getElementById('add-word').style.display = desistir ? 'block' : 'none';
    document.getElementById('desistir').style.display = desistir ? 'none' : 'block';
}


btnInit.addEventListener('click', async () => {
    btnInit.textContent = 'NOVO JOGO';
    const index = Math.floor(Math.random() * words.length);
    word = words[index];
    const secret = document.querySelector(".word-secret");
    secret.innerHTML = '';
    for(let i = 0; i < word.length; i++) {
        const value = word[i] == '-' ? '- ' : word[i] == '\'' ? '\' ' : '_ ';
        secret.innerHTML += value;
    }
    inicio = true;
    reset(false); 
});


document.getElementById('desistir').addEventListener('click', () => {
    reset(true);
    document.querySelector(".word-secret").innerHTML = '';
    inicio = false;
});


document.querySelector("body").addEventListener('keypress', (e) => {

    const letra = e.key.toUpperCase();
    if(!letra.match(/[A-Z]/i) || erros.length === 10 || !inicio) return;
    if(word.indexOf(letra) < 0 && erros.indexOf(letra) < 0) {
        erros.push(letra);       
        document.querySelector('.erros').innerHTML = erros.join(' ');
        document.getElementById(`r${count++}`).style.background = 'black';
        gameOver(null);
        return;
    }    
    const secret = document.querySelector(".word-secret");
    secret.innerHTML = word.split('').map((l,i) => {
        if(l === letra) return '<u>'+l+'</u>'+' ';
        else return '<u>'+secret.textContent.replace(/\s+/g, '').split('')[i]+'</u>'+' ';
    }).join('');
    const resp = secret.textContent.replace(/\s+/g, '');
    gameOver(resp);
});


addWord.addEventListener('click', async () => {
    const newWord = document.querySelector("#new-word");
    if(!/\S/.test(newWord.value)) return;
    if(words.indexOf(newWord.value) >= 0) {
        alert(`A palavra ${newWord.value} já existe na lista de palavras!`)
        return;
    }
    words.push(newWord.value);    
    newWord.value = "";
});


const gameOver = (resp) => {
    if(erros.length === 10 || resp == word) {
        document.querySelector('.msg-final').style.color = (resp == word) ? 'green' : 'red';
        document.querySelector('.msg-final').innerHTML = (resp == word) ? 
                        'Você Venceu. Parabéns!' : 'Você perdeu!';
        inicio = false;
        document.getElementById('new-word').style.display = 'block';
        document.getElementById('add-word').style.display = 'block';
        document.getElementById('desistir').style.display = 'none';
    }
}


const getWord = () => {
    const newWord = document.querySelector("#new-word");
    newWord.value = newWord.value.replace(/[^A-Z]/ig,"").toUpperCase();
}
