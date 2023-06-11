import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({

    username:{
        type:String,
        required: true,
        maxlength:20,
        unique: true
    },
    password:{
        type:String,
        required:true,
        maxlength: 20,
    },
    location:{
        type:String,
        required: true,
        default: "Seaford",
        maxlength: 20
    }
},
{timestamps: true},
)
export default mongoose.models.Admin || mongoose.model('Admin' , AdminSchema);