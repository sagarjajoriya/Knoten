import {
  err,
  ok,
  safeParse,
  workflowDocumentSchema,
  type Result,
  type WorkflowDocument,
} from '@knoten/shared';

/** Serialize a workflow document to pretty-printed JSON. */
export function serializeWorkflow(document: WorkflowDocument): string {
  return JSON.stringify(document, null, 2);
}

/**
 * Parse JSON back into a workflow document, validated against the shared schema.
 * Returns a `Result` rather than throwing so the caller can surface a message.
 */
export function deserializeWorkflow(json: string): Result<WorkflowDocument, string> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return err('The saved workflow is not valid JSON.');
  }

  const result = safeParse(workflowDocumentSchema, parsed);
  if (!result.ok) {
    return err('The saved workflow does not match the current schema.');
  }
  return ok(result.value);
}
