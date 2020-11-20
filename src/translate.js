const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');


/**
 * Helper 
 * @param {*} errorMessage 
 * @param {*} defaultLanguage 
 */
function getTheErrorResponse(errorMessage, defaultLanguage) {
  return {
    statusCode: 200,
    body: {
      language: defaultLanguage || 'en',
      errorMessage: errorMessage
    }
  };
}

/**
  *
  * main() will be run when teh action is invoked
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */
function main(params) {

  /*
   * The default language to choose in case of an error
   */
  const defaultLanguage = 'en';

  return new Promise(function (resolve, reject) {

    try {

      // *******TODO**********
      // - Call the language translation API of the translation service
      // see: https://cloud.ibm.com/apidocs/language-translator?code=node#translate
      // - if successful, resolve exatly like shown below with the
      // translated text in the "translation" property,
      // the number of translated words in "words"
      // and the number of characters in "characters".

      // in case of errors during the call resolve with an error message according to the pattern
      // found in the catch clause below

      // pick the language with the highest confidence, and send it back

      const languageTranslator = new LanguageTranslatorV3({
        version: '2018-05-01',
        authenticator: new IamAuthenticator({
          apikey: 'ZB2lK70gYQN3y7cmTZPin7mrMKzSUFglCQ3b0D9qwmtE',
        }),
        serviceUrl: 'https://api.eu-de.language-translator.watson.cloud.ibm.com/instances/8d7be732-048d-415c-8ae5-6fce75e3a959',
      });


      const translateParams = {
        text: 'Hello, how are you today?',
        modelId: 'en-es',
      };

      languageTranslator.translate(translateParams)
          .then(translationResult => {
            //console.log(JSON.stringify(translationResult.result,null,2));

            const translate_text = translationResult.result.translations[0].translation;
            const translate_word = translationResult.result.word_count;
            const translate_character = translationResult.result.character_count;

            console.log("Translation: "+translate_text);
            console.log("Words: "+translate_word);
            console.log("Character: "+translate_character);

            resolve({
              statusCode: 200,
              body: {
                translations: "<translated text>",
                words: 1,
                characters: 11,
              },
              headers: { 'Content-Type': 'application/json' }
            });

          })
          .catch(err => {
            console.log('error:', err);
          });

         
    } catch (err) {
      console.error('Error while initializing the AI service', err);
      resolve(getTheErrorResponse('Error while communicating with the language service', defaultLanguage));
    }
  });
}
