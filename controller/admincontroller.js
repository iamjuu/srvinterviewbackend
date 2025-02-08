
const product =require("./../model/product")

module.exports={
    formPost :async (req,res)=>{


console.log(req.body)
console.log(req.file)
    const  {name,price}=req.body


const filename =req.file.filename
console.log(filename)
const newproduct =new product({

    name,price,imglink:filename
})
await newproduct.save()
res.status(200).json({message:"sucessful"})
}


}
