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

    const userLibrarySchema =  new mongoose.Schema({
        user: {type: mongoose.Schema.Types.ObjectId, ref: "Users"},
        library: {type: mongoose.Schema.Types.ObjectId, ref: "Library"},
        version: String,
        created_date: Date,
        alert_enabled: Boolean,
        vulnerabilities: [{type: mongoose.Schema.Types.ObjectId, ref: "UserLibVulnerability"}]
    })

    const librarySchema =  new mongoose.Schema({
        name: String,
        versions: [String],
    })

    const userLibVulnerabilitySchema =  new mongoose.Schema({
        vulnerability: {type: mongoose.Schema.Types.ObjectId, ref: "Vulnerability"},
        alerted: Boolean
     })


    const vulnerabilitySchema =  new mongoose.Schema({
        name: String,
        description: String,
        libraryId: {type: mongoose.Schema.Types.ObjectId, ref: "Library"},
        affected_versions: [String],
        published: Date,
        severity: String,
        sourceName: String,
        sourceHref: String
    })

    models.Users = mongoose.model('Users', userSchema)
    models.UserLibrary = mongoose.model('UserLibrary', userLibrarySchema)
    models.Library = mongoose.model('Library', librarySchema)
    models.Vulnerability = mongoose.model('Vulnerability', vulnerabilitySchema)
    models.userLibVulnerability = mongoose.model('UserLibVulnerability', userLibVulnerabilitySchema)


    console.log('mongoose models created')
}

export default models;