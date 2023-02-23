import mongoose from 'mongoose';

let models = {};

main().catch(err => console.log(err))
async function main(){
    console.log('connecting to mongodb')
    await mongoose.connect('mongodb+srv://AaronLiu:QZU.MNwBRx2b73e@cluster0.qduhxvn.mongodb.net/?retryWrites=true&w=majority')
    console.log("successfully connected to mongodb")

    //Create schemas and models to connect to the mongodb collections
    const userSchema = new mongoose.Schema({
        username: String,
        email: String
    })

    const librarySchema =  new mongoose.Schema({
        libraryID: {type: mongoose.Schema.Types.ObjectId, ref: "Post"}
    })

    const vulnerabilitySchema =  new mongoose.Schema({
       
    })

    models.Users = mongoose.model('Users', userSchema)
    models.Library = mongoose.model('Library', librarySchema)
    models.Vulnerability = mongoose.model('Vulnerability', vulnerabilitySchema)


    console.log('mongoose models created')
}

export default models;