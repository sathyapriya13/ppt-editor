import React from "react";

function Ribbon({ slides, setSlides, currentSlide, selected, onSave }) {

  const addText = () => {
    const updated = [...slides];
    updated[currentSlide].elements.push({
      id: Date.now(),
      type: "text",
      x: 100,
      y: 100,
      content: "New Text",
      size: 20,
      color: "#000",
      bold: false
    });
    setSlides(updated);
  };

  const addImage = () => {
    const url = prompt("Enter image URL");
    if (!url) return;

    const updated = [...slides];
    updated[currentSlide].elements.push({
      id: Date.now(),
      type: "image",
      x: 100,
      y: 100,
      url
    });
    setSlides(updated);
  };

  const updateSelected = (changes) => {
    if (!selected) return;

    setSlides(prev => {
      const updated = [...prev];
      const elements = updated[currentSlide].elements;

      const el = elements.find(item => item.id === selected.customId);

      if (el) Object.assign(el, changes);

      return updated;
    });
  };

  return (
    <div className="ribbon">
      <button onClick={addText}>Text</button>
      <button onClick={addImage}>Image</button>

      <button onClick={() => updateSelected({ bold: true })}>Bold</button>

      <input
        type="color"
        onChange={(e) => updateSelected({ color: e.target.value })}
      />

      <select onChange={(e) => updateSelected({ size: parseInt(e.target.value) })}>
        <option>16</option>
        <option>20</option>
        <option>24</option>
        <option>32</option>
      </select>

      {/* ✅ SAVE BUTTON */}
      <button onClick={onSave}>Save</button>
    </div>
  );
}

export default Ribbon;