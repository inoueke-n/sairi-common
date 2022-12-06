import { result, Result, Maybe, maybe } from "folktale";
import * as _ from "lodash";
import * as R from "ramda";

export namespace FolktaleExtension {
  type RR<T> = Result<string[], T>;

  export function concatResults(results: Result<string, any>[]): RR<any> {
    function innerConcatResults(results: RR<any>[]): RR<any> {
      if (R.length(results) === 0) {
        return result.Ok({});
      } else if (R.length(results) === 1) {
        return results[0];
      } else {
        const a = results[0];
        const b = results[1];
        const c = concatResult(a, b);

        const rs = [c, ...results.slice(2)];
        return innerConcatResults(rs);
      }
    }

    const rs = results.map((x) => x.mapError((e: any) => [e]));
    return innerConcatResults(rs);
  }

  export function concatResult<T1, T2>(r1: RR<T1>, r2: RR<T2>): RR<T1 & T2> {
    return r1.matchWith({
      Ok: ({ value: v1 }) => {
        return r2.matchWith({
          Ok: ({ value: v2 }) => {
            return result.Ok(_.assign({}, v1, v2));
          },
          Error: ({ value }) => {
            return result.Error(value);
          },
        });
      },
      Error: ({ value: e1 }) => {
        return r2.matchWith({
          Ok: () => {
            return result.Error(e1);
          },
          Error: ({ value: e2 }) => {
            return result.Error(R.concat(e1, e2));
          },
        });
      },
    });
  }

  export function concatMaybe3<T1, T2, T3>(
    m1: Maybe<T1>,
    m2: Maybe<T2>,
    m3: Maybe<T3>
  ): Maybe<[T1, T2, T3]> {
    const a = concatMaybe(m1, m2);
    const b = concatMaybe(a, m3);
    return b.map((x) => {
      return [x[0][0], x[0][1], x[1]];
    });
  }

  export function concatMaybe<T1, T2>(
    m1: Maybe<T1>,
    m2: Maybe<T2>
  ): Maybe<[T1, T2]> {
    return m1.matchWith({
      Just: ({ value: v1 }) =>
        m2.matchWith({
          Just: ({ value: v2 }) => {
            const obj: [T1, T2] = [v1, v2];
            return maybe.Just(obj);
          },
          Nothing: () => maybe.Nothing(),
        }),
      Nothing: R.always(maybe.Nothing()),
    });
  }
}
