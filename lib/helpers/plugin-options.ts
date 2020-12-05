import * as Serverless from 'serverless';
import * as R from 'ramda';
import * as Types from './types';
import * as CliSynthesizer from './synthesizers/cli-synthesizer';

const pickPluginOptions = (serverless: Serverless): Types.PluginOptions => R.pathOr({}, ['service', 'custom', 'CdkResources'], serverless);

export const getSynthesizeStrategy = (serverless: Serverless): Types.SynthesizeStrategy => R.propOr(Types.SynthesizeStrategy.cli, 'synthesizeStrategy', pickPluginOptions(serverless));

// Given an instance of serverless, return the correct
export const getSynthesizer = (serverless: Serverless): Types.Synthesizer => {
    const strategy = getSynthesizeStrategy(serverless);
    return CliSynthesizer.synthesize;
}

export const getContext = (serverless: Serverless): Types.Context => R.propOr({}, 'context', pickPluginOptions(serverless));
