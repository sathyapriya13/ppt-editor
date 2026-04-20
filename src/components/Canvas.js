import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";

function Canvas({
  slides,
  currentSlide,
  zoom,
  setSelectedId,
  updateElementFromCanvas,
  deleteSelectedElement,
  addElementFromCanvas,
  undo,
  openPresenterMode,
}) {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const copiedObjectRef = useRef(null);

  const saveObjectPosition = (obj) => {
    if (!obj || !obj.customId) return;

    updateElementFromCanvas(obj.customId, {
      x: obj.left || 0,
      y: obj.top || 0,
      scaleX: obj.scaleX || 1,
      scaleY: obj.scaleY || 1,
    });
  };

  const objectToSlideElement = (obj) => {
    const id = Date.now();

    if (obj.type === "textbox" || obj.type === "i-text" || obj.type === "text") {
      return {
        id,
        type: "text",
        x: obj.left || 120,
        y: obj.top || 120,
        content: obj.text || "Text box",
        size: obj.fontSize || 28,
        color: obj.fill || "#1F6F5F",
        bold: obj.fontWeight === "bold",
        scaleX: obj.scaleX || 1,
        scaleY: obj.scaleY || 1,
      };
    }

    if (obj.type === "image") {
      return {
        id,
        type: "image",
        x: obj.left || 120,
        y: obj.top || 120,
        url: obj._element?.src || "",
        scaleX: obj.scaleX || 0.5,
        scaleY: obj.scaleY || 0.5,
      };
    }

    if (obj.type === "circle") {
      return {
        id,
        type: "shape",
        shape: "circle",
        x: obj.left || 120,
        y: obj.top || 120,
        fill: obj.fill || "#6FCF97",
        stroke: obj.stroke || "#2FA084",
        scaleX: obj.scaleX || 1,
        scaleY: obj.scaleY || 1,
      };
    }

    if (obj.type === "triangle") {
      return {
        id,
        type: "shape",
        shape: "triangle",
        x: obj.left || 120,
        y: obj.top || 120,
        width: obj.width || 130,
        height: obj.height || 110,
        fill: obj.fill || "#6FCF97",
        stroke: obj.stroke || "#2FA084",
        scaleX: obj.scaleX || 1,
        scaleY: obj.scaleY || 1,
      };
    }

    if (obj.type === "line") {
      return {
        id,
        type: "shape",
        shape: "line",
        x: obj.left || 120,
        y: obj.top || 120,
        fill: "transparent",
        stroke: obj.stroke || "#2FA084",
        scaleX: obj.scaleX || 1,
        scaleY: obj.scaleY || 1,
      };
    }

    return {
      id,
      type: "shape",
      shape: "rectangle",
      x: obj.left || 120,
      y: obj.top || 120,
      width: obj.width || 150,
      height: obj.height || 95,
      fill: obj.fill || "#6FCF97",
      stroke: obj.stroke || "#2FA084",
      scaleX: obj.scaleX || 1,
      scaleY: obj.scaleY || 1,
    };
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 960,
      height: 540,
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
    });

    fabricRef.current = canvas;

    canvas.on("selection:created", (e) => {
      if (e.selected && e.selected[0]) {
        setSelectedId(e.selected[0].customId);
      }
    });

    canvas.on("selection:updated", (e) => {
      if (e.selected && e.selected[0]) {
        setSelectedId(e.selected[0].customId);
      }
    });

    canvas.on("selection:cleared", () => {
      setSelectedId(null);
    });

    canvas.on("object:modified", (e) => {
      saveObjectPosition(e.target);
    });

    canvas.on("text:changed", (e) => {
      const obj = e.target;

      if (!obj || !obj.customId) return;

      updateElementFromCanvas(obj.customId, {
        content: obj.text || "",
      });
    });

    return () => {
      canvas.dispose();
    };
  }, [setSelectedId, updateElementFromCanvas]);

  useEffect(() => {
    const canvas = fabricRef.current;

    if (!canvas) return;

    canvas.clear();
    canvas.setBackgroundColor("#ffffff", canvas.renderAll.bind(canvas));

    const elements = slides[currentSlide]?.elements || [];

    elements.forEach((el) => {
      if (el.type === "text") {
        const text = new fabric.Textbox(el.content || "Text box", {
          left: el.x,
          top: el.y,
          fontSize: el.size || 28,
          fill: el.color || "#1F6F5F",
          fontWeight: el.bold ? "bold" : "normal",
          scaleX: el.scaleX || 1,
          scaleY: el.scaleY || 1,
          fontFamily: "Arial",
          transparentCorners: false,
          cornerColor: "#2FA084",
          cornerStrokeColor: "#2FA084",
          borderColor: "#2FA084",
          cornerSize: 8,
          padding: 5,
        });

        text.customId = el.id;
        canvas.add(text);
      }

      if (el.type === "image" && el.url) {
        fabric.Image.fromURL(
          el.url,
          (img) => {
            img.set({
              left: el.x,
              top: el.y,
              scaleX: el.scaleX || 0.5,
              scaleY: el.scaleY || 0.5,
              transparentCorners: false,
              cornerColor: "#2FA084",
              cornerStrokeColor: "#2FA084",
              borderColor: "#2FA084",
              cornerSize: 8,
              padding: 5,
            });

            img.customId = el.id;

            canvas.add(img);
            canvas.renderAll();
          },
          el.url.startsWith("data:")
            ? undefined
            : { crossOrigin: "anonymous" }
        );
      }

      if (el.type === "shape") {
        let shape;

        const commonOptions = {
          left: el.x,
          top: el.y,
          fill: el.fill || "#6FCF97",
          stroke: el.stroke || "#2FA084",
          strokeWidth: 2,
          scaleX: el.scaleX || 1,
          scaleY: el.scaleY || 1,
          transparentCorners: false,
          cornerColor: "#2FA084",
          cornerStrokeColor: "#2FA084",
          borderColor: "#2FA084",
          cornerSize: 8,
        };

        if (el.shape === "circle") {
          shape = new fabric.Circle({
            ...commonOptions,
            radius: 55,
          });
        } else if (el.shape === "triangle") {
          shape = new fabric.Triangle({
            ...commonOptions,
            width: 130,
            height: 110,
          });
        } else if (el.shape === "line") {
          shape = new fabric.Line([0, 0, 180, 0], {
            ...commonOptions,
            fill: undefined,
            stroke: el.stroke || "#2FA084",
            strokeWidth: 4,
          });
        } else {
          shape = new fabric.Rect({
            ...commonOptions,
            width: el.width || 150,
            height: el.height || 95,
            rx: 6,
            ry: 6,
          });
        }

        shape.customId = el.id;
        canvas.add(shape);
      }
    });

    canvas.renderAll();
  }, [slides, currentSlide]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const canvas = fabricRef.current;

      if (!canvas) return;

      const activeObject = canvas.getActiveObject();
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const isTyping =
        activeTag === "input" ||
        activeTag === "textarea" ||
        activeObject?.isEditing;

      if (isTyping) return;

      if (e.key === "Delete" || e.key === "Backspace") {
        if (!activeObject) return;

        e.preventDefault();

        if (deleteSelectedElement && activeObject.customId) {
          deleteSelectedElement();
        } else {
          canvas.remove(activeObject);
          canvas.discardActiveObject();
          canvas.renderAll();
          setSelectedId(null);
        }

        return;
      }

      if (e.ctrlKey && e.key.toLowerCase() === "c") {
        if (!activeObject) return;

        e.preventDefault();

        activeObject.clone((cloned) => {
          copiedObjectRef.current = cloned;
        });

        return;
      }

      if (e.ctrlKey && e.key.toLowerCase() === "v") {
        if (!copiedObjectRef.current) return;

        e.preventDefault();

        copiedObjectRef.current.clone((clonedObject) => {
          clonedObject.set({
            left: (clonedObject.left || 120) + 24,
            top: (clonedObject.top || 120) + 24,
            evented: true,
          });

          const newElement = objectToSlideElement(clonedObject);
          clonedObject.customId = newElement.id;

          if (addElementFromCanvas) {
            addElementFromCanvas(newElement);
          } else {
            canvas.add(clonedObject);
            canvas.setActiveObject(clonedObject);
            canvas.renderAll();
          }

          copiedObjectRef.current = clonedObject;
          setSelectedId(newElement.id);
        });

        return;
      }

      if (e.ctrlKey && e.key.toLowerCase() === "z") {
        if (!undo) return;

        e.preventDefault();
        undo();
        return;
      }

      if (e.ctrlKey && e.key.toLowerCase() === "p") {
        if (!openPresenterMode) return;

        e.preventDefault();
        openPresenterMode();
        return;
      }

      if (
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"
      ) {
        if (!activeObject) return;

        e.preventDefault();

        const moveAmount = e.shiftKey ? 10 : 2;

        if (e.key === "ArrowUp") {
          activeObject.top = (activeObject.top || 0) - moveAmount;
        }

        if (e.key === "ArrowDown") {
          activeObject.top = (activeObject.top || 0) + moveAmount;
        }

        if (e.key === "ArrowLeft") {
          activeObject.left = (activeObject.left || 0) - moveAmount;
        }

        if (e.key === "ArrowRight") {
          activeObject.left = (activeObject.left || 0) + moveAmount;
        }

        activeObject.setCoords();
        canvas.renderAll();
        saveObjectPosition(activeObject);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    deleteSelectedElement,
    addElementFromCanvas,
    undo,
    openPresenterMode,
    setSelectedId,
    updateElementFromCanvas,
  ]);

  return (
    <div className="canvas-container">
      <div
        className="canvas-shell"
        style={{
          transform: `scale(${zoom / 100})`,
        }}
      >
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

export default Canvas;