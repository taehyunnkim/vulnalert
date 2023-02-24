import mongoose from 'mongoose';

let models = {};

main().catch(err => console.log(err))
async function main(){
    console.log('connecting to mongodb')
    await mongoose.connect('mongodb+srv://AaronLiu:QZU.MNwBRx2b73e@cluster0.qduhxvn.mongodb.net/Vulnalert?retryWrites=true&w=majority')
    console.log("successfully connected to mongodb")

    //Create schemas and models to connect to the mongodb collections
    const userSchema = new mongoose.Schema({
        given_name: String,
        family_name: String,
        email: String,
        username: String,
        joined_date: Date
    })

    const librarySchema =  new mongoose.Schema({
        users: {type: mongoose.Schema.Types.ObjectId, ref: "Users"},
        library: String,
        version: String,
        created_date: Date,
        alert_enable: Boolean
    })

    const vulnerabilitySchema =  new mongoose.Schema({
       description: String,
       library: {type: mongoose.Schema.Types.ObjectId, ref: "Library"},
       version: String,
       published: Date,
       type:String,
       vulstatus: String,
       severity: String,
       source: String
    })

    models.Users = mongoose.model('Users', userSchema)
    models.Library = mongoose.model('Library', librarySchema)
    models.Vulnerability = mongoose.model('Vulnerability', vulnerabilitySchema)


    console.log('mongoose models created')
}

export default models;