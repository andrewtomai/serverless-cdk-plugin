import * as child_process from 'child_process';
import * as R from 'ramda';
import * as Types from '../types';

export const argsFromContext = (value: string, key: string): [string, string] => ['--context', `${key}=${value}`]

export const synthesize = (spawnSync: any = child_process.spawnSync) => (context: Types.Context): Types.Stack => {
    const contextArgs: string[] = R.flatten(R.values(R.mapObjIndexed(argsFromContext, context)));
    const synthesizeArgs: string[] = ['synthesize', '--json', ...contextArgs];
    const child = spawnSync('./node_modules/.bin/cdk', synthesizeArgs)
    const template = child.stdout;
    return JSON.parse(template)
}
