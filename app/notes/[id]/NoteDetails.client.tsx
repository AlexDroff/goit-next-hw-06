"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { fetchNoteById, deleteNote } from "@/lib/api";
import type { Note } from "@/types/note";
import Link from "next/link";
import css from "./NoteDetails.module.css";

export default function NoteDetailsClient() {
  const queryClient = useQueryClient();
  const params = useParams();
  const id = params.id as string;

  const {
    data: note,
    isLoading,
    error,
  } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const deleteMutation = useMutation({
    mutationFn: (noteId: string) => deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      window.location.href = "/notes";
    },
  });

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !note) return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <Link href="/notes" className={css.backButton}>
        ← Back to notes
      </Link>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
          <span className={css.badge}>{note.tag}</span>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>
          Created: {new Date(note.createdAt).toLocaleDateString()}
        </p>
        <button
          className={css.deleteBtn}
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
