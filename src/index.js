import './style/index.css';
import Map from './Map';

const myMap = new Map(document.querySelector('.js-comment'));

ymaps.ready(init);

function init() {
    // инициализация
    myMap.init();
    myMap.map.events.add('click', async e => {
        const coords = e.get('coords');
        const pos = e.get('position');
        const res = await ymaps.geocode(coords);

        myMap.changePopUp(myMap.map, pos[0], pos[1], coords, res.geoObjects.get(0).getAddressLine(), true);
    });
    myMap.clusterer.events.add(['mousedown'], () => myMap.comment.classList.add('visually-hidden'));
    myMap.map.geoObjects.add(myMap.clusterer);
    document.addEventListener('click', e => {
        e.preventDefault();
        e.target.classList.contains('js-add-comment') && myMap.createBalloonAndPlaceMark(e);
        e.target.classList.contains('js-close') && myMap.createParent(e.target).classList.add('visually-hidden');
        if (e.target.classList.contains('js-claster-link')) {
            const coords = e.target.dataset.id.split(',');
            myMap.changePopUp(myMap.map, e.clientX, e.clientY, coords, e.target.textContent);
            myMap.addView(coords.join(''));
        }
    });
    document.addEventListener('keyup', e => {
        if (e.key === 'Escape') {
            const comment = document.querySelector('.js-comment');
            comment.classList.add('visually-hidden');
            myMap.map.balloon.close();
        }
    });
}