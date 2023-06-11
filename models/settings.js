import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true,
        maxlength:20
    },
    colTime:{
        type:Number,
        required:true,
        default:20,
        min:1,
        max:180
    },
    delTime:{
        type:Number,
        required:true,
        default:40,
        min:1,
        max:180
    },
    offline:{
        type:Boolean,
        required:true,
        default:false
    },
    banner:{
        type:String,
        required:true,
        default:''
    },
    bannerOn:{
        type:Boolean,
        required:true,
        default:true
    },
    notice:{
        type:String,
        required:true,
        default:''  
    },
    noticeOn:{
        type:Boolean,
        required:true,
        default:true
    },
    del:{
        type:Boolean,
        required:true,
        default:true
    },
    discount:{
        active:{
            type:Boolean,
            required:true,
            default:false
        },
        type:{
            type:String,
            required:true,
            default:"percent"
        },
        code:{
            type:String,
            required:false,
            default:''
        },
        valueOff:{
            type:Number,
            required:true,
            default:0
        },
        percentOff:{
            type:Number,
            required:true,
            default:0
        }
    },
    location:{
        type:String,
        required: true,
        default: "Seaford",
        maxlength: 30
    }
    
}, {timestamps: true}
);

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);