const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const usersRoute = require('./routes/users');
const drivesRoute = require('./routes/drives');
const groupsRoute = require('./routes/groups');


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/user', usersRoute);
app.use('/api/drive', drivesRoute);
app.use('/api/group', groupsRoute);


const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => 
  console.log(`Backend listening on port ${PORT}`)
);
