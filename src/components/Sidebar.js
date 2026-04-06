import React from "react";

function Sidebar({ slides, currentSlide, setCurrentSlide, setSlides }) {

  const addSlide = () => {
    setSlides([...slides, { elements: [] }]);
  };

  const deleteSlide = (index) => {
    if (slides.length === 1) return;
    const updated = slides.filter((_, i) => i !== index);
    setSlides(updated);
    setCurrentSlide(0);
  };

  const moveUp = (i) => {
    if (i === 0) return;
    const updated = [...slides];
    [updated[i], updated[i - 1]] = [updated[i - 1], updated[i]];
    setSlides(updated);
    setCurrentSlide(i - 1);
  };

  const moveDown = (i) => {
    if (i === slides.length - 1) return;
    const updated = [...slides];
    [updated[i], updated[i + 1]] = [updated[i + 1], updated[i]];
    setSlides(updated);
    setCurrentSlide(i + 1);
  };

  return (
    <div className="sidebar">
      <button onClick={addSlide}>+ Add Slide</button>

      {slides.map((_, i) => (
        <div key={i} className={`slide-item ${i === currentSlide ? "active" : ""}`}>
          <span onClick={() => setCurrentSlide(i)}>Slide {i + 1}</span>

          <div>
            <button onClick={() => moveUp(i)}>⬆</button>
            <button onClick={() => moveDown(i)}>⬇</button>
            <button onClick={() => deleteSlide(i)}>❌</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Sidebar;