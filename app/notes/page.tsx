import { QueryClient, dehydrate } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

export default async function NotesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", ""],
    queryFn: () => fetchNotes({ search: "" }),
  });

  return <NotesClient dehydratedState={dehydrate(queryClient)} />;
}
