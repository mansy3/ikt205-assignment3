Blodroed Notes

Repo: https://github.com/mansy3/ikt205-assignment3.git

Kort om appen

En notat-app laget med React Native, Expo og Supabase. Man kan logge inn, lage notater, se notater og slette dem. Appen har paginering slik at den bare henter 5 notater om gangen fra databasen.


Hva som er gjort

Testing (35 prosent)

Tre testfiler ligger i src/__tests__/

AddNoteScreen.test.js - Tester at et notat blir opprettet og at man blir navigert tilbake til notatlisten etterpå. Bruker fireEvent.press på lagre-knappen og sjekker at navigation.navigate blir kalt med NoteList.

NoteDetailScreen.test.js - Tester at en spinner vises mens notatet lastes fra databasen, og at spinneren forsvinner når dataen er hentet. Supabase er mocka med jest.mock.

AuthGuard.test.js - Tester at man ikke kan se notatlisten eller legg-til-knappen hvis man ikke er logget inn. Når user er null skal login-skjermen vises i stedet.

Kjør testene med npm test.


Production Readiness (40 prosent)

Ingen console.log i koden.

Kameraet bruker useIsFocused fra React Navigation slik at det stopper når man navigerer bort fra kameraskjermen. Se CameraScreen.js.

Paginering er implementert i NoteListScreen.js. Appen henter bare de 5 første notatene med .range(0, 4). En Last mer knapp henter de neste 5 med .range(start, end).


Hvordan bygge appen

1. Klon repoet og gå inn i mappen

git clone https://github.com/mansy3/ikt205-assignment3.git
cd ikt205-assignment3

2. Installer avhengigheter

npm install

3. Sett inn dine egne Supabase-nøkler i src/lib/supabase.js

4. Kjør appen i utvikling

npx expo start --android

5. Kjør testene

npm test

6. Bygg APK

eas login
eas build -p android --profile preview

APK-filen kan lastes ned fra Expo sin nettside etter bygget er ferdig.


Supabase oppsett

Lag en tabell som heter notes med disse kolonnene: id (uuid), user_id (uuid), title (text), content (text), created_at (timestamptz). Slå på Row Level Security.
