import { HttpRequestNode, type HttpRequestData } from '../components/HttpRequestNode';
import { defineNode } from '../types';

import { GlobeIcon } from '@/components/icons';

/** Calls an HTTP API and exposes the response to downstream nodes. */
export const httpRequestDefinition = defineNode<HttpRequestData>({
  type: 'http-request',
  label: 'HTTP Request',
  category: 'core',
  icon: GlobeIcon,
  description: 'Call any HTTP API and use the response downstream.',
  defaultData: { label: 'HTTP Request', method: 'GET', url: '' },
  component: HttpRequestNode,
});
