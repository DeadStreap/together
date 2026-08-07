const express = require('express');
const cors = require('cors');
const Router = require('./routes/router');
const PORT = process.env.PORT || 3001;

const app = express();


app.use(cors());
app.use(express.json());
app.use('/api', Router);

app.use((err, req, res, next) => {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Server error' });
});

app.listen(PORT, (err) => {
    if(err){
        console.log(err)
    }else{
        console.log(`Server started on port ${PORT}`)
    }
})
