import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk/testing';
import { SLACK_CHANNEL_TYPE, SLACK_CHANNEL_CLASS } from '../../../converters';
import { setupRecording } from '../../../../test/recording';

import step from '../index';
import { Entity, Relationship } from '@jupiterone/integration-sdk';
import {
  matchesSlackChannelUserRelationshipKey,
  matchesSlackChannelKey,
  matchesSlackUserKey,
} from '../../../../test/slack';

let recording: Recording;

beforeEach(() => {
  recording = setupRecording({
    directory: __dirname,
    name: 'fetch-channels-with-users',
  });
});

afterEach(async () => {
  await recording.stop();
});

test('step data collection', async () => {
  const context = createMockStepExecutionContext();
  await step.executionHandler(context);

  expect(context.jobState.collectedEntities.length).toBeGreaterThan(0);
  expect(context.jobState.collectedRelationships.length).toBeGreaterThan(0);

  const expectedCollectedEntities: Entity[] = context.jobState.collectedEntities.map(
    (entity: Entity) => {
      return expect.objectContaining({
        ...entity,
        isChannel: expect.any(Boolean),
        isGroup: expect.any(Boolean),
        isIm: expect.any(Boolean),
        creator: expect.any(String),
        isArchived: expect.any(Boolean),
        isMember: expect.any(Boolean),
        isPrivate: expect.any(Boolean),
        isMpim: expect.any(Boolean),

        topic: expect.any(String),
        topicCreator: expect.any(String),
        topicLastSet: expect.any(Number),

        purpose: expect.any(String),
        purposeCreator: expect.any(String),
        purposeLastSet: expect.any(Number),

        numMembers: expect.any(Number),

        id: expect.any(String),
        name: expect.any(String),
        _key: matchesSlackChannelKey(),
        _type: SLACK_CHANNEL_TYPE,
        _class: [SLACK_CHANNEL_CLASS],
        _rawData: expect.any(Array),
        displayName: entity.name,
      });
    },
  );

  const expectedCollectedRelationships: Relationship[] = context.jobState.collectedRelationships.map(
    () => {
      return {
        _key: matchesSlackChannelUserRelationshipKey(),
        _type: 'slack_channel_has_User',
        _class: 'HAS',
        _fromEntityKey: matchesSlackChannelKey(),
        _toEntityKey: matchesSlackUserKey(),
        _mapping: undefined,
        displayName: 'HAS',
      };
    },
  );

  expect(context.jobState.collectedEntities).toEqual(expectedCollectedEntities);

  expect(context.jobState.collectedRelationships).toEqual(
    expectedCollectedRelationships,
  );
});
