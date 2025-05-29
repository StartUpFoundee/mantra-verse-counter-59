
/**
 * DataFortress - Triple backup system for bulletproof data protection
 */

interface JaapData {
  userId: string;
  totalCount: number;
  dailyCount: number;
  streak: number;
  lastUpdated: number;
  history: Array<{
    date: string;
    count: number;
    timestamp: number;
  }>;
}

interface UserSession {
  sessionId: string;
  userId: string;
  fingerprint: string;
  lastActivity: number;
}

class DataFortress {
  private sessionId: string;
  private userFingerprint: string;
  private autoSaveInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.userFingerprint = this.generateFingerprint();
    this.initializeSession();
    this.startAutoSave();
  }

  /**
   * Generate unique browser fingerprint
   */
  private generateFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('fingerprint', 2, 2);
    
    const fingerprint = btoa(
      navigator.userAgent + 
      screen.width + 
      screen.height + 
      navigator.language + 
      (canvas.toDataURL())
    );
    
    return fingerprint.substring(0, 32);
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Check if another window is active
   */
  private isAnotherWindowActive(): boolean {
    const currentSession = localStorage.getItem('activeSession');
    if (!currentSession) return false;

    const session: UserSession = JSON.parse(currentSession);
    const timeDiff = Date.now() - session.lastActivity;
    
    // Consider session inactive after 30 seconds
    return timeDiff < 30000 && session.sessionId !== this.sessionId;
  }

  /**
   * Initialize single window session
   */
  private initializeSession(): boolean {
    if (this.isAnotherWindowActive()) {
      console.warn("Another window is active. Please use only one window.");
      return false;
    }

    const session: UserSession = {
      sessionId: this.sessionId,
      userId: this.getCurrentUserId() || 'anonymous',
      fingerprint: this.userFingerprint,
      lastActivity: Date.now()
    };

    localStorage.setItem('activeSession', JSON.stringify(session));
    this.updateActivity();
    
    return true;
  }

  /**
   * Update activity timestamp
   */
  private updateActivity(): void {
    const session = localStorage.getItem('activeSession');
    if (session) {
      const sessionData = JSON.parse(session);
      sessionData.lastActivity = Date.now();
      localStorage.setItem('activeSession', JSON.stringify(sessionData));
    }
  }

  /**
   * Get current user ID
   */
  private getCurrentUserId(): string | null {
    const userData = localStorage.getItem('chantTrackerUserData');
    return userData ? JSON.parse(userData).id : null;
  }

  /**
   * Encrypt data for backup storage
   */
  private encrypt(data: any): string {
    // Simple base64 encoding for now - can be enhanced with real encryption
    return btoa(JSON.stringify(data));
  }

  /**
   * Decrypt data from backup storage
   */
  private decrypt(encryptedData: string): any {
    try {
      return JSON.parse(atob(encryptedData));
    } catch (error) {
      console.error('Failed to decrypt data:', error);
      return null;
    }
  }

  /**
   * Save data with triple backup system
   */
  async save(data: JaapData): Promise<boolean> {
    this.updateActivity();
    let saveSuccess = false;

    try {
      // Layer 1: IndexedDB (primary storage)
      await this.saveToIndexedDB(data);
      saveSuccess = true;
      console.log('✅ Data saved to IndexedDB');
    } catch (error) {
      console.error('❌ IndexedDB save failed:', error);
    }

    try {
      // Layer 2: localStorage (emergency backup)
      const encryptedData = this.encrypt(data);
      localStorage.setItem(`backup_${this.userFingerprint}`, encryptedData);
      localStorage.setItem('lastBackupTime', Date.now().toString());
      console.log('✅ Emergency backup saved to localStorage');
    } catch (error) {
      console.error('❌ localStorage backup failed:', error);
    }

    try {
      // Layer 3: Cache storage (additional backup)
      await this.saveToCacheStorage(data);
      console.log('✅ Cache backup saved');
    } catch (error) {
      console.error('❌ Cache storage backup failed:', error);
    }

    return saveSuccess;
  }

  /**
   * Save to IndexedDB
   */
  private async saveToIndexedDB(data: JaapData): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('mantra_db', 2);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['activityData'], 'readwrite');
        const store = transaction.objectStore('activityData');
        
        const putRequest = store.put({
          date: 'fortress_backup',
          data: data,
          timestamp: Date.now()
        });
        
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Save to cache storage
   */
  private async saveToCacheStorage(data: JaapData): Promise<void> {
    if ('caches' in window) {
      const cache = await caches.open('jaap-data-v1');
      const response = new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      });
      await cache.put('fortress-backup', response);
    }
  }

  /**
   * Recover data from all available sources
   */
  async recover(): Promise<JaapData | null> {
    console.log('🔄 Starting data recovery...');

    // Try IndexedDB first
    try {
      const indexedDBData = await this.recoverFromIndexedDB();
      if (indexedDBData) {
        console.log('✅ Recovered from IndexedDB');
        return indexedDBData;
      }
    } catch (error) {
      console.error('❌ IndexedDB recovery failed:', error);
    }

    // Try localStorage backup
    try {
      const localStorageData = this.recoverFromLocalStorage();
      if (localStorageData) {
        console.log('✅ Recovered from localStorage backup');
        return localStorageData;
      }
    } catch (error) {
      console.error('❌ localStorage recovery failed:', error);
    }

    // Try cache storage
    try {
      const cacheData = await this.recoverFromCacheStorage();
      if (cacheData) {
        console.log('✅ Recovered from cache storage');
        return cacheData;
      }
    } catch (error) {
      console.error('❌ Cache storage recovery failed:', error);
    }

    console.log('❌ No recoverable data found');
    return null;
  }

  /**
   * Recover from IndexedDB
   */
  private async recoverFromIndexedDB(): Promise<JaapData | null> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('mantra_db', 2);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['activityData'], 'readonly');
        const store = transaction.objectStore('activityData');
        const getRequest = store.get('fortress_backup');
        
        getRequest.onsuccess = () => {
          const result = getRequest.result;
          resolve(result ? result.data : null);
        };
        getRequest.onerror = () => reject(getRequest.error);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Recover from localStorage
   */
  private recoverFromLocalStorage(): JaapData | null {
    const backupData = localStorage.getItem(`backup_${this.userFingerprint}`);
    return backupData ? this.decrypt(backupData) : null;
  }

  /**
   * Recover from cache storage
   */
  private async recoverFromCacheStorage(): Promise<JaapData | null> {
    if ('caches' in window) {
      try {
        const cache = await caches.open('jaap-data-v1');
        const response = await cache.match('fortress-backup');
        return response ? await response.json() : null;
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  /**
   * Auto-save every 10 seconds
   */
  private startAutoSave(): void {
    this.autoSaveInterval = setInterval(() => {
      this.updateActivity();
      // Auto-save will be triggered by the main app when data changes
    }, 10000);
  }

  /**
   * Auto-login using fingerprint
   */
  autoLogin(): any {
    const savedUser = localStorage.getItem(`user_${this.userFingerprint}`);
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log('✅ Auto-login successful:', userData.name);
        return userData;
      } catch (error) {
        console.error('❌ Auto-login failed:', error);
      }
    }
    return null;
  }

  /**
   * Save user for auto-login
   */
  saveUserForAutoLogin(userData: any): void {
    localStorage.setItem(`user_${this.userFingerprint}`, JSON.stringify(userData));
    localStorage.setItem('chantTrackerUserData', JSON.stringify(userData));
  }

  /**
   * Generate recovery QR code data
   */
  generateRecoveryQR(): string {
    const data = localStorage.getItem(`backup_${this.userFingerprint}`);
    if (data) {
      return `https://mantraverse.app/restore?data=${encodeURIComponent(data)}`;
    }
    return '';
  }

  /**
   * Clean up on destroy
   */
  destroy(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    localStorage.removeItem('activeSession');
  }
}

// Export singleton instance
export const dataFortress = new DataFortress();
export default DataFortress;
