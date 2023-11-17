module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // HOME PAGE W/ LOGIN LINKS
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // feed SECTION =========================
    // read
    app.get('/feed', isLoggedIn, function(req, res) {
        db.collection('shows').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('feed.ejs', {
            user : req.user,
            shows: result
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

// REALITY TV SHOW FEED ROUTES ===============================================================
    // create show
    app.post('/add', (req, res) => {
      console.group(req.body)
      const watchedValue = req.body.watched === 'true';

      db.collection('shows').save({email:req.body.email, title: req.body.title, review: req.body.review, rating: req.body.rating, watched: watchedValue, date: new Date().toDateString()}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/feed')
      })
    })

    // delete show
    app.delete('/delete', (req, res) => {
      db.collection('shows').findOneAndDelete({email:req.body.email, title: req.body.title}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('show deleted!')
      })
    })

    // update show
    app.put('/update', (req, res) => {
      db.collection('shows')
      .findOneAndUpdate({email:req.body.email, title: req.body.title}, {
        $set: {
          rating: req.body.rating,
          review: req.body.review,
          watched: true
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        console.log('updated show')
        res.redirect('/feed')
      })
    })
    
// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/feed', // redirect to the secure feed section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/feed', // redirect to the secure feed section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
