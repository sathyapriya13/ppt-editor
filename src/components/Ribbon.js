import React from "react";

function Ribbon({ slides, setSlides, saveHistory, currentSlide, selected, undo, redo }) {

  const addText = () => {
    const updated = [...slides];
    updated[currentSlide].elements.push({
      type: "text",
      x: 100,
      y: 100,
      content: "New Text",
      size: 20,
      color: "#000"
    });
    saveHistory(updated);
  };

  const addImage = () => {
    const url = prompt("Enter image URL");
    if (!url) return;

    const updated = [...slides];
    updated[currentSlide].elements.push({
      type: "image",
      x: 100,
      y: 100,
      url
    });
    saveHistory(updated);
  };

  const updateSelected = (changes) => {
    if (!selected) return;

    const updated = [...slides];
    const el = updated[currentSlide].elements[selected.index];

    updated[currentSlide].elements[selected.index] = {
      ...el,
      ...changes
    };

    saveHistory(updated);
  };

  const save = () => {
    const blob = new Blob([JSON.stringify(slides)], {
      type: "application/json"
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "slides.json";
    a.click();
  };

  const load = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setSlides(JSON.parse(reader.result));
    };

    reader.readAsText(file);
  };

  return (
    <div
      className="ribbon"
      style={{
        background: "#ffffff",
        padding: "10px 15px",
        display: "flex",
        gap: "12px",
        alignItems: "center",
        borderBottom: "1px solid #ddd",
        flexWrap: "wrap"
      }}
    >
      {/* Insert */}
      <button onClick={addText}>🅣 Text</button>
      <button onClick={addImage}>🖼 Image</button>

      {/* Divider */}
      <span>|</span>

      {/* Font */}
      <select onChange={(e) => updateSelected({ size: parseInt(e.target.value) })}>
        <option>16</option>
        <option>24</option>
        <option>32</option>
      </select>

      <input type="color" onChange={(e) => updateSelected({ color: e.target.value })} />

      <button onClick={() => updateSelected({ bold: true })}>𝗕</button>
      <button onClick={() => updateSelected({ italic: true })}>𝘐</button>

      {/* Divider */}
      <span>|</span>

      {/* Align */}
      <button onClick={() => updateSelected({ align: "left" })}>⬅</button>
      <button onClick={() => updateSelected({ align: "center" })}>⬌</button>
      <button onClick={() => updateSelected({ align: "right" })}>➡</button>

      {/* Divider */}
      <span>|</span>

      {/* Undo / Redo */}
      <button onClick={undo}>↶ Undo</button>
      <button onClick={redo}>↷ Redo</button>

      {/* Divider */}
      <span>|</span>

      {/* File */}
      <button onClick={save}>💾 Save</button>
      <input type="file" onChange={load} />
    </div>
  );
}

export default Ribbon;