import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import instanceConfigFields from './instanceConfigFields';
import validateInvocation from './validateInvocation';
import getStepStartStates from './getStepStartStates';
import teamStep from './steps/team';
import fetchUsersStep from './steps/fetch-users';
import fetchChannelMembersStep from './steps/fetch-channel-members';
import fetchChannels from './steps/fetch-channels';
import { SlackIntegrationConfig } from './type';
import {
  RuntimeGraphObjectStore,
  executeIntegrationLocally,
  prepareLocalStepCollection,
} from '@jupiterone/integration-sdk-runtime';

interface SlackCredentialsParams extends Record<string, string> {
  accessToken: string;
  teamId: string;
  teamName: string;
  scopes: string;
  appId: string;
  botUserId: string;
  authedUserId: string;
}

export const invocationConfig: IntegrationInvocationConfig<SlackIntegrationConfig> = {
  instanceConfigFields,
  validateInvocation,
  getStepStartStates,
  integrationSteps: [
    teamStep,
    fetchUsersStep,
    fetchChannelMembersStep,
    fetchChannels,
  ],
};

const credentialsEnv = {
  accessToken:
    'xoxp-1567311637571-1588688713760-1567431688834-4dd4d8ff6473749f451ef6f383b6f5f0',
  teamId: 'T01GP95JRGT',
  teamName: 'Slack-Tesing',
  scopes: 'admin,channels:read,admin.usergroups:read,users:read',
  appId: 'A01GL5VSH6Z',
  botUserId: 'USLACKBOT',
  authedUserId: 'U01HAL8LZNC',
};

function loadConfig(): Promise<IntegrationInvocationConfig> {
  const integrationModule: any = invocationConfig;
  return integrationModule as Promise<IntegrationInvocationConfig>;
}

export async function loadSlackConnector(credentials: SlackCredentialsParams) {
  /* Load configuration */
  const config = prepareLocalStepCollection(await loadConfig());
  const graphObjectStore = new RuntimeGraphObjectStore({
    integrationSteps: config.integrationSteps,
  });
  const executionResult = await executeIntegrationLocally(
    config,
    {
      current: {
        startedOn: Date.now(),
      },
    },
    credentials,
    {
      graphObjectStore,
    },
  );
  console.log(executionResult);
  console.log(credentialsEnv);
  return graphObjectStore.getData();
}

/* Test function */
// eslint-disable-next-line @typescript-eslint/no-floating-promises
/* (async () => {
  const data = await loadSlackConnector(credentialsEnv);
  console.log(data);
})(); */
