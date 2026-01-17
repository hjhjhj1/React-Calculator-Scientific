import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import "./LayoutEditor.css";

const STORAGE_KEY = "calculator_layout";

const defaultLayout = [
  { id: "sqrt", label: "Sqrt", action: "squareroot", row: 0, col: 0, size: 1 },
  { id: "sin", label: "Sin", action: "sin", row: 0, col: 1, size: 1 },
  { id: "pi", label: "pi", action: "pi", row: 0, col: 2, size: 1 },
  { id: "openParen", label: "(", action: "openParen", row: 0, col: 3, size: 1 },
  { id: "closeParen", label: ")", action: "closeParen", row: 0, col: 4, size: 1 },
  { id: "inversion", label: "1/X", action: "inversion", row: 1, col: 0, size: 1 },
  { id: "7", label: "7", action: "number", value: "7", row: 1, col: 1, size: 1 },
  { id: "8", label: "8", action: "number", value: "8", row: 1, col: 2, size: 1 },
  { id: "9", label: "9", action: "number", value: "9", row: 1, col: 3, size: 1 },
  { id: "divide", label: "/", action: "operator", value: "/", row: 1, col: 4, size: 1 },
  { id: "log10", label: "lg", action: "numberLog10", row: 2, col: 0, size: 1 },
  { id: "4", label: "4", action: "number", value: "4", row: 2, col: 1, size: 1 },
  { id: "5", label: "5", action: "number", value: "5", row: 2, col: 2, size: 1 },
  { id: "6", label: "6", action: "number", value: "6", row: 2, col: 3, size: 1 },
  { id: "subtract", label: "-", action: "operator", value: "-", row: 2, col: 4, size: 1 },
  { id: "log", label: "In", action: "numberLog", row: 3, col: 0, size: 1 },
  { id: "1", label: "1", action: "number", value: "1", row: 3, col: 1, size: 1 },
  { id: "2", label: "2", action: "number", value: "2", row: 3, col: 2, size: 1 },
  { id: "3", label: "3", action: "number", value: "3", row: 3, col: 3, size: 1 },
  { id: "add", label: "+", action: "operator", value: "+", row: 3, col: 4, size: 1 },
  { id: "exponent", label: "e", action: "exponent", row: 4, col: 0, size: 1 },
  { id: "0", label: "0", action: "number", value: "0", row: 4, col: 1, size: 1 },
  { id: "dot", label: ".", action: "operator", value: ".", row: 4, col: 2, size: 1 },
  { id: "equals", label: "=", action: "calculate", row: 4, col: 3, size: 1 },
  { id: "multiply", label: "×", action: "operator", value: "*", row: 4, col: 4, size: 1 },
  { id: "switch", label: "⇄", action: "switch", row: 5, col: 0, size: 1 },
  { id: "factorial", label: "X!", action: "fact", row: 5, col: 1, size: 1 },
  { id: "backspace", label: "⌫", action: "del", row: 5, col: 2, size: 1 },
  { id: "clear", label: "AC", action: "clear", row: 5, col: 3, size: 1 },
  { id: "percent", label: "%", action: "operator", value: "%", row: 5, col: 4, size: 1 },
];

const LayoutEditor = ({ show, onHide, onLayoutChange }) => {
  const [buttons, setButtons] = useState([]);
  const [draggedButton, setDraggedButton] = useState(null);
  const editorRef = useRef(null);

  useEffect(() => {
    loadLayout();
  }, []);

  const loadLayout = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setButtons(JSON.parse(saved));
      } else {
        setButtons([...defaultLayout]);
      }
    } catch (error) {
      console.error("Failed to load layout:", error);
      setButtons([...defaultLayout]);
    }
  };

  const saveLayout = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(buttons));
      if (onLayoutChange) {
        onLayoutChange(buttons);
      }
    } catch (error) {
      console.error("Failed to save layout:", error);
    }
  };

  const handleDragStart = (e, button) => {
    setDraggedButton(button);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetRow, targetCol) => {
    e.preventDefault();
    if (!draggedButton) return;

    setButtons((prevButtons) => {
      const updatedButtons = prevButtons.map((btn) => {
        if (btn.id === draggedButton.id) {
          return { ...btn, row: targetRow, col: targetCol };
        }
        if (btn.row === targetRow && btn.col === targetCol) {
          return { ...btn, row: draggedButton.row, col: draggedButton.col };
        }
        return btn;
      });
      return updatedButtons;
    });

    setDraggedButton(null);
  };

  const handleSizeChange = (buttonId, newSize) => {
    setButtons((prevButtons) =>
      prevButtons.map((btn) =>
        btn.id === buttonId ? { ...btn, size: Math.max(1, Math.min(3, newSize)) } : btn
      )
    );
  };

  const resetToDefault = () => {
    setButtons([...defaultLayout]);
  };

  const handleSave = () => {
    saveLayout();
    onHide();
  };

  const renderGrid = () => {
    const grid = Array(6)
      .fill(null)
      .map(() => Array(5).fill(null));

    buttons.forEach((button) => {
      if (button.row < grid.length && button.col < grid[0].length) {
        grid[button.row][button.col] = button;
      }
    });

    return grid.map((row, rowIndex) => (
      <Row key={rowIndex} className="grid-row">
        {row.map((button, colIndex) => (
          <Col
            key={`${rowIndex}-${colIndex}`}
            xs={2}
            className="d-flex justify-content-center align-items-center"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
            style={{ minHeight: "100px", padding: "8px" }}
          >
            {button ? (
              <Card
                draggable
                onDragStart={(e) => handleDragStart(e, button)}
                className="btn-editor-item h-100"
                style={{ cursor: "grab", width: "100%" }}
                border={draggedButton?.id === button.id ? "primary" : "light"}
              >
                <Card.Body className="d-flex flex-column justify-content-center align-items-center p-2">
                  <Button
                    variant="primary"
                    size="sm"
                    block
                    className="mb-2"
                    style={{ fontWeight: "600" }}
                  >
                    {button.label}
                  </Button>
                  <div className="size-controls">
                    <Button
                      variant="outline-info"
                      size="sm"
                      onClick={() => handleSizeChange(button.id, button.size - 1)}
                    >
                      −
                    </Button>
                    <span className="size-display">Size: {button.size}</span>
                    <Button
                      variant="outline-info"
                      size="sm"
                      onClick={() => handleSizeChange(button.id, button.size + 1)}
                    >
                      +
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ) : (
              <div
                className="placeholder h-100"
              />
            )}
          </Col>
        ))}
      </Row>
    ));
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>布局编辑器</Modal.Title>
      </Modal.Header>
      <Modal.Body ref={editorRef}>
        <div className="mb-3">
          <p className="text-muted">拖拽按钮来重新排列，使用±按钮调整大小</p>
        </div>
        {renderGrid()}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={resetToDefault}>
          恢复默认布局
        </Button>
        <Button variant="primary" onClick={handleSave}>
          保存布局
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LayoutEditor;
export { STORAGE_KEY, defaultLayout };
