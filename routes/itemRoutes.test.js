process.env.NODE_ENV="test";
const request=require('supertest');
const app=require('../app');
const fs=require('fs')
const iItems=require('../items.json')
let item={name:"popsicle",price:1.40};
beforeEach(()=>{
    iItems.push(item);
    fs.writeFile('../items.json',JSON.stringify(iItems),"utf8",err=>{
        if(err){
            console.log('error:',err);
            process.exit(1)
        }
    })
});
afterEach(()=>{
    iItems.length=0;
    fs.writeFile('../items.json',JSON.stringify(iItems),"utf8",err=>{
        if(err){
            console.log('error:',err);
            process.exit(1)
        }
    })
});
describe("GET /items",()=>{
    test("Get all items",async()=>{
        const res=await request(app).get('/items');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([item])
    })
})
describe("GET /items:name",()=>{
    test('Get an item by name',async()=>{
        const res=await request(app).get(`/items/${item.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(item);
    })
    test('Respond with 404 for invalid name',async()=>{
        const res=await request(app).get(`/items/modo`);
        expect(res.statusCode).toBe(404);
    })
})
describe("POST /items",()=>{
    test('Create an item',async()=>{
        const res=await request(app).post('/items/').send({"name":"cheerios","price":3.4});
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({"added":{"name":"cheerios","price":3.4}});
    })
    test('Respond with 404 for invalid name',async()=>{
        const res=await request(app).post('/items').send({});
        expect(res.statusCode).toBe(400);
    })
})
describe("PATCH /items/:name",()=>{
    test('Update an item by name',async()=>{
        const res=await request(app).patch(`/items/${item.name}`).send({"name":"cheerios","price":3.4});
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({"Updated":{"name":"cheerios","price":3.4}});
    })
    test('Respond with 404 for invalid name',async()=>{
        const res=await request(app).patch('/items/modo').send({"name":"cheerios","price":3.4});
        expect(res.statusCode).toBe(404);
    })
})
describe("DELETE /items/:name",()=>{
    test('Delete an item by name',async()=>{
        const res=await request(app).delete(`/items/${item.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({message:"Deleted"});
    })
    test('Respond with 404 for invalid name',async()=>{
        const res=await request(app).delete('/items/modo');
        expect(res.statusCode).toBe(404);
    })
})