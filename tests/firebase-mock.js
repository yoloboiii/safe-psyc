const authListeners = [];
const user = { email: 'a@b.c' };

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
            signOut: () => {
                return new Promise(resolve => {
                    resolve();
                    authListeners.forEach(l => l(undefined));
                });
            },

        };
    },
    database: () => {
        return {
            ref: () => {
                return {
                    push: (_, cb) => {
                        cb();
                    },
                };
            },
        };
    },
};

export default mockObj;
