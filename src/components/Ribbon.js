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
    <div className="ribbon">

      {/* INSERT */}
      <div className="group">
        <button onClick={addText}>🅣</button>
        <button onClick={addImage}>🖼</button>
        <span>Insert</span>
      </div>

      {/* TEXT STYLE */}
      <div className="group">
        <select onChange={(e) => updateSelected({ size: parseInt(e.target.value) })}>
          <option>16</option>
          <option>24</option>
          <option>32</option>
        </select>

        <input type="color" onChange={(e) => updateSelected({ color: e.target.value })} />

        <button onClick={() => updateSelected({ bold: true })}>B</button>
        <button onClick={() => updateSelected({ italic: true })}>I</button>
        <span>Text</span>
      </div>

      {/* ALIGN */}
      <div className="group">
        <button onClick={() => updateSelected({ align: "left" })}>⬅</button>
        <button onClick={() => updateSelected({ align: "center" })}>⬌</button>
        <button onClick={() => updateSelected({ align: "right" })}>➡</button>
        <span>Align</span>
      </div>

      {/* HISTORY */}
      <div className="group">
        <button onClick={undo}>↶</button>
        <button onClick={redo}>↷</button>
        <span>History</span>
      </div>

      {/* FILE */}
      <div className="group">
        <button onClick={save}>💾</button>
        <input type="file" onChange={load} />
        <span>File</span>
      </div>

    </div>
  );
}

export default Ribbon;