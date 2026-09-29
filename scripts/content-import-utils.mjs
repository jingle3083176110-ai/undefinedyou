export function collectionPhotoRows(collections, collectionIdsBySlug) {
  return collections.flatMap((collection) => {
    const collectionId = collectionIdsBySlug.get(collection.slug);
    if (!collectionId) return [];
    return (collection.imageIds || []).map((photoId, sortOrder) => ({
      collection_id: collectionId,
      photo_id: photoId,
      sort_order: sortOrder,
    }));
  });
}
