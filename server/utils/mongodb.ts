import { MongoClient, type Db } from 'mongodb'

declare global {
  var __humeursMongoClientPromise: Promise<MongoClient> | undefined
}

export async function getHumeursDb(event?: any): Promise<Db> {
  const config = useRuntimeConfig(event)

  if (!config.mongodbUri) {
    throw new Error('NUXT_MONGODB_URI n’est pas configurée.')
  }

  if (!globalThis.__humeursMongoClientPromise) {
    const client = new MongoClient(config.mongodbUri, {
      serverSelectionTimeoutMS: 8000
    })

    globalThis.__humeursMongoClientPromise = client.connect().catch(error => {
      globalThis.__humeursMongoClientPromise = undefined
      throw error
    })
  }

  const client = await globalThis.__humeursMongoClientPromise
  return client.db(config.mongodbDbName)
}
