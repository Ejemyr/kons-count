import React from "react";
import { Row, Col } from "react-bootstrap";
import GoogleLogin from 'react-google-login';
import { login } from "../../serverUtils/authentication";
import './Login.css'

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
            <div className="d-flex my-auto outer-box">
                <Col className="justify-content-center my-auto">
                    <h1 id="login-header-text" className="text-center">Logga in här</h1>
                    <div id="spacer"/>
                    <div id="google-button-container">
                        <GoogleLogin
                            clientId={process.env.REACT_APP_CLIENT_ID}
                            onSuccess={responseGoogleSuccess}
                            onFailure={responseGoogleFailure}
                            cookiePolicy={'single_host_origin'}
                        />
                    </div>
                </Col>
            </div>
        </Row>
    );
}

export default Login;