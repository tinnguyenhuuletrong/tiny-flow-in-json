import { useFlowStore } from '@/app/store/flowStore';

export function useFlow() {
  const { flow, setFlow } = useFlowStore();
  return { flow, setFlow };
}
