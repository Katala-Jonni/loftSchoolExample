const enter = document.querySelector('.js-enter');
const friends = document.querySelector('.js-friends');
const hiddenClass = 'visually-hidden';


function apiAuth() {
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

function responseApi(method, params) {
    params.v = '5.76';

    return new Promise((resolve, reject) => {
        VK.api(method, params, data => data.error ? reject(data.error) : resolve(data.response));
    });
}

function handleClickLogOut() {
    VK.Auth.logout(data => {
        if (!data.session) {
            friends.classList.add(hiddenClass);
            enter.classList.remove(hiddenClass);
        }
    });
}

VK.UI.button(enter);

export default {
    auth: apiAuth,
    getFriends: responseApi,
    logOut: handleClickLogOut,
}