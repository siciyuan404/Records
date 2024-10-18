import React from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';

interface CustomLinkProps extends NextLinkProps {
  categoryPath?: string[];
  className?: string;
  children: React.ReactNode;
}

const CustomLink: React.FC<CustomLinkProps> = ({ categoryPath, className, children, ...props }) => {
  const href = typeof props.href === 'string' 
    ? `${props.href}${categoryPath ? `?categoryPath=${categoryPath.join('/')}` : ''}`
    : props.href;

  return (
    <NextLink {...props} href={href} className={className}>
      {children}
    </NextLink>
  );
};

export default CustomLink;