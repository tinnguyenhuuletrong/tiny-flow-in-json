import { useRef, useState } from "react";
import { useFlowStore } from "@/app/store/flowStore";
import { flowJsonSchema } from "@/lib/schema";
import { FlowSchema } from "@tiny-json-workflow/core/src/types";
import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function JsonEditorView() {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof import("monaco-editor") | null>(null);
  const { flow, setFlow } = useFlowStore();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      try {
        const parsed = JSON.parse(value);
        const validationResult = FlowSchema.safeParse(parsed);
        if (validationResult.success) {
          setFlow(validationResult.data);
          setValidationErrors([]); // Clear errors on successful validation
        } else {
          const errors = validationResult.error.errors.map(
            (err) => `${err.path.join(".")}: ${err.message}`
          );
          setValidationErrors(errors);
          // console.error("Invalid FlowJSON schema:", validationResult.error);
        }
      } catch (error: any) {
        setValidationErrors([`Invalid JSON format: ${error.message}`]);
        // console.error("Invalid JSON format:", error);
      }
    } else {
      setValidationErrors([]); // Clear errors if editor is empty
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
        value={JSON.stringify(flow, null, 2)}
        onChange={handleEditorChange}
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
