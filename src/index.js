/* ДЗ 2 - работа с массивами и объеектами */

/*
 Задание 1:

 Напишите аналог встроенного метода forEach для работы с массивами
 Посмотрите как работает forEach и повторите это поведение для массива, который будет передан в параметре array
 */
function forEach(array, fn) {
    for (let i = 0; i < array.length; i++) {
        fn(array[i], i, array);
    }
}

/*
 Задание 2:

 Напишите аналог встроенного метода map для работы с массивами
 Посмотрите как работает map и повторите это поведение для массива, который будет передан в параметре array
 */
function map(array, fn) {
    const copy = [];

    array.forEach((el, idx, arr) => copy[idx] = fn(el, idx, arr));

    return copy;
}

/*
 Задание 3:

 Напишите аналог встроенного метода reduce для работы с массивами
 Посмотрите как работает reduce и повторите это поведение для массива, который будет передан в параметре array
 */
function reduce(array, fn, initial) {
    let count = 0;
    let res = initial || array[count++];

    while (count < array.length) {
        res = fn(res, array[count], count, array);
        count++;
    }

    return res;
}

/*
 Задание 4:

 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистр и вернуть в виде массива

 Пример:
   upperProps({ name: 'Сергей', lastName: 'Петров' }) вернет ['NAME', 'LASTNAME']
 */
function upperProps(obj) {
    return Object.keys(obj).map(el => el.toUpperCase());
}

/*
 Задание 5 *:

 Напишите аналог встроенного метода slice для работы с массивами
 Посмотрите как работает slice и повторите это поведение для массива, который будет передан в параметре array
 */
function slice(array = [], from = 0, to = array.length) {
    const res = [];

    if (from > array.length) {
        return res
    }

    let fromCount = from < 0 ? 0 : from;
    let toCount = to < 0 ? array.length + to || 0 : to;

    toCount = toCount > array.length ? array.length : toCount;

    while (fromCount < toCount) {
        res.push(array[fromCount]);
        fromCount++;
    }

    return res;
}

/*
 Задание 6 *:

 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
function createProxy(obj) {
    const handler = {
        get: function (target, key) {
            return target[key];
        },
        set: function (target, key, value) {
            if (!(key in target)) {
                target[key] = value * value;
            }

            return true;
        }
    };

    return new Proxy(obj, handler);
}

export {
    forEach,
    map,
    reduce,
    upperProps,
    slice,
    createProxy
};