// import your npm packages
import ApolloClient from 'apollo-boost';
import { GetRepos, AddStar, RemoveStar } from './operations';

// keys for actiontypes
export const ActionTypes = {
  FETCH_REPOS: 'FETCH_REPOS',
  ERROR_SET: 'ERROR_SET',
  STAR_CHANGE: 'STAR_CHANGE',
};

const GITHUB_API = 'https://api.github.com/graphql';
const API_KEY = '3076dcb9e09c959b9aa47897430323822b3a996f';

const client = new ApolloClient({
  uri: GITHUB_API,
  headers: { authorization: `bearer ${API_KEY}` },
});

export function fetchRepos(query) {
  return (dispatch) => {
    client.query({
      query: GetRepos,
      variables: {
        queryString: query,
      },
      fetchPolicy: 'no-cache',
    })
      .then((response) => {
        const repos = response.data.search.edges[0].node.repositories.edges.map(repo => repo.node);
        dispatch({ type: ActionTypes.FETCH_REPOS, payload: repos });
      })
      .catch((error) => {
        dispatch({ type: ActionTypes.ERROR_SET, error });
      });
  };
}

export function addStar(repoID, searchTerm) {
  return (dispatch) => {
    client.mutate({
      mutation: AddStar,
      variables: {
        id: repoID,
      },
      fetchPolicy: 'no-cache',
    })
      .then((res) => {
        dispatch(fetchRepos(searchTerm));
      })
      .catch((error) => {
        dispatch({ type: ActionTypes.ERROR_SET, error });
      });
  };
}

export function removeStar(repoID, searchTerm) {
  return (dispatch) => {
    client.mutate({
      mutation: RemoveStar,
      variables: {
        id: repoID,
      },
      fetchPolicy: 'no-cache',
    })
      .then((response) => {
        dispatch(fetchRepos(searchTerm));
      })
      .catch((error) => {
        dispatch({ type: ActionTypes.ERROR_SET, error });
      });
  };
}
