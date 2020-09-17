import { flatten, mapObjIndexed, values } from 'ramda';

interface CdkContext {
    [prop: string]: string
}

export interface StackOptions {
    readonly context?: CdkContext;
}

interface Stack {
    Resources?: any;
    Outputs?: any;
    Conditions?: any;
}

export const argsFromContext = (value: string, key: string): [string, string] => ['--context', `${key}=${value}`]

export const synthesizeCdkStack = (spawnSync: any) => ({ context = {} }: StackOptions = {}): Stack => {
    const contextArgs: string[] = flatten(values(mapObjIndexed(argsFromContext, context)));
    const synthesizeArgs: string[] = ['synthesize', '--json', ...contextArgs];
    const child = spawnSync('./node_modules/.bin/cdk', synthesizeArgs)
    const template = child.stdout;
    return JSON.parse(template)
}
