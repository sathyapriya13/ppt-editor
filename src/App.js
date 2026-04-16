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
          x: 330,
          y: 180,
          content: "Welcome",
          size: 46,
          color: "#111827",
          bold: true,
        },
        {
          id: Date.now() + 1,
          type: "text",
          x: 335,
          y: 260,
          content: "A simple presentation editor",
          size: 24,
          color: "#6b7280",
          bold: false,
        },
      ],
    },
  ]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("slides");

    if (saved) {
      try {
        const parsedSlides = JSON.parse(saved);

        if (Array.isArray(parsedSlides) && parsedSlides.length > 0) {
          setSlides(parsedSlides);
        }
      } catch {
        localStorage.removeItem("slides");
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("slides", JSON.stringify(slides));
    alert("Presentation saved!");
  };

  const deleteSelectedElement = () => {
    if (!selectedId) return;

    setSlides((prev) => {
      const updated = [...prev];

      updated[currentSlide] = {
        ...updated[currentSlide],
        elements: updated[currentSlide].elements.filter(
          (item) => item.id !== selectedId
        ),
      };

      return updated;
    });

    setSelectedId(null);
  };

  const selectedElement =
    slides[currentSlide]?.elements.find((item) => item.id === selectedId) ||
    null;

  return (
    <div className="app">
      <Sidebar
        slides={slides}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        setSlides={setSlides}
        setSelectedId={setSelectedId}
      />

      <div className="main">
        <Ribbon
          slides={slides}
          setSlides={setSlides}
          currentSlide={currentSlide}
          selectedElement={selectedElement}
          setSelectedId={setSelectedId}
          onDeleteSelected={deleteSelectedElement}
          onSave={handleSave}
        />

        <Canvas
          slides={slides}
          setSlides={setSlides}
          currentSlide={currentSlide}
          setSelectedId={setSelectedId}
        />
      </div>
    </div>
  );
}

export default App;