import Image, { StaticImageData } from "next/image";
interface PhonePocketImageProps {
  src: StaticImageData;
  alt: string;
  className?: string;
}

export function PhonePocketImage({ src, alt, className }: PhonePocketImageProps) {
  return (
    <div
      className={`relative max-h-72 w-full flex-shrink-0 basis-1/3 overflow-clip border-b-2 border-solid ${className}`}
      style={{
        borderImage: 'linear-gradient(to right, transparent 15%, rgba(80,80,80,0.7) 30%, rgba(255,255,255,0.7) 60%, rgba(80,80,80,0.7) 80%, transparent 85%) 4',
      }}
    >
      <Image
        src={src}
        alt={alt}
        layout="responsive"
        className="max-w-72 w-full mx-auto"
      />
    </div>
  );
} 