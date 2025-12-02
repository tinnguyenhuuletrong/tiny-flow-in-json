import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
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

function DroppableZone({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="min-h-[40px] border border-dashed rounded-md p-2"
    >
      {children}
    </div>
  );
}

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

const HandleSideList = ({
  side,
  handles,
}: {
  side: Handle["position"];
  handles: Handle[];
}) => (
  <div>
    <h3 className="font-bold my-2">{side}</h3>
    <DroppableZone id={side}>
      <SortableContext
        id={side}
        items={handles.map((h) => h.id)}
        strategy={verticalListSortingStrategy}
      >
        {handles.map((handle) => (
          <SortableItem key={handle.id} id={handle.id}>
            {handle.id} ({handle.type})
          </SortableItem>
        ))}
      </SortableContext>
    </DroppableZone>
  </div>
);

export function HandleEditor({
  handles: initialHandles,
  nodeId,
}: {
  handles: Handle[];
  nodeId: string;
}) {
  const [handlesBySide, setHandlesBySide] = useState<HandlesBySide>(() =>
    getHandlesBySide(initialHandles)
  );
  const [initialHandlesBySide, setInitialHandlesBySide] =
    useState<HandlesBySide>(() => getHandlesBySide(initialHandles));
  const [activeHandle, setActiveHandle] = useState<Handle | null>(null);

  const { flow, setFlow } = useFlowStore();

  useEffect(() => {
    const initialState = getHandlesBySide(initialHandles);
    setInitialHandlesBySide(initialState);
    setHandlesBySide(initialState);
  }, [initialHandles]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findContainer = (id: string): Handle["position"] | undefined => {
    if (id in handlesBySide) {
      return id as Handle["position"];
    }
    for (const side of Object.keys(handlesBySide) as (keyof HandlesBySide)[]) {
      if (handlesBySide[side].some((h) => h.id === id)) {
        return side;
      }
    }
    return undefined;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const handle = Object.values(handlesBySide)
      .flat()
      .find((h) => h.id === active.id);
    if (handle) {
      setActiveHandle(handle);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveHandle(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();
    const activeContainer = findContainer(activeId);
    const overContainer =
      (over.id in handlesBySide
        ? (over.id as Handle["position"])
        : findContainer(overId)) || undefined;

    if (!activeContainer || !overContainer || activeId === overId) {
      return;
    }

    setHandlesBySide((prev) => {
      if (activeContainer === overContainer) {
        const activeIndex = prev[activeContainer].findIndex(
          (h) => h.id === activeId
        );
        const overIndex = prev[overContainer].findIndex((h) => h.id === overId);
        if (overIndex < 0) {
          return prev;
        }
        return {
          ...prev,
          [activeContainer]: arrayMove(
            prev[activeContainer],
            activeIndex,
            overIndex
          ),
        };
      }

      const activeIndex = prev[activeContainer].findIndex(
        (h) => h.id === activeId
      );
      let overIndex = prev[overContainer].findIndex((h) => h.id === overId);
      if (overIndex < 0) {
        overIndex = prev[overContainer].length;
      }

      const newActiveItems = [...prev[activeContainer]];
      const [movedItem] = newActiveItems.splice(activeIndex, 1);
      const newOverItems = [...prev[overContainer]];
      newOverItems.splice(overIndex, 0, {
        ...movedItem,
        position: overContainer,
      });

      return {
        ...prev,
        [activeContainer]: newActiveItems,
        [overContainer]: newOverItems,
      };
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
    setHandlesBySide(initialHandlesBySide);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveHandle(null)}
    >
      <div>
        {(Object.keys(handlesBySide) as (keyof HandlesBySide)[]).map((side) => (
          <HandleSideList
            key={side}
            side={side}
            handles={handlesBySide[side]}
          />
        ))}
      </div>
      <DragOverlay>
        {activeHandle ? (
          <SortableItem id={activeHandle.id}>
            {activeHandle.id} ({activeHandle.type})
          </SortableItem>
        ) : null}
      </DragOverlay>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave}>Save</Button>
      </div>
    </DndContext>
  );
}
