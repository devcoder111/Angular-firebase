export interface AuthUser {
  isAdmin?: boolean;
  uid: string;
  email: string;
  photoURL: string;
  emailVerified?: boolean;
  displayName: string;
  testTags?: string[];
  password?: string;
}

export const defaultPasswordForUsers = '12345678';
const defaultAvatarForTestUsers = 'https://cdn3.iconfinder.com/data/icons/avatars-9/145/Avatar_Robot-512.png';
export const AuthUsersArray: AuthUser[] = [
  {
    isAdmin: true,
    uid: '00000001',
    email: 'michael@michaeldistel.com',
    emailVerified: true,
    password: defaultPasswordForUsers,
    photoURL: 'https://lh5.googleusercontent.com/-vIJdKmrB7_8/AAAAAAAAAAI/AAAAAAAEyjQ/_MdzFyQWXzw/photo.jpg',
    displayName: 'Michael Distel',
  },
  {
    uid: '00000002',
    email: 'cherry.seniorqa@gmail.com',
    emailVerified: true,
    password: defaultPasswordForUsers,
    photoURL: 'https://lh6.googleusercontent.com/-NafXiNz-1yk/AAAAAAAAAAI/AAAAAAAAAAs/iJBC_bsV4YQ/photo.jpg',
    displayName: 'Cherry',
  },
  {
    isAdmin: true,
    uid: '00000003',
    email: '2spy4x@gmail.com',
    emailVerified: true,
    password: defaultPasswordForUsers,
    photoURL:
      'https://lh3.googleusercontent.com/-Lu0l3yYtJdI/AAAAAAAAAAI/AAAAAAAAAAA/AAnnY7pfgyC_AlqFcfxHuvi-qxcd1XMbWg/s64-c-mo/photo.jpg',
    displayName: 'Anton Shubin',
  },
  {
    isAdmin: true,
    uid: '00000004',
    email: '2urnix@gmail.com',
    emailVerified: true,
    password: defaultPasswordForUsers,
    photoURL: 'https://lh4.googleusercontent.com/-xAiXjHaMDYQ/AAAAAAAAAAI/AAAAAAAAAQI/CXCy6SXIAxc/photo.jpg',
    displayName: 'Artem I',
  },
  {
    uid: '00000006',
    email: 'noorayemon@gmail.com',
    emailVerified: true,
    password: defaultPasswordForUsers,
    photoURL:
      'https://odesk-prod-portraits.s3.amazonaws.com/Users:evolutions:PortraitUrl_100?AWSAccessKeyId=AKIAIKIUKM3HBSWUGCNQ&Expires=2147483647&Signature=JfaGPKFqehKEdVSDCFAlWpRLjKk%3D',
    displayName: 'Nooray Yemon',
  },
  {
    uid: '00000007',
    email: 'groxotsasha@gmail.com',
    emailVerified: true,
    password: defaultPasswordForUsers,
    photoURL: 'https://pp.userapi.com/c322131/v322131399/6560/hwgrfegJ0A4.jpg',
    displayName: 'Alex Groshev',
  },
  {
    uid: '00000008',
    email: 'andrabasuki@gmail.com',
    emailVerified: true,
    password: defaultPasswordForUsers,
    photoURL: 'https://lvlt.thesims3.com/sims3_asset/sims3_asset/thumb/shard000/000/033/976/28/original.jpg',
    displayName: 'Andra Basuki',
  },

  // Test users
  {
    uid: '00000009',
    email: 'test1@gmail.com',
    emailVerified: true,
    photoURL: defaultAvatarForTestUsers,
    displayName: 'Test User 1',
    password: defaultPasswordForUsers,
    testTags: ['noOrganizations'],
  },
  {
    uid: '00000010',
    email: 'test2@gmail.com',
    emailVerified: true,
    photoURL: defaultAvatarForTestUsers,
    displayName: 'Test User 2 (O1A)',
    password: defaultPasswordForUsers,
    testTags: ['ORGANIZATION1Admin', 'ORGANIZATION1', 'LOCATION1'],
  },
  {
    uid: '00000011',
    email: 'test3@gmail.com',
    emailVerified: true,
    photoURL: defaultAvatarForTestUsers,
    displayName: 'Test User 3 (O2U_L2)',
    password: defaultPasswordForUsers,
    testTags: ['ORGANIZATION2User', 'ORGANIZATION2', 'LOCATION2'],
  },

  {
    uid: '00000012',
    email: 'test4@gmail.com',
    emailVerified: true,
    photoURL: defaultAvatarForTestUsers,
    displayName: 'Test User 4 (O2U_L3)',
    password: defaultPasswordForUsers,
    testTags: ['ORGANIZATION2User2', 'ORGANIZATION2', 'LOCATION3'],
  },
  {
    uid: '00000013',
    email: 'test5@gmail.com',
    emailVerified: true,
    photoURL: defaultAvatarForTestUsers,
    displayName: 'Test User 5 (O2A)',
    password: defaultPasswordForUsers,
    testTags: ['ORGANIZATION2Admin', 'ORGANIZATION2', 'LOCATION2', 'LOCATION3'],
  },
  {
    uid: '00000014',
    email: 'test6@gmail.com',
    emailVerified: true,
    photoURL: defaultAvatarForTestUsers,
    displayName: 'Test User 6 (O1U, O2O)',
    password: defaultPasswordForUsers,
    testTags: ['ORGANIZATION2Owner', 'ORGANIZATION2', 'LOCATION2', 'LOCATION3'],
  },
];
