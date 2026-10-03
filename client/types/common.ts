export interface BaseEntity {
    id: number;
    createdAt: string;
    updatedAt?: string | null;
}

export interface SoftDeletableEntity extends BaseEntity {
    deletedAt?: string | null;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}