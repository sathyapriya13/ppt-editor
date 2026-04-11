import React, { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Ribbon from "./components/Ribbon";
import Canvas from "./components/Canvas";

function App() {
  const [slides, setSlides] = useState([{ elements: [] }]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selected, setSelected] = useState(null);

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
        />

        <Canvas
          elements={slides[currentSlide]?.elements || []}
          slides={slides}
          setSlides={setSlides}
          currentSlide={currentSlide}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
    </div>
  );
}

export default App;
