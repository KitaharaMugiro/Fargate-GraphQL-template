import { v4 as uuidv4 } from 'uuid';

export class BookModel {
    id: string
    title: string
    author: string

    create(title: string, author: string) {
        this.id = uuidv4()
        this.title = title
        this.author = author
    }
}