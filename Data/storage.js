<<<<<<< Updated upstream
=======
export const Storage = {
    save: (key, data) => {
        try {
            const jsonData = JSON.stringify(data);
            localStorage.setItem(key, jsonData);
            return true;
        } catch (error) {
            console.error(error);
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
>>>>>>> Stashed changes
