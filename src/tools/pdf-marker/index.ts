import { Artboard } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'PDF标注工具',
  path: '/pdf-marker',
  description: '创建并记录PDF文档的标注信息',
  keywords: ['ascii', 'asciiart', 'text', 'drawer'],
  component: () => import('./pdf-marker.vue'),
  icon: Artboard,
  createdAt: new Date('2024-03-03'),
});
