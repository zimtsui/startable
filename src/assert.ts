import chai = require('chai');
type Assert = (v: any, m?: string) => asserts v;
export const assert: Assert = chai.assert;
