import React, { useRef } from "react";

function Ribbon({
  slides,
  setSlides,
  currentSlide,
  selectedElement,
  setSelectedId,
  onDeleteSelected,
  onSave,
}) {
  const fileInputRef = useRef(null);

  const addText = () => {
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
            content: "New Text",
            size: 28,
            color: "#111827",
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
      const imageUrl = reader.result;
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
              url: imageUrl,
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

  const updateSelected = (changes) => {
    if (!selectedElement) return;

    setSlides((prev) => {
      const updated = [...prev];

      updated[currentSlide] = {
        ...updated[currentSlide],
        elements: updated[currentSlide].elements.map((item) =>
          item.id === selectedElement.id ? { ...item, ...changes } : item
        ),
      };

      return updated;
    });
  };

  return (
    <div className="ribbon">
      <div className="toolbar-group">
        <button onClick={addText}>Text</button>
        <button onClick={addImageFromUrl}>Image URL</button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files[0];

            if (file) {
              uploadImage(file);
              e.target.value = "";
            }
          }}
        />

        <button onClick={() => fileInputRef.current.click()}>
          Upload Image
        </button>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        <button
          disabled={!selectedElement || selectedElement.type !== "text"}
          onClick={() =>
            updateSelected({
              bold: !selectedElement?.bold,
            })
          }
        >
          Bold
        </button>

        <input
          type="color"
          disabled={!selectedElement || selectedElement.type !== "text"}
          value={selectedElement?.color || "#111827"}
          onChange={(e) =>
            updateSelected({
              color: e.target.value,
            })
          }
        />

        <select
          disabled={!selectedElement || selectedElement.type !== "text"}
          value={selectedElement?.size || 28}
          onChange={(e) =>
            updateSelected({
              size: parseInt(e.target.value),
            })
          }
        >
          <option value="16">16</option>
          <option value="20">20</option>
          <option value="24">24</option>
          <option value="28">28</option>
          <option value="32">32</option>
          <option value="40">40</option>
          <option value="48">48</option>
          <option value="64">64</option>
        </select>

        <button
          className="delete-btn"
          disabled={!selectedElement}
          onClick={onDeleteSelected}
        >
          Delete
        </button>
      </div>

      <button className="save-btn" onClick={onSave}>
        Save
      </button>
    </div>
  );
}

export default Ribbon;