import { useMemo, useState, useEffect } from "react";
import { z } from "zod";
import { ZodProvider } from "@autoform/zod";
import { AutoForm } from "@/components/ui/autoform";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";

interface JsonAutoFormProps<T extends z.ZodObject<any, any>> {
  schema: T;
  data: z.infer<T>;
  onDataChange: (data: z.infer<T>) => void;
}

export function JsonAutoForm<T extends z.ZodObject<any, any>>({
  schema,
  data,
  onDataChange,
}: JsonAutoFormProps<T>) {
  const [viewMode, setViewMode] = useState<"form" | "json">("form");
  const [internalData, setInternalData] = useState(data);
  const [jsonString, setJsonString] = useState(JSON.stringify(data, null, 2));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setInternalData(data);
    setJsonString(JSON.stringify(data, null, 2));
  }, [data]);

  const schemaProvider = useMemo(() => {
    if (!schema) {
      return null;
    }
    return new ZodProvider(schema);
  }, [schema]);

  const handleJsonStringChange = (newJsonString: string) => {
    setJsonString(newJsonString);
    try {
      const parsedData = JSON.parse(newJsonString);
      const validation = schema.safeParse(parsedData);
      if (validation.success) {
        setInternalData(parsedData);
        setError(null);
      } else {
        setError(validation.error.message);
      }
    } catch (e: any) {
      setError(`Invalid JSON: ${e.message}`);
    }
  };

  const handleSave = () => {
    console.log("aaaa");
    const validation = schema.safeParse(internalData);
    console.log("bbbb", validation);
    if (validation.success) {
      onDataChange(internalData);
      setError(null);
    } else {
      setError(validation.error.message);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-2">
        <Toggle
          pressed={viewMode === "json"}
          onPressedChange={() =>
            setViewMode(viewMode === "form" ? "json" : "form")
          }
        >
          {viewMode === "form" ? "JSON" : "Form"}
        </Toggle>
      </div>
      {viewMode === "form" ? (
        schemaProvider && (
          <AutoForm
            schema={schemaProvider}
            values={internalData}
            onSubmit={handleSave}
            withSubmit
          />
        )
      ) : (
        <div>
          <Textarea
            value={jsonString}
            onChange={(e) => handleJsonStringChange(e.target.value)}
            rows={10}
          />
          <Button onClick={handleSave} className="mt-2">
            Save
          </Button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      )}
    </div>
  );
}
