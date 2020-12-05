import * as sinon from 'sinon'
import * as cdk from '../lib/helpers/synthesizers/cli-synthesizer';
describe('Scenario: I want to use the Cli Synthesizer', () => {
    describe('Given: a key-value pair', () => {
        describe('When: I generate the cdk command line arguments', () => {
            test('Then I get back an array of arguments', () => {
                const actual = cdk.argsFromContext('there', 'hiya')
                expect(actual).toStrictEqual(['--context', 'hiya=there'])
            })
        })
    })
    describe('Given a stub for spawnSync and some cdk context', () => {
        const spawnSyncStub = sinon.stub().returns({
            stdout: JSON.stringify({ hello: 'world' })
        });
        const context = { hiya: 'there' }
        describe('When I synthesize the cdk stack', () => {
            const actual = cdk.synthesize(spawnSyncStub)(context);
            test('Then I get back the expected stack', () => {
                expect(actual).toStrictEqual({ hello: 'world' });
            })
            test('And the spawn function was called with specific arguments', () => {
                expect(spawnSyncStub.calledOnce).toBeTruthy();
                expect(spawnSyncStub.withArgs(['./node_modules/.bin/cdk', ['synthesize', '--json', '--context', 'hiya=there']]))
            })
        })
    })
})
