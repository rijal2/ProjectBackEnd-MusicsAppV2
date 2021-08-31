const {playlistsPayloadSchema, songPayloadSchema} = require("./schema")
const InvariantError = require('../../exceptions/InvariantError')

const playlistsValidator = {
    validationPlaylistPayload: (payload) => {
        const validationResult = playlistsPayloadSchema.validate(payload)
        if(validationResult.error){
            throw new InvariantError(validationResult.error.message)
        }
    },

    validationSongPayload: (payload) => {
        const validationResult = songPayloadSchema.validate(payload)
        if(validationResult.error){
            throw new InvariantError(validationResult.error.message)
        }
    }
}

module.exports = playlistsValidator;