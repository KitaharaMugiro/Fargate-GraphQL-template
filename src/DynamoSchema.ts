export enum AttributeName {
    PartitionKey = "PartitionKey",
    SortKey = "SortKey",
    BookId = "BookId",
    BookTitle = "BookTitle",
    BookAuthor = "BookAuthor"
}

export class DynamoSchema {
    PartitionKey?: string
    SortKey?: string
    BookId?: string
    BookTitle?: string
    BookAuthor?: string
}