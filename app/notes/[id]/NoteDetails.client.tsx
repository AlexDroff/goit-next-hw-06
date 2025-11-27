"use client";

import {
  useQuery,
  hydrate,
  DehydratedState,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import type { Note } from "@/types/note";
import css from "./NoteDetails.module.css";

interface NoteDetailsClientProps {
  dehydratedState: DehydratedState;
  noteId: string;
}

export default function NoteDetailsClient({
  dehydratedState,
  noteId,
}: NoteDetailsClientProps) {
  const queryClient = new QueryClient();

  hydrate(queryClient, dehydratedState);

  return (
    <QueryClientProvider client={queryClient}>
      <NoteDetails noteId={noteId} />
    </QueryClientProvider>
  );
}

function NoteDetails({ noteId }: { noteId: string }) {
  const {
    data: note,
    isLoading,
    error,
  } = useQuery<Note>({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
    enabled: !!noteId,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !note) return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{note.createdAt}</p>
      </div>
    </div>
  );
}
