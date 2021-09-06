import React from "react";
import { Alert } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';
import { CountContext } from "../../contexts";
import CountDisplay from "./CountDisplay";
import '../DivStyles.css';
import NotLive from "./NotLive";

function Home() {
    return (
        <CountContext.Consumer>
            {context => 
                <div className="vh-100">
                    {!context.failed
                        ? context.live !== undefined
                            ? context.live
                                ? <CountDisplay count={context.count} lastUpdate={context.lastUpdate} maxCount={context.maxCount} />
                                : <NotLive />
                            : <div className="page-center"><Spinner animation="border" variant="light"/></div>
                        : <Alert variant="danger">Failed to fetch data from server.<br/>Either server is down or you've lost your connection.</Alert>
                    }
                </div>
            }
        </CountContext.Consumer>
    );
};

export default Home;