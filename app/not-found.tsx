import { Suspense } from 'react';
import NotFoundContent from './NotFoundContent';

export default function NotFound() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}
