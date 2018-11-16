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

filterNameInput.addEventListener('keyup', function () {
    // здесь можно обработать нажатия на клавиши внутри текстового поля для фильтрации cookie
});

const row = document.createElement('tr');
const col = document.createElement('td');
const btn = document.createElement('button');

btn.type = 'button';
btn.textContent = 'X';

disabledButton();

function disabledButton(param = true) {
    addButton.disabled = param;
}

function isEmptyInput() {
    return [...addBlock].every(item => item.value.length);
}

block.addEventListener('input', () => disabledButton(!isEmptyInput()));

function getCookieObject() {
    const arr = document.cookie.split('; ');
    const obj = {};
    arr.reduce((prev, cur) => {
        let [name, value] = cur.split('=');

        obj[name] = value;
    }, {});
    return obj;
}

function createCol(value) {
    const elem = col.cloneNode();

    elem.textContent = value;

    return elem;
}

function createBtn() {
    return createCol().appendChild(btn.cloneNode(true));
}

function createRow() {
    return row.cloneNode();
}

function createCookieDom(name, value) {
    const cloneRow = createRow();
    const cloneCollName = createCol(name);
    const cloneCollValue = createCol(value);
    const cloneCollBtn = createBtn();

    cloneCollBtn.dataset.param = name;
    cloneCollBtn.addEventListener('click', e => {
        document.cookie = `${e.target.dataset.param}=; Expires=Thu, 01 Jan 1900 00:00:00 GMT';`;
        cloneRow.parentElement.removeChild(cloneRow);
    });

    cloneRow.appendChild(cloneCollName);
    cloneRow.appendChild(cloneCollValue);
    cloneRow.appendChild(cloneCollBtn);

    return cloneRow;
}

function showCookie() {
    const cookies = getCookieObject();
    const cookieNames = Object.keys(cookies);

    listTable.innerHTML = '';
    cookieNames.forEach(el => el && listTable.appendChild(createCookieDom(el, cookies[el])));
}

showCookie();

addButton.addEventListener('click', () => {
    document.cookie = `${addNameInput.value}=${addValueInput.value}`;
    showCookie();
    addNameInput.value = '';
    addValueInput.value = '';
});
