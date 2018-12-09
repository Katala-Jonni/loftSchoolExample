import commentCard from './templates/commentCard.hbs';
import commentTemplate from './templates/commentTemplate.hbs';

class Map {
    constructor(comment) {
        this.comment = comment;
        this.commentListMain = this.comment.querySelector('.js-comment-list');
        this.address = this.comment.querySelector('.js-address');
        this.firstComment = this.comment.querySelector('.js-first-comment').cloneNode(true);
        this.popUpClassName = 'js-comment';
        this.commentsArray = [];
        this.timeOptions = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            timezone: 'UTC',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };
    }

    init() {
        // копипаст с доки + подставил свой шаблон commentCard
        this.map = new ymaps.Map('map', {
            center: [55.75, 37.62],
            zoom: 12,
            controls: ['zoomControl'],
            behaviors: ['drag']
        });
        this.clusterer = new ymaps.Clusterer({
            clusterDisableClickZoom: true,
            clusterBalloonContentLayout: "cluster#balloonCarousel",
        });
        const that = this;
        this.myBalloonLayout = ymaps.templateLayoutFactory.createClass(
            commentCard(), {
                build: function () {
                    this.constructor.superclass.build.call(this);
                    this._$element = $('.js-comment', this.getParentElement());
                    this.applyElementOffset();
                    this._$element.find('.js-add-baloon')
                        .on('click', $.proxy((e) => {
                            e.preventDefault();
                            that.createBalloonAndPlaceMark(e);
                        }, this));
                },

                onSublayoutSizeChange: function () {
                    this.myBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);
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
    }

    createBalloonAndPlaceMark(e) {
        const parent = this.createParent(e.target);
        if (!parent) return;
        let commentForm = parent.querySelector('.js-comment-form').elements;
        commentForm = [...commentForm].filter(el => el.name);
        const coords = parent.dataset.id.split(',');
        const commentList = parent.querySelector('.js-comment-list');
        const isComplete = commentForm.every(el => el.value.length);
        if (!isComplete) return;
        const commentParam = {};
        const date = new Date();
        commentParam.comment = {
            date: date.toLocaleString('ru-Ru', this.timeOptions),
        };
        commentParam.coords = coords;
        commentForm.forEach(el => {
            commentParam.comment[el.name] = el.value;
            el.value = '';
        });
        this.commentsArray.push(commentParam);
        this.addView(coords.join(''), commentList);

        const placemark = this.createPlacemark(coords, parent, commentParam, date, this.timeOptions, this.myBalloonLayout);
        this.clusterer.add(placemark);
    }

    createPlacemark(coords, parent, commentParam, date, timeOptions, MyBalloonLayout) {
        const placemark = new ymaps.Placemark(coords, {
            hintContent: `${parent.dataset.address}`,
            balloonContent: '<div>' +
            `    <p>${commentParam.comment.place}</p>` +
            `    <a href="" class="claster-link js-claster-link" data-id=${coords}>${parent.dataset.address}</a>` +
            `    <p>${commentParam.comment.message}</p>` +
            `    <span>${date.toLocaleString('ru-Ru', timeOptions)}</span>` +
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

        placemark.events.add('balloonopen', async () => {
            const coords = placemark.geometry.getCoordinates();
            const res = await ymaps.geocode(coords);
            const parent = document.querySelector('.js-comment');
            const commentList = parent.querySelector('.js-comment-list');
            const header = parent.querySelector('.comment__subtitle');
            header.textContent = res.geoObjects.get(0).getAddressLine();
            parent.dataset.address = header.textContent;
            parent.dataset.id = coords;
            this.addView(coords.join(''), commentList);
        });

        return placemark;
    }

    createParent(parent, value = this.popUpClassName) {
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

    changePopUp(myMap, x = 0, y = 0, coords = [], addressText = '', isMapClick = false) {
        myMap.balloon.close();
        this.commentListMain.innerHTML = '';
        isMapClick && this.commentListMain.appendChild(this.firstComment);
        this.comment.style.left = `${x}px`;
        this.comment.style.top = `${y}px`;
        this.address.textContent = addressText;
        this.comment.dataset.id = coords;
        this.comment.dataset.address = addressText;
        this.comment.classList.remove('visually-hidden');
    }

    addView(coords, box = this.commentListMain) {
        const html = this.commentsArray
            .filter(el => el.coords.join('') === coords)
            .map(el => el.comment);

        if (html.length) {
            box.innerHTML = commentTemplate(html);
        }
    }
}

export default Map;