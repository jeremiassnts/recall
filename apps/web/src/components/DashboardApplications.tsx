import { useListApplications } from "@/api/applications/useListApplications";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export function DashboardApplications() {
    const { data: applications, isLoading, error } = useListApplications();
    console.log(applications);

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-[1px] border-gray-200 dark:border-gray-700">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Stage</TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applications?.map((application) => (
                        <TableRow key={application.id}>
                            <TableCell>{application.jobTitle}</TableCell>
                            <TableCell>{application.companyName}</TableCell>
                            <TableCell>{application.stage}</TableCell>
                            <TableCell>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}