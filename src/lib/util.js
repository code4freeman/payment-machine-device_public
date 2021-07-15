const { say: { say: sound }, say: Say } = window.require("raspi-helper");
const { TTS } = ENV;

/**
 * 播报声音
 * 
 * @param {String} text
 */
export async function say (text = "") {
    await sound(text, new sound.defaultText2Sound.Option({
        secretId: TTS.secretId,
        secretKey: TTS.secretKey
    }));
}