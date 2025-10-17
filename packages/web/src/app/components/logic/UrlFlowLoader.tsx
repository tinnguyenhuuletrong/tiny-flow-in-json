import { useEffect } from "react";
import { useFlowStore } from "@/app/store/flowStore";
import { decodeJsonFromUrl } from "@/lib/url";
import { parseFromJson } from "@tiny-json-workflow/core";

export function UrlFlowLoader() {
  const { setFlow } = useFlowStore();

  useEffect(() => {
    const url = new URL(window.location.href);
    const encodedFlow = url.searchParams.get("flow_v1");
    if (encodedFlow) {
      try {
        const decodedFlow = decodeJsonFromUrl(encodedFlow);
        setFlow(parseFromJson(decodedFlow));
      } catch (error) {
        console.error("Failed to decode flow from URL", error);
        alert("Failed to load workflow from URL.");
      }
    }
  }, [setFlow]);

  return null;
}
