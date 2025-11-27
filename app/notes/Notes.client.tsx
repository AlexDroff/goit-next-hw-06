"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  DehydratedState,
  hydrate,
} from "@tanstack/react-query";
import { fetchNotes, deleteNote } from "@/lib/api";
import type { FetchNotesResponse } from "@/lib/api";
import { useState } from "react";
import NoteList from "@/components/Note/NoteList";
import SearchBox from "@/components/Note/SearchBox";
import css from "./Notes.client.module.css";

interface NotesClientProps {
  dehydratedState: DehydratedState;
}

export default function NotesClient({ dehydratedState }: NotesClientProps) {
  const queryClient = useQueryClient();

  hydrate(queryClient, dehydratedState);

  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", search],
    queryFn: () => fetchNotes({ search }),
  });

  const mutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", search] });
    },
  });

  const handleDelete = (id: string) => {
    mutation.mutate(id);
  };

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error)
    return <p>Could not fetch the list of notes. {(error as Error).message}</p>;

  const notesToDisplay = data?.notes || [];

  return (
    <div className={css.container}>
      <SearchBox value={search} onChange={setSearch} />
      <NoteList notes={notesToDisplay} onDelete={handleDelete} />
    </div>
  );
}
