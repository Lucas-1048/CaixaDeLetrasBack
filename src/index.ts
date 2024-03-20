import 'dotenv/config';
import { server } from './server/Server';

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});