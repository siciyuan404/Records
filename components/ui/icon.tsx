import React from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

type IconName = keyof typeof LucideIcons;

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, className }) => {
  const IconComponent = LucideIcons[name as IconName] as React.ComponentType<LucideProps> | undefined;

  if (!IconComponent) {
    return null;
  }

  return <IconComponent size={size} className={className} />;
};

export default Icon;
