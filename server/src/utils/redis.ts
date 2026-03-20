export const getCache = async (key: string) => {
  return null;
};

export const setCache = async (key: string, value: any, ttl: number = 3600) => {
  // Mock Set
};

export const delCache = async (key: string) => {
  // Mock Del
};

export default {
  duplicate: () => ({}),
  on: () => ({}),
} as any;
