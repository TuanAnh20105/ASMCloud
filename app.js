const EXPRESS= require('express')
const app = EXPRESS();
app.get('/' , (req , res)=>{

   res.end('hello from simple server :)')

})
const PORT = process.env.PORT ||5000;
app.listen(PORT);
console.log("running");