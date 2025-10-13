// Simple & reusable storage helper
export const storage = {
  // Lưu data với key bất kỳ
  save: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Storage save failed for key "${key}":`, error);
      return false;
    }
  },

  // Lấy data theo key
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Storage get failed for key "${key}":`, error);
      return null;
    }
  },

  // Xóa data theo key
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Storage remove failed for key "${key}":`, error);
      return false;
    }
  },

  // Kiểm tra key có tồn tại không
  has: (key) => {
    return localStorage.getItem(key) !== null;
  },
};
