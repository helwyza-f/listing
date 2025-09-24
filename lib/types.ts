// lib/types.ts
import { getPropertyBySlug } from "./data"; // Kita butuh ini hanya untuk inferensi tipe

// Definisikan dan ekspor tipe data lengkapnya di sini
export type FullProperty = NonNullable<
  Awaited<ReturnType<typeof getPropertyBySlug>>
>;
