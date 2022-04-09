let jwt = require("jsonwebtoken");
let secret_key = "secret";
class JWT{
    async generate(payload){
        try {
            console.log("asdasd --> ", payload);
            return await jwt.sign(payload, secret_key, {
                expiresIn: 600000,
                algorithm: 'HS256'
            } )
        } catch (error) {
            console.log(error);
        }
    }

    async decode(token){
        try {
            return await jwt.decode(token, secret_key,{
                algorithm: ['HS256']
            })
        } catch (error) {
            console.log(error);
        }
    }

    async verify(token){
        try {
            return await jwt.verify(token, secret_key,{
                algorithm: ['HS256']
            })
        } catch (error) {
            console.log(error);
        }
    }
}


module.exports = new JWT();