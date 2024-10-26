import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, className }) => {
  const IconComponent = (LucideIcons as any)[name];

  if (!IconComponent) {
    console.warn(`未找到名称为 "${name}" 的图标`);
    return null; // 或者返回一个默认图标
  }

  return <IconComponent size={size} className={className} />;
};

export default Icon;
