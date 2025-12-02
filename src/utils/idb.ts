/**
 * @description 打卡indexDB
 */
function openDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('Dawn', 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('tasks')) {
        db.createObjectStore('tasks', { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function getAllTasks(): Promise<any[]> {
  return openDB().then(
    db =>
      new Promise(resolve => {
        const tx = db.transaction('tasks', 'readonly');
        const store = tx.objectStore('tasks');
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
      })
  );
}

export function saveTasks(tasks: any[]): Promise<void> {
  return openDB().then(
    db =>
      new Promise(resolve => {
        const tx = db.transaction('tasks', 'readwrite');
        const store = tx.objectStore('tasks');
        store.clear();
        tasks.forEach(t => store.put(t));
        tx.oncomplete = () => resolve();
      })
  );
}
