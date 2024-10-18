import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus } from 'lucide-react'

interface SourceLink {
  link: string;
  psw: string;
  size: string;
}

interface SourceLinksInputProps {
  value: Record<string, SourceLink>;
  onChange: (value: Record<string, SourceLink>) => void;
}

const defaultQuarkLink: SourceLink = {
  link: "https://pan.quark.cn/s/b8d940fcdec5",
  psw: "MUhK",
  size: "3.2GB"
};

const platforms = ['夸克', '百度云盘', '阿里云盘','蓝奏云盘', '腾讯云盘', '迅雷', '115网盘','其他'];

export function SourceLinksInput({ value, onChange }: SourceLinksInputProps) {
  const [links, setLinks] = useState<Record<string, SourceLink>>(value);

  const handleAddLink = (platform: string) => {
    if (!links[platform]) {
      const newLinks = { ...links, [platform]: { link: '', psw: '', size: '' } };
      setLinks(newLinks);
      onChange(newLinks);
    }
  };

  const handleRemoveLink = (platform: string) => {
    const newLinks = { ...links };
    delete newLinks[platform];
    setLinks(newLinks);
    onChange(newLinks);
  };

  const handleLinkChange = (platform: string, field: keyof SourceLink, value: string) => {
    const newLinks = {
      ...links,
      [platform]: { ...links[platform], [field]: value }
    };
    setLinks(newLinks);
    onChange(newLinks);
  };

  return (
    <div className="space-y-4">
      {Object.entries(links).map(([platform, link]) => (
        <div key={platform} className="p-4 border rounded-md space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-lg font-semibold">{platform}</Label>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveLink(platform)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${platform}-link`}>Link</Label>
            <Input
              id={`${platform}-link`}
              value={link.link}
              onChange={(e) => handleLinkChange(platform, 'link', e.target.value)}
              placeholder="Enter link"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${platform}-psw`}>Password</Label>
            <Input
              id={`${platform}-psw`}
              value={link.psw}
              onChange={(e) => handleLinkChange(platform, 'psw', e.target.value)}
              placeholder="Enter password"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${platform}-size`}>Size</Label>
            <Input
              id={`${platform}-size`}
              value={link.size}
              onChange={(e) => handleLinkChange(platform, 'size', e.target.value)}
              placeholder="Enter size"
            />
          </div>
        </div>
      ))}
      <Select onValueChange={handleAddLink}>
        <SelectTrigger>
          <SelectValue placeholder="Add new platform" />
        </SelectTrigger>
        <SelectContent>
          {platforms.map((platform) => (
            <SelectItem key={platform} value={platform} disabled={!!links[platform]}>
              {platform}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}