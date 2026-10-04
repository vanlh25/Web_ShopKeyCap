import { USE_MOCK } from "../../../../../core/config/useMock.config";
import type { CategoryRepo } from "../repos/category.repo";
import { CategoryApiRepo } from "../repos/categoryApi.repo";
import { CategoryMockRepo } from "../repos/categoryMock.repo";

export const categoryService: CategoryRepo = USE_MOCK ? new CategoryMockRepo() : new CategoryApiRepo();
