import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";

function Canvas({ slides, currentSlide, saveHistory, setSelected }) {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  useEffect(() => {
    fabricRef.current = new fabric.Canvas(canvasRef.current, {
      width: 960,
      height: 540,
      backgroundColor: "#ffffff",
      selection: true
    });

    return () => {
      fabricRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.clear();

    const elements = slides[currentSlide].elements;

    elements.forEach((el, index) => {
      if (el.type === "text") {
        const text = new fabric.Textbox(el.content, {
          left: el.x,
          top: el.y,
          width: el.width || 300,
          fontSize: el.size || 20,
          fill: el.color || "#000",
          fontWeight: el.bold ? "bold" : "normal",
          fontStyle: el.italic ? "italic" : "normal",
          textAlign: el.align || "left",
          editable: true,
          scaleX: el.scaleX || 1,
          scaleY: el.scaleY || 1,

          borderColor: "#6366f1",
          cornerColor: "#6366f1",
          cornerSize: 8,
          transparentCorners: false
        });

        text.on("selected", () => {
          setSelected({ index });
        });

        text.on("mousedblclick", () => {
          canvas.setActiveObject(text);
          text.enterEditing();
          text.selectAll();
        });

        text.on("modified", () => {
          const updated = [...slides];

          updated[currentSlide].elements[index] = {
            ...updated[currentSlide].elements[index],
            x: text.left,
            y: text.top,
            content: text.text,
            scaleX: text.scaleX,
            scaleY: text.scaleY,
            width: text.width
          };

          saveHistory(updated);
        });

        canvas.add(text);
      }

      if (el.type === "image") {
        fabric.Image.fromURL(el.url, (img) => {
          img.set({
            left: el.x,
            top: el.y,
            scaleX: el.scaleX || 0.5,
            scaleY: el.scaleY || 0.5,

            borderColor: "#6366f1",
            cornerColor: "#6366f1",
            cornerSize: 8,
            transparentCorners: false
          });

          img.on("selected", () => {
            setSelected({ index });
          });

          img.on("modified", () => {
            const updated = [...slides];

            updated[currentSlide].elements[index] = {
              ...updated[currentSlide].elements[index],
              x: img.left,
              y: img.top,
              scaleX: img.scaleX,
              scaleY: img.scaleY
            };

            saveHistory(updated);
          });

          canvas.add(img);
        });
      }
    });

    canvas.renderAll();
  }, [slides, currentSlide]);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "radial-gradient(circle, #e5e7eb, #d1d5db)"
      }}
    >
      <div
        style={{
          padding: "35px", // increased so border is visible
          background: "rgba(255,255,255,0.6)",
          borderRadius: "18px",
          backdropFilter: "blur(12px)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.25)"
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            borderRadius: "12px",

            // 🔥 STRONG VISIBLE BORDER
            border: "6px solid #4f46e5",

            // 🔥 STRONG GLOW
            boxShadow:
              "0 0 0 6px rgba(79,70,229,0.4), 0 15px 40px rgba(0,0,0,0.35)"
          }}
        />
      </div>
    </div>
  );
}

export default Canvas;