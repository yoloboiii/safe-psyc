const authListeners = [];
const user = {};

const mockObj = {
    initializeApp: () => {},
    auth: () => {
        return {
            onAuthStateChanged: (cb) => {
                authListeners.push(cb);
            },
            signInWithEmailAndPassword: () => {
                return new Promise(resolve => {
                    resolve();
                    authListeners.forEach(l => l(user));
                });
            },
        };
    },
    database: () => {
        return {
            ref: () => {
                return {
                    push: () => {
                        return new Promise(resolve => {
                            resolve();
                        });
                    },
                };
            },
        };
    },
};

export default mockObj;
