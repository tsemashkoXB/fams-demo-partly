import { Module } from '@nestjs/common';
import { createDatabasePool } from '../../config/database';

export const PG_POOL = 'PG_POOL';

@Module({
  providers: [
    {
      provide: PG_POOL,
      useFactory: () => createDatabasePool(),
    },
  ],
  exports: [PG_POOL],
})
export class DatabaseModule {}
