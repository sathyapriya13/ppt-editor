import React from "react";

function Ribbon({ slides, setSlides, currentSlide, selected }) {

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
  setSlides(updated);
};
    setSlides(updated);
  };

  const addImage = () => {
    const url = prompt("Enter image URL");
    if (!url) return;

    const updated = [...slides];
    updated[currentSlide].elements.push({
      type: "image",
      x: 100,
      y: 100,
      url,
      width: 150,
      height: 100
    });
    setSlides(updated);
  };

  const updateSelected = (changes) => {
    if (!selected) return;
    Object.assign(selected, changes);
    setSlides([...slides]);
  };

  const save = () => {
    const data = {
      type: "slides",
      slides: slides
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
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
      const parsed = JSON.parse(reader.result);
      setSlides(parsed.slides); // important fix
    };

    reader.readAsText(file);
  };

  return (
    <div className="ribbon">
      <button onClick={addText}>Text</button>
      <button onClick={addImage}>Image</button>

      <select onChange={(e) => updateSelected({ size: parseInt(e.target.value) })}>
        <option>16</option>
        <option>24</option>
        <option>32</option>
      </select>

      <input type="color" onChange={(e) => updateSelected({ color: e.target.value })} />

      <button onClick={() => updateSelected({ bold: !selected?.bold })}>B</button>
      <button onClick={() => updateSelected({ italic: !selected?.italic })}>I</button>

      <button onClick={() => updateSelected({ align: "left" })}>Left</button>
      <button onClick={() => updateSelected({ align: "center" })}>Center</button>
      <button onClick={() => updateSelected({ align: "right" })}>Right</button>

      <button onClick={save}>Save</button>
      <input type="file" onChange={load} />
    </div>
  );
}

export default Ribbon;