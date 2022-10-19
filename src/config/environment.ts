import dotenv from 'dotenv'

dotenv.config()

const { NODE_ENV, PORT, DB_URL, DATABASE_URL, TEST_DB, SECRET_KEY, CLIENT_ID, CLIENT_SECRET, CALLBACK_URL } = process.env

let connectionString: string | undefined = ''
let ssl: boolean | object = false

if (NODE_ENV === 'development') {
  connectionString = DB_URL
} else if (NODE_ENV === 'production') {
  connectionString = DATABASE_URL
  ssl = {
    rejectUnauthorized: false
  }
} else if (NODE_ENV === 'test') {
  connectionString = TEST_DB
} else {
  throw new Error('Invalid Node Env')
}

if (!connectionString) {
  throw new Error('Database url is not valid')
}

if (!SECRET_KEY) {
  throw new Error('SECRET_KEY is not provided in env vars')
}

if (!CLIENT_ID || !CLIENT_SECRET || !CALLBACK_URL) {
  throw new Error('Check google credential')
}

const config = {
  nodeEnv: NODE_ENV,
  port: PORT || 8080,
  connectionString,
  ssl,
  secretKey: SECRET_KEY,
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  callbackUrl: CALLBACK_URL
}

export default config
