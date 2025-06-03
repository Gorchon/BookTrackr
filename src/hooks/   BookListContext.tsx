/* --------------------------------------------------------
   BookListContext.tsx
   -------------------------------------------------------- */

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

/* --------- tipos --------- */
export type ListType = "readBooks" | "queuedBooks" | "wishlist";

type ListsState = {
  readBooks: string[];
  queuedBooks: string[];
  wishlist: string[];
};

interface Ctx {
  lists: ListsState;
  toggleBook: (bookId: string, list: ListType) => Promise<void>;
}

/* --------- contexto --------- */
const BookListContext = createContext<Ctx | undefined>(undefined);

/* --------- provider --------- */
export const BookListProvider = ({ children }: { children: ReactNode }) => {
  const [uid, setUid] = useState<string | null>(null);
  const [lists, setLists] = useState<ListsState>({
    readBooks: [],
    queuedBooks: [],
    wishlist: [],
  });

  /* --- escuchar auth --- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setUid(user?.uid ?? null);

      if (user?.uid) {
        // leer listas del usuario
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data() as Partial<ListsState>;
          setLists({
            readBooks: data.readBooks || [],
            queuedBooks: data.queuedBooks || [],
            wishlist: data.wishlist || [],
          });
        }
      } else {
        // limpiar cuando se haga logout
        setLists({ readBooks: [], queuedBooks: [], wishlist: [] });
      }
    });

    return () => unsub();
  }, []);

  /* --- agregar / quitar --- */
  const toggleBook = async (bookId: string, list: ListType) => {
    if (!uid) return;

    const current = lists[list];
    const updated = current.includes(bookId)
      ? current.filter((id) => id !== bookId)
      : [...current, bookId];

    // merge true ⇒ solo sobreescribe ese campo
    await setDoc(doc(db, "users", uid), { [list]: updated }, { merge: true });

    setLists((prev) => ({ ...prev, [list]: updated }));
  };

  return (
    <BookListContext.Provider value={{ lists, toggleBook }}>
      {children}
    </BookListContext.Provider>
  );
};

/* --------- hook --------- */
export const useBookLists = () => {
  const ctx = useContext(BookListContext);
  if (!ctx)
    throw new Error("useBookLists debe usarse dentro de <BookListProvider>");
  return ctx;
};
