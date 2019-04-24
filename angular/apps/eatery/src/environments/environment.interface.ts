export interface Environment {
  type: EnvironmentType;
  baseUrl: string;
  firebase: {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
  };
  sentry?: string;
  logRocket?: string;
  release?: string;
}

export enum EnvironmentType {
  prod = 'prod',
  dev = 'dev',
  test = 'test'
}
