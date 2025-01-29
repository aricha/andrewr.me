import imageAssets from '@/assets/image-assets.json';
import blurData from '@/assets/blur-data.json';

export type ImageAssetKey = keyof typeof imageAssets;

export interface ImageAsset {
  publicId: string;
  width: number;
  height: number;
}

export function getImageAsset(key: ImageAssetKey): ImageAsset {
  return imageAssets[key];
}

export function getBlurDataUrl(relativePath: string): string | undefined {
  return blurData[relativePath as keyof typeof blurData]?.blurDataURL;
}

