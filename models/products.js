import mongoose  from "mongoose";

const ProductsSchema = new mongoose.Schema({ 
    img:{
        type: String,
    },
    
    title:{
        type: String,
        required:true,
        maxlength:50
    },
    desc:{
        type:String,
        maxlength:300 
    },
    price:{
        type:Number,
        maxlength:6,
        minlength:1
    },
    section:{
        type: String,
        maxlength:20,
        required:true
    },
    veg:{
        type: Boolean,
        default:false,
        required: true
    },
    extraSection:{
        type:[],
    },
    upgrade:{
        type:Boolean,
        default: false,
    },
    available:{
        type: Boolean, 
        default: true, 
    },
    stripeId:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required: true,
        default: "Seaford",
        maxlength: 20
    }
}, 
{timestamps:true}
);
export default mongoose.models.Products || mongoose.model('Products', ProductsSchema); 