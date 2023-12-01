"use client"

import { useParams, useRouter } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"
import { useUser } from "@clerk/clerk-react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"


import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { ConfirmModel } from "@/components/modals/confirm-modal"

interface MenuProps {
    documentId: Id<"documents">
}

export const Menu = ({
    documentId
}: MenuProps) => {

    const router = useRouter();
    const {user} = useUser();
    const params = useParams();

    const archive = useMutation(api.documents.archive);

    const remove = useMutation(api.documents.remove);

    const onRemove = () => {
        const promise = remove({id: documentId})

        toast.promise(promise, {
            loading: "Deleting permanently...",
            success: "Note deleted permanently",
            error: "Failed to delete note."
        })

        router.push("/documents");
    }

    const onArchive = () => {
        const promise = archive({id: documentId})

        toast.promise(promise, {
            loading: "Moving to trash...",
            success: "Note moved to trash!",
            error: "Failed to delete note."
        })

        router.push("/documents");
    }

    const document = useQuery(api.documents.getById, {
        documentId: params.documentId as Id<"documents">,
    });

    if(document == null) return null;

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size={"sm"} variant={"ghost"}>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                    className="w-60"
                    align="end"
                    alignOffset={8}
                    forceMount
                >
                    {document.isArchived ? (
                        <>
                            <DropdownMenuItem>
                                <ConfirmModel  onConfirm={onRemove}>
                                    <div className="flex items-center">
                                        <Trash className="h-4 w-4 mr-2" />
                                        Delete Permanently
                                    </div>
                                </ConfirmModel>
                            </DropdownMenuItem>
                        </>
                    ) : (
                        <>
                            <DropdownMenuItem onClick={onArchive}>
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </>
                    )}
                    <DropdownMenuSeparator />
                    <div className="text-xs text-muted-foreground">
                        Last edited by: {user?.fullName}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

Menu.Skeleton = function MenuSkeleton() {
    return (
        <Skeleton className="h-10 w-10" />
    )
}