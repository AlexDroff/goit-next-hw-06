"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, deleteNote } from "@/lib/api";
import type { FetchNotesResponse } from "@/lib/api";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import NoteList from "@/components/Note/NoteList";
import SearchBox from "@/components/Note/SearchBox";
import css from "./Notes.client.module.css";

export default function NotesClient() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, error } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", { search: debouncedSearch }],
    queryFn: () => fetchNotes({ search: debouncedSearch }),
    staleTime: 5000,
  });

  const mutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
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
      {notesToDisplay.length > 0 ? (
        <NoteList notes={notesToDisplay} onDelete={handleDelete} />
      ) : (
        !isLoading && <p>No notes found.</p>
      )}
    </div>
  );
}
