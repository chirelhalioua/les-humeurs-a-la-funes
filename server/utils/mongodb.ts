import { MongoClient, type Db } from 'mongodb'

declare global {
  var __humeursMongoClientPromise: Promise<MongoClient> | undefined
}

export async function getHumeursDb(): Promise<Db> {
  const config = useRuntimeConfig()

  if (!config.mongodbUri) {
    throw new Error('NUXT_MONGODB_URI n’est pas configurée.')
  }

  if (!globalThis.__humeursMongoClientPromise) {
    const client = new MongoClient(config.mongodbUri)
    globalThis.__humeursMongoClientPromise = client.connect()
  }

  const client = await globalThis.__humeursMongoClientPromise
  return client.db(config.mongodbDbName)
}
