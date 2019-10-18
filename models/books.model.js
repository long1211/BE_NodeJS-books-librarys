const mongoose = require('mongoose');
 const path = require('path');

const coverImgBasepath = 'uploads/booksCover'
const bookSchema = new mongoose.Schema({
    title:{type: String, required:true},
    description:{type: String, required:true},
    publishDate:{type: Date, required:true},
    pageCount:{type: Number, required:true},
    createdAT:{type: Date, required:true, default: Date.now},
    coverImageName:{type:String, required:true},
    author:{type:mongoose.Schema.Types.ObjectId, required:true, ref:'Author'}
})

 bookSchema.virtual('coverImgpath').get(function(){
    if(this.coverImageName != null){
      return path.join('/', coverImgBasepath,this.coverImageName )
    }
})
module.exports = mongoose.model('Book', bookSchema)

module.exports.coverImgBasepath = coverImgBasepath