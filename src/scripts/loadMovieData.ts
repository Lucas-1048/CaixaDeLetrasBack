import mongoose from 'mongoose';
import fs from 'fs';
import { Movie } from '../server/models/Movie';

fs.readFile('./src/data/movies-2020s.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Erro ao ler o arquivo: ', err);
        return;
    } else console.log('Arquivo lido com sucesso')
    const movies = JSON.parse(data);

    const updatedMovies = movies.map((movie: any) => {
        delete movie.href;
        delete movie.thumbnail_width;
        delete movie.thumbnail_height;
        return movie;
    });

    mongoose.connect(process.env.MONGODB_URI as string)
        .then(() => {
            console.log("Connected to MongoDB");
            return Movie.insertMany(updatedMovies);
        })
        .then(() => {
            console.log('Movies inserted');
            mongoose.connection.close();
            process.exit(0);
        })
        .catch((err: any) => {
            console.log("Erro: ", err);
            mongoose.connection.close();
            process.exit(0);
        });
});