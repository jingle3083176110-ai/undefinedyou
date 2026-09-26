import PhotographyBrowser from "@/components/PhotographyBrowser";
import { galleryPhotos, photoThemes, photoWorkshops } from "@/lib/photos";

export default function PhotographyPage() {
  return <PhotographyBrowser photos={galleryPhotos} themes={photoThemes} workshops={photoWorkshops} />;
}
