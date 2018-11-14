/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загруки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */
function loadTowns() {
    function sortString(a, b) {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }

        return 0;
    }

    function createButton() {
        const btn = document.createElement('button');

        btn.type = 'button';
        btn.textContent = 'Повторить';
        btn.style.marginLeft = '10px';
        btn.addEventListener('click', () => location.reload());

        return btn;
    }

    function createErrorBlock() {
        loadingBlock.style.display = 'block';
        loadingBlock.textContent = 'Не удалось загрузить города';
        loadingBlock.appendChild(createButton());
    }

    async function loadData() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json');
            const parse = await response.json();

            return parse.sort(sortString);
        } catch (e) {
            createErrorBlock();
        }
    }

    return loadData();
}

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
function isMatching(full, chunk) {
    return full.toLowerCase().indexOf(chunk.toLowerCase()) !== -1;
}

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');

function showInput() {
    loadingBlock.style.display = 'none';
    filterBlock.style.display = 'block';
}

function clearFilterResult() {
    filterResult.innerHTML = '';
}

let cities;

loadTowns()
    .then(res => {
        if (!res) {
            return;
        }
        showInput();
        cities = res;
    });

// можно было и ul сделать с li
function createParagraph() {
    const p = document.createElement('p');

    p.style.cursor = 'pointer';

    return p;
}

function fillingFragment(cities) {
    const fragment = document.createDocumentFragment();

    cities.reduce((prev, cur) => {
        const cloneParagraph = createParagraph().cloneNode();

        cloneParagraph.textContent = cur.name;
        prev.appendChild(cloneParagraph);

        return prev;
    }, fragment);

    return fragment;
}

function handleVariableInput(e) {
    clearFilterResult();
    if (!e.target.value.length) {
        return;
    }
    const filterCities = cities.filter(el => isMatching(el.name, e.target.value));

    filterResult.appendChild(fillingFragment(filterCities));
}

function handleClickCity(e) {
    if (e.target.tagName === 'P') {
        filterInput.value = e.target.textContent;
        clearFilterResult();
    }
}

filterInput.addEventListener('keyup', handleVariableInput);
filterResult.addEventListener('click', handleClickCity);

export {
    loadTowns,
    isMatching
};
