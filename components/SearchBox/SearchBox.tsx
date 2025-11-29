"use client";

import { ChangeEvent } from "react";
import styles from "./SearchBox.module.css";

interface SearchBoxProps {
  onChange: (value: string) => void;
}

export default function SearchBox({ onChange }: SearchBoxProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <input
      className={styles.input}
      type="text"
      placeholder="Search notes"
      onChange={handleChange}
    />
  );
}
