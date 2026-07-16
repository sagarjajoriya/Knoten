import { describe, expect, it } from 'vitest';

import { safeParse } from '../validation';

import {
  WORKFLOW_SCHEMA_VERSION,
  workflowDocumentSchema,
  workflowNodeSchema,
  workflowSchema,
  type Workflow,
  type WorkflowDocument,
} from './workflow.schema';

const validNode = {
  id: 'node-1',
  kind: 'trigger',
  name: 'When a record is created',
  position: { x: 0, y: 0 },
  data: {},
} as const;

const validWorkflow: Workflow = {
  id: 'wf-1',
  name: 'My first workflow',
  nodes: [
    { ...validNode },
    {
      id: 'node-2',
      kind: 'action',
      name: 'Send email',
      position: { x: 240, y: 0 },
      data: { to: 'user@example.com' },
    },
  ],
  edges: [{ id: 'edge-1', source: 'node-1', target: 'node-2' }],
};

describe('workflowNodeSchema', () => {
  it('accepts a well-formed node', () => {
    const result = safeParse(workflowNodeSchema, validNode);
    expect(result.ok).toBe(true);
  });

  it('rejects an unknown node kind', () => {
    const result = safeParse(workflowNodeSchema, { ...validNode, kind: 'loop' });
    expect(result.ok).toBe(false);
  });

  it('rejects an empty id', () => {
    const result = safeParse(workflowNodeSchema, { ...validNode, id: '' });
    expect(result.ok).toBe(false);
  });

  it('rejects a non-numeric position', () => {
    const result = safeParse(workflowNodeSchema, {
      ...validNode,
      position: { x: '0', y: 0 },
    });
    expect(result.ok).toBe(false);
  });
});

describe('workflowSchema', () => {
  it('accepts a well-formed workflow', () => {
    const result = safeParse(workflowSchema, validWorkflow);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.nodes).toHaveLength(2);
      expect(result.value.edges).toHaveLength(1);
    }
  });

  it('rejects a missing name', () => {
    const { name: _name, ...withoutName } = validWorkflow;
    const result = safeParse(workflowSchema, withoutName);
    expect(result.ok).toBe(false);
  });

  it('allows an empty graph', () => {
    const result = safeParse(workflowSchema, {
      id: 'wf-empty',
      name: 'Empty',
      nodes: [],
      edges: [],
    });
    expect(result.ok).toBe(true);
  });
});

describe('workflowNodeSchema · type', () => {
  it('accepts a node carrying a concrete type id', () => {
    const result = safeParse(workflowNodeSchema, { ...validNode, type: 'manual-trigger' });
    expect(result.ok).toBe(true);
  });
});

describe('workflowDocumentSchema', () => {
  const validDocument: WorkflowDocument = {
    ...validWorkflow,
    schemaVersion: WORKFLOW_SCHEMA_VERSION,
    viewport: { x: 0, y: 0, zoom: 1 },
  };

  it('accepts a document with version and viewport', () => {
    const result = safeParse(workflowDocumentSchema, validDocument);
    expect(result.ok).toBe(true);
  });

  it('rejects an unknown schema version', () => {
    const result = safeParse(workflowDocumentSchema, { ...validDocument, schemaVersion: 999 });
    expect(result.ok).toBe(false);
  });

  it('rejects a missing viewport', () => {
    const { viewport: _viewport, ...withoutViewport } = validDocument;
    const result = safeParse(workflowDocumentSchema, withoutViewport);
    expect(result.ok).toBe(false);
  });
});
