import { Button } from '@/components/ui/button';

export function Toolbar() {
  return (
    <div className="p-2 border-b flex gap-2">
      <Button variant="outline">Import</Button>
      <Button variant="outline">Export</Button>
      <Button>Save</Button>
    </div>
  );
}
