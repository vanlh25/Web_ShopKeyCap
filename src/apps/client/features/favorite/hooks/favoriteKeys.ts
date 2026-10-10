export const favoriteKeys = {
    all: ['favorites'] as const,
    lists: () => [...favoriteKeys.all, 'list'] as const,
    list: (page: number, limit: number) => [...favoriteKeys.lists(), page, limit] as const,
};
