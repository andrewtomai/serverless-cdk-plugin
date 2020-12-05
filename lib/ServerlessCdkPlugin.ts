import * as Serverless from 'serverless';
import * as Types from './helpers/types';
import * as PluginOptions from './helpers/plugin-options';
import { mergeTemplates } from './helpers/template';

class ServerlessCdkPlugin {
    serverless: Serverless;
    hooks: Types.hooks;
    options: Serverless.Options;
    synthesizer: Types.Synthesizer;

    constructor(serverless: Serverless, options: Serverless.Options, { synthesizer }: { synthesizer?: Types.Synthesizer } = {}) {
        this.serverless = serverless;
        this.options = options;
        this.synthesizer = synthesizer || PluginOptions.getSynthesizer(this.serverless);
        this.hooks = {
            'after:aws:package:finalize:mergeCustomProviderResources': this.mergeCdkResources,
        };
    }

    log = (message: string) => {
        this.serverless.cli.log(`[serverless-cdk-plugin] ${message}`)
    }

    mergeCdkResources: Types.hook = () => {
        const compiledCloudFormationTemplate = this.serverless.service.provider.compiledCloudFormationTemplate;
        const context = PluginOptions.getContext(this.serverless);
        // compile cdk resources
        this.log('Compiling CDK Resources');
        const compiledCdkTemplate = this.synthesizer(context);
        
        // merge into current resources
        this.log('Merging CDK Resources into serverless cloudformation stack');
        const mergedTemplate = mergeTemplates(compiledCloudFormationTemplate, compiledCdkTemplate);
        this.serverless.service.provider.compiledCloudFormationTemplate = mergedTemplate;
    }
}

export default ServerlessCdkPlugin;

