var Mongoose    = require('mongoose');
var d 		 	= new Date();
var schema = new Mongoose.Schema({
	businessCardPrices: {
        pq1:{
			price:{type:Number},
			qty:  {type:Number},
		},
		pq2:{
			price:{type:Number},
			qty:  {type:Number},
		},
		pq3:{
			price:{type:Number},
			qty:  {type:Number},
		},
		pq4:{
			price:{type:Number},
			qty:  {type:Number},
		},
		pq5:{
			price:{type:Number},
			qty:  {type:Number},
		},
        pq6:{
			price:{type:Number},
			qty:  {type:Number},
		}
    },
    bannerPrice: {type:Number},
    contactNumber: {type:String},
    contactEmail: {type:String},
    ppn:{type: String},
    physicalAddress: {type:String}

    	
})
module.exports = Mongoose.model('storeInfo', schema)