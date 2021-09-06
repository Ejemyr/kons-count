import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Admin from './pages/Admin/Admin';
import Home from './pages/Display/Home';
import NotFound from './pages/NotFound';
import { useState, useEffect, useCallback } from 'react';
import { CountContext } from './contexts';
import { getCountInfo } from './serverUtils/count'

function App() {

    const maxFailCount = 10;

    const [count, setCount] = useState(undefined);
    const [lastUpdate, setLastUpdate] = useState(undefined);
    const [maxCount, setMaxCount] = useState(undefined);
    const [failed, setFailed] = useState(false);
    const [failCount, setFailCount] = useState(0);

    const updateCountContext = useCallback(async () => {
        return await getCountInfo().then(countInfo => {
            setCount(parseInt(countInfo.count));
            setLastUpdate(parseInt(countInfo.lastUpdate));
            setMaxCount(parseInt(countInfo.maxCount));
            setFailed(false);

            return true;
        }).catch(() => {
            return false;
        });
    }, []);

    useEffect(() => {
        if (count === undefined && failCount === 0) {
            updateCountContext();
        }
    }, [count, failCount, updateCountContext]);

    const updateAndCountFailures = useCallback(async () => {
        if (await updateCountContext()) {
            setFailCount(0);
        } else {
            setFailCount(failCount + 1);
            if( failCount + 1 >= maxFailCount ) {
                setFailed(true);
            }
        }
    }, [failCount, updateCountContext])

    useEffect(() => {
        const interval = setInterval(async () => {
            updateAndCountFailures();
        }, 500);
        return () => clearInterval(interval);
    }, [updateAndCountFailures])


    const contextValue = {
        count: count,
        lastUpdate: lastUpdate,
        maxCount: maxCount,
        failed: failed,
        setCount: setCount
    };

    const rootPath = process.env.ROOT_PATH || "";

    return (
        <Router>
            <div>
                <Switch>
                    <CountContext.Provider value={contextValue}>
                        <Route path={rootPath + "/admin"} exact={true}>
                            <Admin />
                        </Route>
                        <Route path={rootPath + "/"} exact={true}>
                            <Home />
                        </Route>
                    </CountContext.Provider>
                    <Route>
                        <NotFound />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
