import Editor from '@monaco-editor/react';
import { useFlowStore } from '@/app/store/flowStore';

export function JsonEditorView() {
  const { flow, setFlow } = useFlowStore();

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      try {
        const newFlow = JSON.parse(value);
        setFlow(newFlow);
      } catch (error) {
        console.error("Invalid JSON:", error);
      }
    }
  };

  return (
    <Editor
      height="100%"
      defaultLanguage="json"
      value={JSON.stringify(flow, null, 2)}
      onChange={handleEditorChange}
    />
  );
}
