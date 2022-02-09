import {Action} from '@ngrx/store';
import {Repository} from '../../domain/repository';
import {Update} from '@ngrx/entity';

export enum RepositoryActionTypes {
  LoadAllRepositories = '[Repositories] Load all',
  RepositoriesLoaded = '[Repositories] All loaded',
  LoadRepository = '[Repositories] Load one',
  UpdateRepository = '[Repositories] Update one',
  FailedToLoadRepositories = '[Repositories] Failed to load all',
  SetRepositoryFilter = '[Repositories] Set filter'
}

export class LoadAllRepositories implements Action {
  readonly type = RepositoryActionTypes.LoadAllRepositories;
}

export class RepositoriesLoaded implements Action {
  readonly type = RepositoryActionTypes.RepositoriesLoaded;

  constructor(public payload: { repositories: Repository[] }) {
  }
}

export class LoadRepository implements Action {
  readonly type = RepositoryActionTypes.LoadRepository;

  constructor(public payload: { id: string }) {
  }
}

export class UpdateRepository implements Action {
  readonly type = RepositoryActionTypes.UpdateRepository;

  constructor(public payload: { update: Update<Repository> }) {
  }
}

export class FailedToLoadRepositories implements Action {
  readonly type = RepositoryActionTypes.FailedToLoadRepositories;
}

export class SetRepositoryFilter implements Action {
  readonly type = RepositoryActionTypes.SetRepositoryFilter;

  constructor(public payload: { filter: { name: string, value: string [] } }) {
  }
}

export type RepositoryActions =
  LoadAllRepositories
  | RepositoriesLoaded
  | LoadRepository
  | UpdateRepository
  | FailedToLoadRepositories
  | SetRepositoryFilter;
