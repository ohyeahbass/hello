var StoreInfo = require('../models/StoreInfoModel');
module.exports = {
	create:function(req,res){
		StoreInfo.create(req.body, function(err,result){
			if(err){res.send(err)}
			else{res.json(result);}
		})
	},
	read:function(req,res){
		StoreInfo.find().exec(function(err,result){
			if(err){res.send(err)}
			else{res.json(result)}
		})
	},
	update:function(req,res){
		StoreInfo.findByIdAndUpdate(req.body.id, req.body.updatedProd, function(err,result){
			if(err){res.send(err);}
			else{res.json(result);}
		})
	},
	delete:function(req,res){

		StoreInfo.findByIdAndRemove(req.params.id, function(err,result){
			if(err){res.send(err)}
			else{res.json(result)}
		})
	}
}