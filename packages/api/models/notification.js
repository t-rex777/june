const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    notificationMessage = {
        type : String,
        trim : true,
    },
    actionBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    post : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Post"
    }
},
{
    timestamps:true
});

module.exports = mongoose.model("Notification",notificationSchema);