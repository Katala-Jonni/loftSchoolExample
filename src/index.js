import './style/index.css';
import render from './templates/friends.hbs';
import api from './api.js';

const enter = document.querySelector('.js-enter');
const friends = document.querySelector('.js-friends');
const searchFilter = friends.querySelectorAll('.js-search');
const select = friends.querySelector('.js-select');
const total = friends.querySelector('.js-total');
const sections = friends.querySelectorAll('.js-section');
const closeBtn = friends.querySelector('.js-close');
const hiddenClass = 'visually-hidden';
const classNameBtn = {
    add: 'btn--total',
    remove: 'btn--select'
};
const type = {
    'total': 'select',
    'select': 'total'
};
const box = {
    'total': select,
    'select': total
};
const currentTypeBox = {
    'total': total,
    'select': select
};
const selectStorage = [];
let currentType = {
    total: [],
    select: []
};
let currentTarget;

const isEntryValue = (box, val) => box.toLowerCase().indexOf(val.toLowerCase()) !== -1;

const saveStorage = (type, value) => localStorage[type] = JSON.stringify(value);

function getStorage(type) {
    try {
        return JSON.parse(localStorage[type]);
    } catch (e) {
        return null;
    }
}

function handleClickDrag(e) {
    return e.target.classList.contains('js-move') && moveElement(e.target.parentElement, e.target);
}

function handleBarsRender(box, elements, isStartRender = false) {
    let items = elements;

    if (isStartRender) {
        const storageSelects = getStorage('select');

        if (storageSelects && storageSelects.length) {
            // переопределние items
            items = elements.filter(el => storageSelects.includes(`${el.id}`));
            items.forEach(el => el.type = 'select');
            select.innerHTML = render({ items });
            // переопределние items
            items = elements.filter(el => !storageSelects.includes(`${el.id}`));
        }
    }
    box.innerHTML = render({ items });
}

function renderSearchFilter(target) {
    let items = currentType[target.dataset.type];

    items = items.filter(el => isEntryValue(`${el.first_name} ${el.last_name}`, target.value));
    handleBarsRender(currentTypeBox[target.dataset.type], items);
}

function changeClassButton(elem) {
    if (elem.classList.contains(classNameBtn.add)) {
        elem.classList.remove(classNameBtn.add);
        elem.classList.add(classNameBtn.remove);
    } else {
        elem.classList.add(classNameBtn.add);
        elem.classList.remove(classNameBtn.remove);
    }
}

function changeSearchFilter() {
    const selectChild = document.querySelectorAll('.js-select li');
    const totalChild = document.querySelectorAll('.js-total li');

    [...selectChild].forEach(el => pushCurrentType(el, 'select'));
    [...totalChild].forEach(el => pushCurrentType(el, 'total'));
    searchFilter.forEach(el => {
        el.addEventListener('keyup', e => renderSearchFilter(e.target));
        el.addEventListener('input', e => renderSearchFilter(e.target));
    });
}

function pushCurrentType(elem, type) {
    currentType[type].push({
        id: elem.dataset.id,
        first_name: elem.dataset.name,
        last_name: elem.dataset.lastname,
        photo_50: elem.dataset.img,
        type: elem.dataset.type
    });
}

function moveElement(element, button) {
    currentType[element.dataset.type] = currentType[element.dataset.type].filter(el => el.id !== element.dataset.id);
    box[element.dataset.type].appendChild(element);
    element.dataset.type = type[element.dataset.type];
    changeClassButton(button);
    pushCurrentType(element, element.dataset.type);
    searchFilter.forEach(renderSearchFilter);
}

function createZone(from, className = 'friends__list') {
    do {
        if (from.classList.contains(className)) {
            return from;
        }
    } while (from = from.parentElement);
}

//api.auth();
// function auth() {
//     return new Promise((resolve, reject) => {
//         VK.Auth.login(data => {
//             if (data.session) {
//                 resolve();
//                 friends.classList.remove(hiddenClass);
//                 enter.classList.add(hiddenClass);
//             }
//             reject(new Error('Не удалось авторизоваться'));
//         }, 2);
//     });
// }

// function getFriends(method, params) {
//     params.v = '5.76';
//
//     return new Promise((resolve, reject) => {
//         VK.api(method, params, data => data.error ? reject(data.error) : resolve(data.response));
//     });
// }

async function handleClickEnter() {
    try {
        await api.auth();
        sections.forEach(el => el.classList.add(hiddenClass));
        const list = await api.getFriends('friends.get', { fields: 'photo_50', count: 5 });
        const items = list.items.filter(el => el.type = 'total');

        handleBarsRender(total, items, true);
        changeSearchFilter();
        sections.forEach(el => el.classList.remove(hiddenClass));
        friends.querySelector('.friends__loader').classList.add(hiddenClass);
    } catch (e) {
        return null;
    }
}

// function handleClickLogOut() {
//     VK.Auth.logout(data => {
//         if (!data.session) {
//             friends.classList.add(hiddenClass);
//             enter.classList.remove(hiddenClass);
//         }
//     });
// }

function handleClickSaveStorage(e) {
    e.preventDefault();
    currentType.select.forEach(el => selectStorage.push(el.id));
    saveStorage('select', selectStorage);
}

// // инициализация api vk
VK.init({
    apiId: 6761649
});
enter.addEventListener('click', handleClickEnter); // вход
document.addEventListener('click', handleClickDrag); // перемещение по нажатию
document.addEventListener('dragstart', e => {
    const element = createZone(e.target, 'js-drag');

    if (!element) {
        return;
    }
    currentTarget = {
        source: element.parentElement,
        target: element,
        button: element.querySelector('.js-move')
    };
    e.dataTransfer.setData('text/html', 'dragstart');
});
document.addEventListener('dragover', e => e.target.parentElement && e.preventDefault());
document.addEventListener('drop', e => {
    e.preventDefault();
    const zone = createZone(e.target);

    zone && (zone !== currentTarget.source) && moveElement(currentTarget.target, currentTarget.button);
});
document.querySelector('.friends__save-btn').addEventListener('click', handleClickSaveStorage);
closeBtn.addEventListener('click', api.logOut); // выход
//VK.UI.button(enter); // кнопка api vk