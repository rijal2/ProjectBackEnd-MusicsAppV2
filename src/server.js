require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// Songs
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

// Users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// Authentications
const auths = require('./api/auths');
const AuthsService = require('./services/postgres/AuthsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthsValidator = require('./validator/auths');

// Playlist
const thePlaylists = require('./api/thePlaylists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');

// Collaborations


// Server
const init = async () => {
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authsService = new AuthsService();
  const playlistsService = new PlaylistsService();
  
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('songsapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    // songs
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    // Users
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    // Authentications
    {
      plugin: auths,
      options: {
        authsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthsValidator,
      },
    },
    // Playlists
    {
      plugin: thePlaylists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
      }
    },
    // Collabs

  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
