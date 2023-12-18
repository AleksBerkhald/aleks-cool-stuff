//här hämtas senaste serien när sidan laddas
window.onload = function () {
    fetch('https://xkcd.vercel.app/?comic=latest')
        .then(function (response) {
            //kontrollerar förfrågan och hämta data vid framgång annars logga fel
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('Misslyckades med att hämta senaste serien');
            }
        })
        .then(function (data) {
            //sätter totallt antal serier och visar senaste serien
            totalComics = data.num;
            getComic('latest');
        })
        .catch(function (error) {
            console.error('FEL:', error.message);
        });
};

let currentComicNumber = 0;
let totalComics = 0;

//här är knapparna och vad knapparna ska göra
document.getElementById('forsta').addEventListener('click', () => getComic(1));
document.getElementById('forra').addEventListener('click', () => getComic(currentComicNumber - 1));
document.getElementById('slumpa').addEventListener('click', () => getComic(Math.floor(Math.random() * currentComicNumber) + 1));
document.getElementById('nasta').addEventListener('click', () => getComic(currentComicNumber + 1));
document.getElementById('sista').addEventListener('click', () => getComic('latest'));

//om man är på till exempel vid första eller senaste comicen så kan man inte klicka på förra eller nästa för att stoppa errors
function updateButtons() {
    const forraButton = document.getElementById('forra');
    const nastaButton = document.getElementById('nasta');
    forraButton.disabled = currentComicNumber === 1;
    nastaButton.disabled = currentComicNumber === totalComics || currentComicNumber === 0;
}

//hämtar information om en serie och uppdatera gränssnittet
function getComic(which) {
    fetch('https://xkcd.vercel.app/?comic=' + which)
        .then(function (response) {
            //kontrollerar förfrågan och hämta data vid framgång annars logga fel
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('Serien hittades inte');
            }
        })
        .then(function (data) {
            //lägger till serien i gränssnittet och uppdaterar nuvarande serienummer och knappar
            appendComic(data);
            currentComicNumber = data.num;
            updateButtons();
        })
        .catch(function (error) {
            console.error('FEL:', error.message);
        });
}

//lägger till serien i gränssnittet
function appendComic(data) {
    let MainComic = document.getElementById('mainComic');
    MainComic.innerHTML = '';

    let titel = document.createElement('h1');
    titel.innerHTML = data.title;
    MainComic.appendChild(titel);

    let datum = document.createElement('p');
    try {
        let dateObject = new Date(data.year, data.month - 1, data.day);
        datum.innerHTML = 'Publicerad: ' + dateObject.toLocaleDateString();
    } catch (error) {
        console.error('FEL:', error);
        datum.innerHTML = 'FEL';
    }
    MainComic.appendChild(datum);

    let figure = document.createElement('figure');

    let img = document.createElement('img');
    img.src = data.img;
    img.alt = data.alt;

    let caption = document.createElement('figcaption');
    caption.innerHTML = 'Serienummer: ' + data.num;

    figure.appendChild(img);
    figure.appendChild(caption);

    MainComic.appendChild(figure);
}
