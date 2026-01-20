type EnvConfig = {
  DATABASE_URL: string;
};

export function validateEnv(env: NodeJS.ProcessEnv): EnvConfig {
  const databaseUrl = env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required');
  }

  return { DATABASE_URL: databaseUrl };
}
