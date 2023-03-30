import { createContext } from 'react';

export const CountContext = createContext({
    countMembers: undefined,
    countGuests: undefined,
    lastUpdate: undefined,
    maxCount: undefined,
    failed: false,
    setCountMembers: (countMembers) => {},
    setCountGuests: (countGuests) => {}
});
