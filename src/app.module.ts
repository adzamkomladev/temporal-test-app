import { Module } from '@nestjs/common';

import * as path from 'path';
import { TemporalModule } from 'nestjs-temporal';
import {
  bundleWorkflowCode,
  NativeConnection,
  Runtime,
} from '@temporalio/worker';

import { AppService } from './app.service';

import { AppController } from './app.controller';

@Module({
  imports: [TemporalModule.forRootAsync({
    useFactory: async () => {
      Runtime.install({});
      
      const connection = await NativeConnection.connect({
        address: 'localhost:7233',
      });
      const workflowBundle = await bundleWorkflowCode({
        workflowsPath: path.join(__dirname, 'app.workflow.js'),
      });

      return {
        connection,
        taskQueue: 'test-conn',
        workflowBundle,
      };
    },
  }),
  TemporalModule.registerClient(),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
