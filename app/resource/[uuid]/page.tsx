'use client'

import React from 'react';

import ResourceDetail from '@/app/components/ResourceDetail/ResourceDetail';

export default function ResourceDetailPage({ params }: { params: { uuid: string } }) {
  return (
    <div className="w-full h-full">
      <ResourceDetail uuid={params.uuid} />
    </div>
  );
}
