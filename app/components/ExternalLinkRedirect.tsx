'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface ExternalLinkRedirectProps {
  href: string;
}

const ExternalLinkRedirect: React.FC<ExternalLinkRedirectProps> = ({ href }) => {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = href;
    }, 3000);

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 33.33, 100));
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [href]);

  const handleImmediateRedirect = () => {
    setShowConfetti(true);
    setTimeout(() => {
      window.location.href = href;
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[400px] overflow-hidden">
          <CardHeader className="bg-blue-500 text-white">
            <CardTitle className="text-2xl">正在跳转到外部链接</CardTitle>
            <CardDescription className="text-blue-100">您即将离开本站，前往以下地址：</CardDescription>
          </CardHeader>
          <CardContent className="mt-4">
            <p className="text-sm text-blue-600 break-all mb-4">{href}</p>
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="text-yellow-500 animate-pulse" />
              <span className="text-sm text-gray-600">自动跳转倒计时：</span>
            </div>
            <Progress value={progress} className="w-full h-2" />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleImmediateRedirect}>
              <ExternalLink className="mr-2 h-4 w-4" />
              立即跳转
            </Button>
            <Button variant="ghost" onClick={() => router.back()}>
              返回上一页
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-300 rounded-full"
              initial={{ 
                top: "50%", 
                left: "50%", 
                scale: 0 
              }}
              animate={{ 
                top: `${Math.random() * 100}%`, 
                left: `${Math.random() * 100}%`, 
                scale: [0, 1, 0],
                opacity: [1, 1, 0]
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExternalLinkRedirect;
