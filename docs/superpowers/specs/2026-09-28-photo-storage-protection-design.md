# Photo storage protection design

## Goal

Keep original photographs private while continuing to show compressed preview images on the public portfolio.

## Storage layout

- `photo-previews`: public bucket containing website-ready preview files.
- `photo-originals`: private bucket containing original files. It has no public read policy.

## Data model

Add `original_path` to `photos`. `storage_path` remains the public preview path. Public content APIs return preview paths only and never expose `original_path`.

## Migration approach

Existing files in `public/photos` remain unchanged until previews and originals have been uploaded and verified. The migration is additive and reversible: the current site keeps working from local paths until the storage-backed image URLs are enabled.

## Access rules

Anonymous visitors may read `photo-previews`. No anonymous policy is created for `photo-originals`. Original-file access is limited to server-side operations using the service-role key.

## Verification

Verify both buckets exist, confirm the originals bucket has no public policy, and confirm the public content response includes no `original_path` field.
