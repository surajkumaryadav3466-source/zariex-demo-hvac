import { Suspense } from 'react';
import DemoInterface from './components/DemoInterface';

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen bg-background flex items-center justify-center">
        <span className="text-muted-foreground text-xs font-mono">Loading...</span>
      </div>
    }>
      <DemoInterface />
    </Suspense>
  );
}