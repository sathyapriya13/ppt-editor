import React from "react";

function Sidebar({
  slides,
  currentSlide,
  setCurrentSlide,
  setSlides,
  setSelectedId,
}) {
  const addSlide = () => {
    setSlides([...slides, { elements: [] }]);
    setCurrentSlide(slides.length);
    setSelectedId(null);
  };

  const deleteSlide = (index) => {
    if (slides.length === 1) return;

    const updated = slides.filter((_, i) => i !== index);

    setSlides(updated);
    setCurrentSlide(index === 0 ? 0 : index - 1);
    setSelectedId(null);
  };

  const moveUp = (index) => {
    if (index === 0) return;

    const updated = [...slides];

    [updated[index], updated[index - 1]] = [
      updated[index - 1],
      updated[index],
    ];

    setSlides(updated);
    setCurrentSlide(index - 1);
    setSelectedId(null);
  };

  const moveDown = (index) => {
    if (index === slides.length - 1) return;

    const updated = [...slides];

    [updated[index], updated[index + 1]] = [
      updated[index + 1],
      updated[index],
    ];

    setSlides(updated);
    setCurrentSlide(index + 1);
    setSelectedId(null);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Slides</h2>
        <span>{slides.length}</span>
      </div>

      <div className="slide-list">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`slide-item ${index === currentSlide ? "active" : ""}`}
            onClick={() => {
              setCurrentSlide(index);
              setSelectedId(null);
            }}
          >
            <div className="slide-preview">{index + 1}</div>

            <div className="slide-footer">
              <span>Slide {index + 1}</span>

              <div className="slide-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveUp(index);
                  }}
                >
                  Up
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveDown(index);
                  }}
                >
                  Down
                </button>

                <button
                  className="small-delete"
                  disabled={slides.length === 1}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSlide(index);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="add-slide-btn" onClick={addSlide}>
        Add Slide
      </button>
    </div>
  );
}

export default Sidebar;