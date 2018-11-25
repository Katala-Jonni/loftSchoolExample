const mainElement = document.querySelector('.js-friends');

export default {
    friends: mainElement,
    enter: document.querySelector('.js-enter'),
    searchFilter: mainElement.querySelectorAll('.js-search'),
    select: mainElement.querySelector('.js-select'),
    total: mainElement.querySelector('.js-total'),
    sections: mainElement.querySelectorAll('.js-section'),
    closeBtn: mainElement.querySelector('.js-close'),
    loader: mainElement.querySelector('.friends__loader'),
    saveStorage: mainElement.querySelector('.friends__save-btn'),
    currentType: {
        total: [],
        select: []
    },
    hiddenClass: 'visually-hidden'
};