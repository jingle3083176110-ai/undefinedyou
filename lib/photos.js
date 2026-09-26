import { additionalPhotos } from "./photo-library.js";

const basePhotos = [
  {
    id: "midautumn-fair",
    src: "/photos/workshops/2025-midautumn-fair/midautumn-fair.png",
    alt: "A photograph from the Shaw College Mid-Autumn Fair",
    date: "2025-09-20",
    location: "Shaw College",
    locationZh: "逸夫书院",
    note: "Mid-Autumn Fair",
    noteZh: "中秋游园活动",
    aspect: "landscape",
    collectionType: "workshops",
    collectionSlug: "2025-midautumn-fair",
  },
  {
    id: "river-bridge",
    src: "/photos/themes/landscape/river-bridge.jpg",
    alt: "A bridge over water with trees and city buildings",
    date: "2023-08-01",
    location: "",
    locationZh: "",
    note: "",
    noteZh: "",
    aspect: "landscape",
    collectionType: "themes",
    collectionSlug: "landscape",
  },
  {
    id: "autumn-courtyard",
    src: "/photos/themes/landscape/autumn-courtyard.jpeg",
    alt: "Leaves and windows in warm afternoon light",
    date: "",
    location: "",
    locationZh: "",
    note: "",
    noteZh: "",
    aspect: "landscape",
    collectionType: "themes",
    collectionSlug: "landscape",
  },
];

export const galleryPhotos = [...basePhotos, ...additionalPhotos].sort((a, b) => {
  if (!a.date && !b.date) return 0;
  if (!a.date) return 1;
  if (!b.date) return -1;
  return b.date.localeCompare(a.date);
});

export const photoThemes = [
  {
    slug: "landscape",
    title: "Landscape",
    titleZh: "风景",
    intro: "Light, water, trees, and the built world.",
    introZh: "光、水、树木与建筑之间的风景。",
    imageIds: ["river-bridge", "autumn-courtyard", ...additionalPhotos.filter((photo) => photo.collectionSlug === "landscape").map((photo) => photo.id)],
  },
  {
    slug: "people",
    title: "People",
    titleZh: "人文",
    intro: "Faces, gestures, streets, and everyday life.",
    introZh: "面孔、动作、街道与日常生活。",
    imageIds: additionalPhotos.filter((photo) => photo.collectionSlug === "people").map((photo) => photo.id),
  },
  {
    slug: "food",
    title: "Food",
    titleZh: "美食",
    intro: "Tables, textures, and small pleasures.",
    introZh: "餐桌、质感与日常的小小满足。",
    imageIds: additionalPhotos.filter((photo) => photo.collectionSlug === "food").map((photo) => photo.id),
  },
];

export const photoWorkshops = [
  {
    slug: "2025-midautumn-fair",
    title: "Shaw College Mid-Autumn Fair",
    titleZh: "逸夫中秋游园活动",
    dateRange: "2025-09-20",
    location: "Shaw College",
    locationZh: "逸夫书院",
    intro: "An evening of Mid-Autumn gatherings and wandering.",
    introZh: "在中秋游园活动中留下的夜晚片段。",
    imageIds: ["midautumn-fair"],
  },
];

export const photosFor = (ids) => ids.map((id) => galleryPhotos.find((photo) => photo.id === id)).filter(Boolean);
