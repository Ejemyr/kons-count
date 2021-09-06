import React from "react";
import { Alert, Container } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';
import { CountContext } from "../../contexts";
import CountDisplay from "./CountDisplay";
import '../DivStyles.css';

function Home() {
    return (
        <CountContext.Consumer>
            {context => 
                <Container className="vh-100 px-4" fluid>
                    {!context.failed
                        ? (context.count !== undefined)
                            ? <CountDisplay count={context.count} lastUpdate={context.lastUpdate} maxCount={context.maxCount} />
                            : <div className="page-center"><Spinner animation="border" variant="light"/></div>
                        : <Alert variant="danger">Failed to fetch data from server.<br/>Either server is down or you've lost your connection.</Alert>
                    }
                </Container>
            }
        </CountContext.Consumer>
    );
};

export default Home;