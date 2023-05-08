import React, { useCallback, useContext, useState } from "react";
import { Row, Col, Button, Alert, Modal, InputGroup, Form } from "react-bootstrap";
import './CounterPanel.css';
import { CountContext } from '../../contexts';
import { decreaseCountMembers, increaseCountMembers, decreaseCountGuests, increaseCountGuests, resetCount, setMaxCount, setLive } from "../../serverUtils/count";
import { FormControlLabel } from '@material-ui/core';
import { IOSSwitch } from "./IOSSwitch";

function CounterPanel() {
    const maxFailCount = 10;
    const [failed, setFailed] = useState(false);
    
    const context = useContext(CountContext);
    const [showModal, setShowModal] = useState(false);
    const [maxCountModalState, setMaxCountModalState] = useState(undefined);

    const onUpClickMember = useCallback((button, failCount = 0) => {
        increaseCountMembers()
            .then(res => {
                context.setCountMembers(res.countMembers);
            })
            .catch(async () => {
                failCount++;
                if (failCount < maxFailCount) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                    onUpClickMember(button, failCount);
                } else {
                    setFailed(true);
                }
            });
    }, [context]);

    const onDownClickMember = useCallback((button, failCount = 0) => {
        if (context.countMembers > 0) {
            decreaseCountMembers()
                .then(res => {
                    context.setCountMembers(res.countMembers);
                })
                .catch(async () => {
                    failCount++;
                    if (failCount < maxFailCount) {
                        await new Promise(resolve => setTimeout(resolve, 50));
                        onDownClickMember(button, failCount);
                    } else {
                        setFailed(true);
                    }
                });
        }
    }, [context]);

    const onUpClickGuest = useCallback((button, failCount = 0) => {
        increaseCountGuests()
            .then(res => {
                context.setCountGuests(res.countGuests);
            })
            .catch(async () => {
                failCount++;
                if (failCount < maxFailCount) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                    onUpClickGuest(button, failCount);
                } else {
                    setFailed(true);
                }
            });
    }, [context]);

    const onDownClickGuest = useCallback((button, failCount = 0) => {
        if (context.countGuests > 0) {
            decreaseCountGuests()
                .then(res => {
                    context.setCountGuests(res.countGuests);
                })
                .catch(async () => {
                    failCount++;
                    if (failCount < maxFailCount) {
                        await new Promise(resolve => setTimeout(resolve, 50));
                        onDownClickGuest(button, failCount);
                    } else {
                        setFailed(true);
                    }
                });
        }
    }, [context]);

    const onResetClick = useCallback((button, failCount = 0) => {
        resetCount()
            .then(res => {
                context.setCountMembers(res.countMembers);
                context.setCountGuests(res.countGuests);
            })
            .catch(async () => {
                console.log("Fail")
                failCount++;
                if (failCount < maxFailCount) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                    onResetClick(button, failCount);
                } else {
                    setFailed(true);
                }
            });
    }, [context]);

    const onSetMaxClick = useCallback(() => {
        setMaxCountModalState(context.maxCount);
        setShowModal(true);
    }, [context]);

    const setMaxValue = useCallback((value, failCount = 0) => {
        setMaxCount(value)
            .catch(async () => {
                failCount++;
                if (failCount < maxFailCount) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                    setMaxValue(value, failCount);
                } else {
                    setFailed(true);
                }
            });
    }, []);

    const handleModalSave = useCallback(() => {
        setShowModal(false);
        if (maxCountModalState !== context.maxCount) {
            setMaxValue(maxCountModalState);
        }
    }, [maxCountModalState, setMaxValue, context.maxCount]);
    

    const onModalInputChange = function(event) {
        setMaxCountModalState(parseInt(event.target.value));
    }
    const invalidModalInput = maxCountModalState === undefined || Number.isNaN(maxCountModalState) || maxCountModalState < 0;

    const onLiveChange = useCallback((event, failCount = 0) => {
        console.log(event.target.checked);
        setLive(event.target.checked)
            .catch(async () => {
                failCount++;
                if (failCount < maxFailCount) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                    setLive(event.target.checked, failCount);
                } else {
                    setFailed(true);
                }
            });
    }, []);

    return (
        <div className="d-flex justify-content-center">
            <Col className="h-100" id="counter-panel">
                {failed && <Alert variant="danger">An error in connection to server...</Alert>}
                <div id="live-panel" className="d-flex px-3 pt-3">
                    <FormControlLabel
                        control={<IOSSwitch checked={context.live|| false} onChange={onLiveChange} name="live-check" />}
                        label={"Counter is " + (context.live ? "live" : "off")}
                    />
                </div>
                <div id="count-panel" className="d-flex justify-content-center">
                    <Col>
                        <Row>
                            <div id="count-text-big" className="my-auto">{context.countGuests === undefined || context.countMembers === undefined ? "" : context.countGuests + context.countMembers}</div>
                        </Row>
                        <Row>
                            <Col>
                                <div id="count-text-small" className="my-auto">{context.countGuests}</div>
                            </Col>
                            <Col>
                                <div id="count-text-small" className="my-auto">{context.countMembers}</div>
                            </Col>
                        </Row>
                    </Col>
                </div>
                <Col id="control-panel" className="flex-grow-1">
										<Row id="description">
                        <Col className="d-grid"> Guests </Col>
                        <Col className="d-grid"> Members </Col>
										</Row>
                    <Row id="click-controls">
                        <Col className="d-grid">
                            <Button variant="success" size="lg" className="btn-sign" disabled={failed} onClick={onUpClickGuest}>
                                +
                            </Button>   
                        </Col>
                        <Col className="d-grid">
                            <Button variant="success" size="lg" className="btn-sign" disabled={failed} onClick={onUpClickMember}>
                                +
                            </Button>   
                        </Col>
                    </Row>
                    <Row id="click-controls">
                        <Col className="d-grid">
                            <Button variant="danger" size="lg" className="btn-sign" disabled={failed} onClick={onDownClickGuest}>
                                -
                            </Button>   
                        </Col>
                        <Col className="d-grid">
                            <Button id="orange-btn" size="lg" className="btn-sign" disabled={failed} onClick={onDownClickMember}>
                                -
                            </Button>
                        </Col>
                    </Row>
                    <Row id="special-controls">
                        <Col className="d-grid">
                            <Button variant="warning" disabled={failed} onClick={onResetClick}>
                                Reset
                            </Button>
                        </Col>
                        <Col className="d-grid">
                            <Button variant="light" disabled={failed} onClick={onSetMaxClick}>
                                Max ({context.maxCount})
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Col>
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Set max count</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <InputGroup hasValidation>
                    <InputGroup.Text>Max count:</InputGroup.Text>
                    <Form.Control 
                        type="text"
                        required
                        isInvalid={invalidModalInput}
                        onChange={onModalInputChange}
                        defaultValue={context.maxCount}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please choose a positive integer.
                    </Form.Control.Feedback>
                </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleModalSave} disabled={invalidModalInput}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
  
export default CounterPanel;
