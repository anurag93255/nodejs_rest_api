require('dotenv').config();
// const dbConnection = require('./mysql_connection.js');
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const PORT  = process.env.PORT | 9000;
const app = express();

app.use(express.json());

const user = [
    {id: 123, name: 'anurag', role: 'admin'},
    {id: 234, name: 'prakash', role: 'user'},
    {id: 345, name: 'rajesh', role: 'admin'}
];

var products = [
    {id: 'PROD_1',name: 'Product 1', price: '100$'},
    {id: 'PROD_2',name: 'Product 2', price: '240$'},
    {id: 'PROD_3',name: 'Product 3', price: '300$'},
    {id: 'PROD_4',name: 'Product 4', price: '50$'}
]

function getUser(identity, type) {
    const types = ['id', 'name'];
    if(types.includes(type)) {
        let userdetail = user.map((key, obj) => {
            return identity == obj[type];
        });
        if(userdetail != undefined) {
            return userdetail;
        }
    }
    return null;
}



// This will verify that user has jwt or not if not forbidden
function authMiddleware(req, res, next) {
    const bearerheader = req.headers['authorization'];
    // console.log(typeof bearerheader);
    let bearerToken;
    if(typeof bearerheader != 'undefined') {
        // console.log('this is passed');
        bearerToken = bearerheader.split(' ')[1];
    } 
    if(typeof bearerToken != 'undefined') {
        jwt.verify(bearerToken, process.env.SECRET_KEY, (err, data) => {
            if(err) res.sendStatus(403)
            const userInfo = getUser(data.id, 'id');
            if(userInfo == null) {
                res.sendStatus(403);
            } else {
                req.token = bearerToken;
                req.role = userInfo.role;
                next();
            } 
        })
    }
    res.sendStatus(403);
    
}


// This will login user and give user a jwt sign token
app.post('/login', (req,res) => {
    username = req.body.username;

    
    const userInfo = getUser(username, 'name');
    if(typeof userInfo != 'undefined') {
        token = jwt.sign({ id: userInfo.id}, process.env.SECRET_KEY);
        res.json({token});
    } else {
        res.send('User Not Found');
    }
})

// This return products list
app.get('/products', authMiddleware, (req,res) => {
    res.json(products);
})

// This will get product detail
app.get('/product/:id', authMiddleware, (req, res) => {
    // res.json(products[req.params.id]);
    let prod = products.filter((obj, index) => {
        return obj.id == req.params.id;
    });
    res.json(prod);
})

// This will addProduct if user is admin by checking token
app.post('/addProduct', authMiddleware, (req,res) => {
    // res.json({"success" : 'success message'});
    const id = req.body.id;
    const name = req.body.name;
    const price = req.body.price;

    const prod_obj = {id: id, name: name, price: price};
    products.push(prod_obj);

    res.send('Product added successfully');
})


// This will addProduct if user is admin by checking token
/**
 * example 
 * update = {
 *  name: 'updated_value',
 *  price: updated_price
 * }
 * prod_id = id
 */
app.patch('/editProduct', authMiddleware, (req,res) => {
    let update = req.body.update;
    const prod_id = req.body.id;
    
    let messages=[];
    if(typeof update == 'object') {
        products.map(function(obj, index){
            // messages.push(obj.id + " AND " + prod_id);
            if(obj.id == prod_id) {
                Object.keys(update).forEach((key) => {
                    let message = obj[key];
                    obj[key] = update[key];
                    message += " -> " + obj[key];
                    messages.push(message);
                });
            }
        });
        if(messages.length != 0) {
            res.json(Object.assign({}, messages));
        }
    }
    res.sendStatus(403);
})

// This will addProduct if user is admin by checking token
app.delete('/deleteProduct', authMiddleware, (req,res) => {
    const id = req.body.id;
    const prevCount = products.length;
    products = products.filter((obj) => {
        return obj.id != id;
    });
    const afterCount = products.length;
    if(prevCount != afterCount) res.send('Product Deleted successfully')
    else res.send('Product not found')
})









app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/documentation.html'));
});


app.listen(PORT);