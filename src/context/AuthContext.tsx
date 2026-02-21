import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Alert } from "react-native";
import { auth, db } from "../services/firebase";

type AuthContextType = {
  user: User | null;
  loadingAuth: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function ensureUserDoc(user: User) {
  await setDoc(
    doc(db, "users", user.uid),
    {
      email: user.email ?? null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      try {
        setUser(u);

        if (u) {
          await ensureUserDoc(u);
        }
      } catch (e: any) {
        Alert.alert("Aviso", e?.message ?? "Falha ao preparar usuário");
      } finally {
        setLoadingAuth(false);
      }
    });

    return () => unsub();
  }, []);

  async function login(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);

    await ensureUserDoc(cred.user);
  }

  async function register(email: string, password: string) {
    const cred = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password,
    );

    await ensureUserDoc(cred.user);
  }

  async function logout() {
    await signOut(auth);
  }

  const value = useMemo(
    () => ({ user, loadingAuth, login, register, logout }),
    [user, loadingAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
