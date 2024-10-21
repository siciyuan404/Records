import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link, Copy, Check } from 'lucide-react'
import { cn } from "@/lib/utils"

interface SourceLinksPreviewProps {
  links: Record<string, { link: string; psw: string; size: string }>;
}

export function SourceLinksPreview({ links }: SourceLinksPreviewProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Link className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto">
        {Object.entries(links).length > 0 ? (
          <div className="space-y-2">
            {Object.entries(links).map(([key, { link, psw, size }]) => (
              <div key={key} className="flex items-center space-x-2 text-xs">
                <Input
                  value={link}
                  readOnly
                  className="h-7 w-24 text-xs"
                  title={link}
                />
                <Input
                  value={psw}
                  readOnly
                  className="h-7 w-16 text-xs"
                  title={psw}
                />
                <span className="text-muted-foreground whitespace-nowrap w-12">{size}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(`链接: ${link}\n密码: ${psw}`, key)}
                  className={cn(
                    "h-7 px-2 text-xs transition-all duration-200",
                    copiedKey === key && "text-green-500"
                  )}
                >
                  {copiedKey === key ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">暂无可用链接</p>
        )}
      </PopoverContent>
    </Popover>
  );
}