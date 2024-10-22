import type { Component } from 'vue';
import { config } from '@/config';

export interface ITool {
  name: string
  path: string
  description: string
  keywords: string[]
  component: () => Promise<Component>
  icon: Component
  redirectFrom?: string[]
  isNew: boolean
  createdAt: Date
}

export interface ToolCategory {
  name: string
  icon: Component
  components: ITool[]
}

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export function defineTool(
  tool: WithOptional<ITool, 'isNew'>,
  { newTools }: { newTools: string[] } = { newTools: config.tools.newTools },
) {
  const isNew = newTools.includes(tool.name);

  return {
    isNew,
    ...tool,
  };
}
