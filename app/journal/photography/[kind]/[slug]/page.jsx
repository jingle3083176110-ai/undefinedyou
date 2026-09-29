import { notFound } from "next/navigation";
import PhotoCollectionPage from "@/components/PhotoCollectionPage";
import { getPhotos, getPhotoThemes, getPhotoWorkshops } from "@/lib/content/repository";

export async function generateStaticParams() {
  const [themes, workshops] = await Promise.all([getPhotoThemes(), getPhotoWorkshops()]);
  return [...themes.map(({ slug }) => ({ kind: "themes", slug })), ...workshops.map(({ slug }) => ({ kind: "workshops", slug }))];
}

export default async function PhotoCollectionRoute({ params }) {
  const { kind, slug } = await params;
  const [themes, workshops, photos] = await Promise.all([getPhotoThemes(), getPhotoWorkshops(), getPhotos()]);
  const collections = { themes, workshops };
  const collection = collections[kind]?.find((item) => item.slug === slug);
  if (!collection) notFound();
  return <PhotoCollectionPage collection={collection} kind={kind} photos={collection.imageIds.map((id) => photos.find((photo) => photo.id === id)).filter(Boolean)} />;
}
