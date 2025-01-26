import imageAssets from '@/assets/image-assets.json';

export type ImageAssetKey = keyof typeof imageAssets;
export interface ImageAsset {
  publicId: string;
  width: number;
  height: number;
  format: string;
  url: string;
  relativePath: string;
}

export function getImageAsset(key: ImageAssetKey): ImageAsset {
  return imageAssets[key];
}

