import React from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: string;
  fallback?: React.ReactNode;
}

export const DynamicIcon = ({ name, fallback, ...props }: DynamicIconProps) => {
  // Try to find the icon in LucideIcons
  // Lucide icons are usually PascalCase, so we ensure the name is formatted correctly
  const iconName = name.charAt(0).toUpperCase() + name.slice(1);
  const Icon = (LucideIcons as any)[iconName] || (LucideIcons as any)[name];

  if (!Icon) {
    return <>{fallback || <LucideIcons.Sparkles {...props} />}</>;
  }

  return <Icon {...props} />;
};
