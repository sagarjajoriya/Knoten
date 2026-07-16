import { type ReactNode } from 'react';

import { type BaseNodeData, type NodeComponentProps } from '../types';

import { BaseNode } from './BaseNode';

import { GlobeIcon } from '@/components/icons';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type HttpRequestData = BaseNodeData & {
  readonly method: HttpMethod;
  readonly url: string;
};

export function HttpRequestNode({
  data,
  selected,
}: NodeComponentProps<HttpRequestData>): ReactNode {
  const subtitle = `${data.method} · ${data.url || 'Not configured'}`;
  return (
    <BaseNode
      icon={GlobeIcon}
      category="core"
      title={data.label}
      subtitle={subtitle}
      hasInput
      hasOutput
      selected={selected}
    />
  );
}
