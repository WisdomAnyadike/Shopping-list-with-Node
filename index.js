const express = require('express')
const app = express()
const ejs = require('ejs')
const { default: mongoose } = require('mongoose')
const env = require('dotenv').config()



let shoppingSchema = new mongoose.Schema({
    itemName: {type:String , required: [true , "name is required"]},
    itemPrice: {type: Number , required: [true , "price is required"]} ,
    itemQuantity: {type: Number , required: [true , "quantity is required"]} , 
    subTotal: {type: Number , required: [true , "Subtotal is required"]} 
})

let shopModel =  new mongoose.model('ShopModel' , shoppingSchema)


app.set("view engine" , "ejs")

app.use(express.urlencoded({extended:true}))



app.post("/", async(req,res)=> {
    try {
        const {itemName , itemPrice , itemQuantity , subTotal} = req.body
    if(!itemName || !itemPrice || !itemQuantity || !subTotal ){
        res.status(400).json({message:'all inputs are mandatory'})

    }else{
       console.log(req.body);

       try {
        const shoppinglist = await shopModel.create({
            itemName, itemPrice , itemQuantity , subTotal
        })
        console.log('shopping list posted' , shoppinglist);
        res.redirect('/')

        
       } catch (error) {
        console.log( 'error while posting list' + error);
        
       }

    } 
    } catch (error) {
       console.log('error posting ' + error) ; 
    }
   
    
})


app.get('/', async(req,res)=> {
    try {
        let getlist = await shopModel.find()
   console.log('recieved list');

        if(getlist){
            console.log('list fetched'+ getlist);
        }else {
            console.log("unable to fetch list");
        }
        res.render('index' ,{ lists : getlist } )
    } catch (error) {
        console.log('error getting todo'+ error); 
    }

})


app.post('/delete/:id' , async(req,res)=> {
    let id = req.params.id
    if (!id) {
        console.log('couldnt get id');
    }

    try {
        const deletelist = await shopModel.findByIdAndDelete(id)
        if (!deletelist) {
            console.log('Couldnt be found or deleted');
            
        } else{
            console.log('list successfully deleted', deletelist);
        }
    } catch (error) {
        console.log('network error while deleting' + error);
    }
  
    res.redirect('/')


})


app.post('/edit/:id', async(req, res)=> {
    let id = req.params.id
    if(!id){
        console.log('couldnt find id')
    }
    try {
        let getlist = await shopModel.findById(id) 
        if(!getlist){
            console.log('list not found');
        }else{
          console.log('list found'+ getlist);
        }
        res.render('edit' , {list : getlist})
        
        
    } catch (error) {
        console.log('network error finding list' + error);
    }
})



app.post('/update/:id' , async (req,res)=>{
    let id = req.params.id
    if(!id){
        console.log("list not found");
    }
    const {itemName , itemPrice , itemQuantity , subTotal } = req.body

    if (!itemName || !itemPrice || !itemQuantity || !subTotal) {
        console.log('all inputs are needed');
        res.status(400).send('fill in all inputs')
    }

    try {
        const ListToUpdate = await shopModel.findByIdAndUpdate(id , { itemName , itemPrice , itemQuantity , subTotal} , [{new:true}])
        if(!ListToUpdate){
            console.log('couldnt find list to be updated ');
        }else{
            console.log('updating list..'+ ListToUpdate );
        }
        res.redirect('/')
        
    } catch (error) {
        
    }
} )









const port =  process.env.PORT ||  3000
app.listen(port , ()=> {
    console.log('we are running on http://localhost:'+ port);
})

let string = process.env.CONNECTION_STRING

const connect = async()=> {
    try {
        let connection = await mongoose.connect(string)
        if(connection){
            console.log('successfully connected to database');
        }else{
            console.log('couldnt connect loccally to database');
        }
        
    } catch (error) {
        console.log('database network error' + error);
        
    }
}

connect()