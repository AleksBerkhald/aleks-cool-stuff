window.onload = function () {
    fetch('https://xkcd.vercel.app/?comic=latest')
        .then(function (response) {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('Failed to fetch latest comic');
            }
        })
        .then(function (data) {
            totalComics = data.num;
            getComic('latest');
        })
        .catch(function (error) {
            console.error('ERROR:', error.message);
        });
};

let currentComicNumber = 0;
let totalComics = 0;

document.getElementById('forsta').addEventListener('click', function () {
    getComic(1);
});

document.getElementById('forra').addEventListener('click', function () {
    if (currentComicNumber > 1) {
        getComic(currentComicNumber - 1);
    }
});

document.getElementById('slumpa').addEventListener('click', function () {
    console.log('Slumpa fungera');
    const randomComicNumber = Math.floor(Math.random() * currentComicNumber) + 1;
    console.log('Slumpat serienummer', randomComicNumber);
    getComic(randomComicNumber);
});

document.getElementById('nasta').addEventListener('click', function () {
    if (currentComicNumber < totalComics) {
        getComic(currentComicNumber + 1);
    }
});

document.getElementById('sista').addEventListener('click', function () {
    getComic('latest');
});

function updateButtons() {
    const forraButton = document.getElementById('forra');
    const nastaButton = document.getElementById('nasta');

    forraButton.disabled = currentComicNumber === 1;
    nastaButton.disabled = currentComicNumber === totalComics || currentComicNumber === 0;
}
function getComic(which) {
    fetch('https://xkcd.vercel.app/?comic=' + which)
        .then(function (response) {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('Comic hittades inte');
            }
        })
        .then(function (data) {
            appendComic(data);
            currentComicNumber = data.num;
            updateButtons();
        })
        .catch(function (error) {
            console.error('ERROR:', error.message);
        });
}

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
        console.error('ERROR:', error);
        datum.innerHTML = 'ERROR';
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
