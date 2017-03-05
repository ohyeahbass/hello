var Mongoose    = require('mongoose');
var d 		 	= new Date();
console.log('word')
var schema = new Mongoose.Schema({
	user_id: {type: String},
    typeOfItem:{type:String},
    amountPaid:{type:String},
    totalPrice:{type:String}, 
    banner:{type:String},
	finish: {type: String},
	quantity: {type: String},
	frontOfCard:    {type: String},
	backOfCard:     {type: String},
	companyId: {type: String},
    sentOrder: {type:String},
    userPhone: {type:String},
    phoneUpdates: {type: Boolean},
    estTimeToCompltion:{type:String},
    readyToPickUp: {type:Boolean},
    userEmail: {type:String},
    desc: {type: String},
    fullfilled:{type: Boolean},
	time : {type: Date, default: Date.now }
    	
})
module.exports = Mongoose.model('order', schema)