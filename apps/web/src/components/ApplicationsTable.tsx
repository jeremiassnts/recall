import { JobApplication } from "@recall/types";
import { format } from "date-fns";
import { CheckCircle, Link, PencilIcon, TrashIcon, XCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface ApplicationTableTable {
    applications?: JobApplication[];
    isLoading: boolean;
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
}

export function ApplicationsTable({ applications, isLoading, onDelete, onEdit }: ApplicationTableTable) {
    if (isLoading) {
        return (
            <div className="flex flex-col gap-2 w-full pt-4">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-[30px]" />
                ))}
            </div>
        )
    }

    function handleAccessJobUrl(url: string) {
        window.open(url, "_blank");
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>Applied at</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {applications?.map((application) => (
                    <TableRow key={application.id}>
                        <TableCell className="font-medium">{application.jobTitle}</TableCell>
                        <TableCell>{application.companyName}</TableCell>
                        <TableCell>
                            <Badge variant="outline">{application.stage}</Badge>
                        </TableCell>
                        <TableCell>
                            {application.stage === "Rejected" && <XCircle className="w-4 h-4 text-red-500" />}
                            {application.stage !== "Rejected" && <CheckCircle className="w-4 h-4 text-green-500" />}
                        </TableCell>
                        <TableCell>{format(new Date(application.appliedDate ?? ""), "dd/MM/yyyy")}</TableCell>
                        <TableCell>
                            <Button variant="ghost" size="icon" disabled={!application.jobUrl} onClick={() => handleAccessJobUrl(application.jobUrl ?? "")}>
                                <Link className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => onEdit(application.id)}>
                                <PencilIcon className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => onDelete(application.id)}>
                                <TrashIcon className="w-4 h-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}