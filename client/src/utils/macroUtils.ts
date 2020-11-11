
import {escapeRegex, regex, splitOnce, trims, trimLines} from "./util";

export function parseMacro(text: string, macroTexts: string, varsInjected = {}) {
  const macroses: any = [];

  const multilineMacroses: any = [];
  macroTexts = macroTexts.replace(/========\n([^]*?)========\n([^]*?)========\n/g, (_, mL, mR) => {
    multilineMacroses.push(parseMultilineMacro(mL, mR, varsInjected));
    return '@@@========@@@\n';
  });

  const macroLines = trims(macroTexts.split('\n'));
  for (const macroLine of macroLines) {
    if (macroLine === '@@@========@@@') {
    macroses.push(multilineMacroses.shift());
    }
    if (macroLine.indexOf('=>') > 0) {
    macroses.push(parseMacroFunction(macroLine, varsInjected));
    }
    if (macroLine.indexOf('=') > 0) {
    macroses.push(parseSingleLineMacro(macroLine, varsInjected));
    }
  }

  for (const macro of macroses) {
    text = macro.replace(text);
  }

  return text;
}

function parseSingleLineMacro(macroText: string, varsInjected: any): any {
    let [ml, mr] = splitOnce(macroText, '=');
    let mlVars: any;
    let replace;
    let prior;

    mlVars = [];
    prior = 0;

    ml = ml.trim();
    ml = escapeRegex(ml);
    ml = ml.replace(/@\w+/g, w => { mlVars.push(w); return '(.+)'; });
    ml = new RegExp(ml, 'g') as any;

    mr = mr.trim();

    if (mlVars.length) {
      replace = (s: string) =>
        s.replace(ml, (m, ...args) => {
          const gs = args.slice(0, args.length - 2);
          const vars: any = {};
          for (const i in gs) {
            vars[mlVars[i]] = gs[i];
          }
          m = mr;
          m = m.replace(/@\w+/g, w => {
            if (varsInjected[w]) {
              return varsInjected[w](vars);
            }
            return vars[w] ? vars[w] : w;
          });
          return m;
        });
    } else {
      replace = (s: string) => s.replace(ml, mr);
    }

    return { ml, mr, mlVars, prior, replace };
}

function parseMacroFunction(macroText: string, varsInjected= {}): any {
  const [fnL, fnR] = splitOnce(macroText, '=>');
  const [fnName, params] = splitOnce(fnL, ' ');
  const paramsLines = trims(splitOnce(params, ','));
  const prior = 1;
  const mRegex = regex(fnName + '\\((.+?)\\)', 'g');
  return {
    fnName,
    params: paramsLines,
    fnBody: fnR,
    mRegex,
    prior,
    replace(s: string) {
      return s.replace(this.mRegex, (_, callParams) => {
        callParams = trims(callParams.split(','));
        let fnBody = this.fnBody;
        for (const i in paramsLines) {
          fnBody = fnBody.replace(regex(paramsLines[i], 'g'), callParams[i]);
        }
        return fnBody;
      });
    }
  };
}

function parseMultilineMacro(mL: string, mR: string, varsInjected: any = {}): any {
    const mLVars: any = [];
    let replace;
    const prior = 2;
    mL = trimLines(mL);
    mL = escapeRegex(mL);
    mL = mL.replace(/@\w+/g, w => { mLVars.push(w); return '([^]+?)'; });
    mL = new RegExp(mL, 'g') as any;

    if (mLVars.length) {
      replace = (s: any) =>
        s.replace(mL, (m: any, ...args: any) => {
          const gs = args.slice(0, args.length - 2);
          m = mR;
          const vars: any = {};
          for (const i in gs) {
            vars[mLVars[i]] = gs[i];
          }
          m = m.replace(/@\w+/g, (w: any) => {
            if (varsInjected[w]) {
              return varsInjected[w](vars);
            }
            return vars[w] ? vars[w] : w;
          });
          return m;
        });
    } else {
      replace = (s: any) => s.replace(mL, mR);
    }
    return { mL, mR, mLVars, prior, replace };
}
