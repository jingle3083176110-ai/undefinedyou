import { additionalPhotos } from "./photo-library.js";
import { workshopLibrary } from "./workshop-library.js";

const workshopNames = {
  "2025-10-2-10-3": { title: "Zhuhai Trip", titleZh: "珠海之旅" },
  "2025-10-6": { title: "Shaw College Return Day", titleZh: "逸夫书院返校日" },
  "2025-9-20": { title: "Shaw College Mid-Autumn Fair", titleZh: "逸夫中秋游园活动" },
};

const workshopPhotos = workshopLibrary.flatMap((workshop) => workshop.images.map((image) => ({
  id: `workshop-${workshop.slug}-${image.file.replace(/\.webp$/, "")}`,
  src: `/photos/workshops/${workshop.slug}/${image.file}`,
  alt: `${workshop.folder} photograph`,
  date: image.date || workshop.date,
  location: workshop.slug === "2025-10-6" || workshop.slug === "2025-9-20" ? "Shaw College, The Chinese University of Hong Kong, Shenzhen" : workshop.slug === "2025-10-2-10-3" ? "Zhuhai, Guangdong, China" : "",
  locationZh: workshop.slug === "2025-10-6" || workshop.slug === "2025-9-20" ? "中国 广东省 深圳市 龙岗区 香港中文大学（深圳）逸夫书院" : workshop.slug === "2025-10-2-10-3" ? "中国 珠海市" : "",
  note: workshopNames[workshop.slug]?.title || workshop.folder,
  noteZh: workshopNames[workshop.slug]?.titleZh || workshop.folder,
  aspect: "landscape",
  collectionType: "workshops",
  collectionSlug: workshop.slug,
})));

const basePhotos = [{
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
}];

export const galleryPhotos = [...basePhotos, ...additionalPhotos, ...workshopPhotos].sort((a, b) => {
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

export const photoWorkshops = workshopLibrary.map((workshop) => ({
    slug: workshop.slug,
    title: workshopNames[workshop.slug]?.title || workshop.folder,
    titleZh: workshopNames[workshop.slug]?.titleZh || workshop.folder,
    dateRange: workshop.date,
    location: "",
    locationZh: "",
    intro: "A sequence from an afternoon or evening gathered together.",
    introZh: "一段被整理保存的活动片段。",
    imageIds: workshopPhotos.filter((photo) => photo.collectionSlug === workshop.slug).map((photo) => photo.id),
    coverId: workshopPhotos.find((photo) => photo.collectionSlug === workshop.slug)?.id,
  }));

export const photosFor = (ids) => ids.map((id) => galleryPhotos.find((photo) => photo.id === id)).filter(Boolean);
