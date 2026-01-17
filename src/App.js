import React, { useState, useCallback } from "react";
import Container from "react-bootstrap/Container";
import CustomCalculator from "./components/CustomCalculator";
import LayoutEditor from "./components/LayoutEditor";
import "./App.css";

function App() {
  const [showEditor, setShowEditor] = useState(false);
  const [layoutKey, setLayoutKey] = useState(0);

  const handleLayoutChange = useCallback((newLayout) => {
    console.log("Layout updated successfully");
    setLayoutKey(prev => prev + 1);
    setShowEditor(false);
  }, []);

  return (
    <div className="App">
      <Container fluid>
        <div className="text-center mb-4">
          <h2> React Calculator </h2>
        </div>
        <CustomCalculator key={layoutKey} onOpenEditor={() => setShowEditor(true)} />
        <LayoutEditor
          show={showEditor}
          onHide={() => setShowEditor(false)}
          onLayoutChange={handleLayoutChange}
        />
      </Container>
    </div>
  );
}

export default App;
