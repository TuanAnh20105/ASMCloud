const {MongoClient,ObjectId} = require('mongodb');
var URL = "mongodb+srv://anhntgch190543:Anhtuan1234@cluster0.xcwbs.mongodb.net/test";

const DATABASE_NAME = "GCH0803DB"

async function getDB() {
    const client = await MongoClient.connect(URL);
    const dbo = client.db(DATABASE_NAME);
    return dbo;
}

async function insertUser(user) {
    const dbo = await getDB();
    const newS = await dbo.collection("users").insertOne(user);
    console.log("Gia tri id moi duoc insert la: ", newS.insertedId.toHexString());
}

async function insertcar(newcar) {
    const dbo = await getDB();
    const newS = await dbo.collection("cars").insertOne(newcar);
    console.log("Gia tri id moi duoc insert la: ", newS.insertedId.toHexString());
}

async function insertBuyProduct(newBuy) {
    const dbo = await getDB();
    const newS1 = await dbo.collection("BuyProducts").insertOne(newBuy);
    console.log("Gia tri id moi duoc insert la: ", newS1.insertedId.toHexString());
}
async function deletecar(idInput) {
    const dbo = await getDB();
    await dbo.collection("cars").deleteOne({ _id: ObjectId(idInput) });
}
async function searchcar(searchInput) {
    const dbo = await getDB();
    const allcars = await dbo.collection("cars").find({ name: searchInput }).toArray();
    return allcars;
}
async function getAllcar() {
    const dbo = await getDB();
    const allcars = await dbo.collection("cars").find({}).toArray();
    return allcars;
}
async function getAllProductBuy() {
    const dbo = await getDB();
    const allProducts = await dbo.collection("BuyProducts").find({}).toArray();
    return allProducts;
}

async function getcarById(idInput){
    const dbo = await getDB();
    return dbo.collection("cars").findOne({_id:ObjectId(idInput)});
}

async function updatecar(id,nameInput,imageInput,priceInput){
    const dbo = await getDB();
    dbo.collection("cars").updateOne({_id:ObjectId(id)},{$set:{name:nameInput,image:imageInput,prices:priceInput}})
}
async function checkUserRole(nameI,passI){
    const dbo = await getDB();
    const user= await dbo.collection("users").findOne({name:nameI,pass:passI});
    if (user==null) {
        return "-1"
    }else{
        console.log(user)
        return user.role;
    }
}

module.exports = {getAllProductBuy,getDB,insertcar,deletecar,searchcar,getAllcar,getcarById,updatecar,insertUser,checkUserRole,insertBuyProduct}