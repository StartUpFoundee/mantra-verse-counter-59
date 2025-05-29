
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Download, Upload, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { dataFortress } from '@/utils/dataFortress';
import { QRCode } from '@/components/ui/qr-code';
import ModernCard from './ModernCard';

interface BackupStatus {
  indexedDB: boolean;
  localStorage: boolean;
  cacheStorage: boolean;
  lastBackup: string;
}

const BackupManager: React.FC = () => {
  const [backupStatus, setBackupStatus] = useState<BackupStatus>({
    indexedDB: false,
    localStorage: false,
    cacheStorage: false,
    lastBackup: 'Never'
  });
  const [showRecoveryQR, setShowRecoveryQR] = useState(false);
  const [recoveryQRData, setRecoveryQRData] = useState('');

  useEffect(() => {
    checkBackupStatus();
  }, []);

  const checkBackupStatus = async () => {
    try {
      // Check IndexedDB
      const indexedDBData = await dataFortress.recover();
      
      // Check localStorage
      const localStorageBackup = localStorage.getItem(`backup_${(dataFortress as any).userFingerprint}`);
      
      // Check cache storage
      let cacheStorageExists = false;
      if ('caches' in window) {
        try {
          const cache = await caches.open('jaap-data-v1');
          const response = await cache.match('fortress-backup');
          cacheStorageExists = !!response;
        } catch (error) {
          cacheStorageExists = false;
        }
      }

      const lastBackupTime = localStorage.getItem('lastBackupTime');
      const lastBackup = lastBackupTime 
        ? new Date(parseInt(lastBackupTime)).toLocaleString()
        : 'Never';

      setBackupStatus({
        indexedDB: !!indexedDBData,
        localStorage: !!localStorageBackup,
        cacheStorage: cacheStorageExists,
        lastBackup
      });
    } catch (error) {
      console.error('Error checking backup status:', error);
    }
  };

  const createManualBackup = () => {
    try {
      const userData = localStorage.getItem('chantTrackerUserData');
      if (userData) {
        const blob = new Blob([userData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `naam-jaap-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success('Backup file downloaded successfully!');
      } else {
        toast.error('No data to backup');
      }
    } catch (error) {
      console.error('Backup creation failed:', error);
      toast.error('Failed to create backup');
    }
  };

  const generateRecoveryQR = () => {
    const qrData = dataFortress.generateRecoveryQR();
    if (qrData) {
      setRecoveryQRData(qrData);
      setShowRecoveryQR(true);
      toast.success('Recovery QR code generated!');
    } else {
      toast.error('No backup data available for QR generation');
    }
  };

  const restoreFromFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            localStorage.setItem('chantTrackerUserData', JSON.stringify(data));
            toast.success('Data restored successfully!');
            window.location.reload();
          } catch (error) {
            toast.error('Invalid backup file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const StatusIndicator = ({ status, label }: { status: boolean; label: string }) => (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-zinc-800">
      {status ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <AlertTriangle className="w-4 h-4 text-red-500" />
      )}
      <span className="text-sm font-medium">{label}</span>
      <span className={`text-xs px-2 py-1 rounded-full ${
        status ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      }`}>
        {status ? 'Active' : 'Inactive'}
      </span>
    </div>
  );

  return (
    <ModernCard className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-amber-500" />
        <h2 className="text-xl font-bold text-amber-600 dark:text-amber-400">
          Data Protection Center
        </h2>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Backup Status
          </h3>
          <div className="space-y-2">
            <StatusIndicator status={backupStatus.indexedDB} label="Primary Storage (IndexedDB)" />
            <StatusIndicator status={backupStatus.localStorage} label="Emergency Backup (localStorage)" />
            <StatusIndicator status={backupStatus.cacheStorage} label="Cache Backup" />
          </div>
        </div>

        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Last Backup: {backupStatus.lastBackup}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Button
          onClick={createManualBackup}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
        >
          <Download className="w-4 h-4" />
          Download Backup
        </Button>

        <Button
          onClick={restoreFromFile}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Restore from File
        </Button>
      </div>

      <Button
        onClick={generateRecoveryQR}
        variant="outline"
        className="w-full mb-4"
      >
        Generate Recovery QR Code
      </Button>

      {showRecoveryQR && recoveryQRData && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg text-center">
          <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
            Recovery QR Code
          </h3>
          <QRCode value={recoveryQRData} size={200} className="mx-auto mb-3" />
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Scan this QR code to recover your data on another device
          </p>
        </div>
      )}

      <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
        <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
          🔒 Fort Knox Security
        </h3>
        <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
          <li>• Triple backup system ensures zero data loss</li>
          <li>• Auto-save every 10 seconds</li>
          <li>• Emergency recovery from multiple sources</li>
          <li>• QR code backup for device transfer</li>
          <li>• Single window enforcement prevents conflicts</li>
        </ul>
      </div>
    </ModernCard>
  );
};

export default BackupManager;
