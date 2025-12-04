### Task 21: Generalize Handle Rendering and Review HandleEditor for all Node Types

**Objective:** Enhance `packages/web` by extracting the handle rendering logic into a common, reusable component, applying it to all relevant node types, and ensuring `HandleEditor` works seamlessly with this generalization.

**Part 1: Create a Reusable Handle Rendering Component**

1.  **Create `packages/web/src/app/components/shared/NodeHandles.tsx`:**
    *   This component will receive `data.metadata?.handles` (or a similar structure) and the `draggingHandleId` as props.
    *   It will encapsulate the logic currently in `DecisionNode.tsx` for filtering handles by position and dynamically calculating their `style` for `reactflow`'s `Handle` components.
    *   It should properly type its props.

2.  **Modify `DecisionNode.tsx`:**
    *   Replace the existing handle rendering loop with an invocation of the new `NodeHandles` component, passing the necessary props.
    *   Ensure the `computeDefaultHandler` fallback logic is still correctly applied before passing handles to `NodeHandles`.

3.  **Apply to Other Node Types:**
    *   Identify all node files in `packages/web/src/app/components/custom-nodes` *except* `BeginNode.tsx` and `EndNode.tsx`. (These are `TaskNode.tsx`, `ResumeAfterNode.tsx`, `WaitForEventNode.tsx`).
    *   For each of these identified node files:
        *   Read their content to understand their current handle rendering (if any).
        *   Integrate the new `NodeHandles` component, ensuring they correctly pass their `data.metadata?.handles` and `draggingHandleId` (or similar node-specific data) to `NodeHandles`. If a node currently has no handles, it should still be prepared to use `NodeHandles` if `metadata.handles` is later added.
        *   If `computeDefaultHandler` is relevant for these nodes, ensure it's called.

**Part 2: Review and Adapt `HandleEditor`**

1.  **Analyze `HandleEditor.tsx` for Compatibility:**
    *   Confirm that `HandleEditor`'s current logic for updating `metadata.handles` within the `flow` state is generic enough to work for all node types that will now use `NodeHandles`.
    *   No changes are expected here, as `HandleEditor` already operates on `step.metadata.handles`, which is the standardized location.

**Part 3: Metadata Scanning and Type Definition (Nice to Have)**

1.  **Scan `src/app/components/custom-nodes`:**
    *   Propose a mechanism (e.g., a script) to iterate through these node files.
    *   The goal is to infer or extract any specific metadata keys that each node type might use beyond `handles`.
2.  **Create a `typeDef`:**
    *   Based on the scan, create a TypeScript type definition (e.g., in a new `types/NodeMetadata.ts` file or similar) that defines the structure of `metadata` for different node types. This would improve type safety and documentation.
    *   For example:
        ```typescript
        interface BaseNodeMetadata {
          handles?: EditorHandle[];
        }

        interface DecisionNodeMetadata extends BaseNodeMetadata {
          // specific properties for DecisionNode
        }

        interface TaskNodeMetadata extends BaseNodeMetadata {
          // specific properties for TaskNode
        }
        // ... and so on
        ```
    *   Update relevant interfaces (e.g., `ParsedStep`) to use this new `NodeMetadata` type.

**Acceptance Criteria:**

*   A new component `NodeHandles.tsx` exists and is correctly typed.
*   `DecisionNode.tsx` and all other relevant custom nodes (`TaskNode.tsx`, `ResumeAfterNode.tsx`, `WaitForEventNode.tsx`) use `NodeHandles.tsx` for rendering handles.
*   `BeginNode.tsx` and `EndNode.tsx` are *not* modified to use `NodeHandles.tsx` (as per the requirement).
*   `HandleEditor.tsx` remains functional and correctly updates handle metadata for all modified nodes.
*   (Nice to Have) A proposal or implementation for scanning node metadata and generating a `typeDef` is provided.