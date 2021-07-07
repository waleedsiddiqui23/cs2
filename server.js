var express = require ('express');
var app = express();
var path = require('path');
const mongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
var publicPath = path.resolve(__dirname, "public");
let db;

app.use(express.json());                                

mongoClient.connect('mongodb+srv://Waleed90:Waleed90@cluster0.eovo6.mongodb.net/', (err, client) =>{
    db = client.db('webstore');

})

//  app.get('/', (req, res, next) => {
//      res.send('Select a collection, e.g., /collection/messages')
//  })

app.param('collectionName', (req, res, next, collectionName) => {               
   req.collection = db.collection(collectionName)
   return next()
})

app.get('/collection/:collectionName', (req, res, next) => {        
   req.collection.find({}).toArray((e, results) => {
       if (e) return next(e)
       res.send(results)
   })
})

app.post('/collection/:collectionName', (req, res, next) => {                         
   req.collection.insert(req.body, (e, results) => {
       if (e) return next(e)
       res.send(results.ops)
   })
})


app.get('/collection/:collectionName/:id', (req, res, next) => {                         
   req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => {
       if (e) return next(e)
       res.send(result)
   })
})

app.put('/collection/:collectionName/:id', (req, res, next) => {                               
   req.collection.update(
       { _id: new ObjectID(req.params.id) }, 
       { $set: req.body }, 
       { safe: true, multi: false }, 
       (e, result) => { 
       if (e) return next(e)      
       res.send((result.result.n === 1) ? { msg: 'success' } : { msg: 'error' }) 
       }) 
   })

   app.delete('/collection/:collectionName/:id', (req, res, next) => {                               
       req.collection.deleteOne({_id: ObjectID(req.params.id)}, (e, result) => {
       if (e) return next(e)        
       res.send((result.result.n === 1) ? {msg: 'success'} : {msg: 'error'})  
   })
})

app.use((req, res, next) => {                                                                    
    console.log("\nRequest Method: " + req.method + ", \nURL: " + req.url);
    next();
});

 app.use('/', express.static(publicPath))                                                        

  app.use(function(request, response) {                                                           
      response.status(404);
      response.send("File not found!");
    });

const port = process.env.PORT || 3000
app.listen(port, () => {                                                                       
   console.log('Express.js server running')
})
