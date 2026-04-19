import React, { useRef } from "react";

function Ribbon({
  selectedElement,
  addSlide,
  addTextBox,
  addImageFromUrl,
  uploadImage,
  addShape,
  updateSelectedElement,
  deleteSelectedElement,
  undo,
  redo,
  canUndo,
  canRedo,
  zoom,
  zoomIn,
  zoomOut,
  onSave,
  openPresenterMode,
  exportPresentation,
  importPresentation,
}) {
  const fileInputRef = useRef(null);
  const importInputRef = useRef(null);

  return (
    <div className="top-area">
      <div className="title-row">
        <div className="app-mark">P</div>
        <div className="file-title">Untitled presentation</div>

        <div className="title-actions">
          <button className="presenter-btn" onClick={openPresenterMode}>
            Presenter mode
          </button>

          <button className="presenter-btn" onClick={exportPresentation}>
            Export
          </button>

          <input
            ref={importInputRef}
            type="file"
            accept="application/json,.json"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0];

              if (file) {
                importPresentation(file);
                e.target.value = "";
              }
            }}
          />

          <button
            className="presenter-btn"
            onClick={() => importInputRef.current.click()}
          >
            Import
          </button>

          <button className="save-btn" onClick={onSave}>
            Save
          </button>
        </div>
      </div>

      <div className="menu-row">
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Insert</span>
        <span>Format</span>
        <span>Slide</span>
        <span>Arrange</span>
        <span>Tools</span>
        <span>Help</span>
      </div>

      <div className="toolbar">
        <button onClick={addSlide}>+ New slide</button>

        <div className="toolbar-divider" />

        <button onClick={undo} disabled={!canUndo}>
          Undo
        </button>

        <button onClick={redo} disabled={!canRedo}>
          Redo
        </button>

        <div className="toolbar-divider" />

        <button onClick={addTextBox}>Text box</button>

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
          Upload image
        </button>

        <select
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) {
              addShape(e.target.value);
              e.target.value = "";
            }
          }}
        >
          <option value="">Shape</option>
          <option value="rectangle">Rectangle</option>
          <option value="circle">Circle</option>
          <option value="triangle">Triangle</option>
          <option value="line">Line</option>
        </select>

        <div className="toolbar-divider" />

        <button
          disabled={!selectedElement || selectedElement.type !== "text"}
          onClick={() =>
            updateSelectedElement({
              bold: !selectedElement?.bold,
            })
          }
        >
          Bold
        </button>

        <input
          type="color"
          disabled={!selectedElement || selectedElement.type !== "text"}
          value={selectedElement?.color || "#1F6F5F"}
          onChange={(e) =>
            updateSelectedElement({
              color: e.target.value,
            })
          }
        />

        <select
          className="font-size-select"
          disabled={!selectedElement || selectedElement.type !== "text"}
          value={selectedElement?.size || 28}
          onChange={(e) =>
            updateSelectedElement({
              size: parseInt(e.target.value),
            })
          }
        >
          <option value="12">12</option>
          <option value="14">14</option>
          <option value="16">16</option>
          <option value="18">18</option>
          <option value="20">20</option>
          <option value="24">24</option>
          <option value="28">28</option>
          <option value="32">32</option>
          <option value="40">40</option>
          <option value="48">48</option>
          <option value="60">60</option>
          <option value="72">72</option>
        </select>

        <button
          className="delete-btn"
          disabled={!selectedElement}
          onClick={deleteSelectedElement}
        >
          Delete
        </button>

        <div className="toolbar-spacer" />

        <div className="zoom-control">
          <button onClick={zoomOut} disabled={zoom <= 50}>
            -
          </button>

          <span>{zoom}%</span>

          <button onClick={zoomIn} disabled={zoom >= 150}>
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default Ribbon;