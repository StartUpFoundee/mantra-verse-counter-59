import { openDB } from 'idb';

const DB_NAME = "mantra_db";
const DB_VERSION = 1;

// Initialize the database
export const initializeDatabase = async () => {
  try {
    await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create the activityData store
        if (!db.objectStoreNames.contains('activityData')) {
          db.createObjectStore('activityData');
        }
        
        // Create the spiritualId store
        if (!db.objectStoreNames.contains('spiritualId')) {
          db.createObjectStore('spiritualId');
        }
      }
    });
    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
};

export const storeData = async (storeName: string, data: any, key?: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      
      try {
        let putRequest;
        if (storeName === "activityData") {
          // For activity data, use the date as the key from the data object
          putRequest = store.put(data, data.date);
        } else if (key) {
          putRequest = store.put(data, key);
        } else {
          putRequest = store.put(data);
        }
        
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      } catch (error) {
        reject(error);
      }
    };
    
    request.onerror = () => reject(request.error);
  });
};

export const getData = async (storeName: string, key: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const getRequest = store.get(key);
      
      getRequest.onsuccess = () => resolve(getRequest.result);
      getRequest.onerror = () => reject(getRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
};

export const getAllData = async (storeName: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
};

export const deleteData = async (storeName: string, key: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const deleteRequest = store.delete(key);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
};

// Spiritual ID Store functions
const SPIRITUAL_ID_KEY = 'spiritualIdData';

export const getSpiritualIdData = async (): Promise<any | null> => {
  try {
    return await getData('spiritualId', SPIRITUAL_ID_KEY);
  } catch (error) {
    console.error("Failed to get spiritual ID data:", error);
    return null;
  }
};

export const storeSpiritualIdData = async (data: any): Promise<void> => {
  try {
    await storeData('spiritualId', data, SPIRITUAL_ID_KEY);
  } catch (error) {
    console.error("Failed to store spiritual ID data:", error);
  }
};

export const clearSpiritualIdData = async (): Promise<void> => {
  try {
    await deleteData('spiritualId', SPIRITUAL_ID_KEY);
  } catch (error) {
    console.error("Failed to clear spiritual ID data:", error);
  }
};

// Helper functions to get lifetime and today counts
export const getLifetimeCount = async (): Promise<number> => {
  try {
    const allActivity = await getAllData('activityData');
    return allActivity.reduce((sum: number, activity: any) => sum + activity.count, 0);
  } catch (error) {
    console.error("Failed to get lifetime count:", error);
    return 0;
  }
};

export const getTodayCount = async (): Promise<number> => {
  const today = new Date().toISOString().split('T')[0];
  try {
    const todayActivity = await getData('activityData', today);
    return todayActivity ? todayActivity.count : 0;
  } catch (error) {
    console.error("Failed to get today count:", error);
    return 0;
  }
};
