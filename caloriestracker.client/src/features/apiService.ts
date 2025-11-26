import { from, Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

type GraphQLResult<T> = { data?: T; errors?: Array<{ message: string }> };

const GRAPHQL_URL = "/graphql";

function gql<T>(query: string, variables?: Record<string, any>): Observable<T> {
  // from() convert promise to observable
  return from(
    (async () => {
      const response = await fetch(GRAPHQL_URL, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query, // graphQL query
          variables, // params
        }),
      });

      // check http status
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // парсимо Json
      const result: GraphQLResult<T> = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message || "GraphQL error");
      }

      if (!result.data) {
        throw new Error("No data in GraphQL response");
      }

      return result.data;
    })()
  ).pipe(
    catchError((error) =>
      throwError(() => new Error(error.message || "GraphQL request failed"))
    )
  );
}

export default gql;
