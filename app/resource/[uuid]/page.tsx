'use client'

import React from 'react';

import ResourceDetail from '@/app/components/ResourceDetail/ResourceDetail';

export default function ResourceDetailPage({ params }: { params: { uuid: string } }) {
 

  return (
    <div className="container mx-auto p-4 mt-12">
      <ResourceDetail uuid={params.uuid} />
    </div>
  );
}

