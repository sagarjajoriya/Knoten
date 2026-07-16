import { useCallback, useState, type ReactNode } from 'react';

import { useWorkflowHistory } from '../history/history-context';
import { useWorkflowPersistence } from '../persistence/useWorkflowPersistence';
import { type WorkflowMetadata } from '../persistence/workflow-mapper';

import { Button } from '@/components/ui/Button';

interface WorkflowToolbarProps {
  readonly metadata: WorkflowMetadata;
  readonly onMetadataChange: (metadata: WorkflowMetadata) => void;
}

function storageKey(id: string): string {
  return `knoten:workflow:${id}`;
}

/**
 * Save/Load affordance for workflow persistence. Serializes the current editor to
 * JSON and stashes it in `localStorage` (a client-only stand-in for the eventual
 * backend), then restores it — proving the document round-trips metadata, nodes,
 * edges, and viewport. The same JSON is exactly what a backend endpoint would
 * accept.
 */
export function WorkflowToolbar({ metadata, onMetadataChange }: WorkflowToolbarProps): ReactNode {
  const { serialize, load } = useWorkflowPersistence(metadata);
  const { undo, redo, canUndo, canRedo } = useWorkflowHistory();
  const [status, setStatus] = useState<string | null>(null);

  const handleSave = useCallback((): void => {
    localStorage.setItem(storageKey(metadata.id), serialize());
    setStatus('Saved');
  }, [metadata.id, serialize]);

  const handleLoad = useCallback((): void => {
    const json = localStorage.getItem(storageKey(metadata.id));
    if (!json) {
      setStatus('Nothing saved yet');
      return;
    }
    const result = load(json);
    if (!result.ok) {
      setStatus(result.error);
      return;
    }
    onMetadataChange({
      id: result.value.id,
      name: result.value.name,
      description: result.value.description,
    });
    setStatus('Loaded');
  }, [load, metadata.id, onMetadataChange]);

  return (
    <div className="rounded-btn border-line bg-surface shadow-e2 absolute right-3 top-3 z-10 flex items-center gap-2 border p-1.5">
      <span className="text-ink-2 max-w-40 truncate px-1 text-xs font-medium" title={metadata.name}>
        {metadata.name}
      </span>
      {status ? <span className="text-ink-3 px-1 text-xs">· {status}</span> : null}
      <span className="bg-line mx-0.5 h-5 w-px" aria-hidden />
      <Button variant="ghost" size="sm" onClick={undo} disabled={!canUndo}>
        Undo
      </Button>
      <Button variant="ghost" size="sm" onClick={redo} disabled={!canRedo}>
        Redo
      </Button>
      <span className="bg-line mx-0.5 h-5 w-px" aria-hidden />
      <Button variant="secondary" size="sm" onClick={handleSave}>
        Save
      </Button>
      <Button variant="secondary" size="sm" onClick={handleLoad}>
        Load
      </Button>
    </div>
  );
}
