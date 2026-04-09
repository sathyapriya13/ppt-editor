import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";

function Canvas({ slides, setSlides, currentSlide, setSelected }) {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  // create canvas
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 900,
      height: 500,
      backgroundColor: "#fff"
    });

    fabricRef.current = canvas;

    // select element
    canvas.on("selection:created", (e) => {
      setSelected(e.selected[0]);
    });

    canvas.on("selection:updated", (e) => {
      setSelected(e.selected[0]);
    });

    // ✅ FIXED resize + move saving
    canvas.on("object:modified", (e) => {
      const obj = e.target;

      setSlides(prev => {
        const updated = [...prev];
        const elements = updated[currentSlide].elements;

        const el = elements.find(item => item.id === obj.customId);

        if (el) {
          el.x = obj.left;
          el.y = obj.top;

          // ✅ store scale properly
          el.scaleX = obj.scaleX;
          el.scaleY = obj.scaleY;
        }

        return updated;
      });
    });

    return () => canvas.dispose();
  }, []);

  // render elements
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.clear();

    const elements = slides[currentSlide]?.elements || [];

    elements.forEach((el) => {
      if (el.type === "text") {
        const text = new fabric.Textbox(el.content, {
          left: el.x,
          top: el.y,
          fontSize: el.size || 20,
          fill: el.color || "#000",
          fontWeight: el.bold ? "bold" : "normal",
          scaleX: el.scaleX || 1,
          scaleY: el.scaleY || 1
        });

        text.customId = el.id;
        canvas.add(text);
      }

      if (el.type === "image" && el.url) {
        fabric.Image.fromURL(el.url, (img) => {
          img.set({
            left: el.x,
            top: el.y,
            scaleX: el.scaleX || 0.5,
            scaleY: el.scaleY || 0.5
          });

          img.customId = el.id;

          canvas.add(img);
          canvas.renderAll();
        });
      }
    });

    canvas.renderAll();
  }, [slides, currentSlide]);

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} />
    </div>
  );
}

export default Canvas;