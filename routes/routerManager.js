const routeApp = require('./routerApp');
const routeAdmin = require('./routerAdmin');



module.exports = function(app,passport) {


    app.use('/admin',isAdminIn,routeAdmin)

    app.use('/sectionList',function (req,res) {
        res.end(JSON.stringify(sectionList));
    })


    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    //auth

    app.post('/auth/signin', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));




    app.post('/auth/signup', passport.authenticate('local-signup', {
        successRedirect : '/',
        failureRedirect : '/',
        failureFlash : true
    }));


    app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['public_profile', 'email'] }));


    //auth callback

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/',
            failureRedirect : '/'
        }));

    app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/',
            failureRedirect : '/'
        }));

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/',
            failureRedirect : '/'
        }));


    app.get('/connect/facebook', passport.authorize('facebook', { scope : ['public_profile', 'email'] }));

    app.get('/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect : '/',
            failureRedirect : '/'
        }));

    app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

    app.get('/connect/twitter/callback',
        passport.authorize('twitter', {
            successRedirect : '/',
            failureRedirect : '/'
        }));

    app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

    app.get('/connect/google/callback',
        passport.authorize('google', {
            successRedirect : '/',
            failureRedirect : '/'
        }));

    //unlink

    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/');
        });
    });


    app.get('/unlink/facebook', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/');
        });
    });


    app.get('/unlink/twitter', isLoggedIn, function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
            res.redirect('/');
        });
    });


    app.get('/unlink/google', isLoggedIn, function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            res.redirect('/');
        });
    });

    app.use('/',isBlockIn,routeApp)
};

function isBlockIn(req, res, next) {
    if (!req.isAuthenticated()||!req.user.block)
        return next();
    req.logout();
    res.redirect('/');
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

function isAdminIn(req, res, next) {
    if (req.isAuthenticated()&&req.user.role)
        return next();


    res.redirect("/");
}
