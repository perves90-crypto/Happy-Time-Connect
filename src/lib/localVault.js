import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';

const DB_NAME = 'htc-local-vault';
const STORE = 'files';
const ROOT = 'Happy Time Connect';
export const VAULT_CATEGORIES = [
  { id: 'personal', bn: 'Personal Chat', en: 'Personal Chat' },
  { id: 'groups', bn: 'Group Chat', en: 'Group Chat' },
  { id: 'photos', bn: 'Photos', en: 'Photos' },
  { id: 'videos', bn: 'Videos', en: 'Videos' },
  { id: 'documents', bn: 'Documents', en: 'Documents' },
  { id: 'audio', bn: 'Audio & Voice', en: 'Audio & Voice' },
  { id: 'downloads', bn: 'Downloads', en: 'Downloads' },
];

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) {
        request.result.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function dbAction(mode, action) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const request = action(tx.objectStore(STORE));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}
const safeName = (name) => name.normalize('NFKC').replace(/[^a-zA-Z0-9._-]+/g, '_').slice(-100) || 'file';
const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
  reader.onerror = () => reject(reader.error);
  reader.readAsDataURL(file);
});

export async function saveLocalFile(file, category = 'downloads', details = {}) {
  if (!file) throw new Error('কোনো ফাইল নির্বাচন করা হয়নি।');
  const categoryInfo = VAULT_CATEGORIES.find((item) => item.id === category) || VAULT_CATEGORIES.at(-1);
  const id = crypto.randomUUID();
  const filename = safeName(file.name);
  let storagePath = '';
  let storageType = 'browser';
  if (Capacitor.isNativePlatform()) {
    const folder = categoryInfo.id;
    storagePath = `${ROOT}/${folder}/${Date.now()}_${filename}`;
    await Filesystem.writeFile({
      path: storagePath,
      data: await toBase64(file),
      directory: Directory.Documents,
      recursive: true,
    });
    storageType = 'device';
  }
  const record = {
    id, name: file.name, safeName: filename, type: file.type || 'application/octet-stream',
    size: file.size, category: categoryInfo.id, storagePath, storageType,
    savedAt: new Date().toISOString(), conversationId: details.conversationId || null,
    source: details.source || 'manual',
    ...(storageType === 'browser' ? { blob: file } : {}),
  };
  await dbAction('readwrite', (store) => store.put(record));
  return record;
}
export async function listLocalFiles() {
  const records = await dbAction('readonly', (store) => store.getAll());
  return (records || []).sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}
export async function deleteLocalFile(record) {
  if (record.storageType === 'device' && record.storagePath) {
    await Filesystem.deleteFile({ path: record.storagePath, directory: Directory.Documents });
  }
  await dbAction('readwrite', (store) => store.delete(record.id));
}
export async function getLocalFileBlob(record) {
  if (record.blob) return record.blob;
  if (record.storageType === 'device' && record.storagePath) {
    const result = await Filesystem.readFile({ path: record.storagePath, directory: Directory.Documents });
    const raw = typeof result.data === 'string' ? atob(result.data) : '';
    const bytes = Uint8Array.from(raw, (char) => char.charCodeAt(0));
    return new Blob([bytes], { type: record.type });
  }
  throw new Error('ফাইলটি পাওয়া যায়নি।');
}
export const isNativeVault = () => Capacitor.isNativePlatform();
