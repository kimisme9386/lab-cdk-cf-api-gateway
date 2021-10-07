import * as lambda from '@aws-cdk/aws-lambda';
import { App, Construct, Stack, StackProps, CfnOutput } from '@aws-cdk/core';
import { ApiGatewayToLambda } from '@aws-solutions-constructs/aws-apigateway-lambda';
import { CloudFrontToApiGatewayToLambda } from '@aws-solutions-constructs/aws-cloudfront-apigateway-lambda';

export class ServerlessStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const cfToApiGW = new CloudFrontToApiGatewayToLambda(this, 'test-cloudfront-apigateway-lambda', {
      lambdaFunctionProps: {
        code: lambda.Code.fromAsset(`${__dirname}/lambda`),
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: 'index.handler',
      },
    });

    new CfnOutput(this, 'CloudFrontURL', {
      value: cfToApiGW.cloudFrontWebDistribution.distributionDomainName,
    });

    new CfnOutput(this, 'ApiGWURL', {
      value: cfToApiGW.apiGateway.url,
    });
  }
}

export class ServerlessOnlyApiGatewayStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    new ApiGatewayToLambda(this, 'ApiGatewayToLambdaPattern', {
      lambdaFunctionProps: {
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: 'index.handler',
        code: lambda.Code.fromAsset(`${__dirname}/lambda-only-api-gateway`),
      },
    });
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new ServerlessStack(app, 'ServerlessStack', { env: devEnv });
new ServerlessOnlyApiGatewayStack(app, 'ServerlessOnlyApiGatewayStack', { env: devEnv });

app.synth();
