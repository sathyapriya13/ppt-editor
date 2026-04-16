import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";

function Canvas({ slides, setSlides, currentSlide, setSelectedId }) {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const currentSlideRef = useRef(currentSlide);

  useEffect(() => {
    currentSlideRef.current = currentSlide;
  }, [currentSlide]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 900,
      height: 500,
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

      setSlides((prev) => {
        const updated = [...prev];
        const activeSlideIndex = currentSlideRef.current;
        const slide = updated[activeSlideIndex];

        if (!slide) return prev;

        updated[activeSlideIndex] = {
          ...slide,
          elements: slide.elements.map((item) =>
            item.id === obj.customId
              ? {
                  ...item,
                  x: obj.left || 0,
                  y: obj.top || 0,
                  scaleX: obj.scaleX || 1,
                  scaleY: obj.scaleY || 1,
                }
              : item
          ),
        };

        return updated;
      });
    });

    canvas.on("text:changed", (e) => {
      const obj = e.target;

      if (!obj || !obj.customId) return;

      setSlides((prev) => {
        const updated = [...prev];
        const activeSlideIndex = currentSlideRef.current;
        const slide = updated[activeSlideIndex];

        if (!slide) return prev;

        updated[activeSlideIndex] = {
          ...slide,
          elements: slide.elements.map((item) =>
            item.id === obj.customId
              ? {
                  ...item,
                  content: obj.text || "",
                }
              : item
          ),
        };

        return updated;
      });
    });

    return () => {
      canvas.dispose();
    };
  }, [setSelectedId, setSlides]);

  useEffect(() => {
    const canvas = fabricRef.current;

    if (!canvas) return;

    canvas.clear();
    canvas.setBackgroundColor("#ffffff", canvas.renderAll.bind(canvas));

    const elements = slides[currentSlide]?.elements || [];

    elements.forEach((el) => {
      if (el.type === "text") {
        const text = new fabric.Textbox(el.content || "Text", {
          left: el.x,
          top: el.y,
          fontSize: el.size || 28,
          fill: el.color || "#111827",
          fontWeight: el.bold ? "bold" : "normal",
          scaleX: el.scaleX || 1,
          scaleY: el.scaleY || 1,
          fontFamily: "Arial",
          transparentCorners: false,
          cornerColor: "#4f46e5",
          cornerStrokeColor: "#4f46e5",
          borderColor: "#4f46e5",
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
              cornerColor: "#4f46e5",
              cornerStrokeColor: "#4f46e5",
              borderColor: "#4f46e5",
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
    });

    canvas.renderAll();
  }, [slides, currentSlide]);

  return (
    <div className="canvas-container">
      <div className="canvas-shell">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

export default Canvas;