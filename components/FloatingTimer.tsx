import { DraggableData } from '@shopify/draggable';

const handleDrag = (_e: MouseEvent, data: DraggableData) => {
  // If you're not using delta and position, you can omit them
  const { x, y } = data;
  // Use x and y if needed, or remove the entire function if it's not being used
};
