import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { IoIosSwitch } from "react-icons/io";
import { FaBackspace } from "react-icons/fa";
import { defaultLayout, STORAGE_KEY } from "./LayoutEditor";

const CustomCalculator = ({ onOpenEditor, onLayoutUpdate }) => {
  const [result, setResult] = useState("");
  const [show, setShow] = useState(false);
  const [layout, setLayout] = useState([]);

  useEffect(() => {
    loadLayout();
  }, []);

  const loadLayout = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setLayout(JSON.parse(saved));
      } else {
        setLayout([...defaultLayout]);
      }
    } catch (error) {
      console.error("Failed to load layout:", error);
      setLayout([...defaultLayout]);
    }
  };

  const refreshLayout = () => {
    loadLayout();
  };

  const numberLog10 = () => {
    setResult(Math.log10(result).toString());
  };

  const fact = () => {
    const r = factorial(parseFloat(result));
    setResult(r.toString());
  };

  const factorial = (n) => {
    if (n === 0) return 1;
    let f = 1;
    for (let i = 1; i < n; i++) {
      f = f * (i + 1);
    }
    return f;
  };

  const numberLog = () => {
    setResult(Math.log(result).toString());
  };

  const exponent = () => {
    setResult(Math.exp(result).toString());
  };

  const sin = () => {
    setResult(Math.sin(result).toString());
  };

  const inversion = () => {
    setResult((1 / result).toString());
  };

  const squareroot = () => {
    setResult(Math.sqrt(result).toString());
  };

  const handleClick = (value) => {
    setResult(result.concat(value));
  };

  const del = () => {
    setResult(result.slice(0, result.length - 1));
  };

  const clear = () => {
    setResult("");
  };

  const calculate = () => {
    try {
      setResult(eval(result).toString());
    } catch (error) {
      alert("Clear All then Enter again");
      setResult("");
    }
  };

  const handleButtonAction = (button) => {
    switch (button.action) {
      case "number":
        handleClick(button.value);
        break;
      case "operator":
        handleClick(button.value);
        break;
      case "squareroot":
        squareroot();
        break;
      case "sin":
        sin();
        break;
      case "inversion":
        inversion();
        break;
      case "numberLog10":
        numberLog10();
        break;
      case "numberLog":
        numberLog();
        break;
      case "exponent":
        exponent();
        break;
      case "fact":
        fact();
        break;
      case "calculate":
        calculate();
        break;
      case "del":
        del();
        break;
      case "clear":
        clear();
        break;
      case "switch":
        setShow(!show);
        break;
      case "pi":
        handleClick("3.14");
        break;
      case "openParen":
        handleClick("(");
        break;
      case "closeParen":
        handleClick(")");
        break;
      default:
        break;
    }
  };

  const renderButtons = () => {
    const filteredLayout = layout
      .filter((btn) => {
        if ((btn.id === "sqrt" || btn.id === "sin" || btn.id === "pi" || btn.id === "openParen" || btn.id === "closeParen") && !show) {
          return false;
        }
        if ((btn.id === "inversion" || btn.id === "log10" || btn.id === "log" || btn.id === "exponent" || btn.id === "factorial") && !show) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (a.row !== b.row) return a.row - b.row;
        return a.col - b.col;
      });

    const rows = {};
    filteredLayout.forEach((button) => {
      if (!rows[button.row]) {
        rows[button.row] = [];
      }
      rows[button.row].push(button);
    });

    return Object.keys(rows).map((rowKey) => {
      const buttonsInRow = rows[rowKey].sort((a, b) => a.col - b.col);
      return (
        <Row key={rowKey} className="justify-content-md-center mb-1">
          {buttonsInRow.map((button) => (
            <Col key={button.id} xs={button.size * 2} className="btn">
              <Button
                variant="outline-primary"
                onClick={() => handleButtonAction(button)}
                block
              >
                {button.id === "switch" && <IoIosSwitch />}
                {button.id === "backspace" && <FaBackspace />}
                {button.id !== "switch" && button.id !== "backspace" && button.label}
              </Button>
            </Col>
          ))}
        </Row>
      );
    });
  };

  return (
    <Container className="calculator-container">
      <div className="input-container mb-3 d-flex justify-content-center">
        <input
          id="input"
          className="inputfield"
          type="text"
          value={result}
          placeholder="0"
        />
      </div>
      <div className="buttons-container">{renderButtons()}</div>
      <div className="mt-3 text-center">
        <Button variant="outline-success" onClick={onOpenEditor}>
          打开布局编辑器
        </Button>
      </div>
    </Container>
  );
};

export default CustomCalculator;
