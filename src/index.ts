import 'dotenv/config';
import { server } from './server/Server';
import mongoose from 'mongoose';

const uri : string = process.env.MONGODB_URI as string

mongoose.connect(uri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(() => {
    console.log("Error connecting to MongoDB");
  })

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});