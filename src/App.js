import React, { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Ribbon from "./components/Ribbon";
import Canvas from "./components/Canvas";

function App() {
  const [slides, setSlides] = useState([{ elements: [] }]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selected, setSelected] = useState(null);

  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // ✅ FIXED: deep copy + correct state
  const saveHistory = (newSlides) => {
    setHistory((prev) => [
      ...prev,
      JSON.parse(JSON.stringify(slides)) // 🔥 FIX
    ]);
    setRedoStack([]);
    setSlides(newSlides);
  };

  // ✅ FIXED undo
  const undo = () => {
    if (history.length === 0) return;

    const prev = history[history.length - 1];

    setRedoStack((r) => [
      JSON.parse(JSON.stringify(slides)), // 🔥 FIX
      ...r
    ]);

    setSlides(prev);
    setHistory((h) => h.slice(0, -1));
  };

  // ✅ FIXED redo
  const redo = () => {
    if (redoStack.length === 0) return;

    const next = redoStack[0];

    setHistory((h) => [
      ...h,
      JSON.parse(JSON.stringify(slides)) // 🔥 FIX
    ]);

    setSlides(next);
    setRedoStack((r) => r.slice(1));
  };

  return (
    <div className="app">
      <Sidebar
        slides={slides}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        setSlides={setSlides}
      />

      <div className="main">
        <Ribbon
          slides={slides}
          setSlides={setSlides}
          saveHistory={saveHistory}
          currentSlide={currentSlide}
          selected={selected}
          undo={undo}
          redo={redo}
        />

        <Canvas
          slides={slides}
          currentSlide={currentSlide}
          saveHistory={saveHistory}
          setSelected={setSelected}
        />
      </div>
    </div>
  );
}

export default App;
