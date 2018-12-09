import './style/index.css';
import commentCard from './templates/commentCard.hbs';
import commentTemplate from './templates/comment.hbs';

const comment = document.querySelector('.js-comment');
const commentListMain = comment.querySelector('.js-comment-list');
//comment.style.display = 'none';
const address = comment.querySelector('.js-address');
const btnAdd = comment.querySelector('.first-btn');
const firstComment = comment.querySelector('.js-first-comment').cloneNode(true);

function createParent(parent, value = 'js-comment') {
    do {
        if (parent.parentNode) {
            if (parent.classList.contains(value)) {
                return parent;
            }
        } else {
            return null;
        }

    } while (parent = parent.parentNode);
}

let clusterer;
let MyBalloonLayout;
let myMap;
let commentsArray = [];
ymaps.ready(init);

function init() {
    myMap = new ymaps.Map('map', {
        center: [55.75, 37.62],
        zoom: 12,
        controls: ['zoomControl'],
        behaviors: ['drag']
    });

    clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterBalloonContentLayout: "cluster#balloonCarousel",
    });

    myMap.geoObjects.add(clusterer);
    clusterer.events.add(['mousedown'], (e) => {
        comment.classList.add('visually-hidden');
    });


    function createBalloon(e) {
        const parent = createParent(e.target);

        if (!parent) return;
        const coords = parent.dataset.id.split(',');
        const commentList = parent.querySelector('.js-comment-list');
        let commentForm = parent.querySelector('.js-comment-form').elements;
        commentForm = [...commentForm].filter(el => el.name);
        const commentParam = {};
        const isComplete = commentForm.every(el => el.value.length);
        const date = new Date();
        let options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        };
        if (!isComplete) {
            return;
        }
        commentParam.comment = {
            date: date.toLocaleString('ru-Ru', options),
        };
        commentParam.date = date.toLocaleString('ru-Ru', options);
        commentParam.coords = coords;
        commentForm.forEach(el => commentParam.comment[el.name] = el.value);
        commentsArray.push(commentParam);
        const html = commentsArray
            .filter(el => el.coords.join('') === coords.join(''))
            .map(el => el.comment);
        if (html.length) {
            commentList.innerHTML = commentTemplate(html);
        }

        commentForm.forEach(el => el.value = '');
        const time = {
            timezone: 'UTC',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };
        const param = {...options, ...time};
        // placemark
        const placemark = new ymaps.Placemark(coords, {
            hintContent: `${parent.dataset.address}`,
            balloonContent: '<div>' +
            `    <p>${commentParam.comment.place}</p>` +
            `    <a href="" class="claster-link js-claster-link" data-id=${coords}>${parent.dataset.address}</a>` +
            `    <p>${commentParam.comment.message}</p>` +
            `    <span>${date.toLocaleString('ru-Ru', param)}</span>` +
            '</div>'
        }, {
            iconLayout: 'default#image',
            iconImageHref: 'src/img/pin.png',
            iconImageSize: [44, 66],
            iconImageOffset: [-22, -66],
            balloonShadow: false,
            balloonLayout: MyBalloonLayout,
            balloonPanelMaxMapArea: 0,
            hideIconOnBalloonOpen: false,
            balloonOffset: [0, -50]
        });

        placemark.events.add('balloonopen', function (e) {
            const coords = placemark.geometry.getCoordinates();
            ymaps.geocode(coords)
                .then(res => {
                    const parent = document.querySelector('.js-comment');
                    const commentList = parent.querySelector('.js-comment-list');
                    const header = parent.querySelector('.comment__subtitle');
                    parent.dataset.id = coords;
                    header.textContent = res.geoObjects.get(0).getAddressLine();
                    parent.dataset.address = res.geoObjects.get(0).getAddressLine();
                    const html = commentsArray
                        .filter(el => el.coords.join('') === coords.join(''))
                        .map(el => el.comment);
                    if (html.length) {
                        commentList.innerHTML = commentTemplate(html);
                    }
                })
        });
        clusterer.add(placemark);
    }


    MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
        commentCard(), {
            build: function () {
                this.constructor.superclass.build.call(this);
                this._$element = $('.js-comment', this.getParentElement());
                this.applyElementOffset();
                this._$element.find('.js-add-baloon')
                    .on('click', $.proxy((e) => {
                        e.preventDefault();
                        createBalloon(e);
                    }, this));
            },

            clear: function () {
                this._$element.find('.close')
                    .off('click');
                this.constructor.superclass.clear.call(this);
            },

            onSublayoutSizeChange: function () {
                MyBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);
                if (!this._isElement(this._$element)) {
                    return;
                }
                this.applyElementOffset();
                this.events.fire('shapechange');
            },

            applyElementOffset: function () {
                this._$element.css({
                    left: -(this._$element[0].offsetWidth / 2),
                    top: -(this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight)
                });
            },

            onCloseClick: function (e) {
                e.preventDefault();
                this.events.fire('userclose');
            },

            getShape: function () {
                if (!this._isElement(this._$element)) {
                    return MyBalloonLayout.superclass.getShape.call(this);
                }
                var position = this._$element.position();
                return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
                    [position.left, position.top], [
                        position.left + this._$element[0].offsetWidth,
                        position.top + this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight]
                ]));
            },

            _isElement: function (element) {
                return element && element[0] && element.find('.arrow')[0];
            }
        }
    );
    myMap.events.add('click', async e => {
        myMap.balloon.close();
        let coords = e.get('coords');
        const pos = e.get('position');
        commentListMain.innerHTML = '';
        commentListMain.appendChild(firstComment);
        comment.style.left = `${pos[0]}px`;
        comment.style.top = `${pos[1]}px`;
        comment.dataset.id = coords;
        comment.classList.remove('visually-hidden');
        address.textContent = '';
        ymaps.geocode(coords).then(function (res) {
            address.textContent = res.geoObjects.get(0).getAddressLine();
            comment.dataset.address = res.geoObjects.get(0).getAddressLine();
        });
    });

    document.addEventListener('click', addPin);

    function addPin(e) {
        e.preventDefault();
        if (e.target.classList.contains('js-add-comment')) {
            createBalloon(e);
        }
        if (e.target.classList.contains('js-claster-link')) {
            myMap.balloon.close();
            comment.classList.remove('visually-hidden');
            comment.style.left = `${e.clientX + 250}px`;
            comment.style.top = `${e.clientY - 58 }px`;
            comment.dataset.address = e.target.textContent;
            comment.dataset.id = e.target.dataset.id.split(',');
            commentListMain.innerHTML = '';
            address.innerHTML = e.target.textContent;
            const html = commentsArray
                .filter(el => {
                    return el.coords.join('') === e.target.dataset.id.split(',').join('');
                })
                .map(el => el.comment);
            if (html.length) {
                commentListMain.innerHTML = commentTemplate(html);
            }
        }
    }
}

// Закрыть popup
document.addEventListener('click', e => {
    function createParent(parent, value = 'js-comment') {
        do {
            if (parent.parentNode) {
                if (parent.classList.contains(value)) {
                    return parent;
                }
            } else {
                return null;
            }

        } while (parent = parent.parentNode);
    }

    const parent = createParent(e.target);
    if (e.target.classList.contains('js-close')) {
        parent.classList.add('visually-hidden');
    }
});
document.addEventListener('keyup', e => {
    if (e.key === 'Escape') {
        const comment = document.querySelector('.js-comment');
        comment.classList.add('visually-hidden');
        myMap.balloon.close();
    }
});