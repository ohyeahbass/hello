var braintree = require("braintree");
var gateway = braintree.connect({
  environment:braintree.Environment.Sandbox,
  merchantId: "tjx9zq5ydqmhxrv8",
  publicKey: "49pbb6r68jbq2fvc",
  privateKey: "2961f10337a7a32788815f6299eff56d"
})

var Order = require('../models/OrderModel');
var User  = require('../models/user');
module.exports = {
	create:function(req,res){
		// console.log(req.body.user_id);
		User.findOne({
	      username: req.body.user_id.toLowerCase()
	    }, function(err, user) {
	      // if there are any errors, return the error before anything else
           if (err)
		   console.log("error1")
            //    return;

           // if no user is found, return the message
           if (!user){
		   		console.log("cant find user")
            //    return;
			}else {

				gateway.transaction.sale({
					amount: "10.00",
					paymentMethodNonce: req.body.nonce,
					options: {
						submitForSettlement: true
					}
				}, function (err, result) {
					console.log(result)
			});











				Order.create(req.body, function(err,result){
					if(err){res.send(err)}
					else{res.json(result);}
				})
			}
	    });
		
	},
	read:function(req,res){
		Order.find().populate('customer').exec(function(err,result){
			if(err){res.send(err)}
			else{res.json(result)}
		})
	},
	update:function(req,res){
		Order.findByIdAndUpdate(req.body.id, req.body.updatedProd, function(err,result){
			if(err){res.send(err);}
			else{res.json(result);}
		})
	},
	delete:function(req,res){
		console.log('delete')
		Order.findByIdAndRemove(req.params.id, function(err,result){
			if(err){res.send(err)}
			else{res.json(result)}
		})
	}
}