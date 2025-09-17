import React from "react";
import styles from "./styles.module.css";

type SectionProps = {
  id?: string;
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
};

export default function Section({
  id,
  title,
  description,
  children,
}: SectionProps) {
  return (
    <div id={id} className={styles.section}>
      <h3>{title}</h3>
      {description ? (
        <p className={styles.sectionDescription}>{description}</p>
      ) : null}
      {children}
    </div>
  );
}
