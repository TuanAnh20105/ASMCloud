const EXPRESS = require('express') // khai báo thưu viện express
const { Int32} = require('mongodb'); // khai báo thư viện mongodb
const session = require('express-session') //khai báo thư viện check password
// gọi các hàm trong file khác để dùng
const {checkUserRole, insertUser,insertcar,deletecar,searchcar,getAllcar,getcarById,updatecar , insertBuyProduct} = require('./databaseHandler'); 

const APP = EXPRESS();
APP.use(EXPRESS.static( "/public")); // khai báo sử dụng css
APP.use(EXPRESS.static(__dirname + '/public'));
// Use the session middleware
APP.use(session({ secret: '124447yd@@$%%#', cookie: { maxAge: 60000 },saveUninitialized:false,resave:false}))

APP.use(EXPRESS.urlencoded({extended:true}))
APP.set('view engine','hbs')
var i = false;
APP.post('/update',async (req,res)=>{
    const id = req.body.id;
    const nameInput = req.body.txtname;
    const imageInput = req.body.txtimage;
    const priceInput = req.body.txtprice;
    await updatecar(id,nameInput,imageInput,priceInput);
    res.redirect('/');
})

APP.get('/edit',async (req,res)=>{
    const idInput = req.query.id;
    const search_car = await getcarById(idInput);
    res.render('edit',{car:search_car})
})
APP.get('/detail',async (req,res)=>{
    const idInput = req.query.id;
    const search_car = await getcarById(idInput);
    res.render('detail',{car:search_car})
})
APP.post('/register',async (req,res)=>{
    const nameInput = req.body.txtusername;
    const passInput = req.body.txtpassword;
    const roleInput = req.body.role;
    await insertUser({name:nameInput,pass:passInput,role:roleInput})
    res.redirect('/login')
})

APP.post('/add',async (req,res)=>{
    const nameI = car.name;
    const id = car.id;
    const Pri = car.prices;

    await insertBuyProduct({name:nameI,id:id,prices:Pri})
    res.redirect('/Sedan')
})
APP.get('/Login',(req,res)=>{
    res.render('Login')
})
APP.post('/doLogin',async (req,res)=>{
    const nameInput = req.body.txtusername;
    const passInput = req.body.txtpassword;
    const userRole = await checkUserRole(nameInput,passInput);
    
    if(userRole!="-1"){
        req.session["User"]={
            name : nameInput,
            role : userRole
            
        }
    }
    console.log("role là cái này nè  : "+ userRole);
    
    if(userRole=="customer"){
        res.redirect('/Sedan');
    }
    else {
        res.redirect('/index');
    }
    
})
APP.get('/addProduct' , (req , res)=>{

    res.render('addProduct');
 
 })
APP.post('/insert',async (req,res)=>{
    const nameInput = req.body.txtName;
    const tuoiInput = req.body.txtPrice;
    const pictureInput = req.body.txtImage;
    const newcar = {name:nameInput,prices: Int32(tuoiInput),image:pictureInput};
    await insertcar(newcar);
    res.redirect('/');
})
APP.get('/Sedan' ,requiresLogin, async (req,res)=>{
    const allcars = await getAllcar();
    res.render('Sedan',{data:allcars,user:req.session["User"]})
})


APP.get('/index' ,requiresLogin, async (req,res)=>{
    const allcars = await getAllcar();
    res.render('index',{data:allcars,user:req.session["User"]})
})


APP.get('/delete',async (req,res)=>{

    const idInput = req.query.id;
    await deletecar(idInput);
    res.redirect('/');
})
APP.post('/search',async (req,res)=>{
    const searchInput = req.body.txtSearch;
    const allcars = await searchcar(searchInput);
    res.render('index',{data:allcars})
})


APP.get('/' ,requiresLogin, async (req,res)=>{
    const allcars = await getAllcar();
    res.render('index',{data:allcars,user:req.session["User"]})
})
APP.get('/add' , (req , res)=>{


   res.send('hello from simple server :)')

})
APP.get('/register' , (req , res)=>{
    res.render('register');
})

APP.get('/noLogin',requiresLogin, (req,res)=>{
    res.render('noLogin');
})

//custom middleware
function requiresLogin(req,res,next){
    if(req.session["User"]){
        return next()
        // i = true;
    }else{
        res.redirect('/Login')
    }
}

const PORT = process.env.PORT || 5001    ;
APP.listen(PORT);