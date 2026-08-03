export interface TileContent {
  id: string;
  title: string;
  category: string;
  image: string;
}

// Safely maps infinite (x, y) coordinates to your array items dynamically
export function getTileContent(x: number, y: number, items: string[]): TileContent {
  const index = Math.abs((x * 7 + y * 13) % items.length);
  const imageUrl = items[index] || "https://picsum.photos/id/10/400/500";
  
  return {
    id: `${x}_${y}`,
    title: `Project Asset (${x}, ${y})`,
    category: "Dynamic Grid Node",
    image: imageUrl,
  };
}