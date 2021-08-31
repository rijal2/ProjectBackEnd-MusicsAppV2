const routes = (handler) => [
    {
      method: 'POST',
      path: '/playlists',
      handler: handler.addPlaylistHandler,
      options: {
        auth: 'songsapp_jwt',
      },
    },
    {
      method: 'GET',
      path: '/playlists',
      handler: handler.getPlaylistHandler,
      options: {
        auth: 'songsapp_jwt',
      },
    },
    {
      method: 'DELETE',
      path: '/playlists/{playlistId}',
      handler: handler.deletePlaylistHandler,
      options:{
        auth: 'songsapp_jwt'
      }
    },
    {
      method: 'POST',
      path: '/playlists/{playlistId}/songs',
      handler: handler.addSongToPlaylistsHandler,
      options: {
        auth: 'songsapp_jwt'
      }
    },
    {
      method: 'GET',
      path: '/playlists/{playlistId}/songs',
      handler: handler.getSongOnPlaylistsHandler,
      options: {
        auth: 'songsapp_jwt',
      },
    },
    {
      method: 'DELETE',
      path: '/playlists/{playlistId}/songs',
      handler: handler.deleteSongFromPlaylistsHandler,
      options: {
        auth: 'songsapp_jwt',
      },
    },
    {
      method: 'GET',
      path: '/users',
      handler: handler.getUsernameHandler,
      options: {
        auth: 'songsapp_jwt'
      }
    },
  ]
  
  module.exports = routes
  