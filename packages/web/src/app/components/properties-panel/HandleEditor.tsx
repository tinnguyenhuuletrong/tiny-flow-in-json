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
import { ArrowRightFromLine, GripVertical } from "lucide-react";
import { type Handle } from "@tiny-json-workflow/core";
import { useFlowStore } from "@/app/store/flowStore";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type HandlesBySide = Record<Handle["position"], Handle[]>;

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

  const [activeHandle, setActiveHandle] = useState<Handle | null>(null);

  const { flow, setFlow, setDraggingHandleId } = useFlowStore();

  useEffect(() => {
    const initialState = getHandlesBySide(initialHandles);
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

  const onSave = (handlesBySide: HandlesBySide) => {
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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const handle = Object.values(handlesBySide)
      .flat()
      .find((h) => h.id === active.id);
    if (handle) {
      setActiveHandle(handle);
      setDraggingHandleId(handle.id);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveHandle(null);
    setDraggingHandleId(null);

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

      const newData = {
        ...prev,
        [activeContainer]: newActiveItems,
        [overContainer]: newOverItems,
      };
      onSave(newData);

      return newData;
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => {
        setActiveHandle(null);
        setDraggingHandleId(null);
      }}
    >
      <div className="grid grid-cols-3 gap-2">
        <div />
        <HandleSideList side="Top" handles={handlesBySide.Top} />
        <div />

        <HandleSideList side="Left" handles={handlesBySide.Left} />
        <div className="border border-dashed rounded-md" />
        <HandleSideList side="Right" handles={handlesBySide.Right} />

        <div />
        <HandleSideList side="Bottom" handles={handlesBySide.Bottom} />
        <div />
      </div>
      <DragOverlay>
        {activeHandle ? (
          <SortableItem handle={activeHandle}>
            {activeHandle.id} ({activeHandle.type})
          </SortableItem>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

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
      className="min-h-[60px] border border-dashed rounded-md p-1"
    >
      {children}
    </div>
  );
}

function SortableItem({
  handle,
  children,
}: {
  handle: Handle;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: handle.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isSource = handle.type === "source";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        "flex items-center p-2 my-1 rounded-md text-xs",
        isSource ? "bg-blue-100" : "bg-green-100"
      )}
    >
      <div {...listeners} className="cursor-grab">
        <GripVertical size={16} />
      </div>
      <div className="ml-2 flex-1">{children}</div>
      {isSource ? (
        <ArrowRightFromLine size={14} />
      ) : (
        <ArrowRightFromLine size={14} />
      )}
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
  <div className="w-full">
    <h3 className="font-bold text-center text-xs mb-1">{side}</h3>
    <DroppableZone id={side}>
      <SortableContext
        id={side}
        items={handles.map((h) => h.id)}
        strategy={verticalListSortingStrategy}
      >
        {handles.map((handle) => (
          <SortableItem key={handle.id} handle={handle}>
            {handle.id}
          </SortableItem>
        ))}
      </SortableContext>
    </DroppableZone>
  </div>
);
