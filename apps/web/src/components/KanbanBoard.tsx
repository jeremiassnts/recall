"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { JobApplication, JobStage } from "@recall/types";
import { JOB_STAGES } from "@recall/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

const COLUMN_ID_PREFIX = "column-";

function getApplicationsByStage(applications: JobApplication[]): Map<JobStage, JobApplication[]> {
  const byStage = new Map<JobStage, JobApplication[]>();
  for (const stage of JOB_STAGES) {
    byStage.set(
      stage,
      applications
        .filter((a) => a.stage === stage)
        .sort((a, b) => a.order - b.order)
    );
  }
  return byStage;
}

async function reorderApplications(stage: JobStage, applicationIds: string[]): Promise<void> {
  if (applicationIds.length === 0) return;
  const res = await fetch("/api/applications/reorder", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stage, applicationIds }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Failed to reorder");
  }
}

function KanbanCardContent({
  application,
  onEdit,
  onDelete,
  dragHandleProps,
}: {
  application: JobApplication;
  onEdit: (app: JobApplication) => void;
  onDelete: (app: JobApplication) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}) {
  return (
    <div
      className="rounded-lg border bg-white dark:bg-neutral-800/80 dark:border-neutral-700 p-3 shadow-sm"
    >
      <div {...dragHandleProps} className={dragHandleProps ? "cursor-grab active:cursor-grabbing" : ""}>
        <p className="font-medium text-neutral-900 dark:text-white truncate text-sm">
          {application.jobTitle}
        </p>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate mt-0.5">
          {application.companyName}
        </p>
        {application.appliedDate && (
          <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
            Applied {application.appliedDate}
          </p>
        )}
      </div>
      <div className="mt-2 flex gap-2 flex-wrap border-t border-neutral-100 dark:border-neutral-700 pt-2">
        {application.jobUrl && (
          <a
            href={application.jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Link
          </a>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(application);
          }}
          className="text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(application);
          }}
          className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function KanbanCard({
  application,
  isOverlay,
  onEdit,
  onDelete,
}: {
  application: JobApplication;
  isOverlay?: boolean;
  onEdit: (app: JobApplication) => void;
  onDelete: (app: JobApplication) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: application.id,
    data: { application, stage: application.stage },
  });

  const style = transform && !isOverlay
    ? { transform: CSS.Transform.toString(transform), transition }
    : undefined;

  if (isOverlay) {
    return (
      <div className="shadow-lg ring-2 ring-accent opacity-95 rounded-lg">
        <KanbanCardContent application={application} onEdit={onEdit} onDelete={onDelete} />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "opacity-40" : ""}
    >
      <KanbanCardContent
        application={application}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

function KanbanColumn({
  stage,
  applications,
  onEdit,
  onDelete,
}: {
  stage: JobStage;
  applications: JobApplication[];
  onEdit: (app: JobApplication) => void;
  onDelete: (app: JobApplication) => void;
}) {
  const ids = applications.map((a) => a.id);
  const { setNodeRef, isOver } = useDroppableColumn(stage);

  return (
    <div
      ref={setNodeRef}
      className={`
        flex-shrink-0 w-[280px] min-h-[120px] rounded-lg border-2 border-dashed p-3
        flex flex-col gap-2
        ${isOver ? "border-accent bg-accent/5 dark:bg-accent/10" : "border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/30"}
      `}
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-sm text-neutral-900 dark:text-white">{stage}</h3>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">{applications.length}</span>
      </div>
      <SortableColumnItems
        ids={ids}
        applications={applications}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}

function useDroppableColumn(stage: JobStage) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${COLUMN_ID_PREFIX}${stage}`,
    data: { type: "column" as const, stage },
  });
  return { setNodeRef, isOver };
}

function SortableColumnItems({
  ids,
  applications,
  onEdit,
  onDelete,
}: {
  ids: string[];
  applications: JobApplication[];
  onEdit: (app: JobApplication) => void;
  onDelete: (app: JobApplication) => void;
}) {
  return (
    <SortableContext items={ids} strategy={verticalListSortingStrategy}>
      <div className="flex flex-col gap-2 min-h-[40px]">
        {applications.map((app) => (
          <KanbanCard
            key={app.id}
            application={app}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </SortableContext>
  );
}

export function KanbanBoard({
  applications,
  onEdit,
  onDeleted,
}: {
  applications: JobApplication[];
  onEdit: (app: JobApplication) => void;
  onDeleted: () => void;
}) {
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState<string | null>(null);

  const reorderMutation = useMutation({
    mutationFn: async ({
      sourceStage,
      targetStage,
      sourceIds,
      targetIds,
    }: {
      sourceStage: JobStage;
      targetStage: JobStage;
      sourceIds: string[];
      targetIds: string[];
    }) => {
      if (sourceStage !== targetStage && sourceIds.length > 0) {
        await reorderApplications(sourceStage, sourceIds);
      }
      if (targetIds.length > 0) {
        await reorderApplications(targetStage, targetIds);
      }
    },
    onMutate: async ({ sourceStage, targetStage, sourceIds, targetIds }) => {
      await queryClient.cancelQueries({ queryKey: ["applications"] });
      const prev = queryClient.getQueryData<JobApplication[]>(["applications"]);
      if (!prev) return { prev };

      const updateApp = (id: string, updates: Partial<JobApplication>) =>
        prev.map((a) => (a.id === id ? { ...a, ...updates } : a));

      let next = prev;
      const movedId = targetIds.find((id) => !sourceIds.includes(id) || sourceStage !== targetStage);
      if (movedId) {
        const app = next.find((a) => a.id === movedId);
        if (app) {
          next = updateApp(movedId, { stage: targetStage, order: targetIds.indexOf(movedId) });
        }
      }
      next = next
        .map((a) => {
          if (a.stage === sourceStage) {
            const idx = sourceIds.indexOf(a.id);
            return idx >= 0 ? { ...a, order: idx } : a;
          }
          if (a.stage === targetStage) {
            const idx = targetIds.indexOf(a.id);
            return idx >= 0 ? { ...a, order: idx } : a;
          }
          return a;
        })
        .sort((a, b) => {
          const stageOrderA = JOB_STAGES.indexOf(a.stage);
          const stageOrderB = JOB_STAGES.indexOf(b.stage);
          if (stageOrderA !== stageOrderB) return stageOrderA - stageOrderB;
          return a.order - b.order;
        });

      queryClient.setQueryData(["applications"], next);
      return { prev };
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(["applications"], context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      onDeleted();
    },
  });

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = event;
      if (!over) return;

      const activeIdStr = String(active.id);
      const activeApp = applications.find((a) => a.id === activeIdStr);
      if (!activeApp) return;

      const byStage = getApplicationsByStage(applications);
      let targetStage: JobStage;
      let targetIndex: number;

      if (String(over.id).startsWith(COLUMN_ID_PREFIX)) {
        targetStage = String(over.id).slice(COLUMN_ID_PREFIX.length) as JobStage;
        const col = byStage.get(targetStage) ?? [];
        if (activeApp.stage === targetStage) {
          const reordered = col.map((a) => a.id);
          const fromIdx = reordered.indexOf(activeIdStr);
          if (fromIdx === -1) return;
          reordered.splice(fromIdx, 1);
          reordered.push(activeIdStr);
          reorderMutation.mutate({
            sourceStage: targetStage,
            targetStage,
            sourceIds: reordered,
            targetIds: reordered,
          });
          return;
        }
        const newTargetIds = [...col.map((a) => a.id), activeIdStr];
        const sourceCol = byStage.get(activeApp.stage) ?? [];
        const sourceIds = sourceCol.filter((a) => a.id !== activeIdStr).map((a) => a.id);
        reorderMutation.mutate({
          sourceStage: activeApp.stage,
          targetStage,
          sourceIds,
          targetIds: newTargetIds,
        });
        return;
      }

      const overIdStr = String(over.id);
      const overApp = applications.find((a) => a.id === overIdStr);
      if (!overApp) return;
      targetStage = overApp.stage;
      const targetCol = byStage.get(targetStage) ?? [];
      targetIndex = targetCol.findIndex((a) => a.id === overIdStr);
      if (targetIndex === -1) return;

      if (activeApp.stage === targetStage) {
        const reordered = targetCol.map((a) => a.id);
        const fromIdx = reordered.indexOf(activeIdStr);
        reordered.splice(fromIdx, 1);
        reordered.splice(targetIndex, 0, activeIdStr);
        reorderMutation.mutate({
          sourceStage: targetStage,
          targetStage,
          sourceIds: reordered,
          targetIds: reordered,
        });
      } else {
        const sourceCol = byStage.get(activeApp.stage) ?? [];
        const sourceIds = sourceCol.filter((a) => a.id !== activeIdStr).map((a) => a.id);
        const newTargetIds = [...targetCol.map((a) => a.id)];
        newTargetIds.splice(targetIndex, 0, activeIdStr);
        reorderMutation.mutate({
          sourceStage: activeApp.stage,
          targetStage,
          sourceIds,
          targetIds: newTargetIds,
        });
      }
    },
    [applications, reorderMutation]
  );

  const handleDelete = useCallback(
    (app: JobApplication) => {
      if (typeof window === "undefined") return;
      if (!window.confirm(`Delete "${app.jobTitle}" at ${app.companyName}?`)) return;
      fetch(`/api/applications/${app.id}`, { method: "DELETE" }).then(() => {
        queryClient.invalidateQueries({ queryKey: ["applications"] });
        onDeleted();
      });
    },
    [queryClient, onDeleted]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const byStage = getApplicationsByStage(applications);
  const activeApp = activeId ? applications.find((a) => a.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[400px]">
        {JOB_STAGES.map((stage) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            applications={byStage.get(stage) ?? []}
            onEdit={onEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
      {activeApp && (
        <DragOverlay>
          <KanbanCard application={activeApp} isOverlay onEdit={onEdit} onDelete={handleDelete} />
        </DragOverlay>
      )}
    </DndContext>
  );
}
