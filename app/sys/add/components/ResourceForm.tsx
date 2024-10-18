import React from 'react';
import { useForm, Controller } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Cascader } from '@/components/ui/cascader'
import { ImageUpload } from '@/components/ui/image-upload'
import { TagInput } from '@/components/ui/tag-input'
import { SourceLinksInput } from '@/components/ui/source-links-input'
import { Textarea } from "@/components/ui/textarea"
import { Resource } from '@/app/sys/add/types'
import { KeyValueInput } from '@/components/ui/key-value-input'
import { FormMessage } from "@/components/ui/form";

interface ResourceFormProps {
    initialData?: Resource;
    onSubmit: (data: Resource) => void;
    categories: Record<string, any>;
    tags: Record<string, any>;
}

export function ResourceForm({ initialData, onSubmit, categories, tags }: ResourceFormProps) {

    
    const form = useForm<Resource>({
        defaultValues: initialData || {
            name: '',
            category: '', 
            images: ['https://picsum.photos/200/300'],
            tags: {},
            source_links: {},
            uploaded: Date.now(),
            update_time: Date.now(),
            introduction: '',
            resource_information: {},
            link: '',
            rating: 5,
            comments: 0,
            download_count: 0,
            download_limit: 0,
            other_information: {}
        }
    });

    const handleSubmit = (data: Resource) => {
        onSubmit(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar p-4 w-full">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>名字</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>分类</FormLabel>
                            <FormControl>
                                <Cascader
                                    categories={categories}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>图片</FormLabel>
                            <FormControl>
                                <ImageUpload {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>标签</FormLabel>
                            <FormControl>
                                <TagInput
                                    options={tags}
                                    value={Array.isArray(field.value) ? field.value : []}
                                    onChange={(newTags) => field.onChange(newTags)}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="source_links"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>资源链接</FormLabel>
                            <FormControl>
                                <SourceLinksInput
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="introduction"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>简介</FormLabel>
                            <FormControl>
                                <Textarea {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>官方链接</FormLabel>
                            <FormControl>
                                <Input {...field} type="url" />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>评分</FormLabel>
                            <FormControl>
                                <Input {...field} type="number" min="1" max="10" step="0.1" />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="resource_information"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <KeyValueInput
                                    value={field.value as Record<string, string | number>}
                                    onChange={field.onChange}
                                    title="资源信息"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="other_information"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <KeyValueInput
                                    value={field.value as Record<string, string | number>}
                                    onChange={field.onChange}
                                    title="其他信息"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">保存</Button>
            </form>
        </Form>
    );
}