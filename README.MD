# Serverless CDK Plugin

<p>
  <a href="https://www.serverless.com">
    <img src="http://public.serverless.com/badges/v3.svg">
  </a>
  <a href="https://www.npmjs.com/package/serverless-cdk-plugin">
    <img src="https://img.shields.io/npm/v/serverless-cdk-plugin.svg?style=flat-square">
  </a>
  <img src="https://img.shields.io/node/v/serverless-cdk-plugin.svg?style=flat-square">
  <a href="https://github.com/serverless/serverless">
    <img src="https://img.shields.io/npm/dependency-version/serverless-cdk-plugin/peer/serverless.svg?style=flat-square">
  </a>
  <a href="https://github.com/serverless/serverless">
    <img src="https://img.shields.io/npm/dependency-version/serverless-cdk-plugin/peer/aws-cdk.svg?style=flat-square">
  </a>
  <img src="https://img.shields.io/npm/l/serverless-cdk-plugin.svg?style=flat-square">
  <a href="#contributing">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square">
  </a>
</p>

Currently, It's very hard to describe complex AWS Resources/Infrastructure in your `serverless.yml`.  This plugin allows you to combine your `serverless.yml` with complex infrastructure stacks you define using the [AWS Cloud Development Kit](https://aws.amazon.com/cdk/).


## Installing
Add this package to your project's development dependencies:
```bash
$ yarn add --dev serverless-cdk-plugin
```

```bash
$ npm install --save-dev serverless-cdk-plugin
```

After installing, add this plugin to your `serverless.yml`:
```yml
plugins:
  - serverless-cdk-plugin
```

## Usage
This plugin works by spawning the cdk `synthesize` command in the current working directory to synthesize your cdk application. The synthesized cloudformation stack is then merged into the serverless cloudformation stack before it is deployed.

### CDK Application Definition
There are currently two restrictions on how you define your aws-cdk stack so that it can be used with this plugin:
1. you must define the cdk `app` in the `cdk.json` file
2. your cdk `app` must only create one stack. 


### Passing runtime `context` to your aws-cdk stack
You can pass any amount of [runtime context](https://docs.aws.amazon.com/cdk/latest/guide/context.html) to your aws-cdk stack by adding the following to your `serverless.yml`:

```yml
...
custom:
  CdkResources:
     context:
      stage: ${self:provider.stage}
      myContext: someContextValue
```

## Examples
Check out the examples directory to see example usage patterns.


## Current Known Limitations
1. This plugin assumes that your cdk-app only defines one cloudformation stack 

2. This plugin will not build/bundle any artifacts with the serverless project to be deployed (for example, you cannot specify a lambda function in your cdk stack)

3. This plugin will not attempt to resolve Resource Logical Id Naming conflicts




