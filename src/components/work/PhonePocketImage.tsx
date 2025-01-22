import Image, { StaticImageData } from "next/image";

interface PhonePocketImageProps {
  src: StaticImageData;
  alt: string;
  className?: string;
  imageClassName?: string;
}

export function PhonePocketImage({ src, alt, className, imageClassName }: PhonePocketImageProps) {
  return (
    <div
      className={`relative max-h-72 mx-auto w-4/5 sm:w-full flex-shrink-0 basis-1/3 overflow-clip border-b-2 border-solid ${className}`}
      style={{
        borderImage: 'linear-gradient(to right, transparent 15%, rgba(80,80,80,0.7) 30%, rgba(255,255,255,0.7) 60%, rgba(80,80,80,0.7) 80%, transparent 85%) 4',
      }}
    >
      <Image
        src={src}
        alt={alt}
        className={`max-w-72 w-full sm:px-0 mx-auto ${imageClassName}`}
      />
    </div>
  );
} 