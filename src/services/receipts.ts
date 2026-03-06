import * as DocumentPicker from "expo-document-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

export type PickedFile = {
  uri: string;
  name: string;
  mimeType?: string;
  size?: number;
};

export type UploadReceiptResult = {
  receiptUrl: string;
  receiptPath: string;
  receiptName: string;
  receiptType?: string;
};

async function uriToBlob(uri: string): Promise<Blob> {
  const resp = await fetch(uri);
  return await resp.blob();
}

export async function pickReceiptFile(): Promise<PickedFile | null> {
  const res = await DocumentPicker.getDocumentAsync({
    type: ["image/*", "application/pdf"],
    copyToCacheDirectory: true,
    multiple: false,
  });

  if (res.canceled) return null;

  const f = res.assets?.[0];
  if (!f?.uri) return null;

  return {
    uri: f.uri,
    name: f.name ?? `receipt-${Date.now()}`,
    mimeType: f.mimeType,
    size: f.size,
  };
}

export async function uploadReceipt(params: {
  uid: string;
  transactionId: string;
  file: PickedFile;
}): Promise<UploadReceiptResult> {
  const { uid, transactionId, file } = params;

  const safeName = file.name.replace(/[^\w.\-() ]/g, "_");
  const receiptPath = `users/${uid}/receipts/${transactionId}/${safeName}`;

  const blob = await uriToBlob(file.uri);

  const storageRef = ref(storage, receiptPath);
  await uploadBytes(
    storageRef,
    blob,
    file.mimeType ? { contentType: file.mimeType } : undefined,
  );

  const receiptUrl = await getDownloadURL(storageRef);

  return {
    receiptUrl,
    receiptPath,
    receiptName: safeName,
    receiptType: file.mimeType,
  };
}
