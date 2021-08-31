const ClientError = require("../../exceptions/ClientError");

class PlaylistsHandler{
    constructor(service, validator){
        this._service = service;
        this._validator = validator;

        this.addPlaylistHandler = this.addPlaylistHandler.bind(this)
        this.getPlaylistHandler = this.getPlaylistHandler.bind(this)
        this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this)
        this.addSongToPlaylistsHandler = this.addSongToPlaylistsHandler.bind(this)
        this.getSongOnPlaylistsHandler = this.getSongOnPlaylistsHandler.bind(this)
        this.deleteSongFromPlaylistsHandler = this.deleteSongFromPlaylistsHandler.bind(this)
        this.getUsernameHandler = this.getUsernameHandler.bind(this)
    }

    async addPlaylistHandler(req, h){ //Selesai
        try {
            this._validator.validationPlaylistPayload(req.payload);
            const {name} = req.payload;
            const {id: credentialId} = req.auth.credentials;
            const playlistId = await this._service.addPlaylists({name, owner: credentialId});

            const response = h.response({
                status: 'success',
                message: 'Playlist berhasil ditambahkan',
                data: {
                    playlistId
                }
            });
            response.code(201);
            return response;
        } catch (error) {
            if(error instanceof ClientError){
                const response = h.response({
                    status: 'fail',
                    message: error.message
                })

                response.code(error.statusCode)
                return response;
            }

            const response =  h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            });
            
            response.code(500);
            return response;
        }   
    };

    async getPlaylistHandler(req) {//Selesai
        const {id: credentialId} = req.auth.credentials;
        const playlists = await this._service.getPlaylists(credentialId);
        
        return {
            status: 'success',
            data: {
                playlists
            }
        }
    };

    async deletePlaylistHandler(req, h) { //Selesai
        try {
            const {playlistId} = req.params
            const {id: credentialId}= req.auth.credentials
            
            await this._service.verifyThePlaylistOwner(playlistId, credentialId)
            await this._service.deletePlaylists(playlistId)

            return {
                status: 'success',
                message: 'Playlist berhasil dihapus'
            }
            
        } catch (error) {
            if(error instanceof ClientError){
                const response = h.response({
                    status: 'fail',
                    message: error.message
                })

                response.code(error.statusCode)
                return response
            }

            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            })
            response.code(500)
            console.log(error.message)
            return response
        }
    };

    async addSongToPlaylistsHandler(req, h){ //Selesai
        try {
            await this._validator.validationSongPayload(req.payload)
            const {playlistId} = req.params
            const { songId } = req.payload
            const {id: credentialId} = req.auth.credentials

            await this._service.verifyThePlaylistAccess(playlistId, credentialId)
            await this._service.addSongToPlaylists(playlistId, songId)

            const response = h.response({
                status: 'success',
                message: 'Lagu Berhasil ditambahkan'
            })

            response.code(201)
            return response
            
        } catch (error) {
            if(error instanceof ClientError){
                const response = h.response({
                    status: 'fail',
                    message: error.message
                })

                response.code(error.statusCode)
                return response
            }

            const response = h.response({
                status: 'fail',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            })

            response.code(500)
            return response
        }
    };

    async getSongOnPlaylistsHandler(req, h){ //Selesai
        try {
            const {playlistId} = req.params
            const {id: credentialId} = req.auth.credentials

            await this._service.verifyThePlaylistAccess(playlistId, credentialId)

            const music = await this._service.getSongOnPlaylists(playlistId)
            const songs = music
            return {
                status: 'success',
                data : {
                    songs
                }   
            }
        } catch (error) {
            if(error instanceof ClientError){
                const response= h.response({
                    status: 'fail',
                    message: error.message
                })

                response.code(error.statusCode)
                return response
            }

            const response = h.response({
                status: 'fail',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            })
            response.code(500)
            return response
        }
    };
    
    async deleteSongFromPlaylistsHandler(req, h){ //Selesai
        try {
            const {playlistId} = req.params
            const {songId} = req.payload
            const {id:credentialId} = req.auth.credentials

            await this._service.verifyThePlaylistAccess(playlistId, credentialId)
            await this._service.deleteSongFromPlaylists(playlistId, songId)

            return {
                status: 'success',
                message: 'Lagu berhasil dihapus dari playlist'
            }
        } catch (error) {
            if(error instanceof ClientError){
                const response = h.response({
                    status: 'fail',
                    message: error.message
                })

                response.code(error.statusCode)
                return response
            }

            const response = h.response({
                status: 'fail',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            })

            response.code(500)
            return response
        }
    };

    async getUsernameHandler(req, h) { //Selesai
        try {
            const { username = '' } = req.query;
            const users = await this._service.getUserWithUsername(username);
            return {
              status: 'success',
              data: {
                users,
              },
            };
          } catch (error) {
            if (error instanceof ClientError) {
              const response = h.response({
                status: 'fail',
                message: error.message,
              });
              response.code(error.statusCode);
              return response;
            }
      
            // Server ERROR!
            const response = h.response({
              status: 'error',
              message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
          }
    };

}

module.exports = PlaylistsHandler;