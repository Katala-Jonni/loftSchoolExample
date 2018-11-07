/* Задание со звездочкой */
/*
 Создайте страницу с кнопкой.
 При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией на экране
 Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
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
 Функция должна создавать и возвращать новый div с классом draggable-div и случайными размерами/цветом/позицией
 Функция должна только создавать элемент и задвать ему случайные размер/позицию/цвет
 Функция НЕ должна добавлять элемент на страницу. На страницу элемент добавляется отдельно

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
 */
function createDiv() {
    const div = document.createElement('div');
    const classes = 'draggable-div';

    div.classList.add(classes);
    const size = getRandom(100, 300);
    const color = {
        h: getRandom(0, 256),
        s: getRandom(0, 256),
        l: getRandom(0, 256),
    };

    div.style.width = `${size}px`;
    div.style.height = `${size}px`;
    div.style.backgroundColor = `rgb(${color.h}, ${color.s}, ${color.l})`;
    div.style.cursor = 'pointer';
    div.style.position = 'absolute';
    div.style.left = `${getRandom(0, 1000 - size)}px`;
    div.style.top = `${getRandom(0, 1000 - size)}px`;

    function getRandom(max, min) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    return div;
}

/*
 Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
   addListeners(newDiv);
 */
function addListeners(target) {
    const minX = homeworkContainer.offsetLeft;
    const minY = homeworkContainer.offsetTop;
    let ind = false;
    let shiftX = 0;
    let shiftY = 0;
    let maxX, maxY;

    function handleDownDiv(evt) {
        const targetElement = evt.target;

        if (!targetElement.classList.contains('draggable-div')) {
            return;
        }
        ind = true;

        const bounds = evt.target.getBoundingClientRect();

        shiftX = evt.clientX - bounds.left;
        shiftY = evt.clientY - bounds.top;

        maxX = minX + homeworkContainer.offsetWidth - targetElement.offsetWidth;
        maxY = minY + homeworkContainer.offsetHeight - targetElement.offsetHeight;
    }

    function handleUpDiv(evt) {
        if (!evt.target.classList.contains('draggable-div')) {
            return
        }
        ind = false;
    }

    function handleMoveDiv(evt) {
        if (!ind) {
            return;
        }
        evt.preventDefault();

        let x = evt.pageX - shiftX;
        let y = evt.pageY - shiftY;

        x = Math.min(x, maxX);
        y = Math.min(y, maxY);

        x = Math.max(x, minX);
        y = Math.max(y, minY);

        target.style.left = `${x}px`;
        target.style.top = `${y}px`;
    }

    homeworkContainer.addEventListener('mousedown', handleDownDiv);
    homeworkContainer.addEventListener('mouseup', handleUpDiv);
    homeworkContainer.addEventListener('mousemove', handleMoveDiv);
}

let addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function () {
    // создать новый div
    const div = createDiv();

    // добавить на страницу
    homeworkContainer.appendChild(div);
    // назначить обработчики событий мыши для реализации D&D
    addListeners(div);
    // можно не назначать обработчики событий каждому div в отдельности, а использовать делегирование
    // или использовать HTML5 D&D - https://www.html5rocks.com/ru/tutorials/dnd/basics/
});

export {
    createDiv
};
