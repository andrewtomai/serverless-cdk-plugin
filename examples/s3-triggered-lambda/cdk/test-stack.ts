import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';

class MyStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        // create a new s3 bucket
        const stage = this.node.tryGetContext('stage');
        const bucket = new s3.Bucket(this, 'MyS3Bucket', {
            bucketName: stage + '-randyboi'
        });
        

        // override the logical cloudformation id so that we can reference the bucket
        // in our serverless.yml file
        const cfnBucket = bucket.node.defaultChild as s3.CfnBucket;
        cfnBucket.overrideLogicalId('MyBucket');
    }
}

const app = new cdk.App();

new MyStack(app, 'MyStack')
