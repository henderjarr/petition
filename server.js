// ------------------------------ REQUIRE MODULES------------------------------------

const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const db = require('./db/db')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const bcrypt = require('./db/bcrypt')
const csurf = require('csurf')

// var router = require('./routes/routes')
// ------------handlebars instance -------------

var hbs = exphbs.create({
    defaultLayout: "main",
    helpers: {
        foo: function (age, city) {
            if (age && !city) {
                return `(${age})`
            } else if (city && !age) {
                return `(<a href="/thanks/signers/${city}">${city}</a>)`
            }
            else if (age && city) {
                return ` (${age}, <a href="/thanks/signers/${city}">${city}</a>)`
            }
        }
    }
})

// ----------------------------MIDDLEWARE --------------------------------------

// -------cookieSession ------------

app.use(cookieSession({
    secret: 'Im always angry',
    maxAge: 1000 * 60 * 60 * 24 * 14
}))
function checkForLogin(req, res, next) {
    if (!req.session.userId) {
        res.redirect('/')
    } else {
        next()
    }
}

function checkForSig(req, res, next) {
    if (!req.session.signatureId) {
        res.redirect('/')
    } else {
        next()
    }
}

// ----------body parser middleware ----------
app.use(bodyParser.urlencoded({ extended: false }))

// ------- csurf middlewear ---------
app.use(csurf())
app.use(function (req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
});

// -------- static file and hadlebars set up middleware--------
app.use(express.static('public'))

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

// --------------------------------- ROUTES ----------------------------------------------------------

//----------- start page, login or signup----------

app.get('/', function (req, res) {
    res.render('startpage')
})

//---------signup stuff-------------

app.get('/signup', (req, res) => {
    if (!req.session.signatureId) {
        res.render('signup')
    } else {
        res.redirect('profilePage')
    }

})
app.post('/signup', (req, res) => {
    if (req.body.password) {
        bcrypt.hashPassword(req.body.password)
            .then(returnedInfoHashedPassword => {
                db.signUp(req.body.firstname, req.body.lastname, req.body.email, returnedInfoHashedPassword)
                    .then(userData => {
                        req.session.firstName = userData.first_name
                        req.session.lastname = userData.last_name
                        req.session.email = userData.email
                        req.session.userId = userData.id
                        res.redirect('/profile')
                    }).catch(err => {
                        if (err.constraint == 'users_email_key') {
                            res.render('signup', {
                                errToBeRendered: 'This email already exists, you have either made a mistake, or you are already a memeber.'
                            })
                        }
                    })
            }).catch(err => {
                console.log(err)
            })
    } else {
        res.render('signup', {
            errToBeRendered: 'you must fill in all fields!'
        })
    }
})


// ----------login page---------
app.get('/login', (req, res) => {
    res.render('login')
})
app.post('/login', (req, res) => {
    const loginEmail = req.body.email
    db.queryEmail(loginEmail)
        .then(returnedInfo => {
            bcrypt.checkPassword(req.body.password, returnedInfo.hashed_password)
                .then(allGood => {
                    if (allGood) {
                        req.session.userId = returnedInfo.id
                        db.sigImage(returnedInfo.id)
                            .then(ifTheySigned => {
                                req.session.signatureId = ifTheySigned.user_id
                                res.redirect('/thanks')
                            }).catch(err => {
                                res.redirect('/signature')
                            })
                    } else {
                        res.render('login', {
                            errPassword: 'I think your password is incorrect'
                        })
                        console.log('password err')
                    }
                }).catch(err => {
                    console.log(err)
                })
        }).catch(err => {
            res.render('login', {
                errEmail: 'There is no account that matches your email address!'
            })
        })
})

//----------- profile page -----------
app.get('/profile', checkForLogin, (req, res) => {
    res.render('profile', {
        name: req.session.firstName,
        lastname: req.session.lastname,
        email: req.session.email
    })
})
app.post('/profile', (req, res) => {
    db.profileData(req.body.age, req.body.city, req.body.homepage)
        .then(results => {
            res.redirect('/signature')
        }).catch(err => {
            console.log('this is a profile post error')
        })
})

// ---------signature---------
app.get('/signature', checkForLogin, (req, res) => {
    if (!req.session.signatureId) {
        res.render('signature', {
            name: req.session.firstName
        })
    } else {
        res.redirect('/profilePage')

    }

})
app.post('/signature', (req, res) => {
    if (!req.session.signatureId) {
        db.insertSignature(req.body.signature, req.session.userId)
            .then(sigResults => {
                req.session.signatureId = sigResults.user_id
                res.redirect('/thanks')
            }).catch((err) => {
                res.render('signature', {
                    err: 'Oh no, looks like you didn\'t fill out all the form correctly, please try again'
                })
            })
    } else {
        res.redirect('/profilePage')
    }
})
// ---------------thanks-----------------

app.get('/thanks', checkForLogin, checkForSig, (req, res) => {
    db.getSigners()
        .then(result => {
            db.sigImage(req.session.signatureId)
                .then(imgres => {
                    res.render('thanks', {
                        signature: imgres.signature,
                        length: result.length
                    })
                }).catch(err => {
                    console.log(err)
                })
        }).catch(err => {
            console.log(err)
        })
})

app.get('/thanks/signers', checkForLogin, checkForSig, (req, res) => {
    db.getSignersData()
        .then(result => {

            // req.session.city = result[1].city
            // console.log(req.session)

            res.render('signers', {
                results: result,
            })
        }).catch(err => {
            console.log(err)
        })
})
app.get('/thanks/signers/:city', (req, res) => {
    db.allSignersFromCity(req.params.city).then(resal => {
        res.render('signers', {
            cityResults: resal
        })
    }).catch(err => {
        console.log(err)
    })
})
app.get('/profilePage', checkForSig, (req, res) => {
    db.userJoinedTable(req.session.signatureId).then(results => {
        // console.log(results)
        res.render('profilePage', {
            results: results
        })
    }).catch(err => {
        console.log(err)
    })
})
app.get('/profilePage/editProfile', checkForSig, (req, res) => {
    db.userJoinedTable(req.session.signatureId).then(resultsForForm => {
        res.render('editProfile', {
            res: resultsForForm
        })
    }).catch(err => {
        console.log(err)
    })
})
app.post('/profilePage/editProfile', (req, res) => {
    console.log(req.body.firstname, req.body.lastname, req.body.email, req.session.signatureId)
    db.updateUsers(req.body.firstname, req.body.lastname, req.body.email, req.session.signatureId)
        .then(hopefully => {
            console.log(hopefully)
            console.log(req.body.age, req.body.city, req.body.homepage, hopefully.id)
            db.updateProfiles(req.body.age, req.body.city, req.body.homepage, hopefully.id)
                .then(hope => {
                    console.log(hope)
                    res.redirect('/profilePage')

                }).catch(err => {
                    console.log('this is a updateProfiles problesm')
                })
        }).catch(err => {
            console.log('some strannge profile error', err)
        })
})

app.get('/logout', (req, res) => {

        req.session = null
        res.redirect('/')

})
const port = 8080
const heroku = process.env.PORT

app.listen(heroku || port, () => { console.log('listening on port: ', port) })






// app.get('/hash-practise', (req, res) => {
//     bcrypt.hashPassword('trustno1')
//         .then(hashedPassword => {
//             console.log(hashedPassword)
//             return bcrypt.checkPassword('trustno1', hashedPassword)
//                 .then(doThePsswordsMatch => {
//                     console.log(doThePsswordsMatch)
//                 }).catch(err => {
//                     console.log(err)
//                 })
//         }).catch(err => {
//             console.log(err)
//         })
// })


// app.use(cookieSession({
//     secret: 'what a wonderful day',
//     maxAge:
// }))

// //middle ware in express
// //we can use middle ware globally or just route basis, globally goes through all routes

// //this middleware should check if the user has sign the petition
// //global way
// app.use((req, res, next)=>{
//     if(!req.session.signatureId){
//         res.redirect('/')
//     }else{
//         next()
//     }
// })

// //single route way
// function checkForSig(req, res, next){
//     if(!req.session.signatureId){
//         res.redirect('/')
//     }else{
//         next()
//     }
// }
// //to us the single way, pass the func in between the url and the callback
// //ie
// app.get('/thanks', checkForSig, (req, res)=>{})





// part 3 registration page

