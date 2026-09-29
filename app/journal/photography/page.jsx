import PhotographyBrowser from "@/components/PhotographyBrowser";
import { getPhotos, getPhotoThemes, getPhotoWorkshops } from "@/lib/content/repository";

export default async function PhotographyPage() {
  const [photos, themes, workshops] = await Promise.all([getPhotos(), getPhotoThemes(), getPhotoWorkshops()]);
  return <PhotographyBrowser photos={photos} themes={themes} workshops={workshops} />;
}
