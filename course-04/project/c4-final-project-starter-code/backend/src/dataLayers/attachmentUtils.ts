import * as AWS from 'aws-sdk'
import * as AWSXRay from "aws-xray-sdk-core";
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger';

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
const logger = createLogger("attachmentUrl")
const todosTable = process.env.TODOS_TABLE
const docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient()

export async function attachmentUrl(todoId: string, userId: string, url: string) {
    logger.debug(`attachmentUrl (todoId: ${todoId}, url: ${url})`);
  
    await docClient.update({
        TableName: todosTable,
        Key: { 
            todoId: todoId, userId: userId 
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': url
        }
      })
      .promise();
  }
