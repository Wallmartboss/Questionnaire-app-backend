import { initMongoConnection } from './src/db/initMongoConnection.js';
import { setupServer } from './src/server.js';


const bootstrap = async () => {
  await initMongoConnection();
  setupServer();
};

void bootstrap();
