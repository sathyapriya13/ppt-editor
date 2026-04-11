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

  return (
    <div className="sidebar">
      <button onClick={addSlide}>+ Add Slide</button>

      {slides.map((_, i) => (
        <div
          key={i}
          className={`slide-item ${i === currentSlide ? "active" : ""}`}
          onClick={() => setCurrentSlide(i)}
        >
          Slide {i + 1}
          <button onClick={(e) => {
            e.stopPropagation();
            deleteSlide(i);
          }}>❌</button>
        </div>
      ))}
    </div>
  );
}

export default Sidebar;