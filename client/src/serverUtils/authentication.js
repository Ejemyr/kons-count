import { getApi, postApi } from "./apiUtils";

export const getLoggedIn = async (timeout = 1000) => {
    return await getApi('/loggedin', timeout);
};

export const login = async (token, timeout = 10000) => {
    return await postApi('/login', {token: token}, timeout);
};