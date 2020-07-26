module.exports = {
    requiredParameters: ['clientID', 'clientSecret', 'scope', 'callbackURL'],

    uris: {
        authorization: 'authorize',
        token:         'token',
        user:          'user',
    },

    url: function(uri) {
        return 'https://streamlabs.com/api/v1.0/' + this.uris[uri];
    },

    options: function(options) {
        options = options || {};

        options.authorizationURL = options.authorizationURL || this.url('authorization');
        options.tokenURL         = options.tokenURL         || this.url('token');
        options.userURL          = options.userURL          || this.url('user');

        this.validate(options);

        return options;
    },

    validate: function(options) {
        this.requiredParameters.forEach(function(parameter) {
            if (! options.hasOwnProperty(parameter)) throw new Error('The options you provided lack ' + parameter + ', which is required.');
            if (! options[parameter])                throw new TypeError('Make sure ' + parameter + ' is not a falsy value, like an empty string.');
        });
    }
};
