const express=require('express');
const fs=require('fs');
const router=new express.Router();
const ExpressError=require('../expressError');
const iItems=require('../items.json')

router.get('/',(req,res)=>{
    res.json(iItems);
})
router.get('/:name', (req,res)=>{
        const items=iItems
        const foundItem=items.find(item=>item.name===req.params.name);
        if (foundItem===undefined){
            throw new ExpressError('Item Not Found',404);
        }
        res.json( foundItem );
})
router.post("/",(req,res,next)=>{
    try{
        if(!req.body.name) throw new ExpressError("Name and price is required",400)
        const newItem={name:req.body.name,price:req.body.price};
        iItems.push(newItem)
        fs.writeFile('./items.json',JSON.stringify(iItems),"utf8",err=>{
            if(err){
                console.log("error:",err);
                process.exit(1)
            }
        })
        return res.status(201).json({"added":newItem})
    } catch(e){
        return next(e)
    }
})
router.patch('/:name',(req,res)=>{
    const foundItem=iItems.findIndex(item=>item.name===req.params.name);
    if (foundItem===-1){
        throw new ExpressError('Item not found',404);
    }
    iItems.splice(foundItem,1)
    const newItem={name:req.body.name,price:req.body.price}
    iItems.push(newItem)
    fs.writeFile('./items.json',JSON.stringify(iItems),"utf8",err=>{
        if(err){
            console.log("error:",err);
            process.exit(1)
        }
    })
    res.json({"Updated":newItem})
})
router.delete('/:name',(req,res)=>{
    const foundItem=iItems.findIndex(item=>item.name===req.params.name);
    if (foundItem===-1){
        throw new ExpressError('Item not found',404);
    }
    iItems.splice(foundItem,1)
    fs.writeFile('./items.json',JSON.stringify(iItems),"utf8",err=>{
        if(err){
            console.log("error:",err);
            process.exit(1)
        }
    })
    res.json({message:"Deleted"})
})

module.exports=router;