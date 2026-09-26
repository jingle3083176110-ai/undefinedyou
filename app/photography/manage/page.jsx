import PhotoMetadataManager from "@/components/PhotoMetadataManager";
import { galleryPhotos } from "@/lib/photos";

export const metadata = { title: "Photo metadata manager" };

export default function PhotoManagePage() {
  return <main className="min-h-screen bg-warmwhite px-6 pb-24 pt-32 md:px-16 lg:px-24"><div className="mx-auto max-w-7xl"><p className="font-mono text-xs uppercase tracking-[.3em] text-muted">Local tool / Photography</p><h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[1.04] text-ink md:text-7xl">Photo index</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">Use the thumbnails to identify each uploaded photo, then add its location. Export the metadata when you are ready to sync it.</p><PhotoMetadataManager photos={galleryPhotos} /></div></main>;
}
