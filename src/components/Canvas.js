import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";

function Canvas({ slides, currentSlide, setSlides }) {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  // Initialize canvas
  useEffect(() => {
    fabricRef.current = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 500,
      backgroundColor: "#fff"
    });

    return () => {
      fabricRef.current.dispose();
    };
  }, []);

  // Render slide elements
  useEffect(() => {
    const canvas = fabricRef.current;
    canvas.clear();

    const elements = slides[currentSlide].elements;

    elements.forEach((el) => {
      if (el.type === "text") {
        const text = new fabric.Textbox(el.content, {
          left: el.x,
          top: el.y,
          fontSize: el.size || 20,
          fill: el.color || "#000"
        });

        canvas.add(text);
      }

      if (el.type === "image") {
        fabric.Image.fromURL(el.url, (img) => {
          img.set({
            left: el.x,
            top: el.y,
            scaleX: 0.5,
            scaleY: 0.5
          });
          canvas.add(img);
        });
      }
    });

  }, [slides, currentSlide]);

  return <canvas ref={canvasRef} />;
}

export default Canvas;