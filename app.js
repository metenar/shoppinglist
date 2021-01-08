const { request } = require('express');
const express=require('express');
const app=express();
const morgan=require('morgan');
const ExpressError=require('./expressError');
const itemRoutes=require('./routes/itemRoutes');
app.use(express.json());
app.use(morgan('dev'));

app.use('/items',itemRoutes);

/**404 Error handler */
app.use((req,res,next)=>{
    return new ExpressError('Not Found',404);
});

/** General Error Handling */
app.use((err,req,res,next)=>{
    res.status(err.status || 500)
    return res.json({
        error:err.message
    })
})

module.exports=app;