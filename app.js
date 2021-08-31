const EXPRESS = require('express') // khai báo thưu viện express
const { Int32, ObjectId } = require('mongodb'); // khai báo thư viện mongodb
const session = require('express-session') //khai báo thư viện check password
// gọi các hàm trong file khác để dùng
const { getAllProductBuy, checkUserRole, insertUser, insertcar, deletecar, searchcar, getAllcar, getcarById, updatecar, insertBuyProduct } = require('./databaseHandler');

const APP = EXPRESS();
APP.use(EXPRESS.static('public')); // khai báo sử dụng css
APP.use(EXPRESS.static(__dirname + '/public'));
// Use the session middleware
APP.use(session({ secret: '124447yd@@$%%#', cookie: { maxAge: 600000000 }, saveUninitialized: false, resave: false }))

APP.use(EXPRESS.urlencoded({ extended: true }))
APP.set('view engine', 'hbs')
APP.get('/Login', (req, res) => {
    res.render('Login')
})
APP.post('/doLogin', async (req, res) => {
    const nameInput = req.body.txtusername;
    const passInput = req.body.txtpassword;
    const userRole = await checkUserRole(nameInput, passInput);

    if (userRole != "-1") {
        req.session["User"] = {
            name: nameInput,
            role: userRole
        }
    }
    console.log("role là cái này nè  : " + userRole);
    if (userRole == "customer") {
        res.redirect('/Sedan');
    }
    else if (userRole == "admin") {
        res.redirect('/index');
    }
    else {
        res.render('Login', { errorMsg: "Login failed!" })
    }
})
APP.get('/register', (req, res) => {
    res.render('register');
})
APP.post('/register', async (req, res) => {

    const nameInput = req.body.txtusername;
    const passInput = req.body.txtpassword;
    const roleInput = req.body.role;
    await insertUser({ name: nameInput, pass: passInput, role: roleInput })
    res.redirect('/login')

})
APP.get('/Sedan', requiresLogin, async (req, res) => {
    const allcars = await (await getAllcar());
    res.render('Sedan', { data: allcars, user: req.session["User"] })
})
APP.get('/index', requiresLogin, async (req, res) => {
    const allcars = await getAllcar();
    // allcars.id = allcars.id.slice(0,1) + allcars.id.slice(allcars.id.lastIndexOf()-2,allcars.id.lastIndexOf())
    for(var i =0 ; i < allcars.length; i++){
        console.log(allcars[i]._id.toHexString());
        allcars["id2"] =allcars[i]._id.toHexString().slice(0,2) + allcars[i]._id.toHexString().slice(-2);
       
    }
    res.render('index', { data: allcars, user: req.session["User"] })
})
APP.get('/detail', async (req, res) => {
    const idInput = req.query.id;
    const search_car = await getcarById(idInput);
    res.render('detail', { car: search_car })
})
APP.get('/allProductBuy', async (req, res) => {
    const allProducts = await getAllProductBuy();
    res.render('allProductBuy', { data: allProducts })
})
APP.post('/add', async (req, res) => {
    let date = new Date();
    const nameI = req.body.nameBuy;
    const Pri = req.body.priceBuy;;
    const img = req.body.imageBuy;
    const nameUser = req.body.Name;
    const address = req.body.Addr;
    const phone = req.body.Phone;
    await insertBuyProduct({ nameuser: nameUser, Address: address, PhoneNumber: phone, name: nameI, image: img, prices: Pri, date: date })
    res.redirect('/Sedan')
})
APP.get('/addProduct', (req, res) => {

    res.render('addProduct');
})
APP.post('/insert', async (req, res) => {
    const nameInput = req.body.txtName;
    const tuoiInput = req.body.txtPrice;
    const pictureInput = req.body.txtImage;

    const newcar = { name: nameInput, prices: Int32(tuoiInput), image: pictureInput };
    await insertcar(newcar);
    res.redirect('/');
})
APP.get('/edit', async (req, res) => {
    const idInput = req.query.id;
    const search_car = await getcarById(idInput);
    res.render('edit', { car: search_car })
})
APP.post('/update', async (req, res) => {
    const id = req.body.id;
    const nameInput = req.body.txtname;
    const imageInput = req.body.txtimage;
    const priceInput = req.body.txtprice;
    await updatecar(id, nameInput, imageInput, priceInput);
    res.redirect('/index');

})
APP.get('/delete', async (req, res) => {
    const idInput = req.query.id;
    await deletecar(idInput);
    res.redirect('/');
})
APP.post('/search', async (req, res) => {
    const searchInput = req.body.txtSearch;
    const allcars = await searchcar(searchInput);
    res.render('index', { data: allcars })
})
APP.get('/', requiresLogin, async (req, res) => {
    const allcars = await getAllcar();
    res.render('index', { data: allcars, user: req.session["User"] })
})
APP.get('/add', (req, res) => {

    res.redirect('/add');

})


APP.get('/noLogin', requiresLogin, (req, res) => {
    res.render('noLogin')
})
//custom middleware
function requiresLogin(req, res, next) {
    if (req.session["User"]) {
        return next()

    } else {
        res.redirect('/Login')
    }
}
const PORT = process.env.PORT || 5000;
APP.listen(PORT);