import { adapter, initialRepositoryState } from '../states/repository.state';
import * as RepositoryAction from '../actions/repository.actions';
import { createReducer, on } from '@ngrx/store';
import { LoadingState } from '../../domain/enum/loading-state.enum';

export const repositoryReducer = createReducer(
  initialRepositoryState,
  on(RepositoryAction.loadRecommendedRepositories, state => {
    if (state.recommendedLoaded === LoadingState.LOADED) {
      return { ...state };
    }
    return { ...state, recommendedLoaded: LoadingState.LOADING };
  }),
  on(
    RepositoryAction.recommendedRepositoriesLoaded,
    (state, { repositories }) => ({
      ...state,
      recommendedLoaded: LoadingState.LOADED,
      recommended: repositories,
    })
  ),
  on(RepositoryAction.failedToLoadRecommendedRepositories, state => ({
    ...state,
    recommendedLoaded: LoadingState.FAILED,
  })),
  on(RepositoryAction.loadAllRepositories, (state, { skipIfPresent }) => {
    return skipIfPresent && state.loaded !== LoadingState.NOT_LOADED
      ? { ...state }
      : {
          ...state,
          filters: {},
          loaded: LoadingState.LOADING,
        };
  }),
  on(RepositoryAction.repositoriesLoaded, (state, { repositories }) => {
    return adapter.setAll(repositories, {
      ...state,
      loaded: LoadingState.LOADED,
    });
  }),
  on(RepositoryAction.failedToLoadRepositories, state => ({
    ...state,
    loaded: LoadingState.FAILED,
  })),
  on(RepositoryAction.updateRepository, (state, { update }) => {
    return adapter.updateOne(update, state);
  }),
  on(RepositoryAction.setRepositoryFilter, (state, { filter }) => ({
    ...state,
    filters: filter,
    loaded: LoadingState.LOADING,
  }))
);
