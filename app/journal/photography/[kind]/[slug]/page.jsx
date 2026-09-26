import { notFound } from "next/navigation";
import PhotoCollectionPage from "@/components/PhotoCollectionPage";
import { photoThemes, photoWorkshops, photosFor } from "@/lib/photos";

const collections = { themes: photoThemes, workshops: photoWorkshops };

export function generateStaticParams() {
  return Object.entries(collections).flatMap(([kind, items]) => items.map(({ slug }) => ({ kind, slug })));
}

export default async function PhotoCollectionRoute({ params }) {
  const { kind, slug } = await params;
  const collection = collections[kind]?.find((item) => item.slug === slug);
  if (!collection) notFound();
  return <PhotoCollectionPage collection={collection} kind={kind} photos={photosFor(collection.imageIds)} />;
}
