"use client";

import { useDeleteApplication } from "@/api/applications/useDeleteApplication";
import { useListApplications } from "@/api/applications/useListApplications";
import { ApplicationForm } from "@/components/ApplicationForm";
import { ApplicationsTable } from "@/components/ApplicationsTable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { JobApplication } from "@recall/types";
import { useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export default function ApplicationsPage() {
  const { data: applications = [], isLoading, error, refetch } = useListApplications();
  const [editing, setEditing] = useState<JobApplication | null>(null);
  const [showForm, setShowForm] = useState(false);
  const deleteApplicationMutation = useDeleteApplication();
  const queryClient = useQueryClient();

  const handleCreated = () => {
    setShowForm(false);
    queryClient.invalidateQueries({ queryKey: ["applications"] });
    refetch();
  };

  const handleUpdated = () => {
    setEditing(null);
    queryClient.invalidateQueries({ queryKey: ["applications"] });
    refetch();
  };

  const handleDeleteApplication = async (id: string) => {
    await deleteApplicationMutation.mutateAsync(id)
    queryClient.invalidateQueries({ queryKey: ["applications"] });
    refetch();
  }

  const handleAddApplication = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEditApplication = (id: string) => {
    setEditing(applications.find((app) => app.id === id) ?? null);
  }

  return (
    <section className="px-4">
      <Tabs defaultValue="list" className="w-full">
        <div className="flex flex-row justify-between items-center">
          <TabsList>
            <TabsTrigger value="list" className="dark:data-[state=active]:bg-gray-700">List</TabsTrigger>
            <TabsTrigger value="kanban" className="dark:data-[state=active]:bg-gray-700">Kanban</TabsTrigger>
          </TabsList>
          <Button size="default" variant="outline" onClick={handleAddApplication}>
            Add application <PlusIcon className="w-4 h-4" />
          </Button>
        </div>
        <TabsContent value="list">
          {!isLoading && !error && (
            <ApplicationsTable applications={applications} isLoading={isLoading} onDelete={handleDeleteApplication} onEdit={handleEditApplication} />
          )}
        </TabsContent>
        <TabsContent value="kanban">
        </TabsContent>
      </Tabs>

      {showForm && (
        <ApplicationForm
          onClose={() => setShowForm(false)}
          onSuccess={handleCreated}
        />
      )}

      {editing && (
        <ApplicationForm
          application={editing}
          onClose={() => setEditing(null)}
          onSuccess={handleUpdated}
        />
      )}
      {/* {!isLoading && !error && viewMode === "kanban" && (
        <KanbanBoard
          applications={applications}
          onEdit={setEditing}
          onDeleted={handleDeleted}
        />
      )} */}
    </section>
  );
}
