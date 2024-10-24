import React from 'react';
import { Loader2 } from 'lucide-react'; // 引入 Lucide 图标库中的 Loader2 图标

const LoadingAnimation = () => (
  <div className="flex items-center justify-center h-full">
    <Loader2 className="animate-spin h-8 w-8 text-primary" />
  </div>
);

export default LoadingAnimation;
