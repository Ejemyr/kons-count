import React from "react";
import { Row } from "react-bootstrap";
import './NotLive.css';

function NotLive() {
    return (
        <Row className="h-100 justify-content-center">
            <div className="outer-box my-auto">
                <Row className="h-100 justify-content-center">
                    <div id="no-event-live-text" className="my-auto">
                        Counter is not live
                    </div>
                </Row>
            </div>
        </Row>
    );
};

export default NotLive;