export const bannerKeys = {
  all: ['banners'] as const,
  lists: () => [...bannerKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...bannerKeys.lists(), filters] as const,
  details: () => [...bannerKeys.all, 'detail'] as const,
  detail: (id: number) => [...bannerKeys.details(), id] as const,
};
