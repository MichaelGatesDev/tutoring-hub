const express = require('express');
const { OAuth2Client } = require('google-auth-library');

const router = express.Router({
    mergeParams: true
});

const User = require('../../../../models/User');

const CLIENT_ID = '720087900394-emhkhqeh8m9nhq1mm07td42iuihbu56i.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);


async function verifyLogin(idToken) {
    return new Promise((resolve, reject) => {
        client.verifyIdToken({
            idToken: idToken,
            audience: CLIENT_ID,
        })
            .then(function (loginTicket) {
                const payload = loginTicket.getPayload();

                const userID = payload['sub']; // 12893019340175940719402134
                const domain = payload['hd']; // @domain.ext
                const email = payload['email']; // my.email@domain.ext
                const fullName = payload['name']; // John Doe
                const imageURL = payload['picture']; // 'https://lh6.googleusercontent.com/~/photo.jpg
                const locale = payload['locale']; // en

                const newUserObj = {
                    userID: userID,
                    domain: domain,
                    email: email,
                    fullName: fullName,
                    image: imageURL,
                    locale: locale
                };

                User.findOne({
                    userID: userID
                })
                    .then(function (found) {
                        if (found) {
                            return resolve(found);
                        }
                        else {
                            // found no user, try to create
                            console.log("Didn't find user, so creating one..");
                            User.create(newUserObj)
                                .then((createdUser) => {
                                    console.log("Created user");
                                    return resolve(createdUser);
                                }).catch(function (err) {
                                    console.log("Error creating user");
                                    return reject(err);
                                });
                        }
                    }).catch(function (err) {
                        console.log("Error finding user: " + userID);
                        return reject(err);
                    });
            })
            .catch(function (err) {
                return reject(err);
            });
    });
}

router.get('/google/login', (req, res, next) => {
    res.send("Google login");
});

router.post('/google/login', async (req, res, next) => {
    let token = req.body.token;
    await verifyLogin(token)
        .then(function (user) {
            console.log("Successfully verified the login!");
            res.status(200).send(user);
        }).catch(function (err) {
            console.log("There was an error verifying the login");
            console.log(err);
            res.status(400).send("Could not verify login");
        });
});


router.get('/google/logout', (req, res, next) => {
    res.send("Google logout");
});

module.exports = router;