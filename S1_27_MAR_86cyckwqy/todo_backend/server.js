const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./models/Todo');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://Manish:Chandra@todo.kwqmjat.mongodb.net/?retryWrites=true&w=majority&appName=Todo',
    console.log('MongoDB connected')
)

app.listen(8000,
    console.log('Server listening on port: 8000')
)

app.post('/add', (req, res) => {
  const { task } = req.body;
  TodoModel.create({ task })
      .then(result => res.json(result))
      .catch(err => console.log(err));
   
});

app.get('/get',(req,res)=>{
  TodoModel.find()
  .then(result=> res.json(result))
  .catch(err=>console.log(err));
});
  
app.put('/edit/:id',(req,res)=>{
  const{id} = req.params;
  TodoModel.findByIdAndUpdate(id,{done:true},{new:true})
  .then(result=> res.json(result))
  .catch(err=>res.json(err));
 });

app.put('/update/:id',(req,res)=>{
  const{id} = req.params;
  const{task} = req.body;
  TodoModel.findByIdAndUpdate(id,{task:task})
  .then(result=> res.json(result))
  .catch(err=>res.json(err));
 });

app.delete('/delete/:id',(req,res)=>{
  const{id} = req.params;
  TodoModel.findByIdAndDelete({_id:id})
  .then(result=> res.json(result))
  .catch(err=>res.json(err));
 }); 

// Backend: Delete multiple todos
// app.post('/delete-multiple', async (req, res) => {
//   const { ids } = req.body; // Expecting an array of IDs in the request body
//   try {
//       if (!Array.isArray(ids) || ids.length === 0) {
//           return res.status(400).send({ error: 'Invalid or empty IDs array' });
//       }

//       // Delete todos with the given IDs
//       await Todo.deleteMany({ _id: { $in: ids } });
//       res.status(200).send({ message: 'Todos deleted successfully' });
//   } catch (err) {
//       console.error('Error deleting todos:', err);
//       res.status(500).send({ error: 'Failed to delete todos' });
//   }
// });

module.exports=app;
