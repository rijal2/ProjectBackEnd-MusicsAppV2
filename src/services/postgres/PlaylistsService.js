const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const AuthorizError = require('../../exceptions/AuthorizError')

class PlaylistsService {
    constructor(CollabsService){
        this._pool = new Pool();
        this._collabsService =  CollabsService;

    }

    // Menambahkan (membuat) playlist. Ket: Selesai dan terhubung dg handler
    async addPlaylists({name, owner}) {
        const id = `playlist-${nanoid(16)}`

        const query = {
        text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
        values: [id, name, owner],
        }

        const result = await this._pool.query(query)

        if (!result.rows[0].id) {
        throw new InvariantError('Playlist gagal ditambahkan')
        }
        return result.rows[0].id
    }

    // Melihat daftar playlist. Ket: Selesai dan terhubung dg handler
    async getPlaylists(users) {
        const query = {
            text: `SELECT playlists.id, playlists.name, users.username FROM playlists 
                  LEFT JOIN users ON users.id = playlists.owner
                  LEFT JOIN collaborations ON playlists.id = collaborations.playlist_id
                  WHERE playlists.owner = $1 OR collaborations.user_id = $1;`,
            values: [users],
          }
      
          const result = await this._pool.query(query)
          return result.rows
    }

    // Menghapus Playlist. Ket: Selesai dan terhubung dg handler
    async deletePlaylists(id) {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
            values: [id],
          }
      
          const result = await this._pool.query(query)
          if (!result.rows.length) {
              throw new NotFoundError('Playlist gagal dihapus, Id tidak ditemukan')
          }
    }

    // Menambahkan lagu ke Playlist. Ket: Selesai dan terhubung dg handler
    async addSongToPlaylists(playlistId, songId) {
        const query = {
            text: 'INSERT INTO playlistssongs (playlist_id, song_id) VALUES($1, $2) RETURNING id',
            values: [playlistId, songId],
          }
          
          const result = await this._pool.query(query)
          if (!result.rows.length) {
            throw new InvariantError('Lagu gagal ditambahkan ke playlist')
          }
    }

    // Melihat daftar lagu pada sebuah playlist. Ket: Selesai dan terhubung dg handler
    async getSongOnPlaylists(playlistId){
        const query = {
            text: `SELECT songs.id, songs.title, songs.performer 
            FROM songs JOIN playlistssongs ON songs.id = playlistssongs.song_id WHERE playlistssongs.playlist_id = $1`,
            values: [playlistId],
          }
      
          const result = await this._pool.query(query)
      
          return result.rows
    }

    // Menghapus lagu dari playlist. Ket: Selesai dan terhubung dg handler
    async deleteSongFromPlaylists(playlistId, songId) {
        const query = {
            text: 'DELETE FROM playlistssongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
            values: [playlistId, songId],
          }
      
          const result = await this._pool.query(query)
          if (!result.rows.length) {
            throw new InvariantError('Lagu gagal dihapus')
          }
    }

    // Mengetahui Pemilik. Ket: Selesai dan terhubung dg handler
    async getUserWithUsername(username) {
        const query = {
            text: 'SELECT id, username, fullname FROM users WHERE username LIKE $1',
            values: [`${username}`],
          }
      
          const result = await this._pool.query(query)
          return result.rows
    }

    // Melakukan verifikasi pemilik playlist. Ket: Selesai
    async verifyThePlaylistOwner(id, owner) {
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [id],
          }
      
          const result = await this._pool.query(query)
          if (!result.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan')
          }
      
          const playlist = result.rows[0]
          if (playlist.owner !== owner) {
            throw new AuthorizError('Anda tidak berhak mengakses resource ini.')
          }
    }

    async verifyThePlaylistAccess(playlistId, userId){ //mengandung collab
        try {
            await this.verifyThePlaylistOwner(playlistId, userId)
          } catch (error) {
            if (error instanceof NotFoundError) {
              throw error
            }
            try {
              await this._collabsService.verifyCollaborator(playlistId, userId)
            } catch {
              throw error
            }
          }
    }

}

module.exports = PlaylistsService;