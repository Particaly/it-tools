import type { ToolCategory } from './tool';
import { LockOpen } from '@vicons/tabler';

import { tool as PdfMarker } from './pdf-marker';

export const toolsByCategory: ToolCategory[] = [
  {
    name: '文件处理',
    icon: LockOpen,
    components: [PdfMarker],
  },
];

export const tools = toolsByCategory.flatMap(({ components }) => components);
export const toolsWithCategory = toolsByCategory.flatMap(({ components, name }) =>
  components.map(tool => ({ category: name, ...tool })),
);
