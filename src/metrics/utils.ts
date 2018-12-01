export function processSQLLimitOffset(query: string, limit: number, offset: number): string {
  let res;
  let relim = RegExp(/limit/ig);
  let reoff = RegExp(/offset/ig);

  if(relim.test(query)) {
    res = query.replace(/limit [0-9]+/ig, `LIMIT ${limit}`);
  } else {
    res = query + ` LIMIT ${limit}`;
  }

  if(reoff.test(query)) {
    res = res.replace(/offset [0-9]+/ig, `OFFSET ${offset}`);
  } else {
    res += ` OFFSET ${offset}`;
  }

  return res;
}
