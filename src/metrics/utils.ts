import * as _ from 'lodash';

export function processSQLLimitOffset(sql: string, limit: number, offset: number): string {
  let splits = sql.split(';');
  if(splits.length > 1 && splits[1] !== '' ) {
    throw Error('multiple metrics currently not supported');
  }
  sql = splits[0]; // removes ";" from EOL

  let relim = /limit [0-9]+/ig;
  let reoff = /offset [0-9]+/ig;

  let limIdx = ensureParentheses(relim, sql);
  if(limIdx.index !== -1) {
    sql = `${sql.slice(0, limIdx.index)}LIMIT ${limit}${sql.slice(limIdx.index + limIdx.length)}`;
  } else {
    sql += ` LIMIT ${limit}`;
  }

  let offIdx = ensureParentheses(reoff, sql);
  if(offIdx.index !== -1) {
    sql = `${sql.slice(0, offIdx.index)}OFFSET ${offset}${sql.slice(offIdx.index + offIdx.length)}`;
  } else {
    sql += ` OFFSET ${offset}`;
  }

  if(splits.length === 2) {
    sql += ';';
  }
  return sql;
}

function ensureParentheses(regex: RegExp, str: string): {index: number, length: number} {
  let occurence: RegExpExecArray;
  while((occurence = regex.exec(str)) !== null) {
    let parts = [str.slice(0, occurence.index), str.slice(occurence.index + occurence[0].length)];
    let pairing = parts.map(p => (p.match(/\(/g) || []).length === (p.match(/\)/g) || []).length);
    if(pairing.every(i => i === true)) {
      return { index: occurence.index, length: occurence[0].length };
    }
  }
  return { index: -1, length: 0 };
}
