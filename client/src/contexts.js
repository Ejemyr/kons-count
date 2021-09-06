import { createContext } from 'react';

export const CountContext = createContext({
    count: undefined,
    lastUpdate: undefined,
    maxCount: undefined,
    failed: false,
    setCount: (count) => {}
});
