import React, { useState, useRef } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { IoIosSwitch } from "react-icons/io";
import { FaBackspace, FaCalculator, FaChartPie } from "react-icons/fa";
import { historyService } from "./services/historyService";
import { AnalyticsDashboard } from "./components/Analytics";
import "./App.css";

function App() {
  const [result, setResult] = useState("");
  const inputRef = useRef(null);
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState("calculator");

  const saveCalculation = (expression, resultValue, success, functionUsed = null, errorType = null) => {
    historyService.addRecord({
      expression,
      result: resultValue,
      success,
      functionUsed,
      errorType
    });
  };

  function numberLog10() {
    const input = result;
    const output = Math.log10(result).toString();
    setResult(output);
    saveCalculation(input, output, true, "log10");
  }

  function fact() {
    const input = result;
    const r = factorial(n);
    const output = r.toString();
    setResult(output);
    saveCalculation(input, output, true, "factorial");
  }

  const n = result;

  function factorial(n) {
    if (n === 0) return 1;
    let f = 1;
    for (let i = 1; i < n; i++) {
      f = f * (i + 1);
    }
    return f;
  }

  function numberLog() {
    const input = result;
    const output = Math.log(result).toString();
    setResult(output);
    saveCalculation(input, output, true, "ln");
  }

  function exponent() {
    const input = result;
    const output = Math.exp(result).toString();
    setResult(output);
    saveCalculation(input, output, true, "exp");
  }

  function sin() {
    const input = result;
    const output = Math.sin(result).toString();
    setResult(output);
    saveCalculation(input, output, true, "sin");
  }

  function inversion() {
    const input = result;
    const output = (1 / result).toString();
    setResult(output);
    saveCalculation(input, output, true, "1/x");
  }

  function squareroot() {
    const input = result;
    const output = Math.sqrt(result).toString();
    setResult(output);
    saveCalculation(input, output, true, "sqrt");
  }

  function handleClick(e) {
    setResult(result.concat(e.target.name));
  }

  function del() {
    setResult(result.slice(0, result.length - 1));
  }

  function clear() {
    setResult("");
  }

  function calculate() {
    const expression = result;
    try {
      const evalResult = eval(result).toString();
      setResult(evalResult);
      saveCalculation(expression, evalResult, true);
    } catch (error) {
      saveCalculation(expression, null, false, null, "Syntax Error");
      setResult(alert("Clear All then Enter again"));
    }
  }

  return (
    <div className="App">
      <Container fluid>
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
          fill
        >
          <Tab
            eventKey="calculator"
            title={
              <span>
                <FaCalculator className="me-2" />
                Calculator
              </span>
            }
          >
            <div>
              <h2> React Calculator </h2>
              <br />
              <br />
              <Row className="justify-content-md-center" xs={1} md={4} lg={4}>
                <Form>
                  <input
                    id="input"
                    className="inputfield"
                    type="text"
                    value={result}
                    ref={inputRef}
                  ></input>

                  <hr />
                </Form>
              </Row>
            </div>
            <div>
              {show ? (
                <Row className="justify-content-md-center" xs={1} md={4} lg={4}>
                  <Col xs="3" md="1" lg="1" className="btn">
                    <Button
                      variant="outline-primary"
                      onClick={squareroot}
                      name="7"
                      block
                    >
                      Sqrt
                    </Button>
                  </Col>
                  <Col xs="3" md="1" lg="1" className="btn">
                    <Button variant="outline-primary" onClick={sin} block>
                      Sin
                    </Button>
                  </Col>
                  <Col xs="3" md="1" lg="1" className="btn">
                    <Button
                      variant="outline-primary"
                      onClick={handleClick}
                      name="3.14"
                      block
                    >
                      pi
                    </Button>
                  </Col>
                  <Col xs="3" md="1" lg="1" className="btn">
                    <Button
                      variant="outline-primary"
                      onClick={handleClick}
                      name="("
                      block
                    >
                      (
                    </Button>
                  </Col>
                  <Col xs="3" md="1" lg="1" className="btn">
                    <Button
                      variant="outline-primary"
                      onClick={handleClick}
                      name=")"
                      block
                    >
                      )
                    </Button>
                  </Col>
                </Row>
              ) : null}
              <Row className="justify-content-md-center" xs={1} md={4} lg={4}>
                {show ? (
                  <Col xs="3" md="1" lg="1" className="btn">
                    <Button variant="outline-primary" onClick={inversion} block>
                      1/X
                    </Button>
                  </Col>
                ) : null}
                <Col xs="3" md="1" lg="1" className="btn">
                  <Button
                    variant="outline-primary"
                    onClick={handleClick}
                    name="7"
                    block
                  >
                    7
                  </Button>
                </Col>
                <Col xs="3" md="1" lg="1" className="btn">
                  <Button
                    variant="outline-primary"
                    onClick={handleClick}
                    name="8"
                    block
                  >
                    8
                  </Button>
                </Col>
                <Col xs="3" md="1" lg="1" className="btn">
                  <Button
                    variant="outline-primary"
                    onClick={handleClick}
                    name="9"
                    block
                  >
                    9
                  </Button>
                </Col>
                <Col xs="3" md="1" lg="1" className="btn">
                  <Button
                    variant="outline-primary"
                    onClick={handleClick}
                    name="/"
                    block
                  >
                    /
                  </Button>
                </Col>
              </Row>
              <Row className="justify-content-md-center" xs={1} md={4} lg={4}>
                {show ? (
                  <Col xs="3" md="1" lg="1" className="btn">
                    <Button
                      variant="outline-primary"
                      onClick={numberLog10}
                      name="lg"
                      block
                    >
                      lg
                    </Button>
                  </Col>
                ) : null}
                <Col xs="3" md="1" lg="1" className="btn">
                  <Button
                    variant="outline-primary"
                    onClick={handleClick}
                    name="4"
                    block
                  >
                    4
                  </Button>
                </Col>
                <Col xs="3" md="1" lg="1" className="btn">
                  <Button
                    variant="outline-primary"
                    onClick={handleClick}
                    name="5"
                    block
                  >
                    5
                  </Button>
                </Col>
                <Col xs="3" md="1" lg="1" className="btn">
                  <Button
                    variant="outline-primary"
                    onClick={handleClick}
                    name="6"
                    block
                  >
                    6
                  </Button>
                </Col>
                <Col xs="3" md="1" lg="1" className="btn">
                  <Button
                    variant="outline-primary"
                    onClick={handleClick}
                    name="-"
                    block
                  >
                    -
                  </Button>
                </Col>
              </Row>
              <Row className="justify-content-md-center" xs={1} md={4} lg={4}>
                {show ? (
                  <Col xs="3" md="1" lg="1" className="btn">
                    <Button variant="outline-primary" onClick={numberLog} block>
                      In
                    </Button>
                  </Col>
                ) : null}
                <Col xs="3" md="1" lg="1" className="btn">
                  <Button
                    variant="outline-primary"
                    onClick={handleClick}
                    name="1"
                    block
                  >
                    1
                  </Button>
                </Col>
                <Col xs="3" md="1" lg="1" className="btn">
                  <Button
                    variant="outline-primary"
                    onClick={handleClick}
                    name="2"
                    block
                  >
                    2
                  </Button>
                </Col>
                <Col xs="3" md="1" lg="1" className="btn">
                  <Button
                    variant="outline-primary"
                    onClick={handleClick}
                    name="3"
                    block
                  >
                    3
                  </Button>
                </Col>
                <Col xs="3" md="1" lg="1" className="btn">
                  <Button
                    variant="outline-primary"
                    onClick={handleClick}
                    name="+"
                    block
                  >
                    +
                  </Button>
                </Col>
              </Row>
              <Row className="justify-content-md-center" xs={1} md={4} lg={4}>
                {show ? (
                  <Col xs="3" md="1" lg="1" className="btn">
                    <Button variant="outline-primary" onClick={exponent} block>
                      e
                    </Button>
                  </Col>
                ) : null}
                <Col xs="3" md="1" lg="1" className="btn">
                  <Button
                    variant="outline-primary"
                    onClick={handleClick}
                    name="0"
                    block
                  >
                    0
                  </Button>
                </Col>
                <Col xs="3" md="1" lg="1" className="btn">
                  <Button
                    variant="outline-primary"
                    onClick={handleClick}
                    name="."
                    block
                  >
                    .
                  </Button>
                </Col>
                <Col xs="3" md="1" lg="1" className="btn">
                  <Button
                    variant="outline-primary"
                    onClick={calculate}
                    name="="
                    block
                  >
                    =
                  </Button>
                </Col>
                <Col xs="3" md="1" lg="1" className="btn">
                  <Button
                    variant="outline-primary"
                    onClick={handleClick}
                    name="*"
                    block
                  >
                    &times;
                  </Button>
                </Col>
              </Row>
              <Row className="justify-content-md-center" xs={4} md={4} lg={4}>
                <Col xs="3" md="1" lg="1" className="btn">
                  <Button
                    variant="outline-primary"
                    onClick={() => setShow(!show)}
                    id="collapse"
                    block
                  >
                    <IoIosSwitch />
                  </Button>
                </Col>
                {show ? (
                  <Col xs="3" md="1" lg="1" className="btn">
                    <Button variant="outline-primary" onClick={fact} block>
                      X!
                    </Button>
                  </Col>
                ) : null}
                <Col xs="3" md="1" lg="1" className="btn">
                  <Button variant="outline-primary" onClick={del} id="delete" block>
                    <FaBackspace />
                  </Button>
                </Col>
                <Col xs="3" md="1" lg="1" className="btn">
                  <Button
                    variant="outline-primary"
                    onClick={clear}
                    id="clear"
                    block
                  >
                    AC
                  </Button>
                </Col>
                <Col xs="3" md="1" lg="1" className="btn">
                  <Button
                    variant="outline-primary"
                    onClick={handleClick}
                    name="%"
                    block
                  >
                    %
                  </Button>
                </Col>
              </Row>
            </div>
          </Tab>
          <Tab
            eventKey="analytics"
            title={
              <span>
                <FaChartPie className="me-2" />
                Analytics
              </span>
            }
          >
            <AnalyticsDashboard />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
}
export default App;
