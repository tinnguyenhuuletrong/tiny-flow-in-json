import { Button } from "@/components/ui/button";
import { useFlowStore } from "@/app/store/flowStore";
import { encodeJsonForUrl } from "@/lib/url";
import { saveToJson } from "@tiny-json-workflow/core";

export function Header() {
  const { flow } = useFlowStore();

  const flowName = flow?.name || "";
  const flowVersion = flow?.version || "";

  const handleShare = () => {
    if (flow) {
      const rawFlow = saveToJson(flow);
      const encoded = encodeJsonForUrl(rawFlow);
      const url = new URL(window.location.href);
      url.searchParams.set("flow_v1", encoded);
      window.history.pushState({}, "", url);
      navigator.clipboard.writeText(url.toString());
      alert("Shareable URL copied to clipboard!");
    }
  };

  return (
    <header className="p-4 border-b flex justify-between items-center">
      <h1 className="text-xl font-bold">{`${flowName} - ${flowVersion}`}</h1>
      <div className="flex items-center gap-2">
        {flow && <Button onClick={handleShare}>Share</Button>}
      </div>
    </header>
  );
}
