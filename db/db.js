const spicedPg = require('spiced-pg')
let db
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL)
} else {
    db = spicedPg('postgres:jarrodhenderson:password@localhost:5432/petition');
}


///----------- signup users -----------
exports.signUp = function (firstName, lastName, email, password) {
    const q = ('UPDATE users SET first_name = $1, last_name = $2, email = $3, hashed_password =$4 WHERE users.id = 2 RETURNING *;')
    const params = [firstName || null, lastName || null, email || null, password || null]
    return db.query(q, params)
        .then(results => {
            return results.rows[0]
        }).catch(err => {
            console.log("this is a signn up problem")
            return Promise.reject(err)
        })
}


// --------------login---------------------

exports.queryEmail = function (loginEmail) {
    const params = [loginEmail]
    return db.query('SELECT * FROM users WHERE email = $1;', params)
        .then((results) => {
            return results.rows[0]
        }).catch(err => {
            console.log('this is a queryEmail problem')
            return err
        })
}

exports.sigImage = function (usersId) {
    const params = [usersId]
    return db.query('SELECT * FROM signatures WHERE user_id = $1;', params)
        .then(results => {
            return results.rows[0]
        }).catch(err => {
            console.log('this is a sigImage problem')
            return err
        })
}

// --------------profile---------------------

exports.profileData = function (age, city, homepage) {
    const q = 'UPDATE user_profiles SET age = $1, city =$2, homepage =$3 WHERE user_id = 2 RETURNING *;'
    const params = [age, city, homepage]
    return db.query(q, params)
        .then(results => {
            return results.rows[0]
        })
        .catch(err => {
            console.log('this is the profileData error')
            return err
        })
}

// -----------------insertSignature --------------

exports.insertSignature = function (signature) {

    const q = 'UPDATE signatures SET signature = $1 WHERE user_id = 2 RETURNING *;'//$ signs are how we avoid sequel injection from hackers
    const params = [signature || null]

    return db.query(q, params)
        .then(results => {
            return results.rows[0]
        }).catch(err => {
            console.log("this is matts error in insert user", err)
            return Promise.reject(err)
        })
}
// ------------thanks page ---------------------

exports.getSigners = function () {
    return db.query(`SELECT users.first_name, signatures.signature 
                    FROM users
                    JOIN signatures
                        ON users.id = signatures.user_id;`)
        .then((results) => {
            return results.rows
        }).catch(err => {
            console.log(err)
        })
}

// ------------signers page ----------------------------

exports.getSignersData = function () {
    return db.query(`SELECT users.first_name, users.last_name, user_profiles.age, user_profiles.city, user_profiles.homepage, signatures.signature 
                    FROM users
                    LEFT JOIN user_profiles
                        ON users.id = user_profiles.user_id
                    LEFT JOIN signatures
                        ON users.id = signatures.user_id;`)
        .then((results) => {
            return results.rows
        }).catch(err => {
            console.log(err)
        })
}

exports.allSignersFromCity = function(city){
    const params = [city]
    const q = (`SELECT users.first_name, users.last_name, user_profiles.age, user_profiles.city
                FROM users
                JOIN user_profiles
                ON user_profiles.user_id = users.id
                WHERE user_profiles.city = $1`) 

    return db.query(q, params).then(results =>{
        return results.rows
    }).catch(err=>{
        console.log('this is an error from allSignersFromCity', err)
    })
}

// exports.joinData = function () {
//     // const query = [keyId, id]
//     return db.query(` SELECT users.id AS user_id, user_profiles.user_id AS user_profiles_id
//                 FROM users
//                 JOIN user_profiles
//                 ON users.id = users.user_profiles; `)
//         .then(results => {
//             return results.row[0]
//         }).catch(err => {
//             console.log('this is a join error')
//         })
// }

// ---------------- all tables-----------------------

exports.userJoinedTable = function (id){
    const params = [id]
    const q = (`SELECT users.id, users.first_name, users.last_name, users.email, users.hashed_password, user_profiles.age, user_profiles.city, user_profiles.homepage, signatures.signature 
               FROM users
               JOIN user_profiles
                    ON users.id = user_profiles.user_id
               JOIN signatures
                    ON users.id = signatures.user_id
                WHERE users.id = $1;`)
                    
    return db.query(q, params)
    .then(results => {
        return results.rows[0]
    }).catch(err => {
        console.log("this is db userjoined tables error")
        return Promise.reject(err)
    })
}

exports.updateUsers = function (firstname, lastname, email, id){
    const params = [firstname, lastname, email, id]
    const q = ('UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE id = $4 RETURNING *;')

    return db.query(q, params)
    .then(results => {
        return results.rows[0]
    }).catch(err => {
        console.log("this is db userjoined tables error")
        return Promise.reject(err)
    })
}
exports.updateProfiles = function (age, city, homepage, id){
    const params = [age, city, homepage, id]
    const q = ('UPDATE user_profiles SET age = $1, city = $2, homepage = $3 WHERE user_id = $4 RETURNING *;')

    return db.query(q, params)
    .then(results => {
        return results.rows[0]
    }).catch(err => {
        console.log("this is db uup tables error")
        return Promise.reject(err)
    })
}

