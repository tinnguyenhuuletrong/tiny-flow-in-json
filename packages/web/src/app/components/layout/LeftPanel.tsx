import { useFlowStore } from "@/app/store/flowStore";
import { JsonAutoForm } from "@/app/components/shared/JsonAutoForm";

export function LeftPanel() {
  const { flow, updateFlowState } = useFlowStore();

  return (
    <div className="p-4 border-r w-80 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Steps</h2>
      <ul>
        {flow.steps.map((step) => (
          <li key={step.id} className="mb-2 p-2 border rounded-md">
            {step.name}
          </li>
        ))}
      </ul>
      <h2 className="text-lg font-semibold mt-8 mb-4">Global State</h2>
      <div className="p-2 bg-gray-100 rounded-md">
        {flow.globalStateZodSchema && (
          <JsonAutoForm
            schema={flow.globalStateZodSchema as any}
            data={flow.globalState ?? {}}
            onDataChange={updateFlowState}
          />
        )}
      </div>
    </div>
  );
}
