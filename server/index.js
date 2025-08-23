import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './src/config/connectDb.js'
import userRoutes from './src/routes/user.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import songRoutes from './src/routes/song.routes.js';
import playlistRoutes from './src/routes/playlist.routes.js';
import albumRoutes from './src/routes/album.routes.js'
import cors from 'cors';

dotenv.config();

const app=express();
connectDB();

app.use(cors(
  {
    origin: process.env.CLIENT_URL,
    credentials: true
  }
));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())




app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/prevent-cold-start',(req,res)=>{
  res.send("Preventing cold start");
})

app.use('/api/users',userRoutes)
app.use('/api/admins',adminRoutes)
app.use('/api/songs',songRoutes)
app.use('/api/playlists',playlistRoutes)
app.use('/api/albums',albumRoutes)



app.listen(process.env.PORT, () => {
  console.log('Server is running on port ' + process.env.PORT);
});