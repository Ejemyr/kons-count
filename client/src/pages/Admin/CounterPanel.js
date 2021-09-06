import React, { useCallback, useContext, useState } from "react";
import { Row, Col, Button, Alert, Modal, InputGroup, Form } from "react-bootstrap";
import './CounterPanel.css';
import { CountContext } from '../../contexts';
import { decreaseCount, increaseCount, resetCount, setMaxCount, setLive } from "../../serverUtils/count";
import { FormControlLabel } from '@material-ui/core';
import { IOSSwitch } from "./IOSSwitch";

function CounterPanel() {
    const maxFailCount = 10;
    const [failed, setFailed] = useState(false);
    
    const context = useContext(CountContext);
    const [showModal, setShowModal] = useState(false);
    const [maxCountModalState, setMaxCountModalState] = useState(undefined);
    const [liveSwitchState, setLiveSwitchState] = useState(context.live);

    const onUpClick = useCallback((failCount = 0) => {
        increaseCount()
            .then(res => {
                context.setCount(res.count);
            })
            .catch(async () => {
                failCount++;
                if (failCount < maxFailCount) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                    onUpClick(failCount);
                } else {
                    setFailed(true);
                }
            });
    }, [context]);

    const onDownClick = useCallback((failCount = 0) => {
        if (context.count > 0) {
            decreaseCount()
                .then(res => {
                    context.setCount(res.count);
                })
                .catch(async () => {
                    failCount++;
                    if (failCount < maxFailCount) {
                        await new Promise(resolve => setTimeout(resolve, 50));
                        onDownClick(failCount);
                    } else {
                        setFailed(true);
                    }
                });
        }
    }, [context]);

    const onResetClick = useCallback((failCount = 0) => {
        resetCount()
            .then(res => {
                context.setCount(res.count);
            })
            .catch(async () => {
                failCount++;
                if (failCount < maxFailCount) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                    onResetClick(failCount);
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

    const onLiveSwitchChange = useCallback((event, failCount = 0) => {
        console.log(event.target.checked);
        setLiveSwitchState(event.target.checked);
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
                        control={<IOSSwitch checked={liveSwitchState || false} onChange={onLiveSwitchChange} name="live-check" />}
                        label={"Counter is " + (liveSwitchState ? "live" : "off")}
                    />
                </div>
                <div id="count-panel" className="d-flex justify-content-center">
                    <div id="count-text" className="my-auto">{context.count}</div>
                </div>
                <Col id="control-panel" className="flex-grow-1">
                    <Row id="click-controls">
                        <Col className="d-grid">
                            <Button variant="danger" size="lg" className="btn-sign" disabled={failed} onClick={onDownClick}>
                                -
                            </Button>
                        </Col>
                        <Col className="d-grid">
                            <Button variant="success" size="lg" className="btn-sign" disabled={failed} onClick={onUpClick}>
                                +
                            </Button>   
                        </Col>
                    </Row>
                    <Row id="special-controls">
                        <Col className="d-grid">
                            <Button variant="warning" disabled={failed} onClick={onResetClick}>
                                Reset count
                            </Button>
                        </Col>
                        <Col className="d-grid">
                            <Button variant="light" disabled={failed} onClick={onSetMaxClick}>
                                Change max ({context.maxCount})
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