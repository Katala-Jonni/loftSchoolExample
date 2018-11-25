import './style/index.css';
import render from './templates/friends.hbs';
import util from './util';
import { init, auth, getFriends, handleClickLogOut } from './api';
import { changeSearchFilter } from './filter';
import Storage from './storage';

const { closeBtn, saveStorage, enter, hiddenClass, select, total, sections, loader, currentType } = util;

// инициализация api vk
init();
const storage = new Storage();

export function handleBarsRender(box, elements, isStartRender = false) {
    let items = elements;

    if (isStartRender) {
        const storageSelects = storage.get('select');

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

async function handleClickEnter() {
    try {
        await auth();
        sections.forEach(el => el.classList.add(hiddenClass));
        const list = await getFriends('friends.get', { fields: 'photo_50', count: 2000 });
        const items = list.items.filter(el => el.type = 'total');

        handleBarsRender(total, items, true);
        changeSearchFilter();
        sections.forEach(el => el.classList.remove(hiddenClass));
        loader.classList.add(hiddenClass);
    } catch (e) {
        return null;
    }
}

function handleClickSaveStorage(e) {
    e.preventDefault();
    currentType.select.forEach(el => storage.selectStorage.push(el.id));
    storage.save('select', storage.selectStorage);
}

enter.addEventListener('click', handleClickEnter); // вход
saveStorage.addEventListener('click', handleClickSaveStorage); // storage
closeBtn.addEventListener('click', handleClickLogOut); // выход