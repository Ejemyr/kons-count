import React, { useCallback, useContext, useState } from "react";
import { Row, Col, Button, Alert, Modal, InputGroup, Form } from "react-bootstrap";
import './CounterPanel.css';

import { CountContext } from '../../contexts';
import { decreaseCount, increaseCount, resetCount, setMaxCount } from "../../serverUtils/count";

function CounterPanel() {
    const maxFailCount = 10;
    const [failed, setFailed] = useState(false);
    
    const context = useContext(CountContext);
    const [showModal, setShowModal] = useState(false);
    const [maxCountModalState, setMaxCountModalState] = useState(undefined);

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

    return (
        <>
            {failed && <Alert variant="danger">An error in connection to server...</Alert>}
            <Col className="d-flex flex-column h-100 text-center" id="counter-panel">
                <Row className="my-5">
                    <h1 id="current-count-text">{context.count}</h1>
                </Row>
                <Row className="flex-grow-1">
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
                <Row className="">
                    <Col className="d-grid">
                        <Button variant="warning" size="lg" className="btn-text" disabled={failed} onClick={onResetClick}>
                            Reset count
                        </Button>
                    </Col>
                    <Col className="d-grid">
                        <Button variant="light" size="lg" className="btn-text" disabled={failed} onClick={onSetMaxClick}>
                            Change max ({context.maxCount})
                        </Button>
                    </Col>
                </Row>
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
        </>
    );
}
  
export default CounterPanel;