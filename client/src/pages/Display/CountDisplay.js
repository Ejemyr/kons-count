import React from "react";
import { Row, Col } from "react-bootstrap";
import './CountDisplay.css';

function CountDisplay({countMembers, countGuests, lastUpdate, maxCount} = {countMembers: 0, countGuests : 0, lastUpdate: 0, maxCount: 0}) {

    var lastUpdateDateString = "--";
    if(lastUpdate !== undefined) {
        const lastUpdateDate = new Date(0);
        lastUpdateDate.setUTCSeconds(lastUpdate);
        lastUpdateDateString = lastUpdateDate.toLocaleString(
            "en-GB",
            {
                dateStyle: "long",
                timeStyle: "short"
            }
        );
    }

    return (
        <Row className="h-100 justify-content-center">
            <Col className="my-auto">
                <Row>
                    <div id="current-count-header" className="text-light">
                        Current count in Kons:
                    </div>
                </Row>
                <Row className="justify-content-center">
                    <div className="outer-box">
                        <Row className="h-100 justify-content-center text-center">
                            <div className="d-flex number-box my-auto justify-content-center"><div className="my-auto">{countGuests}</div></div>
                            <div className="d-flex number-box my-auto justify-content-center"><div className="my-auto">{countMembers}</div></div>
                            <div className="d-flex number-box my-auto justify-content-center"><div className="my-auto">{countGuests === undefined || countMembers === undefined ? "" : countGuests + countMembers}</div></div>
                            <div className="d-flex number-box my-auto justify-content-center"><div className="my-auto">{maxCount}</div></div>
                        </Row>
                    </div>
                </Row>
                <Row>
                    <div id="last-reported-text" className="text-light">
                        Last reported on: <span id="time">{lastUpdateDateString}</span>
                    </div>
                </Row>
            </Col>
        </Row>
    );  
}

export default CountDisplay;
