import {
  DndContext,
  type DragEndEvent,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { type Handle } from "@tiny-json-workflow/core";
import { useFlowStore } from "@/app/store/flowStore";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type HandlesBySide = Record<Handle["position"], Handle[]>;

function SortableItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center bg-gray-100 dark:bg-gray-800 p-2 my-1 rounded-md"
    >
      <div {...listeners} className="cursor-grab">
        <GripVertical size={16} />
      </div>
      <div className="ml-2">{children}</div>
    </div>
  );
}

export function HandleEditor({
  handles: initialHandles,
  nodeId,
}: {
  handles: Handle[];
  nodeId: string;
}) {
  const [handlesBySide, setHandlesBySide] = useState<HandlesBySide>({
    Top: [],
    Bottom: [],
    Left: [],
    Right: [],
  });

  const { flow, setFlow } = useFlowStore();

  const getHandlesBySide = (handles: Handle[]): HandlesBySide => {
    const newHandlesBySide: HandlesBySide = {
      Top: [],
      Bottom: [],
      Left: [],
      Right: [],
    };
    handles.forEach((handle) => {
      newHandlesBySide[handle.position].push(handle);
    });
    return newHandlesBySide;
  };

  useEffect(() => {
    setHandlesBySide(getHandlesBySide(initialHandles));
  }, [initialHandles]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findContainer = (id: string) => {
    if (id in handlesBySide) {
      return id as Handle["position"];
    }
    for (const side of Object.keys(handlesBySide) as (keyof HandlesBySide)[]) {
      if (handlesBySide[side].some((h) => h.id === id)) {
        return side;
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeId === overId) {
      return;
    }

    setHandlesBySide((prev) => {
      const newHandlesBySide = { ...prev };
      const activeItems = newHandlesBySide[activeContainer];
      const overItems = newHandlesBySide[overContainer];

      const activeIndex = activeItems.findIndex((h) => h.id === activeId);
      const overIndex = overItems.findIndex((h) => h.id === overId);

      if (activeContainer === overContainer) {
        newHandlesBySide[activeContainer] = arrayMove(
          activeItems,
          activeIndex,
          overIndex
        );
      } else {
        const [movedItem] = activeItems.splice(activeIndex, 1);
        movedItem.position = overContainer;
        overItems.splice(overIndex, 0, movedItem);
      }

      return newHandlesBySide;
    });
  };

  const onSave = () => {
    if (!flow) return;
    const newHandles = Object.values(handlesBySide).flat();
    const newFlow = {
      ...flow,
      steps: flow.steps.map((step) => {
        if (step.id === nodeId) {
          return {
            ...step,
            metadata: {
              ...step.metadata,
              handles: newHandles,
            },
          };
        }
        return step;
      }),
    };
    setFlow(newFlow);
  };

  const onCancel = () => {
    setHandlesBySide(getHandlesBySide(initialHandles));
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
      sensors={sensors}
    >
      <div>
        {Object.keys(handlesBySide).map((side) => {
          const sideHandles = handlesBySide[side as Handle["position"]];
          return (
            <div key={side}>
              <h3 className="font-bold my-2">{side}</h3>
              <SortableContext
                id={side}
                items={sideHandles.map((h) => h.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="min-h-[40px] border border-dashed rounded-md p-2">
                  {sideHandles.map((handle) => (
                    <SortableItem key={handle.id} id={handle.id}>
                      {handle.id} ({handle.type})
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </div>
          );
        })}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save</Button>
        </div>
      </div>
    </DndContext>
  );
}
