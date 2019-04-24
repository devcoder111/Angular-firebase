import { Injectable } from '@angular/core';
import { User as FirebaseUser } from 'firebase/app';
import * as LogRocket from 'logrocket';
import * as Raven from 'raven-js';
import { environment } from '../../../environments/environment';
import { EnvironmentType } from '../../../environments/environment.interface';

@Injectable()
export class LoggerService {
  private logRocketSessionURL = null;

  constructor() {
    this.debug('LoggerService.constructor()');
    if (environment.type === EnvironmentType.prod && environment.sentry) {
      Raven.config(environment.sentry, {
        release: environment.release || undefined,
      }).install();

      LogRocket.getSessionURL(sessionURL => {
        this.logRocketSessionURL = sessionURL;
      });

      Raven.setDataCallback(data => {
        data.extra.sessionURL = this.logRocketSessionURL;
        return data;
      });

      if (!environment.release) {
        this.error('LoggerService.constructor() - no "environment.release" provided');
      }
    }
  }

  setUser(user: FirebaseUser): void {
    const context = user
      ? {
          id: user.uid,
          email: user.email,
          username: user.displayName,
        }
      : undefined;
    Raven.setUserContext(context);
  }

  debug(message: string, params?: { [key: string]: any }) {
    if (environment.type === EnvironmentType.prod) {
      return; // no output to console on production
    }
    console.log(message, params || '');
  }

  warn(message: string, params?: { [key: string]: any }) {
    console.warn(message, params || '');
    Raven.captureMessage(message, {
      extra: params,
      level: 'warning',
      stacktrace: true,
    });
  }

  error(message: string, error?: Error, params?: { [key: string]: any }) {
    console.error(message, error, params);
    Raven.captureException(message, { extra: { error, params } });
  }
}
