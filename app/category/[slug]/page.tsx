'use client'

import React, { useMemo } from 'react';
import ResourceCard from '@/app/components/ResourceCard';
import { Skeleton } from "@/components/ui/skeleton";
import { Resource } from '@/app/sys/add/types';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { useGetCategoriesQuery } from '@/app/store/api/categoriesApi';
import { useGetResourcesQuery } from '@/app/store/api/resourcesApi';

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
  const { data: categories, isLoading: isCategoriesLoading, isError: isCategoriesError } = useGetCategoriesQuery();
  const { data: resources, isLoading: isResourcesLoading, isError: isResourcesError } = useGetResourcesQuery();

  const categoryPath = useMemo(() =>
    categories ? findCategoryPath(categories, params.slug) : []
    , [categories, params.slug]);

  const currentCategory = categoryPath.length > 0 ? categoryPath[categoryPath.length - 1] : params.slug;
  const currentCategoryData = categories?.[currentCategory] as Category | undefined;

  const filteredResources = useMemo(() => {
    if (!resources) return [];
    
    const categoryString = categoryPath.join(' > ');

    return Object.entries(resources)
      .filter(([, resource]: [string, Resource]) =>
        resource.category === categoryString ||
        resource.category.startsWith(categoryString + ' > ') ||
        (categoryPath.length === 1 && resource.category.startsWith(currentCategory))
      )
      .map(([uuid, resource]) => ({ ...resource, uuid }));
  }, [resources, categoryPath, currentCategory]);

  const showSubcategories = !isResourcesLoading && filteredResources.length === 0 && !!currentCategoryData?.items;
  
  const isLoading = isCategoriesLoading || isResourcesLoading;

  if (isCategoriesError) return <div>加载分类时出错</div>;
  if (isResourcesError) return <div>加载资源时出错</div>;

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
      ) : (
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
      )}
    </div>
  );
}
