import * as sinon from 'sinon'
import * as cdk from '../lib/helpers/cdk';
describe('Cdk Helpers', () => {
    test('Can generate an array of args from a context object', () => {
        const actual = cdk.argsFromContext('there', 'hiya')
        expect(actual).toStrictEqual(['--context', 'hiya=there'])
    })

    test('Can correctly spawn a child process to synthesize a cdk stack', () => {
        const spawnSyncStub = sinon.stub().returns({
            stdout: JSON.stringify({ hello: 'world' })
        });
        const actual = cdk.synthesizeCdkStack(spawnSyncStub)({ context: { hiya: 'there' }})

        expect(actual).toStrictEqual({ hello: 'world' });
        expect(spawnSyncStub.calledOnce).toBeTruthy();
        expect(spawnSyncStub.withArgs(['./node_modules/.bin/cdk', ['synthesize', '--json', '--context', 'hiya=there']]))
    })
})
