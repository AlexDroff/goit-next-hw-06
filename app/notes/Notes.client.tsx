"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, createNote } from "@/lib/api";
import type { FetchNotesResponse, CreateNotePayload } from "@/lib/api";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./Notes.client.module.css";

export default function NotesClient() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);

  const perPage = 12;

  const { data, isLoading, error } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", { search: debouncedSearch, page }],
    queryFn: () =>
      fetchNotes({
        search: debouncedSearch,
        page,
        perPage,
      }),
    staleTime: 5000,
    placeholderData: (prev) => prev,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateNotePayload) => createNote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error)
    return <p>Could not fetch the list of notes. {(error as Error).message}</p>;

  const notes = data?.notes || [];

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className={css.container}>
      <div className={css.header}>
        <SearchBox onChange={handleSearchChange} />

        <div className={css.pagination}>
          {page > 1 && (
            <button onClick={() => setPage(page - 1)} className={css.navButton}>
              ←
            </button>
          )}

          {[...Array(page + (notes.length === perPage ? 1 : 0))].map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                className={p === page ? css.currentPage : css.pageButton}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            );
          })}

          {notes.length === perPage && (
            <button onClick={() => setPage(page + 1)} className={css.navButton}>
              →
            </button>
          )}
        </div>

        <button
          className={css.createButton}
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </div>

      <NoteList notes={notes} />

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onClose={() => setIsModalOpen(false)}
            onSubmit={(values) => createMutation.mutate(values)}
          />
        </Modal>
      )}
    </div>
  );
}
