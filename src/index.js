import './style/index.css';
import render from './templates/friends.hbs';
import util from './util';
import VkApi from './api';
import { changeSearchFilter } from './filter';
import Storage from './storage';

const { friends, closeBtn, saveStorage, enter, hiddenClass, select, total, sections, loader, currentType } = util;

// инициализация api vk
const appId = 6761649;
const perms = 2;
const api = new VkApi();
const { auth, getFriends, createButtonVk, logOut } = api;

createButtonVk(enter);
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
        await auth(appId, perms);
        friends.classList.remove(hiddenClass);
        enter.classList.add(hiddenClass);
        sections.forEach(el => el.classList.add(hiddenClass));
        const list = await getFriends.call(api, 'friends.get', { fields: 'photo_50', count: 2000 });
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
closeBtn.addEventListener('click', async () => {
    try {
        await logOut();
        friends.classList.add(hiddenClass);
        enter.classList.remove(hiddenClass);
        loader.classList.remove(hiddenClass);
    } catch (e) {
        return null;
    }
}); // выход