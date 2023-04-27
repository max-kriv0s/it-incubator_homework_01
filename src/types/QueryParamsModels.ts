export type QueryParamsModels = {
    searchNameTerm: string
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: 'asc' | 'desc'
}

export type QueryParamsUsersModel = {
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: 'asc' | 'desc'
    searchLoginTerm: string
    searchEmailTerm: string
}