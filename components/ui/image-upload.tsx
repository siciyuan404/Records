import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"
import { X, Plus } from 'lucide-react'
import axios from 'axios';

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [urls, setUrls] = useState<string[]>(value);
  const [urlInputs, setUrlInputs] = useState<string[]>(value.length ? value : ['']);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    
    // 禁用 API 上传功能
    /*
    const uploadPromises = acceptedFiles.map(async (file) => {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await axios.post('https://api.4040000.xyz/image_upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data.url; // Assuming the API returns the uploaded image URL
      } catch (error) {
        console.error('Upload failed:', error);
        toast({
          title: "Upload failed",
          description: "There was an error uploading your image. Please try again.",
          variant: "destructive",
        });
        return null;
      }
    });

    const uploadedUrls = (await Promise.all(uploadPromises)).filter(Boolean) as string[];
    */

    // 使用本地文件 URL 代替上传
    const uploadedUrls = acceptedFiles.map(file => URL.createObjectURL(file));

    const newUrls = [...urls, ...uploadedUrls];
    setUrls(newUrls);
    setUrlInputs(newUrls);
    onChange(newUrls);
    setIsUploading(false);
  }, [onChange, urls]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUrlChange = (index: number, value: string) => {
    const newUrlInputs = [...urlInputs];
    newUrlInputs[index] = value;
    setUrlInputs(newUrlInputs);
    updateUrls(newUrlInputs);
  };

  const handleAddUrlInput = () => { // 修改: 添加输入框后更新 URLs
    const newUrlInputs = [...urlInputs, '']; // 在数组末尾添加一个空字符串
    setUrlInputs(newUrlInputs);
    updateUrls(newUrlInputs); // 添加这一行以确保 URLs 状态同步更新
  };

  const handleRemoveUrlInput = (index: number) => {
    const newUrlInputs = urlInputs.filter((_, i) => i !== index);
    setUrlInputs(newUrlInputs);
    updateUrls(newUrlInputs);
  };

  const updateUrls = (newUrlInputs: string[]) => {
    const filteredUrls = newUrlInputs.filter(url => url.trim() !== '');
    setUrls(filteredUrls);
    onChange(filteredUrls);
  };

  return (
    <div className="space-y-4">
      <RadioGroup value={mode} onValueChange={(value) => setMode(value as 'upload' | 'url')}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="upload" id="upload" />
          <Label htmlFor="upload">Upload Images</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="url" id="url" />
          <Label htmlFor="url">Enter Image URLs</Label>
        </div>
      </RadioGroup>

      {mode === 'upload' && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${
            isDragActive ? 'border-primary' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </div>
      )}

      {mode === 'url' && (
        <div className="space-y-2">
          {urlInputs.map((url, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Enter image URL"
                value={url}
                onChange={(e) => handleUrlChange(index, e.target.value)}
              />
              <Button onClick={() => handleRemoveUrlInput(index)} size="icon" variant="outline" type="button">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button onClick={handleAddUrlInput} size="sm" variant="outline" type="button">
            <Plus className="h-4 w-4 mr-2" /> Add URL
          </Button>
        </div>
      )}

      {isUploading && <p>Uploading...</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {urls.map((url, index) => (
          <div key={index} className="relative group">
            <img src={url} alt={`Uploaded ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemoveUrlInput(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}