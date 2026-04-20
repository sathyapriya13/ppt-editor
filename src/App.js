import React, { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Ribbon from "./components/Ribbon";
import Canvas from "./components/Canvas";

function App() {
  const defaultSlides = [
    {
      elements: [
        {
          id: Date.now(),
          type: "text",
          x: 275,
          y: 120,
          content: "Click to add title",
          size: 44,
          color: "#1F6F5F",
          bold: true,
        },
        {
          id: Date.now() + 1,
          type: "text",
          x: 355,
          y: 210,
          content: "Click to add subtitle",
          size: 24,
          color: "#2FA084",
          bold: false,
        },
      ],
      notes: "",
    },
  ];

  const [slides, setSlides] = useState(defaultSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);
  const [presenterOpen, setPresenterOpen] = useState(false);
  const [presenterIndex, setPresenterIndex] = useState(0);

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

  const saveHistory = () => {
    setPast((prev) => [...prev.slice(-19), slides]);
    setFuture([]);
  };

  const handleSave = () => {
    localStorage.setItem("slides", JSON.stringify(slides));
    alert("Presentation saved!");
  };

  const exportPresentation = () => {
    const file = new Blob([JSON.stringify({ slides }, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = "presentation.json";
    link.click();

    URL.revokeObjectURL(url);
  };

  const importPresentation = (file) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const importedSlides = Array.isArray(parsed) ? parsed : parsed.slides;

        if (!Array.isArray(importedSlides) || importedSlides.length === 0) {
          throw new Error("Invalid file");
        }

        setSlides(
          importedSlides.map((slide) => ({
            elements: Array.isArray(slide.elements) ? slide.elements : [],
            notes: slide.notes || "",
          }))
        );

        setCurrentSlide(0);
        setSelectedId(null);
        alert("Presentation imported successfully!");
      } catch {
        alert("Import failed. Please choose a valid presentation JSON file.");
      }
    };

    reader.readAsText(file);
  };

  const undo = () => {
    if (past.length === 0) return;

    const previous = past[past.length - 1];

    setFuture((prev) => [slides, ...prev]);
    setSlides(previous);
    setPast((prev) => prev.slice(0, -1));
    setSelectedId(null);
  };

  const redo = () => {
    if (future.length === 0) return;

    const next = future[0];

    setPast((prev) => [...prev, slides]);
    setSlides(next);
    setFuture((prev) => prev.slice(1));
    setSelectedId(null);
  };

  const addSlide = () => {
    saveHistory();

    setSlides((prev) => [...prev, { elements: [], notes: "" }]);
    setCurrentSlide(slides.length);
    setSelectedId(null);
  };

  const deleteSlide = (index) => {
    if (slides.length === 1) return;

    saveHistory();

    const updated = slides.filter((_, i) => i !== index);

    setSlides(updated);
    setCurrentSlide(index === 0 ? 0 : index - 1);
    setSelectedId(null);
  };

  const moveSlideUp = (index) => {
    if (index === 0) return;

    saveHistory();

    const updated = [...slides];

    [updated[index], updated[index - 1]] = [
      updated[index - 1],
      updated[index],
    ];

    setSlides(updated);
    setCurrentSlide(index - 1);
    setSelectedId(null);
  };

  const moveSlideDown = (index) => {
    if (index === slides.length - 1) return;

    saveHistory();

    const updated = [...slides];

    [updated[index], updated[index + 1]] = [
      updated[index + 1],
      updated[index],
    ];

    setSlides(updated);
    setCurrentSlide(index + 1);
    setSelectedId(null);
  };

  const reorderSlides = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;

    saveHistory();

    const updated = [...slides];
    const [movedSlide] = updated.splice(fromIndex, 1);

    updated.splice(toIndex, 0, movedSlide);

    setSlides(updated);
    setCurrentSlide(toIndex);
    setSelectedId(null);
  };

  const addTextBox = () => {
    saveHistory();

    const id = Date.now();

    setSlides((prev) => {
      const updated = [...prev];

      updated[currentSlide] = {
        ...updated[currentSlide],
        elements: [
          ...updated[currentSlide].elements,
          {
            id,
            type: "text",
            x: 120,
            y: 120,
            content: "Text box",
            size: 28,
            color: "#1F6F5F",
            bold: false,
          },
        ],
      };

      return updated;
    });

    setSelectedId(id);
  };

  const addImageFromUrl = () => {
    const url = prompt("Paste a direct image URL");

    if (!url) return;

    saveHistory();

    const id = Date.now();

    setSlides((prev) => {
      const updated = [...prev];

      updated[currentSlide] = {
        ...updated[currentSlide],
        elements: [
          ...updated[currentSlide].elements,
          {
            id,
            type: "image",
            x: 120,
            y: 120,
            url,
            scaleX: 0.5,
            scaleY: 0.5,
          },
        ],
      };

      return updated;
    });

    setSelectedId(id);
  };

  const uploadImage = (file) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      saveHistory();

      const id = Date.now();

      setSlides((prev) => {
        const updated = [...prev];

        updated[currentSlide] = {
          ...updated[currentSlide],
          elements: [
            ...updated[currentSlide].elements,
            {
              id,
              type: "image",
              x: 120,
              y: 120,
              url: reader.result,
              scaleX: 0.5,
              scaleY: 0.5,
            },
          ],
        };

        return updated;
      });

      setSelectedId(id);
    };

    reader.readAsDataURL(file);
  };

  const addShape = (shapeType) => {
    saveHistory();

    const id = Date.now();

    setSlides((prev) => {
      const updated = [...prev];

      updated[currentSlide] = {
        ...updated[currentSlide],
        elements: [
          ...updated[currentSlide].elements,
          {
            id,
            type: "shape",
            shape: shapeType,
            x: 140,
            y: 140,
            width: 140,
            height: 90,
            fill: shapeType === "line" ? "transparent" : "#6FCF97",
            stroke: "#2FA084",
            scaleX: 1,
            scaleY: 1,
          },
        ],
      };

      return updated;
    });

    setSelectedId(id);
  };

  const updateSelectedElement = (changes) => {
    if (!selectedId) return;

    saveHistory();

    setSlides((prev) => {
      const updated = [...prev];

      updated[currentSlide] = {
        ...updated[currentSlide],
        elements: updated[currentSlide].elements.map((item) =>
          item.id === selectedId ? { ...item, ...changes } : item
        ),
      };

      return updated;
    });
  };

  const updateElementFromCanvas = (id, changes) => {
    setSlides((prev) => {
      const updated = [...prev];

      updated[currentSlide] = {
        ...updated[currentSlide],
        elements: updated[currentSlide].elements.map((item) =>
          item.id === id ? { ...item, ...changes } : item
        ),
      };

      return updated;
    });
  };

  const deleteSelectedElement = () => {
    if (!selectedId) return;

    saveHistory();

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

  const updateSlideNotes = (value) => {
    setSlides((prev) => {
      const updated = [...prev];

      updated[currentSlide] = {
        ...updated[currentSlide],
        notes: value,
      };

      return updated;
    });
  };

  const openPresenterMode = () => {
    setPresenterIndex(currentSlide);
    setPresenterOpen(true);
  };

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 150));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50));
  };

  const selectedElement =
    slides[currentSlide]?.elements.find((item) => item.id === selectedId) ||
    null;

  const presenterSlide = slides[presenterIndex];

  return (
    <div className="app">
      <Ribbon
        selectedElement={selectedElement}
        addSlide={addSlide}
        addTextBox={addTextBox}
        addImageFromUrl={addImageFromUrl}
        uploadImage={uploadImage}
        addShape={addShape}
        updateSelectedElement={updateSelectedElement}
        deleteSelectedElement={deleteSelectedElement}
        undo={undo}
        redo={redo}
        canUndo={past.length > 0}
        canRedo={future.length > 0}
        zoom={zoom}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        onSave={handleSave}
        openPresenterMode={openPresenterMode}
        exportPresentation={exportPresentation}
        importPresentation={importPresentation}
      />

      <div className="workspace">
        <Sidebar
          slides={slides}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          addSlide={addSlide}
          deleteSlide={deleteSlide}
          moveSlideUp={moveSlideUp}
          moveSlideDown={moveSlideDown}
          setSelectedId={setSelectedId}
        />

        <div className="editor-main">
          <Canvas
            slides={slides}
            currentSlide={currentSlide}
            zoom={zoom}
            setSelectedId={setSelectedId}
            updateElementFromCanvas={updateElementFromCanvas}
            deleteSelectedElement={deleteSelectedElement}
            addElementFromCanvas={(element) => {
              setSlides((prev) => {
                const updated = [...prev];
                updated[currentSlide] = {
                  ...updated[currentSlide],
                  elements: [...updated[currentSlide].elements, element],
                };
                return updated;
              });
            }}
            undo={undo}
            openPresenterMode={openPresenterMode}
          />

          <div className="notes-panel">
            <label>Slide notes</label>
            <textarea
              value={slides[currentSlide]?.notes || ""}
              onChange={(e) => updateSlideNotes(e.target.value)}
              placeholder="Add speaker notes for this slide..."
            />
          </div>
        </div>
      </div>

      {presenterOpen && presenterSlide && (
        <div className="presenter-overlay">
          <div className="presenter-top">
            <strong>Presenter mode</strong>

            <button onClick={() => setPresenterOpen(false)}>Close</button>
          </div>

          <div className="presenter-body">
            <div className="presenter-slide">
              <div className="presenter-slide-canvas">
                {presenterSlide.elements.map((element) => {
                  if (element.type === "text") {
                    return (
                      <div
                        key={element.id}
                        style={{
                          position: "absolute",
                          left: element.x,
                          top: element.y,
                          color: element.color || "#1F6F5F",
                          fontSize: element.size || 28,
                          fontWeight: element.bold ? "700" : "400",
                          transform: `scale(${element.scaleX || 1}, ${
                            element.scaleY || 1
                          })`,
                          transformOrigin: "top left",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {element.content}
                      </div>
                    );
                  }

                  if (element.type === "image" && element.url) {
                    return (
                      <img
                        key={element.id}
                        src={element.url}
                        alt=""
                        style={{
                          position: "absolute",
                          left: element.x,
                          top: element.y,
                          maxWidth: 320,
                          transform: `scale(${element.scaleX || 1}, ${
                            element.scaleY || 1
                          })`,
                          transformOrigin: "top left",
                        }}
                      />
                    );
                  }

                  return (
                    <div
                      key={element.id}
                      style={{
                        position: "absolute",
                        left: element.x,
                        top: element.y,
                        width:
                          element.shape === "line"
                            ? 180
                            : element.width || 140,
                        height:
                          element.shape === "line"
                            ? 4
                            : element.height || 90,
                        background:
                          element.shape === "line"
                            ? element.stroke || "#2FA084"
                            : element.fill || "#6FCF97",
                        border: `2px solid ${element.stroke || "#2FA084"}`,
                        borderRadius:
                          element.shape === "circle"
                            ? "999px"
                            : element.shape === "triangle"
                            ? "0"
                            : "10px",
                        clipPath:
                          element.shape === "triangle"
                            ? "polygon(50% 0, 0 100%, 100% 100%)"
                            : "none",
                        transform: `scale(${element.scaleX || 1}, ${
                          element.scaleY || 1
                        })`,
                        transformOrigin: "top left",
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <div className="presenter-notes">
              <span>Notes</span>

              <div className="presenter-notes-text">
                {presenterSlide.notes || "No speaker notes for this slide."}
              </div>

              <div className="presenter-controls">
                <button
                  disabled={presenterIndex === 0}
                  onClick={() =>
                    setPresenterIndex((prev) => Math.max(0, prev - 1))
                  }
                >
                  Previous
                </button>

                <p>
                  Slide {presenterIndex + 1} of {slides.length}
                </p>

                <button
                  disabled={presenterIndex === slides.length - 1}
                  onClick={() =>
                    setPresenterIndex((prev) =>
                      Math.min(slides.length - 1, prev + 1)
                    )
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;