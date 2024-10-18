import { useState, useEffect } from 'react'
import Image from 'next/image'
import { format, formatDistanceToNow } from 'date-fns'
import { Star, Download, MessageSquare, ExternalLink, Copy, Eye, Calendar, Link, Info, FileText, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion' // 新增：用于动画效果

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip" // 新增：用于提示

import { Resource } from '@/app/sys/add/types'
import { fetchResourceInfo } from '@/lib/api'
import ResourceSkeleton from './ResourceSkeleton'

interface ResourceDetailProps {
    uuid: string;
}

export default function ResourceDetail({ uuid }: ResourceDetailProps) {
    const [resource, setResource] = useState<Resource | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [isImageModalOpen, setIsImageModalOpen] = useState(false)

    useEffect(() => {
        const fetchResource = async () => {
            try {
                const data = await fetchResourceInfo(uuid);
                setResource(data);
            } catch (error) {
                console.error('获取资源详情时出错:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchResource();
    }, [uuid]);

    if (loading) {
        return <ResourceSkeleton />;
    }

    if (!resource) {
        return <div className="text-center p-4">资源未找到</div>;
    }

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === resource.images.length - 1 ? 0 : prevIndex + 1
        )
    }

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? resource.images.length - 1 : prevIndex - 1
        )
    }

    const copyToClipboard = async (text: string, description: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast({
                title: "已复制",
                description: description,
            });
        } catch (err) {
            console.error('复制失败:', err);
            toast({
                title: "复制失败",
                description: "请手动复制内容",
                variant: "destructive"
            });
        }
    }
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 sm:px-6 py-6 sm:py-10"
        >
            <Card className="mb-4 sm:mb-6 shadow-lg rounded-lg overflow-hidden">
                <CardHeader className="pb-4 sm:pb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <CardTitle className="text-xl sm:text-2xl font-bold">{resource.name}</CardTitle>
                    <p className="mt-1 opacity-80">{resource.category}</p>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 sm:mt-4">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex items-center space-x-1 bg-white bg-opacity-20 rounded-full px-3 py-1">
                                        <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-300" />
                                        <span className="text-xs sm:text-sm">{resource.rating}</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>资源评分</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        {/* 类似地，为其他信息项添加 Tooltip */}
                    </div>
                </CardHeader>
                <CardContent className="px-3 sm:px-4 py-2 sm:py-3">
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative w-full h-[300px] mb-4 overflow-hidden rounded-lg"
                    >
                        <Image
                            src={resource.images[currentImageIndex]}
                            alt={`${resource.name} - 图片`}
                            layout="fill"
                            objectFit="cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-between p-4">
                            <Button onClick={prevImage} variant="ghost" size="icon" className="bg-black bg-opacity-50 text-white">
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                            <Button onClick={nextImage} variant="ghost" size="icon" className="bg-black bg-opacity-50 text-white">
                                <ChevronRight className="h-6 w-6" />
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap gap-2 mb-4"
                    >
                        {resource.tags.map((tag: any, index: number) => (
                            <Badge key={index} variant="secondary" className="animate-pulse">{tag}</Badge>
                        ))}
                    </motion.div>

                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h3 className="text-base sm:text-lg font-semibold mb-2 flex items-center">
                            <Download className="mr-2" /> 网盘资源
                        </h3>
                        {Object.entries(resource.source_links).map(([source, info]) => (
                            <Card key={source} className="mb-3 sm:mb-4 p-3 sm:p-4 hover:shadow-md transition-shadow duration-300">
                                <div className="flex items-center justify-between">
                                    <p className="font-medium">{source}</p>
                                </div>
                                <div className="flex items-center space-x-2 mt-2">
                                    <div className="relative flex-grow group">
                                        <Input
                                            value={info.link}
                                            readOnly
                                            className="pr-10"
                                            onClick={() => copyToClipboard(info.link, "链接已复制到剪贴板")}
                                        />
                                        <Button
                                            className="absolute right-0 top-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 hover:bg-blue-600"
                                            onClick={() => copyToClipboard(info.link, "链接已复制到剪贴板")}
                                            size="icon"
                                        >
                                            <Copy className="h-4 w-4 text-white" />
                                        </Button>
                                    </div>
                                    {info.psw && (
                                        <div className="relative w-24 group">
                                            <Input
                                                value={info.psw}
                                                readOnly
                                                className="pr-10"
                                                onClick={() => copyToClipboard(info.psw, "密码已复制到剪贴板")}
                                            />
                                            <Button
                                                className="absolute right-0 top-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => copyToClipboard(info.psw, "密码已复制到剪贴板")}
                                                size="icon"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                    <Button onClick={() => copyToClipboard(`链接：${info.link}\n密码：${info.psw || '无'}`, "链接和密码已复制到剪贴板")} size="icon"><Copy className="h-4 w-4" /></Button>
                                    <Button onClick={() => window.open(info.link, '_blank')} variant="outline" size="icon"><ExternalLink className="h-4 w-4" /></Button>
                                </div>
                                <p className="text-sm text-muted-foreground whitespace-nowrap mb-2 mt-2 ml-0 mr-0">大小：{info.size}</p>
                            </Card>
                        ))}
                    </motion.div>

                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h3 className="text-lg font-semibold mb-2 flex items-center">
                            <Info className="mr-2" /> 资源信息
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center">
                                <Calendar className="mr-2 text-gray-500" />
                                <p>更新时间：{format(new Date(resource.update_time), 'yyyy-MM-dd HH:mm:ss')}</p>
                            </div>
                            <div className="flex items-center">
                                <Link className="mr-2 text-gray-500" />
                                <a href={resource.link} className="text-blue-500 hover:underline flex items-center">
                                    官方链接 <ExternalLink className="h-4 w-4 ml-1" />
                                </a>
                            </div>
                            {Object.entries(resource.resource_information || {}).map(([key, value]) => (
                                <p key={key}>{key}: {value}</p>
                            ))}
                        </div>
                    </motion.div>

                    <Separator className="my-4" />

                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <h3 className="text-lg font-semibold mb-2 flex items-center">
                            <FileText className="mr-2" /> 简介
                        </h3>
                        <p className="text-gray-700">{resource.introduction}</p>
                    </motion.div>

                    <Separator className="my-4" />

                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        <h3 className="text-lg font-semibold mb-2 flex items-center">
                            <ImageIcon className="mr-2" /> 图集
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {resource.images.map((image, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
                                        <DialogTrigger asChild>
                                            <div className="relative w-full h-[150px] cursor-pointer overflow-hidden rounded-lg">
                                                <Image
                                                    src={image}
                                                    alt={`${resource.name} - 图片 ${index + 1}`}
                                                    layout="fill"
                                                    objectFit="cover"
                                                    className="rounded-lg"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
                                                    <Eye className="h-6 w-6 text-white" />
                                                </div>
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-3xl">
                                            <Image
                                                src={image}
                                                alt={`${resource.name} - 图片 ${index + 1}`}
                                                width={800}
                                                height={600}
                                                layout="responsive"
                                                objectFit="contain"
                                            />
                                        </DialogContent>
                                    </Dialog>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    )
}