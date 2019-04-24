import { UserRecord } from 'firebase-functions/lib/providers/auth';
import { createId } from '../../+utils/createId';
import { getFirestore } from '../../+utils/firestore';
import { Organization } from '../../../../../shared/types/organization.interface';
import { User } from '../../../../../shared/types/user.interface';
import { UserConfig } from '../../../../../shared/types/userConfig.interface';
import { CollectionNames } from '../../../../../shared/values/collectionNames.map';
import { Permission } from '@shared/types/permission.interface';
import { Roles } from '../../../../../shared/values/roles.array';

const firestore = getFirestore();

export async function createUserStructureInDB(userRecord: UserRecord): Promise<User> {
  try {
    const userId = userRecord.uid;
    const organizationId = createId();
    const userPath = `${CollectionNames.users}/${userId}`;
    const userRef = firestore.doc(userPath);
    const user: User = {
      email: userRecord.email,
      displayName: userRecord.displayName || null,
      photoURL: userRecord.photoURL || null,
      createdAt: new Date(),
    };
    const userConfigPath = `${CollectionNames.usersConfigs}/${userId}`;
    const userConfigRef = firestore.doc(userConfigPath);
    const userConfig: UserConfig = { activeOrganizationId: organizationId, activeLocationId: null };

    const organizationsSnapshot = await firestore
      .collection(`${CollectionNames.organizations}`)
      .where('isDeleted', '==', false)
      .where('admins', 'array-contains', userId)
      .get();
    const organizations = organizationsSnapshot.docs.map(doc => doc.data()) as Organization[];

    let organizationRef, organization: Organization, permissionRef, permission: Permission;
    if (organizations.length) {
      organization = organizations[0];
    } else {
      const organizationPath = `${CollectionNames.organizations}/${organizationId}`;
      organizationRef = firestore.doc(organizationPath);
      organization = {
        name: 'Default organization',
        details: 'Default organization',
        ownerId: userId,
        admins: [userId],
        availableForUsers: [userId],
        timezone: 'Singapore',
        createdAt: new Date(),
        createdBy: userId,
        isDeleted: false,
      };
      const permissionPath = `${CollectionNames.permissions}/${userId}_${organizationId}`;
      permissionRef = firestore.doc(permissionPath);
      permission = {
        userId,
        displayName: user.displayName || null,
        jobTitle: null,
        email: user.email,
        organizationId,
        role: Roles.owner.slug,
        byLocations: [],
        invitedAt: user.createdAt,
        invitedBy: userId,
      };
    }

    console.log('createUserStructureInDB - Working on user:', user);

    const batch = firestore.batch();
    batch.set(userRef, user);
    batch.set(userConfigRef, userConfig);
    if (organizationRef) {
      batch.set(organizationRef, organization);
      batch.set(permissionRef, permission);
    }
    await batch.commit();
    const result = {
      user: { id: userId, ...user },
      userConfig: { id: userId, userConfig },
      organization: { id: userId, organization },
    };
    console.log('createUserStructureInDB - User structure was created', result);
    return result.user;
  } catch (error) {
    console.error('createUserStructureInDB', error);
    throw new Error(error);
  }
}
