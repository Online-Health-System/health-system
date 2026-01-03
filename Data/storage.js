export const Storage = {
    save: (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    },
    get: (key) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },
    getDBPart: (part) => {
        const db = JSON.parse(localStorage.getItem("hospitalDB")) || {};
        return db[part] || [];
    },
    updateDB: (part, newData) => {
        const db = JSON.parse(localStorage.getItem("hospitalDB")) || {};
        db[part] = newData;
        localStorage.setItem("hospitalDB", JSON.stringify(db));
    }
};