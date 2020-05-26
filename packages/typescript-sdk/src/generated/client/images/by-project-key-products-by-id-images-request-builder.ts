/**
 *
 *    Generated file, please do not change!!!
 *    From http://www.vrap.io/ with love
 *
 *                ,d88b.d88b,
 *                88888888888
 *                `Y8888888Y'
 *                  `Y888Y'
 *                    `Y'
 *
 */
import { Product } from 'models/product'
import { executeRequest, QueryParam } from 'shared/utils/common-types'
import { ApiRequest } from 'shared/utils/requests-utils'

export class ByProjectKeyProductsByIDImagesRequestBuilder {
  constructor(
    protected readonly args: {
      pathArgs: {
        projectKey: string
        ID: string
      }
      executeRequest: executeRequest
      baseUri?: string
    }
  ) {}
  /**
   *	Uploads a binary image file to a given product variant. The supported image formats are JPEG, PNG and GIF.
   *
   */
  public post(methodArgs: {
    queryArgs?: {
      filename?: string | string[]
      variant?: number | number[]
      sku?: string | string[]
      staged?: boolean | boolean[]
      [key: string]: QueryParam
    }
    body: Buffer
    headers: {
      'Content-Type': 'image/jpeg' | 'image/png' | 'image/gif'
      [key: string]: string
    }
  }): ApiRequest<Product> {
    return new ApiRequest<Product>(
      {
        baseUri: this.args.baseUri,
        method: 'POST',
        uriTemplate: '/{projectKey}/products/{ID}/images',
        pathVariables: this.args.pathArgs,
        headers: {
          ...methodArgs?.headers,
        },
        queryParams: methodArgs?.queryArgs,
        body: methodArgs?.body,
      },
      this.args.executeRequest
    )
  }
}
