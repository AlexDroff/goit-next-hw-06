import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

export default async function NotesPage() {
  const queryClient = new QueryClient();

  // Завантажуємо лише початкові дані (без пошуку)
  await queryClient.prefetchQuery({
    queryKey: ["notes", { search: "", page: 1, perPage: 12 }],
    queryFn: () => fetchNotes({ search: "", page: 1, perPage: 12 }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  );
}
