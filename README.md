# Digit Recognition based on MNIST dataset

Deze repo bevat een opgeslagen TensorFlow model ([`saved_model.pb`](./saved_model.pb)) die is gemaakt a.d.h.v. [deze tutorial](https://colab.research.google.com/github/tensorflow/docs/blob/master/site/en/tutorials/quickstart/beginner.ipynb). Vervolgens is het model geconverteerd naar een 'Frozen Model', geschikt voor gebruik met TensorFlow.js.

Het script om het model te converteren is te vinden in [`convert.sh`](./convert.sh) in de root van deze repo. Dit script is gebaseerd op [deze tutorial](https://www.tensorflow.org/js/tutorials/conversion/import_saved_model) en vereist Python 3.6+.

## Direct aan de slag

1. Clone deze repo
2. Open een terminal in de `web_app` folder
3. Voer `npm install` uit
4. Open de web app in je browser (bijvoorbeeld met [Live Server in VS Code](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer))

## Zelf het model bemachtigen

De `saved_model.pb` is al aanwezig in deze repo, maar als je het model zelf wilt genereren, volg dan de volgende stappen:

1. Voer alle stappen uit in [deze tutorial](https://colab.research.google.com/github/tensorflow/docs/blob/master/site/en/tutorials/quickstart/beginner.ipynb). Zorg dat alle code-blokken zijn uitgevoerd.
2. Voeg in de tutorial, na het code blok `model.fit(x_train, y_train, epochs=5)`, de volgende code toe:

    ```python
    export_dir = 'export/'
    tf.saved_model.save(model, export_dir)
    ```

3. Voer die code uit met de 'play'-knop voor de code. Het model wordt opgeslagen naar de `export` map.
4. Zoek links in de navigatiebalk de 'Bestanden'-knop (map-icoontje).
5. Download alle bestanden in de `export` map.

## Bijzonderheden

- De meest interessante code is te vinden in [`web_app/app.js`](./web_app/app.js). Daar gebeurt het laden van het TFJS Frozen Model en het voorspellen van de cijfers.
- Het model is getrained op afbeeldingen van cijfers van 28x28 pixels. Daarom wordt de canvas in de web app ook op die grootte ingesteld.
- Omdat het model is getrained op witte cijfers op een zwarte achtergrond, wordt de afbeelding in de web app ook omgekeerd: `reshapedInput = reshapedInput.mul(-1).add(1);` (zie [`web_app/app.js`](./web_app/app.js))
- Het model is niet heel goed als je het cijfer niet in het midden van het canvas tekent. Dit komt omdat het model is getrained op afbeeldingen van cijfers die in het midden van de afbeelding staan. Dit is op te lossen door het model te trainen op afbeeldingen van cijfers die op willekeurige plekken staan. Dit is echter niet gedaan in deze repo.