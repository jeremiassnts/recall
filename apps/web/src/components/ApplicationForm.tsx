"use client";

import type { JobApplication, JobApplicationCreate, JobStage } from "@recall/types";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { JOB_STAGES } from "@recall/types";

const formSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
  stage: z.enum(JOB_STAGES as unknown as [string, ...string[]]),
  status: z.string().optional(),
  appliedDate: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ApplicationForm({
  application,
  onClose,
  onSuccess,
}: {
  application?: JobApplication;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const isEdit = !!application;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: application
      ? {
          companyName: application.companyName,
          jobTitle: application.jobTitle,
          jobUrl: application.jobUrl ?? "",
          description: application.description ?? "",
          stage: application.stage,
          status: application.status ?? "",
          appliedDate: application.appliedDate ?? "",
          notes: application.notes ?? "",
        }
      : {
          companyName: "",
          jobTitle: "",
          jobUrl: "",
          description: "",
          stage: "Wishlist",
          status: "",
          appliedDate: "",
          notes: "",
        },
  });

  const createMutation = useMutation({
    mutationFn: async (data: JobApplicationCreate) => {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to create");
      }
      return res.json();
    },
    onSuccess: () => onSuccess(),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormValues }) => {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to update");
      }
      return res.json();
    },
    onSuccess: () => onSuccess(),
  });

  const onSubmit = (values: FormValues) => {
    const payload: JobApplicationCreate = {
      companyName: values.companyName,
      jobTitle: values.jobTitle,
      jobUrl: values.jobUrl || undefined,
      description: values.description || undefined,
      stage: values.stage as JobStage,
      status: values.status || undefined,
      appliedDate: values.appliedDate || undefined,
      notes: values.notes || undefined,
    };
    if (isEdit && application) {
      updateMutation.mutate({ id: application.id, data: values });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const submitError = createMutation.error ?? updateMutation.error;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70">
      <div
        className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 id="form-title" className="text-lg font-semibold text-neutral-900 dark:text-white">
              {isEdit ? "Edit application" : "Add application"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 p-1 rounded"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Company name *
              </label>
              <input
                id="companyName"
                {...form.register("companyName")}
                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-neutral-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
              />
              {form.formState.errors.companyName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {form.formState.errors.companyName.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Job title *
              </label>
              <input
                id="jobTitle"
                {...form.register("jobTitle")}
                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-neutral-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
              />
              {form.formState.errors.jobTitle && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {form.formState.errors.jobTitle.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="jobUrl" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Job URL
              </label>
              <input
                id="jobUrl"
                type="url"
                {...form.register("jobUrl")}
                placeholder="https://…"
                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-neutral-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
              />
              {form.formState.errors.jobUrl && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {form.formState.errors.jobUrl.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="stage" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Stage *
              </label>
              <select
                id="stage"
                {...form.register("stage")}
                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-neutral-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                {JOB_STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="appliedDate" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Applied date
              </label>
              <input
                id="appliedDate"
                type="date"
                {...form.register("appliedDate")}
                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-neutral-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                {...form.register("notes")}
                rows={3}
                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-neutral-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>

            {submitError && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {submitError instanceof Error ? submitError.message : "Something went wrong"}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-neutral-900 transition-colors"
              >
                {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Add application"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
