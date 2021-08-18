const EXPRESS = require('express') // khai báo thưu viện express
const { Int32} = require('mongodb'); // khai báo thư viện mongodb
const session = require('express-session') //khai báo thư viện check password
// gọi các hàm trong file khác để dùng
const {checkUserRole, insertUser,insertStudent,deleteStudent,searchStudent,getAllStudent,getStudentById,updateStudent} = require('./databaseHandler'); 

const APP = EXPRESS();
APP.use(EXPRESS.static( "/public")); // khai báo sử dụng css
APP.use(EXPRESS.static(__dirname + '/public'));
// Use the session middleware
APP.use(session({ secret: '124447yd@@$%%#', cookie: { maxAge: 60000 },saveUninitialized:false,resave:false}))

APP.use(EXPRESS.urlencoded({extended:true}))
APP.set('view engine','hbs')

APP.post('/update',async (req,res)=>{
    const id = req.body.id;
    const nameInput = req.body.txtName;
    const tuoiInput = req.body.txtTuoi;
    await updateStudent(id,nameInput,tuoiInput);
    res.redirect('/');
})

APP.get('/edit',async (req,res)=>{
    const idInput = req.query.id;
    const search_Student = await getStudentById(idInput);
    res.render('edit',{student:search_Student})
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
    // if(userRole=="admin"){
    //     res.redirect('/index');
    // }
    
    // res.redirect('/');

    
})

APP.post('/insert',async (req,res)=>{
    const nameInput = req.body.txtName;
    const tuoiInput = req.body.txtPrice;
    const pictureInput = req.body.txtImage;
    const newStudent = {name:nameInput,prices: Int32(tuoiInput),image:pictureInput};
    await insertStudent(newStudent);
    res.redirect('/');
})
APP.get('/Sedan' ,requiresLogin, async (req,res)=>{
    const allStudents = await getAllStudent();
    res.render('Sedan',{data:allStudents,user:req.session["User"]})
})

APP.get('/index' ,requiresLogin, async (req,res)=>{
    const allStudents = await getAllStudent();
    res.render('index',{data:allStudents,user:req.session["User"]})
})

APP.get('/delete',async (req,res)=>{
    const idInput = req.query.id;
    await deleteStudent(idInput);
    res.redirect('/');
})
APP.post('/search',async (req,res)=>{
    const searchInput = req.body.txtSearch;
    const allStudents = await searchStudent(searchInput);
    res.render('index',{data:allStudents})
})

APP.get('/' ,requiresLogin, async (req,res)=>{
    const allStudents = await getAllStudent();
    res.render('index',{data:allStudents,user:req.session["User"]})
})
APP.post('/register',async (req,res)=>{
    const nameInput = req.body.txtusername;
    const passInput = req.body.txtpassword;
    const roleInput = req.body.role;
    await insertUser({name:nameInput,pass:passInput,role:roleInput})
    res.redirect('/Login')
})

APP.get('/noLogin',requiresLogin, (req,res)=>{
    res.render('noLogin');
})

//custom middleware
function requiresLogin(req,res,next){
    if(req.session["User"]){
        return next()
    }else{
        res.redirect('/Login')
    }
}

const PORT = process.env.PORT || 5001  ;
APP.listen(PORT);