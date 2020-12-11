import * as AWS from 'aws-sdk';
import { BookModel } from './BookModel';
import { DynamoSchema } from './DynamoSchema';
import { ModelFactory } from './ModelFactory';
import { KeyGenarator, ModelScrap } from './ModelScrap';

const TABLE_NAME = "subscription-api-test-subscription-api-subscription-api" //うーん、環境変数から呼べないかな
AWS.config.update({ region: 'ap-northeast-1' });

export class BookRepository {

    //done
    static async list() {
        const dynamoDb = new AWS.DynamoDB.DocumentClient();
        const result = await dynamoDb.query({
            TableName: TABLE_NAME,

            KeyConditionExpression: `#PK = :PK`,
            ExpressionAttributeNames: {
                "#PK": 'PartitionKey'
            },
            ExpressionAttributeValues: {
                ':PK': KeyGenarator.book().PartitionKey,
            }

        }).promise()
        const items = result.Items
        const themes = items.map(i => ModelFactory.bookModel(i))
        return themes
    }

    //done
    static async add(book: BookModel) {
        const dynamoDb = new AWS.DynamoDB.DocumentClient();
        const result = await dynamoDb.put({
            TableName: TABLE_NAME,
            Item: ModelScrap.book(book)
        }).promise()
        return result
    }
}