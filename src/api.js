const BASE_URL = "http://localhost:8080/api";

// Frontend element → Spring Boot SlideElement (flat, uppercase type)
const toBackend = (el) => ({
  type: el.type ? el.type.toUpperCase() : "TEXT",
  content: el.content || "",
  x: el.x || 0,
  y: el.y || 0,
  width: el.width || 300,
  scaleX: el.scaleX || 1.0,
  scaleY: el.scaleY || 1.0,
  fontSize: el.size || 20,
  color: el.color || "#000000",
  bold: el.bold || false,
  italic: el.italic || false,
  align: el.align || "left",
  url: el.url || "",
  zIndex: el.zIndex || 0,
});

// Spring Boot SlideElement → frontend element (lowercase type, map fontSize → size)
const toFrontend = (el) => ({
  type: el.type ? el.type.toLowerCase() : "text",
  content: el.content || "",
  x: el.x || 0,
  y: el.y || 0,
  width: el.width || 300,
  scaleX: el.scaleX || 1.0,
  scaleY: el.scaleY || 1.0,
  size: el.fontSize || 20,
  color: el.color || "#000000",
  bold: el.bold || false,
  italic: el.italic || false,
  align: el.align || "left",
  url: el.url || "",
  zIndex: el.zIndex || 0,
});

export const createPresentation = async (title) => {
  const res = await fetch(`${BASE_URL}/presentations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Failed to create presentation");
  return res.json();
};

export const getPresentation = async (id) => {
  const res = await fetch(`${BASE_URL}/presentations/${id}`);
  if (!res.ok) throw new Error("Presentation not found");
  const data = await res.json();
  const slides = (data.slides || []).map((s) => ({
    background: s.background || "#ffffff",
    elements: (s.elements || []).map(toFrontend),
  }));
  return { id: data.id, title: data.title, slides };
};

export const savePresentation = async (id, title, slides) => {
  const body = {
    title,
    slides: slides.map((s) => ({
      background: s.background || "#ffffff",
      elements: (s.elements || []).map(toBackend),
    })),
  };
  const res = await fetch(`${BASE_URL}/presentations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to save");
  return res.json();
};

export const getAllPresentations = async () => {
  const res = await fetch(`${BASE_URL}/presentations`);
  return res.json();
};