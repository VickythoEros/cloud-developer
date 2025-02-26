import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl ,getItem} from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'


const logger = createLogger('generateUploadUrl')


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id

    const userId = getUserId(event);
    const todoItem = await getItem(userId, todoId);

    if (!!!todoItem) {
      logger.error(`todo with id = ${todoId} doesn't exist`);
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "Todo item doesn't exist"
        })
      };
    }
  
    const uploadUrl = await createAttachmentPresignedUrl(userId, todoId);

    return {
      statusCode: 201,
      body: JSON.stringify({ uploadUrl  })
    };

})
    

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
