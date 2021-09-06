import { getApi, postApi } from "./apiUtils";

export const getCountInfo = async (timeout = 400) => {
    return await getApi('/countInfo', timeout);
};

export const increaseCount = async (timeout = 400) => {
    return await postApi('/count/up', {}, timeout);
};

export const decreaseCount = async (timeout = 400) => {
    return await postApi('/count/down', {}, timeout);
}; 

export const resetCount = async (timeout = 400) => {
    return await postApi('/count/reset', {}, timeout);
};

export const setMaxCount = async (maxCount, timeout = 400) => {
    return await postApi('/maxCount/set', {value: maxCount}, timeout);
};

export const setLive = async (live, timeout = 400) => {
    return await postApi('/setLive', {value: live.toString()}, timeout);
};