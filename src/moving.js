import util from './util';
import { renderSearchFilter } from './filter';

const { total, select, currentType, searchFilter } = util;
const type = {
    'total': 'select',
    'select': 'total'
};
const box = {
    'total': select,
    'select': total
};
const classNameBtn = {
    add: 'btn--total',
    remove: 'btn--select'
};
let currentTarget;

function createZone(from, className = 'friends__list') {
    do {
        if (from.classList.contains(className)) {
            return from;
        }
    } while (from = from.parentElement);
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

export function pushCurrentType(elem, type) {
    currentType[type].push({
        id: elem.dataset.id,
        first_name: elem.dataset.name,
        last_name: elem.dataset.lastname,
        photo_50: elem.dataset.img,
        type: elem.dataset.type
    });
}

export function moveElement(elem, button) {
    currentType[elem.dataset.type] = currentType[elem.dataset.type].filter(el => el.id !== elem.dataset.id);
    box[elem.dataset.type].appendChild(elem);
    elem.dataset.type = type[elem.dataset.type];
    changeClassButton(button);
    pushCurrentType(elem, elem.dataset.type);
    searchFilter.forEach(renderSearchFilter);
}

function handleClickDrag(e) {
    return e.target.classList.contains('js-move') && moveElement(e.target.parentElement, e.target);
}

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
document.addEventListener('click', handleClickDrag); // перемещение по нажатию