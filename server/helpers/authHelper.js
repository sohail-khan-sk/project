const bcrypt = require("bcrypt")

exports.hashPassword = (password) => {
    return new Promise((res,rej) => {
        bcrypt.genSalt(10,(err,salt)=>{
            if (err) {
                rej(err)
            }
            bcrypt.hash(password,salt,(err,hash)=>{
                if (err) {
                    rej(err);
                }
                res(hash);
            });
        });
    });
};

exports.comparePassword= (password,hashed) =>{
    return bcrypt.compare(password,hashed);
};