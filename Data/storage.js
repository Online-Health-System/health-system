// storage.js

export const Storage = {
    save: (key, data) => {
        try {
            const jsonData = JSON.stringify(data);
            localStorage.setItem(key, jsonData);
            return true;
        } catch (error) {
            console.error("Error saving to LocalStorage", error);
            return false;
        }
    },

    get: (key) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },

    remove: (key) => {
        localStorage.removeItem(key);
    },

    pushToItem: (key, newItem) => {
        const currentData = Storage.get(key) || [];
        currentData.push(newItem);
        return Storage.save(key, currentData);
    }
};