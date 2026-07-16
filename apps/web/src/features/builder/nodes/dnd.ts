import { type DragEvent } from 'react';

/**
 * The drag-and-drop contract between the Node Library and the canvas. A drag
 * carries only the node-type id on a custom MIME type; the canvas resolves the
 * rest from the registry on drop. Keeping the payload to an id (not a serialized
 * node) means new node types need no changes here.
 */
export const NODE_DND_MIME = 'application/x-knoten-node';

/** Called on the library item's `dragStart` to attach the node-type id. */
export function setNodeDragData(event: DragEvent, type: string): void {
  event.dataTransfer.setData(NODE_DND_MIME, type);
  event.dataTransfer.effectAllowed = 'copy';
}

/** Reads the dragged node-type id on the canvas `drop`; null if not our drag. */
export function getDraggedNodeType(event: DragEvent): string | null {
  return event.dataTransfer.getData(NODE_DND_MIME) || null;
}
