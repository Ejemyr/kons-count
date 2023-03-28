import { getApi, postApi } from "./apiUtils";

export const getCountInfo = async (timeout = 400) => {
    return await getApi('/countInfo', timeout);
};

export const increaseCountMembers = async (timeout = 400) => {
    return await postApi('/count/members/up', {}, timeout);
};

export const increaseCountGuests = async (timeout = 400) => {
    return await postApi('/count/guests/up', {}, timeout);
};

export const decreaseCountMembers = async (timeout = 400) => {
    return await postApi('/count/members/down', {}, timeout);
}; 

export const decreaseCountGuests = async (timeout = 400) => {
    return await postApi('/count/guests/down', {}, timeout);
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
