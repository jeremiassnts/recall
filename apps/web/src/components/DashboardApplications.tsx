import { useListApplications } from "@/api/applications/useListApplications";
import { Link } from "lucide-react";
import { redirect } from "next/navigation";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export function DashboardApplications() {
    const { data: applications, isLoading, error } = useListApplications();
    console.log(applications);

    function handleSeeBoard() {
        redirect("/dashboard/applications");
    }

    function handleOpenJobUrl(url: string) {
        window.open(url, "_blank");
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-[1px] border-gray-200 dark:border-gray-700">
            <div className="flex flex-row justify-between items-center">
                <div className="text-sm font-medium text-neutral-900 dark:text-white">Applications</div>
                <Button variant="link" className="text-sm font-medium text-neutral-600 dark:text-gray-400" onClick={handleSeeBoard}>
                    See board
                </Button>
            </div>
            {isLoading && <div className="flex flex-col gap-2 w-full pt-4">
                <Skeleton className="h-[30px] w-full" />
                <Skeleton className="h-[30px] w-full" />
                <Skeleton className="h-[30px] w-full" />
                <Skeleton className="h-[30px] w-full" />
            </div>}
            {!isLoading && <div className="flex flex-col gap-2 w-full pt-4">
                {applications?.map(application => (
                    <div key={application.id} className="flex flex-row gap-2 items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded-lg border-[1px] border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-900 dark:text-gray-100 font-bold">{application.jobTitle}</span>
                            <span className="text-xs text-gray-900 dark:text-gray-100">{application.companyName}</span>
                        </div>
                        <Badge variant="outline" className="text-xs border-[1px] border-gray-200 dark:border-gray-500">{application.stage}</Badge>
                        <Button variant="ghost" size="icon" disabled={!application.jobUrl} onClick={() => handleOpenJobUrl(application.jobUrl ?? "")}>
                            <Link className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </div>}
        </div>
    );
}