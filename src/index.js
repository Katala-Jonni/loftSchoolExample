/* ДЗ 4 - работа с DOM */

/*
 Задание 1:

 1.1: Функция должна создать элемент с тегом DIV

 1.2: В созданный элемент необходимо поместить текст, переданный в параметр text

 Пример:
   createDivWithText('loftschool') // создаст элемент div, поместит в него 'loftschool' и вернет созданный элемент
 */
function createDivWithText(text) {
    const element = document.createElement('div');

    element.textContent = text;

    return element;
}

/*
 Задание 2:

 Функция должна вставлять элемент, переданный в переметре what в начало элемента, переданного в параметре where

 Пример:
   prepend(document.querySelector('#one'), document.querySelector('#two')) // добавит элемент переданный первым аргументом в начало элемента переданного вторым аргументом
 */
function prepend(what, where) {
    where.insertBefore(what, where.firstChild);
}

/*
 Задание 3:

 3.1: Функция должна перебрать все дочерние элементы узла, переданного в параметре where

 3.2: Функция должна вернуть массив, состоящий из тех дочерних элементов следующим соседом которых является элемент с тегом P

 Пример:
   Представим, что есть разметка:
   <body>
      <div></div>
      <p></p>
      <a></a>
      <span></span>
      <p></p>
   </dody>

   findAllPSiblings(document.body) // функция должна вернуть массив с элементами div и span т.к. следующим соседом этих элементов является элемент с тегом P
 */
function findAllPSiblings(where) {
    return [...where.children].filter(el => el.nextElementSibling && el.nextElementSibling.tagName === 'P');
}

/*
 Задание 4:

 Функция представленная ниже, перебирает все дочерние узлы типа "элемент" внутри узла переданного в параметре where и возвращает массив из текстового содержимого найденных элементов
 Но похоже, что в код функции закралась ошибка и она работает не так, как описано.

 Необходимо найти и исправить ошибку в коде так, чтобы функция работала так, как описано выше.

 Пример:
   Представим, что есть разметка:
   <body>
      <div>привет</div>
      <div>loftschool</div>
   </dody>

   findError(document.body) // функция должна вернуть массив с элементами 'привет' и 'loftschool'
 */
function findError(where) {
    const result = [];

    for (const child of where.children) {
        result.push(child.textContent);
    }

    return result;
}

/*
 Задание 5:

 Функция должна перебрать все дочерние узлы элемента переданного в параметре where и удалить из него все текстовые узлы

 Задачу необходимо решить без использования рекурсии, то есть можно не уходить вглубь дерева.
 Так же будьте внимательны при удалении узлов, т.к. можно получить неожиданное поведение при переборе узлов

 Пример:
   После выполнения функции, дерево <div></div>привет<p></p>loftchool!!!
   должно быть преобразовано в <div></div><p></p>
 */
function deleteTextNodes(where) {
    return [...where.childNodes].filter(el => el.nodeType === 3 && where.removeChild(el));
}

/*
 Задание 6:

 Выполнить предудыщее задание с использование рекурсии - то есть необходимо заходить внутрь каждого дочернего элемента (углубляться в дерево)

 Задачу необходимо решить без использования рекурсии, то есть можно не уходить вглубь дерева.
 Так же будьте внимательны при удалении узлов, т.к. можно получить неожиданное поведение при переборе узлов

 Пример:
   После выполнения функции, дерево <span> <div> <b>привет</b> </div> <p>loftchool</p> !!!</span>
   должно быть преобразовано в <span><div><b></b></div><p></p></span>
 */
function deleteTextNodesRecursive(where) {
    // Решение 1
    // function foo(element) {
    //     [...element.childNodes].forEach(el => {
    //         if (el.nodeType === 1) {
    //             foo(el);
    //         } else if (el.nodeType === 3) {
    //             el.parentNode.removeChild(el);
    //         } else {
    //             el.textContent = '';
    //         }
    //     });
    // }
    //
    // foo(where);

    // Решение 2 не рекурсивное с использованием стэка
    const copy = [...where.childNodes];

    while (copy.length) {
        let next = copy.pop();

        if (next.children && next.children.length) {
            next = [...next.childNodes];
            copy.push(...next);
        } else if (next.nodeType === 3) {
            next.parentNode.removeChild(next);
        } else {
            next.textContent = '';
        }
    }
}

/*
 Задание 7 *:

 Необходимо собрать статистику по всем узлам внутри элемента переданного в параметре root и вернуть ее в виде объекта
 Статистика должна содержать:
 - количество текстовых узлов
 - количество элементов каждого класса
 - количество элементов каждого тега
 Для работы с классами рекомендуется использовать classList
 Постарайтесь не создавать глобальных переменных

 Пример:
   Для дерева <div class="some-class-1"><b>привет!</b> <b class="some-class-1 some-class-2">loftschool</b></div>
   должен быть возвращен такой объект:
   {
     tags: { DIV: 1, B: 2},
     classes: { "some-class-1": 2, "some-class-2": 1 },
     texts: 3
   }
 */
function collectDOMStat(root) {
    const statistic = {
        tags: {},
        classes: {},
        texts: 0
    };
    const { tags, classes } = statistic;
    const changeTags = elem => tags[elem.tagName] ? tags[elem.tagName]++ : tags[elem.tagName] = 1;
    const changeClasses = elem => [...elem.classList].forEach(el => classes[el] ? classes[el]++ : classes[el] = 1);
    const changeTexts = () => statistic.texts++;

    function makeStatistic(elem, bool = true) {
        changeTags(elem);
        changeClasses(elem);
        bool && changeTexts();
    }

    const copy = [...root.childNodes];

    while (copy.length) {
        let next = copy.pop();

        if (next.children && next.children.length) {
            makeStatistic(next, false);
            next = [...next.childNodes];
            copy.push(...next);
        } else if (next.nodeType === 3) {
            changeTexts();
        } else {
            next.textContent && makeStatistic(next);
        }
    }

    return statistic;
}

/*
 Задание 8 *:

 8.1: Функция должна отслеживать добавление и удаление элементов внутри элемента переданного в параметре where
 Как только в where добавляются или удаляются элементы,
 необходимо сообщать об этом при помощи вызова функции переданной в параметре fn

 8.2: При вызове fn необходимо передавать ей в качестве аргумента объект с двумя свойствами:
   - type: типа события (insert или remove)
   - nodes: массив из удаленных или добавленных элементов (в зависимости от события)

 8.3: Отслеживание должно работать вне зависимости от глубины создаваемых/удаляемых элементов

 Рекомендуется использовать MutationObserver

 Пример:
   Если в where или в одного из его детей добавляется элемент div
   то fn должна быть вызвана с аргументом:
   {
     type: 'insert',
     nodes: [div]
   }

   ------

   Если из where или из одного из его детей удаляется элемент div
   то fn должна быть вызвана с аргументом:
   {
     type: 'remove',
     nodes: [div]
   }
 */
function observeChildNodes(where, fn) {
    const beforeObserve = where.children.length;
    let observer = new MutationObserver(mutations => {
        const afterObserve = where.children.length;
        const difference = afterObserve - beforeObserve;
        const typeAction = beforeObserve < afterObserve ? 'insert' : 'remove';
        const nodes = typeAction === 'insert' ? difference : !difference;

        mutations.forEach(mutation => {
            fn(
                {
                    type: typeAction,
                    nodes: nodes ? [...mutation.addedNodes] : [...mutation.removedNodes]
                }
            )
        });
    });

    const options = {
        childList: true,
        subtree: true
    };

    observer.observe(where, options);
}

export {
    createDivWithText,
    prepend,
    findAllPSiblings,
    findError,
    deleteTextNodes,
    deleteTextNodesRecursive,
    collectDOMStat,
    observeChildNodes
};
