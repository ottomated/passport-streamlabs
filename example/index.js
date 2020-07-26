var StreamlabsStrategy = require('passport-streamlabs').Strategy,
    bodyParser         = require('body-parser'),
    cookieParser       = require('cookie-parser'),
    cookieSession      = require('cookie-session'),
    passport           = require('passport'),
    express            = require('express'),
    app                = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({ secret: 'SOME_SECRET_KEY' }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new StreamlabsStrategy({
    clientID:     'YOUR_CLIENT_ID',
    clientSecret: 'YOUR_CLIENT_SECRET',
    scope:        'SCOPES',
    callbackURL:  'YOUR_REDIRECT_URI'
}, function(accessToken, refreshToken, profile, done) {
    return done(undefined, profile);
}));

// User serialization
passport.serializeUser(function(user, done)   { done(null, user); });
passport.deserializeUser(function(user, done) { done(null, user); });

// Routes
app.get('/auth/streamlabs/authorize', passport.authenticate('streamlabs'));

app.get('/auth/streamlabs/callback', passport.authenticate('streamlabs', { failureRedirect: '/auth/streamlabs/authorize' }), function(req, res) {
    // At this point, the authentication was successful.
});

app.get('/protected-route', function(req, res, next) {
    if (req.isAuthenticated()) return next();

    // Not authenticated.
    res.redirect('/auth/streamlabs/authorize');
}, function (req, res) {
    // Good to go.
});

app.get('/logout', function(req, res) {
    req.logout();

    res.redirect('/');
});

app.listen(3000);
