/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const addBlock = document.querySelectorAll('#add-block input');
const block = document.querySelector('#add-block');
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

function searchValue(box, val) {
    return box.indexOf(val)
}

filterNameInput.addEventListener('keyup', function (e) {
    // здесь можно обработать нажатия на клавиши внутри текстового поля для фильтрации cookie
    const cookies = getCookieObject();
    const cookieNames = Object.keys(cookies);
    const value = e.target.value;
    const cookieNamesFilter = cookieNames.filter(el => {
        if (searchValue(el, value) !== -1 || (searchValue(cookies[el], value) !== -1 && cookies[el] === value)) {
            return el;
        }
    });
    const fragment = getFragment(cookieNamesFilter, cookies);

    // const fil = cookieNames.filter(el => cookies[el].toLowerCase() === value.toString().toLowerCase());
    // console.log(fil);
    // const fragment = getFragment(fil, cookies);

    showCookie(fragment);
});

function getCookieObject() {
    return document.cookie
        .split('; ')
        .reduce((prev, cur) => {
            const [name, value] = cur.split('=');

            prev[name] = value;

            return prev;
        }, {});
}

function createRow() {
    return document.createElement('tr');
}

function createCol(value) {
    const col = document.createElement('td');

    col.textContent = value;

    return col;
}

function createCollBtn() {
    const td = createCol();
    const btn = document.createElement('button');

    btn.type = 'button';
    btn.textContent = 'X';
    btn.style.width = '50px';
    btn.style.cursor = 'pointer';
    btn.className = 'js-btn js-btn--delete';
    td.appendChild(btn);

    return td;
}

function createCookieDom(name, value) {
    const row = createRow();
    const collName = createCol(name);
    const collValue = createCol(value);
    const collBtn = createCollBtn();

    collBtn.dataset.param = name;

    function handleClickDelete(e) {
        if (e.target.classList.contains('js-btn--delete')) {
            deleteCookie(e.currentTarget.dataset.param);
            row.parentElement.removeChild(row);
        }
    }

    collBtn.addEventListener('click', handleClickDelete);
    [collName, collValue, collBtn].forEach(el => row.appendChild(el));

    return row;
}

function getFragment(keys, data) {
    const fragment = document.createDocumentFragment();

    keys.reduce((prev, cur) => {
        cur && fragment.appendChild(createCookieDom(cur, data[cur]));

        return fragment;
    }, fragment);

    return fragment;
}

function showCookie(fragment) {
    listTable.innerHTML = '';
    listTable.appendChild(fragment);
}

function isEmptyInput() {
    return [...addBlock].every(item => item.value.length);
}

function addCookie() {
    document.cookie = `${addNameInput.value}=${addValueInput.value};`;
}

function deleteCookie(name) {
    document.cookie = `${name}=; Expires=Thu, 01 Jan 1900 00:00:00 GMT';`;
}

createCookieData();

function createCookieData() {
    const cookies = getCookieObject();
    let cookieNames = Object.keys(cookies);
    //
    // if (filterNameInput.value.length && filterNameInput.value !== addValueInput.value) {
    //     const data = cookieNames.find(el => cookies[el] === addValueInput.value);
    //     cookieNames = cookieNames.filter(el => el !== data);
    //     //console.log(data);
    // }
    // console.log(cookieNames);
    const fragment = getFragment(cookieNames, cookies);

    showCookie(fragment);


}

function handleClickAddButton() {
    if (!isEmptyInput()) {
        return null;
    }
    addCookie();
    createCookieData();
}

addButton.addEventListener('click', handleClickAddButton);

function disabledButton(param = true) {
    addButton.disabled = param;
}

//block.addEventListener('input', () => disabledButton(!isEmptyInput()));
