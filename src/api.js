class VkApi {
    auth(appId, perms) {
        return new Promise((resolve, reject) => {
            VK.init({
                apiId: appId
            });
            VK.Auth.login(data => {
                if (data.session) {
                    resolve(data)
                }
                reject(new Error('Ошибка Авторизации'));
            }, perms);
        });
    }

    callApi(method, params = {}) {
        params.v = '5.76';

        return new Promise((resolve, reject) => {
            VK.api(method, params, data => data.error ? reject(data.error) : resolve(data.response));
        });
    }

    logOut() {
        return new Promise((resolve, reject) => {
            VK.Auth.logout(data => {
                !data.session ? resolve() : reject(new Error('Не удалось выйти'))
            })
        })
    }

    createButtonVk(id) {
        VK.UI.button(id);
    }

    getFriends(method, params = {}) {
        return this.callApi(method, params);
    }
}

export default VkApi;