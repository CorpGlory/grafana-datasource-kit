export function processSQLLimitOffset(sql: string, limit: number, offset: number): string {
  let res;
  let relim = RegExp(/limit/ig);
  let reoff = RegExp(/offset/ig);

  if(relim.test(sql)) {
    res = sql.replace(/limit [0-9]+/ig, `LIMIT ${limit}`);
  } else {
    res = sql + ` LIMIT ${limit}`;
  }

  if(reoff.test(sql)) {
    res = res.replace(/offset [0-9]+/ig, `OFFSET ${offset}`);
  } else {
    res += ` OFFSET ${offset}`;
  }

  return res;
}
