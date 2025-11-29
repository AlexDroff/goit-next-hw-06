"use client";

import Link from "next/link";
import type { Note } from "@/types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <span className={css.badge}>{note.tag}</span>
          <h3 className={css.title}>{note.title}</h3>
          <p className={css.content}>{note.content}</p>
          <div className={css.actions}>
            <Link href={`/notes/${note.id}`} className={css.viewDetails}>
              View details
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
