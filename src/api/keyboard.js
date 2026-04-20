// src/api/keyboard.js

export const keyboardCommands = {
  // Copy selected items
  copy: (canvasState) => {
    const selected = canvasState.selectedItems || [];
    return {
      items: selected,
      timestamp: Date.now()
    };
  },

  // Paste copied items
  paste: (canvasState, originalItems) => {
    const newItems = originalItems.map((item, index) => ({
      ...item,
      id: Date.now() + index, // New ID
      x: (originalItems[0]?.x || 0) + 50, // Offset position
      y: (originalItems[0]?.y || 0) + 50
    }));

    return {
      items: newItems,
      count: newItems.length
    };
  },

  // Undo
  undo: (history) => {
    if (history && history.length > 0) {
      return history[history.length - 1];
    }
    return null;
  },

  // Delete
  delete: (selectedIds) => {
    return selectedIds;
  },

  // Move
  move: (item, dx, dy) => {
    return {
      x: item.x + dx,
      y: item.y + dy
    };
  },

  // Print
  print: () => {
    window.print();
  }
};
