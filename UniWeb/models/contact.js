const mongoose = require('mongoose');
const Schema = mongoose.Schema;

contactSchema = new Schema( {
	
	unique_id: String,
	email: String,
	name: String,
	phone:Number,
	message:String,
	createdAt: {
		type: Date,
		default: Date.now
	}
}),
Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;