class Storage {
    constructor() {
        this.selectStorage = [];
    }

    save(type, value) {
        localStorage[type] = JSON.stringify(value);
    }

    get(type) {
        try {
            return JSON.parse(localStorage[type]);
        } catch (e) {
            return null;
        }
    }
}

export default Storage;