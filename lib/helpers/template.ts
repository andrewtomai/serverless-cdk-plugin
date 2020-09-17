import * as R from 'ramda'

export const mergeTemplates = (...templates: any[]): any => R.reduce(R.mergeDeepLeft, {} as any, templates);