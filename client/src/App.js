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

    const [live, setLive] = useState(undefined);
    const [countMembers, setCountMembers] = useState(undefined);
    const [countGuests, setCountGuests] = useState(undefined);
    const [lastUpdate, setLastUpdate] = useState(undefined);
    const [maxCount, setMaxCount] = useState(undefined);
    const [failed, setFailed] = useState(false);
    const [failCount, setFailCount] = useState(0);

    const updateCountContext = useCallback(async () => {
        return await getCountInfo().then(countInfo => {
            setLive(countInfo.live === "true");
            setCountMembers(parseInt(countInfo?.countMembers));
            setCountGuests(parseInt(countInfo?.countGuests));
            setLastUpdate(parseInt(countInfo?.lastUpdate));
            setMaxCount(parseInt(countInfo?.maxCount));
            setFailed(false);

            return true;
        }).catch(() => {
            return false;
        });
    }, []);

    useEffect(() => {
        if (countMembers === undefined && countGuests === undefined && failCount === 0) {
            updateCountContext();
        }
    }, [countMembers, countGuests, failCount, updateCountContext]);

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
        live: live,
        countMembers: countMembers,
        countGuests: countGuests,
        lastUpdate: lastUpdate,
        maxCount: maxCount,
        failed: failed,
        setCountMembers: setCountMembers,
        setCountGuests: setCountGuests
    };


    const rootPath = process.env.REACT_APP_ROOT_PATH || "";
    
    return (
        <Router basename={rootPath}>
            <div>
                <Switch>
                    <CountContext.Provider value={contextValue}>
                        <Route path="/admin" exact={true}>
                            <Admin />
                        </Route>
                        <Route path="/" exact={true}>
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
