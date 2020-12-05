import * as R from 'ramda';
import * as Serverless from 'serverless';
import { spawnSync } from 'child_process';
import { synthesizeCdkStack, StackOptions } from './helpers/cdk';
import { mergeTemplates } from './helpers/template';

interface hook {
    (): Promise<void> | void;
}

interface hooks {
    [propName: string]: hook
}

interface Synthesizer {
    (cdkResourceOptions: StackOptions): any;
}

class ServerlessCdkPlugin {
    serverless: Serverless;
    hooks: hooks;
    options: Serverless.Options;
    synthesizer: Synthesizer;

    constructor(serverless: Serverless, options: Serverless.Options, { synthesizer = synthesizeCdkStack(spawnSync) }: { synthesizer?: Synthesizer } = {}) {
        this.serverless = serverless;
        this.options = options;
        this.synthesizer = synthesizer;
        this.hooks = {
            'after:aws:package:finalize:mergeCustomProviderResources': this.mergeCdkResources,
        };
    }

    log = (message: string) => {
        this.serverless.cli.log(`[serverless-cdk-plugin] ${message}`)
    }

    mergeCdkResources: hook = () => {
        const compiledCloudFormationTemplate = this.serverless.service.provider.compiledCloudFormationTemplate;
        
        const customCdkResources: StackOptions = R.pathOr({}, ['service', 'custom', 'CdkResources'], this.serverless);
        // compile cdk resources
        this.log('Compiling CDK Resources');
        const compiledCdkTemplate = this.synthesizer(customCdkResources);
        
        // merge into current resources
        this.log('Merging CDK Resources into serverless cloudformation stack');
        const mergedTemplate = mergeTemplates(compiledCloudFormationTemplate, compiledCdkTemplate);
        this.serverless.service.provider.compiledCloudFormationTemplate = mergedTemplate;
    }
}

export default ServerlessCdkPlugin;

