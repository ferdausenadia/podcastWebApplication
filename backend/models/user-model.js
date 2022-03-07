const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        phone: { type: String, required: true },
        name: { type: String, required: false },
        profile: { type: String, required: false, get:(profile)=>{
            if(profile){
                return `${process.env.BASE_URL}${profile}`;
            }
            return profile;
        }},
        activated: { type: Boolean, required: false, default: false },
    },
    {
        timestamps: true,
        toJSON: {getters: true},
    }
);

module.exports = mongoose.model('User', userSchema, 'users');