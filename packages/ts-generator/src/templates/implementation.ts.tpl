// --- IMPLEMENTATION ---

{{functions}}

export function createWorkflow() {
  return new {{workflowClassName}}({
    {{tasks}}
  });
}