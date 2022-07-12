import mongoose from "mongoose";

/*
    0 = Déconnecté
    1 = Connecté
    2 = Connexion...
    3 = Déconnexion...
*/

const mongoConnection = {
    isConnected: 0,
};

export const connect = async () => {
    if (mongoConnection.isConnected === 1) {
        console.log('MongoDB is already connected');
        return;
    }

    if (mongoose.connections.length > 0) {
        mongoConnection.isConnected = mongoose.connections[0].readyState;

        if (mongoConnection.isConnected === 1) {
            console.log('En utilisant la connexion précédente');
            return;
        }

        await mongoose.disconnect();
    }

    await mongoose.connect(process.env.MONGO_URL || '');
    mongoConnection.isConnected = 1;
    console.log('MongoDB is connected : ', process.env.MONGO_URL);
};

export const disconnect = async () => {
    if (mongoConnection.isConnected === 0) return;

    await mongoose.disconnect();
    mongoConnection.isConnected = 0;
    console.log('MongoDB is disconnected: ', '....');
};