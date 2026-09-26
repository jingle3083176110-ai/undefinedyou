export const galleryPhotos = [
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

export const photoThemes = [
  {
    slug: "landscape",
    title: "Landscape",
    titleZh: "风景",
    intro: "Light, water, trees, and the built world.",
    introZh: "光、水、树木与建筑之间的风景。",
    imageIds: ["river-bridge", "autumn-courtyard"],
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
