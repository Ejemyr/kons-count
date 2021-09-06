import React from "react";
import { Row, Col } from "react-bootstrap";

function CountDisplay({count, lastUpdate, maxCount} = {count: 0, lastUpdate: 0, maxCount: 0}) {

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
            <Col xs={12} md={10} lg={9} xl={8} className="my-auto">
                <Row className="text-light mb-5">
                    <h1>
                        Current count in Kons:
                    </h1>
                </Row>
                <Row className="justify-content-center">
                    <Col className="outer-box">
                        <Row className="px-5 justify-content-center">
                            <Col xs={4} className="d-flex flex-grow-1 number-box my-5 justify-content-center">{count}</Col>
                            <Col className="slashBox my-5 text-center">/</Col>
                            <Col xs={4} className="d-flex flex-grow-1 number-box my-5 justify-content-center">{maxCount}</Col>
                        </Row>
                    </Col>
                </Row>
                <Row  className="text-light mt-4">
                    <h4>
                        Last reported on: <span id="time">{lastUpdateDateString}</span>
                    </h4>
                </Row>
            </Col>
        </Row>
    );  
}

export default CountDisplay;
