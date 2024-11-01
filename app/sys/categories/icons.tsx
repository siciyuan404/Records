"use client"

import * as Icons from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useGetIconsQuery } from '@/app/store/features/icons/iconsApi'

const CategoriesPage = () => {
  const [page, setPage] = useState(1)
  const [allIcons, setAllIcons] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const pageSize = 60

  const { data, isLoading, error } = useGetIconsQuery({ 
    page, 
    pageSize 
  })

  useEffect(() => {
    if (data?.icons) {
      setAllIcons(prev => [...prev, ...data.icons])
    }
  }, [data])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && data?.total && allIcons.length < data.total) {
          setPage(prev => prev + 1)
        }
      },
      { threshold: 0.5 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [data?.total, allIcons.length])

  if (error) {
    return <div>加载失败</div>
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-6 gap-4">
        {allIcons.map(iconName => {
          const IconComponent = Icons[iconName as keyof typeof Icons] as React.ElementType
          return (
            <div key={iconName} className="flex flex-col items-center p-2 border rounded hover:bg-gray-50">
              <IconComponent size={24} />
              <span className="mt-1 text-sm text-gray-600">{iconName}</span>
            </div>
          )
        })}
      </div>
      <div ref={containerRef} className="h-20 flex items-center justify-center">
        {isLoading && <div>加载中...</div>}
      </div>
    </div>
  )
}

export default CategoriesPage
