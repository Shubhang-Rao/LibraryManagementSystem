const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const memberRoutes = require('./routes/members');
const bookRoutes = require('./routes/books');  

const app = express();


app.use(bodyParser.json());  

app.use('/members', memberRoutes);
app.use('/books', bookRoutes);  

mongoose.connect('mongodb://localhost/libraryDB', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
