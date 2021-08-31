/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('playlistssongs', {
      id: {
        type: 'serial',
        primaryKey: true,
      },
      playlist_id: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
      song_id: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
    });
  
    pgm.addConstraint('playlistssongs', 'unique_playlist_id_and_song_id', 'UNIQUE(playlist_id, song_id)');
    pgm.addConstraint('playlistssongs', 'fk_playlistsongs.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
    pgm.addConstraint('playlistssongs', 'fk_playlistsongs.song_id_songs.id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');
  };
  
  exports.down = (pgm) => {
    pgm.dropTable('playlistssongs');
  };
  