import { useEffect, useRef, useState } from "react";
import { useFlowStore } from "@/app/store/flowStore";
import { flowJsonSchema } from "@/lib/schema";
import debounce from "lodash.debounce";
import {
  FlowSchema,
  parseFromJson,
  validate,
  saveToJson,
} from "@tiny-json-workflow/core";
import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fromZodError } from "zod-validation-error";

export function JsonEditorView() {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof import("monaco-editor") | null>(null);
  const { flow, setFlow, revision, selectedStepId } = useFlowStore();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [currentRevision, setCurrentRevision] = useState(revision);

  // watch for external update -> refresh
  // optimistic state control for uncontrolled component
  useEffect(() => {
    if (currentRevision !== revision) {
      editorRef.current?.setValue(saveToJson(flow));
      console.log("external reloaded for", currentRevision);
    }
  }, [currentRevision, revision, editorRef]);

  useEffect(() => {
    if (!selectedStepId || !editorRef.current) {
      return;
    }

    const editor = editorRef.current;
    const model = editor.getModel();
    if (!model) {
      return;
    }

    // We search for the unique string "id": "step_id_..."
    const searchString = `"id": "${selectedStepId}"`;
    const matches = model.findMatches(
      searchString,
      true,
      false,
      true,
      null,
      true
    );

    if (matches.length > 0) {
      const range = matches[0].range;
      editor.revealRangeInCenter(range, 1 /* Immediate scroll */);
      editor.setPosition({ lineNumber: range.startLineNumber, column: 1 });
      editor.focus();
    }
  }, [selectedStepId]);

  const handleEditorChange = (value: string | undefined) => {
    if (!value) {
      setValidationErrors([]);
      return;
    }

    try {
      const parsedJson = JSON.parse(value);
      const validationResult = FlowSchema.safeParse(parsedJson);

      if (!validationResult.success) {
        const userFriendlyError = fromZodError(validationResult.error);
        setValidationErrors([userFriendlyError.message]);
        return;
      }

      const parsedFlow = parseFromJson(value);
      const errors = validate(parsedFlow);

      if (errors.length > 0) {
        setValidationErrors(errors.map((e) => e.message));
        return;
      }

      // update flow + also update head Revision
      const headRevision = setFlow(parsedFlow);
      setCurrentRevision(headRevision);

      setValidationErrors([]);
    } catch (error: any) {
      setValidationErrors([`Invalid JSON format: ${error.message}`]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {validationErrors.length > 0 && (
        <div className="relative w-full">
          <Alert
            variant="destructive"
            className="absolute top-0 right-0 w-1/2 z-10 bg-white/30 backdrop-blur-sm"
          >
            <AlertTitle>Validation Errors</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      )}
      <Editor
        height="100%"
        defaultLanguage="json"
        defaultValue={saveToJson(flow)}
        onChange={debounce(handleEditorChange, 200)}
        options={{
          minimap: { enabled: false },
          quickSuggestions: true, // Auto-completion
          hover: {
            enabled: true,
          },
          suggest: {
            insertMode: "insert",
            showInlineDetails: true,
            preview: true,
            previewMode: "prefix",
          },
        }}
        beforeMount={(monaco) => {
          monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            validate: true,
            schemaValidation: "error",
            schemas: [
              {
                uri: "http://tiny-json-workflow/flow-schema.json", // A unique URI for our schema
                fileMatch: ["*"], // Temporarily use "*" to ensure it's broadly applied, will refine in onMount
                schema: flowJsonSchema,
              },
            ],
          });
        }}
        onMount={(editor, monaco) => {
          editorRef.current = editor;
          monacoRef.current = monaco;
        }}
      />
    </div>
  );
}
