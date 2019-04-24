import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CoreState } from './core.state';
import { FEATURE_NAME } from './module';
import { AuthState } from './types/authState.enum';
import { Roles } from '@shared/values/roles.array';

export const getCoreState = createFeatureSelector<CoreState>(FEATURE_NAME);
export const getUser = createSelector(getCoreState, state => state.user);
export const getAuthState = createSelector(getCoreState, state => state.authState);
export const getAuthError = createSelector(getCoreState, state => state.authError);
export const getEmailActionCode = createSelector(getCoreState, state => state.emailActionCode);
export const getEmailActionEmail = createSelector(getCoreState, state => state.emailActionEmail);
export const getResendDate = createSelector(getCoreState, state => state.resendEmailDate);

export const getUserCustomFields = createSelector(getCoreState, state => state.userCustomFields);
export const getUserConfig = createSelector(getCoreState, state => state.userConfig);

export const getActiveOrganizationId = createSelector(
  getUserConfig,
  userConfig => (userConfig ? userConfig.activeOrganizationId : null),
);
export const getActiveLocationId = createSelector(
  getUserConfig,
  userConfig => (userConfig ? userConfig.activeLocationId : null),
);

export const getOrganizationItems = createSelector(getCoreState, state => state.organizations.items);
export const getOrganizationIds = createSelector(getCoreState, state => state.organizations.ids);
export const getOrganizations = createSelector(getOrganizationItems, getOrganizationIds, (items, ids) =>
  ids.map(id => items[id]),
);

export const getPermissionItems = createSelector(getCoreState, state => state.permissions.items);
export const getPermissionIds = createSelector(getCoreState, state => state.permissions.ids);
export const getPermissions = createSelector(getPermissionItems, getPermissionIds, (items, ids) =>
  ids.map(id => items[id]),
);

export const getActiveOrganizationPermission = createSelector(
  getPermissions,
  getActiveOrganizationId,
  (permissions, organizationId) => permissions.find(permission => permission.organizationId === organizationId),
);

export const getActiveOrganizationRole = createSelector(
  getActiveOrganizationPermission,
  permission => (permission && permission.role) || null,
);

export const isAdminOrOwner = createSelector(getActiveOrganizationRole, role =>
  [Roles.admin.slug, Roles.owner.slug].includes(role),
);

export const isOwner = createSelector(getActiveOrganizationRole, role => Roles.owner.slug === role);

export const getActivePosition = createSelector(getUserConfig, userConfig => {
  if (userConfig && userConfig.activeLocationId != null) {
    return { type: 'location', id: userConfig.activeLocationId };
  } else if (userConfig && userConfig.activeOrganizationId != null) {
    return { type: 'organization', id: userConfig.activeOrganizationId };
  } else {
    return { type: null, id: null };
  }
});

export const isActivePositionOrganization = createSelector(
  getActivePosition,
  position => position.type === 'organization',
);

export const isActivePositionLocation = createSelector(getActivePosition, position => position.type === 'location');

export const getLocationsState = createSelector(getCoreState, state => state.locations);

export const getLocationsListIds = createSelector(getLocationsState, state => state.ids);
export const getLocationsListItemsMap = createSelector(getLocationsState, state => state.items);
export const getLocationsListIsLoading = createSelector(getLocationsState, state => state.isLoading);
export const getLocationsListLoadError = createSelector(getLocationsState, state => state.loadError);

export const getAllLocations = createSelector(getLocationsListItemsMap, getLocationsListIds, (items, ids) =>
  ids.map(id => items[id]),
);
export const getLocationsInActiveOrganization = createSelector(
  getLocationsListItemsMap,
  getLocationsListIds,
  getActiveOrganizationId,
  (items, ids, organizationId) => ids.map(id => items[id]).filter(item => item.organizationId === organizationId),
);
export const getLocationsActive = createSelector(
  getLocationsListItemsMap,
  getActiveLocationId,
  (items, activeItemId) => (activeItemId ? items[activeItemId] : null),
);

export const isNotAuthenticated = createSelector(getAuthState, authState => authState === AuthState.notAuthenticated);
export const isAuthorized = createSelector(getAuthState, authState => authState === AuthState.authorized);
