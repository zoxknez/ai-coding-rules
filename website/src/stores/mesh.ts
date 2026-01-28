import { atom } from 'nanostores';

// Selected node in 3D mesh viewer
export const selectedNode = atom<string | null>(null);

// Camera position for persisting across navigation
export const cameraPosition = atom({ x: 0, y: 0, z: 50 });

// Mesh filter by category
export const activeCategory = atom<string | null>(null);
