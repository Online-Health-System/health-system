export const Storage = {
    save: (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            return false;
        }
    },
    get: (key) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },
    findItem: (key, predicate) => {
        const data = Storage.get(key) || [];
        return data.find(predicate);
    },
    pushToItem: (key, newItem) => {
        const currentData = Storage.get(key) || [];
        currentData.push(newItem);
        return Storage.save(key, currentData);
    },
    updateItem: (key, id, newData) => {
        const data = Storage.get(key) || [];
        const index = data.findIndex(item => item.id === id);
        if (index !== -1) {
            data[index] = { ...data[index], ...newData };
            return Storage.save(key, data);
        }
        return false;
    }
};