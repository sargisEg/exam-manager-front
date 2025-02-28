import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {Page} from "@shared/response-models.ts";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageCount: number;
    pageIndex: number;
    total: number;
    onPageChange: (pageIndex: number) => void;
    initialSorting: SortingState;
}

export function getTable<T>(
    getData: (pageIndex: number, pageSize: number) => Promise<Page<T>>,
    columns: ColumnDef<T>[],
    reset: boolean,
) {

    const initialSorting: SortingState = [{id: "name", desc: false}];
    const [content, setContent] = useState<T[]>([]);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageCount, setPageCount] = useState(1);
    const [pageSize] = useState(6);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const page = await getData(pageIndex, pageSize);
                setContent(page.content);
                setTotalElements(page.page.totalElements);
                setPageCount(page.page.totalPages);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [pageIndex, pageSize, reset]);

    // Handle page change from DataTable
    const handlePageChange = (newPageIndex: number) => {
        if (newPageIndex >= 0 && newPageIndex < pageCount) {
            setPageIndex(newPageIndex);
        }
    };

    return (
        <div>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <DataTable
                    columns={columns}
                    data={content}
                    pageCount={pageCount}
                    pageIndex={pageIndex}
                    total={totalElements}
                    onPageChange={handlePageChange}
                    initialSorting={initialSorting}
                />
            )}
        </div>
    );
}


export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                             pageCount,
                                             total,
                                             pageIndex,
                                             onPageChange,
                                             initialSorting,
                                         }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>(initialSorting);

    const table = useReactTable({
        data,
        columns,
        pageCount, // Provided by the parent
        manualPagination: true, // Enable server-side pagination
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
            pagination: {
                pageIndex: pageIndex, // Initial page; can be managed externally if needed
                pageSize: 6, // Fixed page size; adjust as needed
            },
        },
    });

    return (
        <div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex items-center justify-between space-x-2 py-4">
                <span>
                    {(pageIndex * 6) + 1}-{(pageIndex * 6) + table.getRowModel().rows?.length} of {total}
                </span>
                </div>
                <div className="flex items-center justify-between space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(pageIndex - 1)}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(pageIndex + 1)}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
                <span>
                    Page {pageIndex + 1} of {pageCount}
                </span>
                </div>
            </div>
        </div>
    );
}
