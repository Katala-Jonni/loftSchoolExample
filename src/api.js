import util from './util';

const { enter, friends, hiddenClass, loader } = util;

export function init() {
    VK.init({
        apiId: 6761649
    });
}

export function auth() {
    return new Promise((resolve, reject) => {
        VK.Auth.login(data => {
            if (data.session) {
                resolve();
                friends.classList.remove(hiddenClass);
                enter.classList.add(hiddenClass);
            }
            reject(new Error('Не удалось авторизоваться'));
        }, 2);
    });
}

export function getFriends(method, params) {
    params.v = '5.76';

    return new Promise((resolve, reject) => {
        VK.api(method, params, data => data.error ? reject(data.error) : resolve(data.response));
    });
}

export function handleClickLogOut() {
    VK.Auth.logout(data => {
        if (!data.session) {
            friends.classList.add(hiddenClass);
            enter.classList.remove(hiddenClass);
            loader.classList.remove(hiddenClass);
        }
    });
}

VK.UI.button(enter);