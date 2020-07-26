var util               = require('util'),
    Helpers            = require('./Helpers'),
    OAuth2Strategy     = require('passport-oauth2'),
    InternalOAuthError = require('passport-oauth2').InternalOAuthError;

function Strategy(options, verify) {
    options = Helpers.options(options);

    OAuth2Strategy.call(this, options, verify);

    this.name = 'streamlabs';
    this._profileURL = options.userURL;
    this._oauth2.useAuthorizationHeaderforGET(true);
}

util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function(accessToken, done) {
    this._oauth2.get(this._profileURL, accessToken, function(err, body, res) {
        if (err) return done(new InternalOAuthError('Failed to fetch the user profile.', err));

        try {
            var json = JSON.parse(body);
        } catch (e) {
            return done(new Error('Failed to parse the response.', e));
        }

        return done(undefined, {
            provider:     'streamlabs',
            token:        accessToken,
            id:           json.streamlabs.id,
            username:         json.streamlabs.display_name.toLowerCase(),
            displayName: json.streamlabs.display_name,
            _raw:         body,
            _json:        json
        });
    });
};

module.exports = Strategy;
