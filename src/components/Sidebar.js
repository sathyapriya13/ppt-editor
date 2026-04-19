import React, { useState } from "react";

function Sidebar({
  slides,
  currentSlide,
  setCurrentSlide,
  addSlide,
  deleteSlide,
  moveSlideUp,
  moveSlideDown,
  reorderSlides,
  setSelectedId,
}) {
  const [draggingIndex, setDraggingIndex] = useState(null);

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
            draggable
            className={`slide-item ${index === currentSlide ? "active" : ""} ${
              draggingIndex === index ? "dragging" : ""
            }`}
            onClick={() => {
              setCurrentSlide(index);
              setSelectedId(null);
            }}
            onDragStart={(e) => {
              setDraggingIndex(index);
              e.dataTransfer.setData("slideIndex", index);
            }}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();

              const fromIndex = parseInt(e.dataTransfer.getData("slideIndex"));

              if (!Number.isNaN(fromIndex)) {
                reorderSlides(fromIndex, index);
              }

              setDraggingIndex(null);
            }}
            onDragEnd={() => {
              setDraggingIndex(null);
            }}
          >
            <div className="slide-number">{index + 1}</div>

            <div className="slide-preview">{index + 1}</div>

            <div className="slide-footer">
              <span>Slide {index + 1}</span>

              <div className="slide-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveSlideUp(index);
                  }}
                  disabled={index === 0}
                >
                  Up
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveSlideDown(index);
                  }}
                  disabled={index === slides.length - 1}
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
        + Add Slide
      </button>
    </div>
  );
}

export default Sidebar;