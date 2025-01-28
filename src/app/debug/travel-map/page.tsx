import TravelMapDebugTool from '@/components/travels/TravelMapDebugTool';
import { notFound } from 'next/navigation';

export default function TravelMapDebugPage() {
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Travel Map Debug Tool</h1>
      <TravelMapDebugTool/>
    </div>
  );
} 