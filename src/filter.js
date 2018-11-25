import util from './util';
import { pushCurrentType } from './moving';
import { handleBarsRender } from './index';

const { total, select, currentType, searchFilter } = util;

const currentTypeBox = {
    'total': total,
    'select': select
};

const isEntryValue = (box, val) => box.toLowerCase().indexOf(val.toLowerCase()) !== -1;

export function renderSearchFilter(target) {
    let items = currentType[target.dataset.type];

    items = items.filter(el => isEntryValue(`${el.first_name} ${el.last_name}`, target.value));
    handleBarsRender(currentTypeBox[target.dataset.type], items);
}

export function changeSearchFilter() {
    const selectChild = select.querySelectorAll('li');
    const totalChild = total.querySelectorAll('li');

    [...selectChild].forEach(el => pushCurrentType(el, 'select'));
    [...totalChild].forEach(el => pushCurrentType(el, 'total'));
    searchFilter.forEach(el => {
        el.addEventListener('keyup', e => renderSearchFilter(e.target));
        el.addEventListener('input', e => renderSearchFilter(e.target));
    });
}