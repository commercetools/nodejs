
import { Product } from './../../models/product'
import { ApiRequestExecutor, ApiRequest } from './../../base/requests-utils'

export class ByProjectKeyProductsByIDImagesRequestBuilder {

    
      constructor(
        protected readonly args: {
          pathArgs: {
                projectKey: string,
                ID: string
           },
          apiRequestExecutor: ApiRequestExecutor;
        }
      ) {}
    /**
    *		Uploads a binary image file to a given product variant. The supported image formats are JPEG, PNG and GIF.
    *		
    */
    public post(
                methodArgs:{
                   
                   queryArgs?: {
                      'filename'?: string | string[]
                      'variant'?: number | number[]
                      'sku'?: string | string[]
                      'staged'?: boolean | boolean[]
                   },
                   body: Buffer,
                   headers: {
                      'Content-Type': 'image/jpeg' | 'image/png' | 'image/gif'
                      [key:string]:string
                   },
                }): ApiRequest<Product> {
       return new ApiRequest<Product>(
           {
              baseURL: 'https://api.sphere.io',
              method: 'POST',
              uriTemplate: '/{projectKey}/products/{ID}/images',
              pathVariables: this.args.pathArgs,
              headers: {
                  ...methodArgs?.headers
              },
              queryParams: methodArgs?.queryArgs,
              body: methodArgs?.body,
           },
           this.args.apiRequestExecutor
       )
    }
    

}
