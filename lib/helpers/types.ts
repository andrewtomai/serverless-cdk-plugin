// The context to pass to the synthesizer
export interface Context {
    [prop: string]: string
}

// Currently, there are two supported strategies: use the cdk synth cli, or programatically synthesize
export enum SynthesizeStrategy {
    cli,
    programatic
}

// This is the function that takes in the plugin options, and returns a synthesized cdk stack
export interface Synthesizer {
    (context: Context): any;
}

// This is the interface describing the configuration in the serverless.yml file
export interface PluginOptions {
    readonly synthesizeStrategy?: SynthesizeStrategy;
    readonly context?: Context;
}

export interface Stack {
    Resources?: any;
    Outputs?: any;
    Conditions?: any;
}

export interface hook {
    (): Promise<void> | void;
}

export interface hooks {
    [propName: string]: hook
}


