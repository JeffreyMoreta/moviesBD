module.exports = function (app, passport, db, ObjectID) {
  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

  app.get('/profile', isLoggedIn, function (req, res) {
    db.collection('messages').find().toArray(function (err, result) {
      if (err) return console.log(err);
      res.render('profile.ejs', {
        user: req.user,
        messages: result,
      });
    });
  });

  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/movieBoard', isLoggedIn, function (req, res) {
    db.collection('messages').find().toArray(function (err, result) {
      if (err) return console.log(err);
      res.render('movieBoard.ejs', {
        user: req.user,
        messages: result,
      });
    });
  });

  app.get('/post', isLoggedIn, function (req, res) {
    db.collection('messages').find().toArray(function (err, result) {
      if (err) return console.log(err);
      res.render('post.ejs', {
        user: req.user,
        messages: result,
      });
    });
  });

  app.post('/messages', function (req, res) {
    db.collection('messages').save({
      name: req.body.name,
      title: req.body.title,
      msg: req.body.msg,
      date: req.body.date,
      src: req.body.src,
    }, function (err, result) {
      if (err) return console.log(err);
      console.log('saved to database');
      res.redirect('/profile');
    });
  });

  app.put('/messages', function (req, res) {
    console.log(req.body);
    db.collection('messages')
      .findOneAndUpdate({
        _id: ObjectID(req.body.id),
      }, {
        $set: {
          heart: req.body.heart,
          fav: req.body.fav, },
      }, {
        sort: {
          _id: -1,
        },
        upsert: true,
      }, function (err, result) {
        if (err) return res.send(err);
        res.send(result);
      });
  });

  app.delete('/messages', function (req, res) {
    db.collection('messages').findOneAndDelete({
      _id: ObjectID(req.body.id),
    }, function (err, result) {
      if (err) return res.send(500, err);
      res.send('Message deleted!');
    });
  });

  app.get('/login', function (req, res) {
    res.render('login.ejs', {
      message: req.flash('loginMessage'),
    });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true,
  }));

  app.get('/signup', function (req, res) {
    res.render('signup.ejs', {
      message: req.flash('signupMessage'),
    });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true,
  }));

  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
