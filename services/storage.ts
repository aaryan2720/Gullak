import AsyncStorage from '@react-native-async-storage/async-storage';

// In-memory fallback database for web or environments where native module fails
const memoryStorage: Record<string, string> = {};

export const safeStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      // Direct call check to ensure AsyncStorage native module is not null
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (error) {
      console.warn(`[safeStorage] AsyncStorage failed for key "${key}", falling back to memory:`, error);
      return memoryStorage[key] || null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.warn(`[safeStorage] AsyncStorage failed to set key "${key}", falling back to memory:`, error);
      memoryStorage[key] = value;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.warn(`[safeStorage] AsyncStorage failed to remove key "${key}", falling back to memory:`, error);
      delete memoryStorage[key];
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.warn('[safeStorage] AsyncStorage failed to clear, falling back to memory:', error);
      for (const key in memoryStorage) {
        delete memoryStorage[key];
      }
    }
  }
};

export default safeStorage;
