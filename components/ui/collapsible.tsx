"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import React from 'react'

// 直接导出 Radix 的组件，不要重新声明为 React.FC
export const Collapsible = CollapsiblePrimitive.Root
export const CollapsibleTrigger = CollapsiblePrimitive.Trigger
export const CollapsibleContent = CollapsiblePrimitive.Content
