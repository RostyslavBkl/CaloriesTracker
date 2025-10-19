type GraphQLResult<T> = { data?: T; errors?: Array<{ message: string }> };

const GRAPHQL_URL = '/graphql';

async function gql<T>(query: string, variables?: unknown): Promise<GraphQLResult<T>> {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

export async function loginApi(email: string, password: string) {
  const query = `
    mutation ($request: LoginInput!) {
      login(request: $request) {
        success
        message
        token
        user { id email }
      }
    }`;
  return gql<{ login: import('./Types').AuthResponse }>(query, { request: { email, password } });
}

export async function registerApi(email: string, password: string) {
  const query = `
    mutation ($request: RegistrationInput!) {
      register(request: $request) {
        success
        message
        token
        user { id email }
      }
    }`;
  return gql<{ register: import('./Types').AuthResponse }>(query, { request: { email, password } });
}

export async function meApi() {
  const query = `
    query { 
    me
    { id email }
     }`;
  return gql<{ me: import('./Types').User }>(query);
}

export async function logoutApi() {
  const query = `mutation { logout }`;
  return gql<{ logout: boolean }>(query);
}
