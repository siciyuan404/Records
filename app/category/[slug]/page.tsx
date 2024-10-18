'use client'

import React, { useMemo } from 'react';
import { useAppSelector } from '@/app/store/hooks';
import ResourceCard from '@/app/components/ResourceCard';
import { Skeleton } from "@/components/ui/skeleton";
import { Resource } from '@/app/sys/add/types';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";

interface Category {
  link: string;
  items?: Record<string, Category>;
}

const findCategoryPath = (categories: Record<string, Category>, slug: string): string[] => {
  if (categories[slug]) return [slug];

  for (const [key, value] of Object.entries(categories)) {
    if (value.link === `/${slug}/` || value.link === `/${slug}` || value.link === slug) {
      return [key];
    }
    if (value.items) {
      const subPath = findCategoryPath(value.items, slug);
      if (subPath.length > 0) {
        return [key, ...subPath];
      }
    }
  }
  return [];
};

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { data: categories, status: categoryStatus, error: categoryError } = useAppSelector((state) => state.categories);
  const { data: resources, status: resourceStatus, error: resourceError } = useAppSelector((state) => state.resources);



  const categoryPath = useMemo(() =>
    categoryStatus === 'succeeded' ? findCategoryPath(categories, params.slug) : []
    , [categoryStatus, categories, params.slug]);

  const currentCategory = categoryPath.length > 0 ? categoryPath[categoryPath.length - 1] : params.slug;
  const currentCategoryData = categories[currentCategory] as Category | undefined;

  // useMemo 是 React 的一个钩子函数，用于优化性能。
  // 它会缓存计算结果，只有当依赖项发生变化时才重新计算。
  const filteredResources = useMemo(() => {
    if (resourceStatus !== 'succeeded' || !resources) return [];
    
    const categoryString = categoryPath.join(' > ');

    // Object.entries() 是一个JavaScript内置方法，用于将一个对象转换为其可枚举属性的键值对数组。
    // 对于resources对象，它会返回一个数组，每个元素都是一个包含两个项的数组：[key, value]
    // 其中key是resources对象的属性名（在这里可能是资源的UUID），value是对应的资源对象
    return Object.entries(resources)
      .filter(([, resource]: [string, Resource]) =>
        resource.category === categoryString ||
        resource.category.startsWith(categoryString + ' > ') ||
        (categoryPath.length === 1 && resource.category.startsWith(currentCategory))
      )
      .map(([uuid, resource]) => ({ ...resource, uuid }));
  }, [resources, categoryPath, currentCategory, resourceStatus]);

  const showSubcategories = resourceStatus === 'succeeded' && filteredResources.length === 0 && !!currentCategoryData?.items;
  
  const isLoading = categoryStatus === 'loading' || resourceStatus === 'loading';

  if (categoryStatus === 'failed') return <div>错误：{categoryError}</div>;
  if (resourceStatus === 'failed') return <div>错误：{resourceError}</div>;

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold mb-4">{currentCategory}</h1>
      <p className="text-muted-foreground mb-4">
        {categoryPath.length > 0 ? `分类路径：${categoryPath.join(' > ')}` : '顶层分类'}
      </p>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="w-full h-48" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : resourceStatus === 'succeeded' ? (
        showSubcategories ? (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">子分类：</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(currentCategoryData!.items!).map(([key, value]) => (
                <Link key={key} href={`/category${value.link}`}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <p className="text-lg font-semibold">{key}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mt-8 mb-4">资源列表：</h2>
            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources.map(({uuid, ...resource}) => (
                  <ResourceCard
                    key={uuid}
                    resource={resource}
                    uuid={uuid}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">该分类下暂无资源。</p>
            )}
          </>
        )
      ) : (
        <p className="text-muted-foreground">加载资源时出错。</p>
      )}
    </div>
  );
}
