
/**
 * Google Drive sync utilities for Naam Japa data
 */

import { getGoogleAccessToken } from './googleAuth';

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const UPLOAD_API_BASE = 'https://www.googleapis.com/upload/drive/v3';

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

/**
 * Get file name for user's data
 */
const getDataFileName = (userId: string): string => {
  return `naam-jaap-${userId}.json`;
};

/**
 * Search for existing data file
 */
const findDataFile = async (fileName: string): Promise<string | null> => {
  const accessToken = getGoogleAccessToken();
  if (!accessToken) throw new Error('No access token available');

  try {
    const response = await fetch(
      `${DRIVE_API_BASE}/files?q=name='${fileName}'&spaces=drive`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    return data.files && data.files.length > 0 ? data.files[0].id : null;
  } catch (error) {
    console.error('Error searching for file:', error);
    return null;
  }
};

/**
 * Download data from Google Drive
 */
export const downloadDataFromDrive = async (userId: string): Promise<JaapData | null> => {
  const fileName = getDataFileName(userId);
  const fileId = await findDataFile(fileName);
  
  if (!fileId) {
    console.log('No existing data file found on Drive');
    return null;
  }

  const accessToken = getGoogleAccessToken();
  if (!accessToken) throw new Error('No access token available');

  try {
    const response = await fetch(
      `${DRIVE_API_BASE}/files/${fileId}?alt=media`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Data downloaded from Drive:', data);
    return data;
  } catch (error) {
    console.error('Error downloading data from Drive:', error);
    return null;
  }
};

/**
 * Upload data to Google Drive
 */
export const uploadDataToDrive = async (userId: string, data: JaapData): Promise<boolean> => {
  const fileName = getDataFileName(userId);
  const existingFileId = await findDataFile(fileName);
  
  const accessToken = getGoogleAccessToken();
  if (!accessToken) throw new Error('No access token available');

  const dataBlob = JSON.stringify(data);
  
  try {
    let response;
    
    if (existingFileId) {
      // Update existing file
      response = await fetch(
        `${UPLOAD_API_BASE}/files/${existingFileId}?uploadType=media`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: dataBlob,
        }
      );
    } else {
      // Create new file
      const metadata = {
        name: fileName,
        parents: [], // Root directory
      };
      
      const formData = new FormData();
      formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      formData.append('file', new Blob([dataBlob], { type: 'application/json' }));

      response = await fetch(
        `${UPLOAD_API_BASE}/files?uploadType=multipart`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );
    }

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.statusText}`);
    }

    console.log('Data uploaded to Drive successfully');
    return true;
  } catch (error) {
    console.error('Error uploading data to Drive:', error);
    return false;
  }
};

/**
 * Sync local data with Google Drive
 */
export const syncWithGoogleDrive = async (userId: string, localData: JaapData): Promise<JaapData> => {
  try {
    // Download existing data from Drive
    const cloudData = await downloadDataFromDrive(userId);
    
    if (!cloudData) {
      // No cloud data, upload local data
      await uploadDataToDrive(userId, localData);
      return localData;
    }
    
    // Conflict resolution: use latest timestamp
    const useCloudData = cloudData.lastUpdated > localData.lastUpdated;
    const finalData = useCloudData ? cloudData : localData;
    
    // Upload the final data to ensure sync
    if (!useCloudData) {
      await uploadDataToDrive(userId, finalData);
    }
    
    console.log(`Sync completed. Using ${useCloudData ? 'cloud' : 'local'} data.`);
    return finalData;
  } catch (error) {
    console.error('Sync failed:', error);
    // Return local data if sync fails
    return localData;
  }
};
