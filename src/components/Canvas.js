import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";

function Canvas({
  slides,
  currentSlide,
  zoom,
  setSelectedId,
  updateElementFromCanvas,
}) {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

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
      const obj = e.target;

      if (!obj || !obj.customId) return;

      updateElementFromCanvas(obj.customId, {
        x: obj.left || 0,
        y: obj.top || 0,
        scaleX: obj.scaleX || 1,
        scaleY: obj.scaleY || 1,
      });
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