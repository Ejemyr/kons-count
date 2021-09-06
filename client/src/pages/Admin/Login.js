import React from "react";
import { Row, Col } from "react-bootstrap";
import GoogleLogin from 'react-google-login';
import { login } from "../../serverUtils/authentication";

function Login({setLoggedIn}) {

    function responseGoogleSuccess(callbackData) {
        login(callbackData.tokenId)
            .then(res => { setLoggedIn(res.loggedIn) })
            .catch(console.error);
    }
    function responseGoogleFailure(callbackData) {
        console.error(callbackData);
    }

    return (
        <Row className="h-100 justify-content-center">
            <Col className="my-auto outer-box">
                <Row className="mt-5">
                    <h1>Logga in här:</h1>
                </Row>
                <Row className="mb-4 mb-sm-2 mb-md-0">
                    <Col>
                        <GoogleLogin
                            clientId={process.env.REACT_APP_CLIENT_ID}
                            onSuccess={responseGoogleSuccess}
                            onFailure={responseGoogleFailure}
                            cookiePolicy={'single_host_origin'}
                        />
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}

export default Login;