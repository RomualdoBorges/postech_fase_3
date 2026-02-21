/**
 * Service: auth
 * ----------------------------------------------------------------------------
 * Responsável por:
 * - Login
 * - Registro
 * - Garantir documento do usuário no Firestore
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type UserCredential,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

/* ----------------------------------------------------------------------------
 * Garante que exista um documento em users/{uid}
 * -------------------------------------------------------------------------- */
export async function ensureUserDoc() {
  const user = auth.currentUser;
  if (!user) return;

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

/* ----------------------------------------------------------------------------
 * Login
 * -------------------------------------------------------------------------- */
export async function login(
  email: string,
  password: string,
): Promise<UserCredential> {
  const credential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );

  await ensureUserDoc();

  return credential;
}

/* ----------------------------------------------------------------------------
 * Registro
 * -------------------------------------------------------------------------- */
export async function register(
  email: string,
  password: string,
): Promise<UserCredential> {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );

  await ensureUserDoc();

  return credential;
}
