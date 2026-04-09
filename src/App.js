import React, { useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Ribbon from "./components/Ribbon";
import Canvas from "./components/Canvas";

function App() {
  const [slides, setSlides] = useState([
    {
      elements: [
        {
          id: Date.now(),
          type: "text",
          x: 100,
          y: 100,
          content: "Hello",
          size: 20,
          color: "#000",
          bold: false
        }
      ]
    }
  ]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selected, setSelected] = useState(null);

  // ✅ LOAD saved slides
  useEffect(() => {
    const saved = localStorage.getItem("slides");
    if (saved) {
      setSlides(JSON.parse(saved));
    }
  }, []);

  // ✅ SAVE function
  const handleSave = () => {
    localStorage.setItem("slides", JSON.stringify(slides));
    alert("Saved!");
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
          currentSlide={currentSlide}
          selected={selected}
          onSave={handleSave}
        />

        <Canvas
          slides={slides}
          setSlides={setSlides}
          currentSlide={currentSlide}
          setSelected={setSelected}
        />
      </div>
    </div>
  );
}

export default App;
