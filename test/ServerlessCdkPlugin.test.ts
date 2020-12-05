import * as Serverless from 'serverless';
import * as sinon from 'sinon'
import ServerlessCdkPlugin from '../lib/ServerlessCdkPlugin';

const serverlessLogger = sinon.stub()
const synthesizerFake = sinon.fake(() => ({ Resources: cdkResource }))
const cdkResource = { cdk: 'resource' }
const serverlessResource = { serverless: 'resource' }
const serverless: Serverless = {
    service: {
        provider: {
            compiledCloudFormationTemplate: { Resources: serverlessResource }
        }
    },
    cli: {
        log: serverlessLogger
    }
} as any

const options = { stage: 'test', region: 'test' };
describe('Given I\'ve constructed an instance of the Serverless Cdk Plugin ', () => {
    const plugin = new ServerlessCdkPlugin(serverless, options, { synthesizer: synthesizerFake });

    describe('When the constructor sets the hooks for the plugin', () => {
        test('Then it hooks into package finalization step of merging in customer provider resources', () => {
            expect(plugin).toHaveProperty('hooks');
            expect(plugin.hooks).toHaveProperty('after:aws:package:finalize:mergeCustomProviderResources');
        })
    })

    describe('When I merge cdk resources into the serverless generated resources', () => {
        plugin.mergeCdkResources();
        test('Then my cdk stack was synthesized', () => {
            expect(synthesizerFake.calledOnce).toBeTruthy();
        })

        test('And I\'ve logged information about the process', () => {
            expect(serverlessLogger.called).toBeTruthy();
        })

        test('And the new compiled cloudformation template includes my custom defined resources', () => {
            expect(plugin.serverless.service.provider.compiledCloudFormationTemplate).toEqual({
                Resources: {
                    ...cdkResource,
                    ...serverlessResource,
                }
            })
        })
    })
})