# Sporto veiklu sistema

## 1. Description of the problem to be solved

### 1.1. Purpose of the system

Pagrindinis projekto tikslas yra sukurti platformą, kurioje naudotojai gali lengvai surasti sporto veiklas pagal miestą, veiklos tipą ir vietas, bei gauti išsamią informaciją apie šias veiklas. Kiekvienas naudotojas sistemoje turės tam tikrą rolę, kuri nulems jų prieinamą funkcionalumą.

Administratorius privalės prisijungti, kad galėtų naudotis sistemos funkcijomis. Po prisijungimo administratorius gaus pilną prieigą prie sistemos ir galės valdyti visus aspektus, įskaitant sporto veiklų, vietų ir naudotojų administravimą.

Potencialūs klientai (naudotojai) galės naršyti sistemą ir peržiūrėti sporto veiklas pagal miestą, veiklos tipą ar kitus kriterijus (pvz., vidinis/ išorinis sportas, laiko filtrai).
Be registracijos, jie galės matyti pagrindinę informaciją, tačiau norėdami peržiūrėti išsamią informaciją apie veiklos laikus, trenerius ar kainas, jiems reikės prisiregistruoti.
Naudotojai galės peržiūrėti sporto vietos aprašymą, matyti trenerių siūlomas veiklas, įskaitant treniruotes, ir skaityti atsiliepimus apie sporto vietas ar trenerius.
Prisiregistravę naudotojai galės registruotis į veiklas bei palikti atsiliepimus ir reitingus, susijusius su veiklomis ar vietomis.

### 1.2. Functional requirements

Sistemos svečias galės:

-Peržiūrėti sistemoje egzistuojančius miestus ir sporto veiklas;
-Filtruoti sporto veiklas pagal miestą ar kitus kriterijus;
-Matyti trumpą sporto veiklos aprašymą (pvz., sporto tipą, bet ne tikslią vietą ar laiką);
-Registruotis sistemoje norint gauti pilną prieigą.

Registruotas naudotojas galės:

-Prisijungti prie sistemos;
-Matyti išsamią informaciją apie sporto veiklas ir jų vietas;
-Registruotis į sporto veiklas ir renginius;
-Palikti atsiliepimus apie veiklas, vietas;
-Dalyvauti diskusijose ar komentaruose, susijusiuose su sporto veiklomis;
-Atnaujinti savo naudotojo informaciją.

Administratorius galės:

-Prisijungti prie sistemos;
-Pridėti naujas sporto veiklas ir vietas;
-Redaguoti esamas sporto veiklas ir vietas;
-Šalinti nereikalingas sporto veiklas ir vietas;
-Tvarkyti registruotų naudotojų sąrašą, šalinti netinkamus naudotojus;
-Prižiūrėti ir moderuoti naudotojų turinį (atsiliepimus, diskusijas);
-Matyti sistemos statistiką ir valdyti administracines funkcijas.

## 2. Sistemos architektūra

Sistemos sudedamosios dalys:

Kliento pusė – bus realizuota naudojant React.jsx;
Serverio pusė – bus realizuota naudojant PHP Laravel;
Duomenų bazė – MySQL.

## 3. Front-end pages

| ![Pagrindinis puslapis](storage/app/public/readme/HomePage.png) |
| :-------------------------------------------------------------: |
|                     _Pagrindinis puslapis_                      |

<br>

| ![Registracijos puslapis](storage/app/public/readme/Signup.png) |
| :-------------------------------------------------------------: |
|                    _Registracijos puslapis_                     |

<br>

| ![Prisijungimo puslapis](storage/app/public/readme/Login.png) |
| :-----------------------------------------------------------: |
|                    _Prisijungimo puslapis_                    |

<br>

| ![Miestų sąrašo puslapis (naudotojas prisijungęs, arba svečias)](storage/app/public/readme/CitiesU.png) |
| :-----------------------------------------------------------------------------------------------------: |
|                     _Miestų sąrašo puslapis (naudotojas prisijungęs, arba svečias)_                     |

<br>

| ![Miestų sąrašo puslapis (naudotojas prisijungęs kaip administratorius)](storage/app/public/readme/CitiesA.png) |
| :-------------------------------------------------------------------------------------------------------------: |
|                     _Miestų sąrašo puslapis (naudotojas prisijungęs kaip administratorius)_                     |

<br>

| ![Sporto klubų sąrašo puslapis (naudotojas prisijungęs, arba svečias)](storage/app/public/readme/GymsU.png) |
| :---------------------------------------------------------------------------------------------------------: |
|                   _Sporto klubų sąrašo puslapiss (naudotojas prisijungęs, arba svečias)_                    |

<br>

| ![Sporto klubų sąrašo puslapis (naudotojas prisijungęs kaip administratorius)](storage/app/public/readme/GymsA.png) |
| :-----------------------------------------------------------------------------------------------------------------: |
|                    _Sporto klubų sąrašo puslapis (naudotojas prisijungęs kaip administratorius)_                    |

<br>

| ![Sporto klubo trenerių sąrašo puslapis (naudotojas prisijungęs, arba svečias)](storage/app/public/readme/CoachesU.png) |
| :---------------------------------------------------------------------------------------------------------------------: |
|                     _Sporto klubo trenerių sąrašo puslapis (naudotojas prisijungęs, arba svečias)_                      |

<br>

| ![Sporto klubo trenerių sąrašo puslapis (naudotojas prisijungęs kaip administratorius)](storage/app/public/readme/CoachesA.png) |
| :-----------------------------------------------------------------------------------------------------------------------------: |
|                     _Sporto klubo trenerių sąrašo puslapis (naudotojas prisijungęs kaip administratorius)_                      |

<br>

| ![Sporto renginių sąrašo puslapis (naudotojas prisijungęs kaip administratorius, arba svečias)](storage/app/public/readme/SportsEventsG.png) |
| :------------------------------------------------------------------------------------------------------------------------------------------: |
|                        _Sporto renginių sąrašo puslapis (naudotojas prisijungęs kaip administratorius, arba svečias)_                        |

<br>

| ![Sporto renginių sąrašo puslapis (naudotojas prisijungęs)](storage/app/public/readme/SportsEventsU.png) |
| :------------------------------------------------------------------------------------------------------: |
|                        _Sporto renginių sąrašo puslapis (naudotojas prisijungęs)_                        |

<br>

| ![Prisijungusio naudotojo informacijos peržiūros puslapis](storage/app/public/readme/ProfileV.png) |
| :------------------------------------------------------------------------------------------------: |
|                     _Prisijungusio naudotojo informacijos peržiūros puslapis_                      |

<br>

| ![Prisijungusio naudotojo informacijos redagavimo puslapis](storage/app/public/readme/ProfileE.png) |
| :-------------------------------------------------------------------------------------------------: |
|                     _Prisijungusio naudotojo informacijos redagavimo puslapis_                      |

<br>

| ![Paskyros šalinimo modalas](storage/app/public/readme/ProfileDel.png) |
| :--------------------------------------------------------------------: |
|                      _Paskyros šalinimo modalas_                       |

<br>

| ![Miesto šalinimo modalas (naudotojas prisijungęs kaip administratorius)](storage/app/public/readme/CitiesDel.png) |
| :----------------------------------------------------------------------------------------------------------------: |
|                      _Miesto šalinimo modalas (naudotojas prisijungęs kaip administratorius)_                      |

<br>

| ![Miesto kūrimo puslapis (naudotojas prisijungęs kaip administratorius)](storage/app/public/readme/CitiesCre.png) |
| :---------------------------------------------------------------------------------------------------------------: |
|                      _Miesto kūrimo puslapis (naudotojas prisijungęs kaip administratorius)_                      |

<br>

| ![Sporto klubo šalinimo modalas (naudotojas prisijungęs kaip administratorius)](storage/app/public/readme/GymsDel.png) |
| :--------------------------------------------------------------------------------------------------------------------: |
|                     _Sporto klubo šalinimo modalas (naudotojas prisijungęs kaip administratorius)_                     |

<br>

| ![Sporto klubo kūrimo puslapis (naudotojas prisijungęs kaip administratorius)](storage/app/public/readme/GymsCre.png) |
| :-------------------------------------------------------------------------------------------------------------------: |
|                     _Sporto klubo kūrimo puslapis (naudotojas prisijungęs kaip administratorius)_                     |

<br>

| ![Sporto klubo redagavimo puslapis (naudotojas prisijungęs kaip administratorius)](storage/app/public/readme/GymsEdi.png) |
| :-----------------------------------------------------------------------------------------------------------------------: |
|                     _Sporto klubo redagavimo puslapis (naudotojas prisijungęs kaip administratorius)_                     |

<br>

| ![Trenerio šalinimo modalas (naudotojas prisijungęs kaip administratorius)](storage/app/public/readme/CoachesDel.png) |
| :-------------------------------------------------------------------------------------------------------------------: |
|                      _Trenerio šalinimo modalas (naudotojas prisijungęs kaip administratorius)_                       |

<br>

| ![Trenerio kūrimo puslapis (naudotojas prisijungęs kaip administratorius)](storage/app/public/readme/CoachesCre.png) |
| :------------------------------------------------------------------------------------------------------------------: |
|                      _Trenerio kūrimo puslapis (naudotojas prisijungęs kaip administratorius)_                       |

<br>

| ![Trenerio redagavimo puslapis (naudotojas prisijungęs kaip administratorius)](storage/app/public/readme/CoachesEdi.png) |
| :----------------------------------------------------------------------------------------------------------------------: |
|                      _Trenerio redagavimo puslapis (naudotojas prisijungęs kaip administratorius)_                       |

<br>

| ![Prisiregistruotų naudotojų peržiūros puslapis (naudotojas prisijungęs kaip administratorius)](storage/app/public/readme/Users.png) |
| :----------------------------------------------------------------------------------------------------------------------------------: |
|                    _Prisiregistruotų naudotojų peržiūros puslapis (naudotojas prisijungęs kaip administratorius)_                    |

<br>

| ![Prisiregistruoto naudotojo šalinimo modalas (naudotojas prisijungęs kaip administratorius)](storage/app/public/readme/UsersDel.png) |
| :-----------------------------------------------------------------------------------------------------------------------------------: |
|                     _Prisiregistruoto naudotojo šalinimo modalas (naudotojas prisijungęs kaip administratorius)_                      |

<br>

## 4. API specifikacija

-   Atsako formatas: JSON
-   Užklausų kiekis: neribotas

### 4.1 City API methods

**Get a list of cities**

 <table> <tr> <td width="500px">API Method:</td> <td width="500px">GET</td> </tr> <tr> <td>Purpose:</td> <td>Retrieve a list of all cities.</td> </tr> <tr> <td>Accessible via:</td> <td>/api/cities</td> </tr> <tr> <td>Request "header" part:</td> <td>-</td> </tr> <tr> <td>Request structure:</td> <td>-</td> </tr> <tr> <td>Response structure:</td> <td> <code>[ { "id": 1, "name": "New York" }, { "id": 2, "name": "Los Angeles" } ]</code> </td> </tr> <tr> <td>Possible response codes:</td> <td> - 200 (OK): Successfully retrieved the list of cities.<br> - 405 (Method Not Allowed): Unsupported HTTP request method. </td> </tr> </table> <br>

**Get details of a specific city**

 <table> <tr> <td width="500px">API Method:</td> <td width="500px">GET</td> </tr> <tr> <td>Purpose:</td> <td>Retrieve information about a specific city by its ID.</td> </tr> <tr> <td>Accessible via:</td> <td>/api/cities/{id}</td> </tr> <tr> <td>Request "header" part:</td> <td>-</td> </tr> <tr> <td>Request structure:</td> <td>-</td> </tr> <tr> <td>Response structure:</td> <td> <code>{ "id": 1, "name": "New York" }</code> </td> </tr> <tr> <td>Possible response codes:</td> <td> - 200 (OK): Successfully retrieved city details.<br> - 404 (Not Found): City with the specified ID does not exist.<br> - 405 (Method Not Allowed): Unsupported HTTP request method. </td> </tr> </table> <br>

**Create a new city**

 <table> <tr> <td width="500px">API Method:</td> <td width="500px">POST</td> </tr> <tr> <td>Purpose:</td> <td>Create a new city.</td> </tr> <tr> <td>Accessible via:</td> <td>/api/cities</td> </tr> <tr> <td>Request "header" part:</td> <td>Authorization: Bearer {token}</td> </tr> <tr> <td>Request structure:</td> <td> <code>{ "name": "San Francisco" }</code> </td> </tr> <tr> <td>Response structure:</td> <td> <code>{ "id": 3, "name": "San Francisco" }</code> </td> </tr> <tr> <td>Possible response codes:</td> <td> - 201 (Created): Successfully created the city.<br> - 401 (Unauthorized): Missing or invalid token.<br> - 422 (Unprocessable Entity): Invalid JSON data provided.<br> - 405 (Method Not Allowed): Unsupported HTTP request method. </td> </tr> </table> <br>

**Delete a city**

 <table> <tr> <td width="500px">API Method:</td> <td width="500px">DELETE</td> </tr> <tr> <td>Purpose:</td> <td>Delete an existing city by its ID.</td> </tr> <tr> <td>Accessible via:</td> <td>/api/cities/{id}</td> </tr> <tr> <td>Request "header" part:</td> <td>Authorization: Bearer {token}</td> </tr> <tr> <td>Request structure:</td> <td>-</td> </tr> <tr> <td>Response structure:</td> <td>-</td> </tr> <tr> <td>Possible response codes:</td> <td> - 204 (No Content): Successfully deleted the city.<br> - 401 (Unauthorized): Missing or invalid token.<br> - 403 (Forbidden): User lacks permission to delete.<br> - 404 (Not Found): City with the specified ID does not exist.<br> - 405 (Method Not Allowed): Unsupported HTTP request method. </td> </tr> </table>

### 4.2 Gym API methods

**Get a list of gyms in a city**

<table> <tr> <td width="500px">API Method:</td> <td width="500px">GET</td> </tr> <tr> <td>Purpose:</td> <td>Retrieve a list of all gyms in a specific city.</td> </tr> <tr> <td>Accessible via:</td> <td>/api/cities/{city}/gyms</td> </tr> <tr> <td>Request "header" part:</td> <td>-</td> </tr> <tr> <td>Request structure:</td> <td>-</td> </tr> <tr> <td>Response structure:</td> <td> <code>[ { "id": 1, "name": "Gold's Gym", "city_id": 1 }, { "id": 2, "name": "Planet Fitness", "city_id": 1 } ]</code> </td> </tr> <tr> <td>Possible response codes:</td> <td> - 200 (OK): Successfully retrieved the list of gyms.<br> - 404 (Not Found): City with the specified ID does not exist.<br> - 405 (Method Not Allowed): Unsupported HTTP request method. </td> </tr> </table> <br>

**Get details of a specific gym**

<table> <tr> <td width="500px">API Method:</td> <td width="500px">GET</td> </tr> <tr> <td>Purpose:</td> <td>Retrieve information about a specific gym in a city by its ID.</td> </tr> <tr> <td>Accessible via:</td> <td>/api/cities/{city}/gyms/{gym}</td> </tr> <tr> <td>Request "header" part:</td> <td>-</td> </tr> <tr> <td>Request structure:</td> <td>-</td> </tr> <tr> <td>Response structure:</td> <td> <code>{ "id": 1, "name": "Gold's Gym", "city_id": 1 }</code> </td> </tr> <tr> <td>Possible response codes:</td> <td> - 200 (OK): Successfully retrieved gym details.<br> - 404 (Not Found): Gym or city with the specified ID does not exist, or gym does not belong to the city.<br> - 405 (Method Not Allowed): Unsupported HTTP request method. </td> </tr> </table> <br>

**Create a new gym in a city**

<table> <tr> <td width="500px">API Method:</td> <td width="500px">POST</td> </tr> <tr> <td>Purpose:</td> <td>Create a new gym in a specified city.</td> </tr> <tr> <td>Accessible via:</td> <td>/api/cities/{city}/gyms</td> </tr> <tr> <td>Request "header" part:</td> <td>Authorization: Bearer {token}</td> </tr> <tr> <td>Request structure:</td> <td> <code>{ "name": "Fitness World", "image_url": "https://example.com/image.jpg" }</code> </td> </tr> <tr> <td>Response structure:</td> <td> <code>{ "id": 3, "name": "Fitness World", "city_id": 1 }</code> </td> </tr> <tr> <td>Possible response codes:</td> <td> - 201 (Created): Successfully created the gym.<br> - 401 (Unauthorized): Missing or invalid token.<br> - 404 (Not Found): City with the specified ID does not exist.<br> - 422 (Unprocessable Entity): Invalid JSON data provided.<br> - 405 (Method Not Allowed): Unsupported HTTP request method. </td> </tr> </table> <br>

**Update an existing gym in a city**

<table> <tr> <td width="500px">API Method:</td> <td width="500px">PUT</td> </tr> <tr> <td>Purpose:</td> <td>Update details of an existing gym in a specified city.</td> </tr> <tr> <td>Accessible via:</td> <td>/api/cities/{city}/gyms/{gym}</td> </tr> <tr> <td>Request "header" part:</td> <td>Authorization: Bearer {token}</td> </tr> <tr> <td>Request structure:</td> <td> <code>{ "name": "Updated Gym Name", "image_url": "https://example.com/new-image.jpg" }</code> </td> </tr> <tr> <td>Response structure:</td> <td> <code>{ "id": 1, "name": "Updated Gym Name", "city_id": 1 }</code> </td> </tr> <tr> <td>Possible response codes:</td> <td> - 200 (OK): Successfully updated the gym.<br> - 401 (Unauthorized): Missing or invalid token.<br> - 404 (Not Found): Gym or city with the specified ID does not exist, or gym does not belong to the city.<br> - 422 (Unprocessable Entity): Invalid JSON data provided.<br> - 405 (Method Not Allowed): Unsupported HTTP request method. </td> </tr> </table> <br>

**Delete a gym in a city**

<table> <tr> <td width="500px">API Method:</td> <td width="500px">DELETE</td> </tr> <tr> <td>Purpose:</td> <td>Delete an existing gym in a specified city.</td> </tr> <tr> <td>Accessible via:</td> <td>/api/cities/{city}/gyms/{gym}</td> </tr> <tr> <td>Request "header" part:</td> <td>Authorization: Bearer {token}</td> </tr> <tr> <td>Request structure:</td> <td>-</td> </tr> <tr> <td>Response structure:</td> <td>-</td> </tr> <tr> <td>Possible response codes:</td> <td> - 204 (No Content): Successfully deleted the gym.<br> - 401 (Unauthorized): Missing or invalid token.<br> - 404 (Not Found): Gym or city with the specified ID does not exist, or gym does not belong to the city.<br> - 405 (Method Not Allowed): Unsupported HTTP request method. </td> </tr> </table>

### 4.3 Coach API methods

**Get a list of coaches for a specific gym in a city**

<table> <tr> <td width="500px">API Method:</td> <td width="500px">GET</td> </tr> <tr> <td>Purpose:</td> <td>Retrieve a list of coaches associated with a specific gym in a city.</td> </tr> <tr> <td>Accessible via:</td> <td>/api/cities/{cityId}/gyms/{gymId}/coaches</td> </tr> <tr> <td>Request "header" part:</td> <td>-</td> </tr> <tr> <td>Request structure:</td> <td>-</td> </tr> <tr> <td>Response structure:</td> <td> <code>[ { "id": 1, "name": "John Doe", "specialty": "Personal Training" }, { "id": 2, "name": "Jane Smith", "specialty": "Yoga" } ]</code> </td> </tr> <tr> <td>Possible response codes:</td> <td> - 200 (OK): Successfully retrieved the list of coaches.<br> - 404 (Not Found): City or gym not found.<br> </td> </tr> </table> <br>

**Get details of a specific coach**

<table> <tr> <td width="500px">API Method:</td> <td width="500px">GET</td> </tr> <tr> <td>Purpose:</td> <td>Retrieve details of a specific coach at a gym in a city.</td> </tr> <tr> <td>Accessible via:</td> <td>/api/cities/{cityId}/gyms/{gymId}/coaches/{coachId}</td> </tr> <tr> <td>Request "header" part:</td> <td>-</td> </tr> <tr> <td>Request structure:</td> <td>-</td> </tr> <tr> <td>Response structure:</td> <td> <code>{ "id": 1, "name": "John Doe", "specialty": "Personal Training" }</code> </td> </tr> <tr> <td>Possible response codes:</td> <td> - 200 (OK): Successfully retrieved coach details.<br> - 404 (Not Found): City, gym, or coach not found.<br> </td> </tr> </table> <br>

**Create a new coach**

<table> <tr> <td width="500px">API Method:</td> <td width="500px">POST</td> </tr> <tr> <td>Purpose:</td> <td>Create a new coach for a gym in a specific city.</td> </tr> <tr> <td>Accessible via:</td> <td>/api/cities/{cityId}/gyms/{gymId}/coaches</td> </tr> <tr> <td>Request "header" part:</td> <td>Authorization: Bearer {token}</td> </tr> <tr> <td>Request structure:</td> <td> <code>{ "name": "Alice Johnson", "specialty": "Zumba"}</code> </td> </tr> <tr> <td>Response structure:</td> <td> <code>{ "id": 3, "name": "Alice Johnson", "specialty": "Zumba"}</code> </td> </tr> <tr> <td>Possible response codes:</td> <td> - 201 (Created): Successfully created the coach.<br> - 401 (Unauthorized): Missing or invalid token.<br> - 404 (Not Found): City or gym not found.<br> - 422 (Unprocessable Entity): Invalid data provided.<br> </td> </tr> </table> <br>

**Update an existing coach**

<table> <tr> <td width="500px">API Method:</td> <td width="500px">PUT</td> </tr> <tr> <td>Purpose:</td> <td>Update the details of an existing coach at a gym in a city.</td> </tr> <tr> <td>Accessible via:</td> <td>/api/cities/{cityId}/gyms/{gymId}/coaches/{coachId}</td> </tr> <tr> <td>Request "header" part:</td> <td>Authorization: Bearer {token}</td> </tr> <tr> <td>Request structure:</td> <td> <code>{ "name": "Alice Johnson", "specialty": "Pilates",  }</code> </td> </tr> <tr> <td>Response structure:</td> <td> <code>{ "id": 3, "name": "Alice Johnson", "specialty": "Pilates",  }</code> </td> </tr> <tr> <td>Possible response codes:</td> <td> - 200 (OK): Successfully updated the coach.<br> - 401 (Unauthorized): Missing or invalid token.<br> - 404 (Not Found): City, gym, or coach not found.<br> - 422 (Unprocessable Entity): Invalid data provided.<br> </td> </tr> </table> <br>

**Delete a coach**

<table> <tr> <td width="500px">API Method:</td> <td width="500px">DELETE</td> </tr> <tr> <td>Purpose:</td> <td>Delete a coach from a gym in a city.</td> </tr> <tr> <td>Accessible via:</td> <td>/api/cities/{cityId}/gyms/{gymId}/coaches/{coachId}</td> </tr> <tr> <td>Request "header" part:</td> <td>Authorization: Bearer {token}</td> </tr> <tr> <td>Request structure:</td> <td>-</td> </tr> <tr> <td>Response structure:</td> <td>-</td> </tr> <tr> <td>Possible response codes:</td> <td> - 204 (No Content): Successfully deleted the coach.<br> - 401 (Unauthorized): Missing or invalid token.<br> - 404 (Not Found): City, gym, or coach not found.<br> </td> </tr> </table> <br>

### 4.4 User API methods

**Get a list of all users**

<table> <tr> <td width="500px">API Method:</td> <td width="500px">GET</td> </tr> <tr> <td>Purpose:</td> <td>Retrieve a list of all users in the system.</td> </tr> <tr> <td>Accessible via:</td> <td>/api/users</td> </tr> <tr> <td>Request "header" part:</td> <td>Authorization: Bearer {token}</td> </tr> <tr> <td>Request structure:</td> <td>-</td> </tr> <tr> <td>Response structure:</td> <td> <code>[ { "id": 1, "name": "John Doe", "email": "john@example.com" }, { "id": 2, "name": "Jane Smith", "email": "jane@example.com" } ]</code> </td> </tr> <tr> <td>Possible response codes:</td> <td> - 200 (OK): Successfully retrieved the list of users.<br> - 401 (Unauthorized): Missing or invalid token.<br> </td> </tr> </table> <br>

**Get details of a specific user**

<table> <tr> <td width="500px">API Method:</td> <td width="500px">GET</td> </tr> <tr> <td>Purpose:</td> <td>Retrieve details of a specific user by their ID.</td> </tr> <tr> <td>Accessible via:</td> <td>/api/users/{id}</td> </tr> <tr> <td>Request "header" part:</td> <td>Authorization: Bearer {token}</td> </tr> <tr> <td>Request structure:</td> <td>-</td> </tr> <tr> <td>Response structure:</td> <td> <code>{ "id": 1, "name": "John Doe", "email": "john@example.com" }</code> </td> </tr> <tr> <td>Possible response codes:</td> <td> - 200 (OK): Successfully retrieved user details.<br> - 404 (Not Found): User not found.<br> </td> </tr> </table> <br>

**Get the currently authenticated user's details**

<table> <tr> <td width="500px">API Method:</td> <td width="500px">GET</td> </tr> <tr> <td>Purpose:</td> <td>Retrieve the details of the currently authenticated user.</td> </tr> <tr> <td>Accessible via:</td> <td>/api/user</td> </tr> <tr> <td>Request "header" part:</td> <td>Authorization: Bearer {token}</td> </tr> <tr> <td>Request structure:</td> <td>-</td> </tr> <tr> <td>Response structure:</td> <td> <code>{ "id": 1, "name": "John Doe", "email": "john@example.com" }</code> </td> </tr> <tr> <td>Possible response codes:</td> <td> - 200 (OK): Successfully retrieved the current user's details.<br> - 401 (Unauthorized): Missing or invalid token.<br> </td> </tr> </table> <br>

**Update a user's details**

<table> <tr> <td width="500px">API Method:</td> <td width="500px">PATCH</td> </tr> <tr> <td>Purpose:</td> <td>Update the details of a specific user by their ID.</td> </tr> <tr> <td>Accessible via:</td> <td>/api/users/{userId}</td> </tr> <tr> <td>Request "header" part:</td> <td>Authorization: Bearer {token}</td> </tr> <tr> <td>Request structure:</td> <td> <code>{ "name": "John Doe", "email": "john.doe@example.com", "password": "newpassword123" }</code> </td> </tr> <tr> <td>Response structure:</td> <td> <code>{ "id": 1, "name": "John Doe", "email": "john.doe@example.com" }</code> </td> </tr> <tr> <td>Possible response codes:</td> <td> - 200 (OK): Successfully updated the user.<br> - 422 (Unprocessable Entity): Invalid data provided.<br> - 404 (Not Found): User not found.<br> </td> </tr> </table> <br>

**Delete a user**

<table> <tr> <td width="500px">API Method:</td> <td width="500px">DELETE</td> </tr> <tr> <td>Purpose:</td> <td>Delete a user from the system.</td> </tr> <tr> <td>Accessible via:</td> <td>/api/users/{userId}</td> </tr> <tr> <td>Request "header" part:</td> <td>Authorization: Bearer {token}</td> </tr> <tr> <td>Request structure:</td> <td>-</td> </tr> <tr> <td>Response structure:</td> <td>-</td> </tr> <tr> <td>Possible response codes:</td> <td> - 204 (No Content): Successfully deleted the user.<br> - 404 (Not Found): User not found.<br> </td> </tr> </table> <br>

### 4.5 Authentication API methods

**User Signup**

<table> <tr> <td width="500px">API Method:</td> <td width="500px">POST</td> </tr> <tr> <td>Purpose:</td> <td>Create a new user account.</td> </tr> <tr> <td>Accessible via:</td> <td>/api/signup</td> </tr> <tr> <td>Request "header" part:</td> <td>-</td> </tr> <tr> <td>Request structure:</td> <td> <code>{ "name": "John Doe", "email": "john@example.com", "password": "Password123-", "password_confirmation": "Password123-" }</code> </td> </tr> <tr> <td>Response structure:</td> <td> <code>{ "message": "Signup successful!", "user": { "id": 1, "name": "John Doe", "email": "john@example.com" } }</code> </td> </tr> <tr> <td>Possible response codes:</td> <td> - 201 (Created): Successfully signed up.<br> - 400 (Bad Request): Validation error, such as missing or invalid data.<br> </td> </tr> </table> <br>

**User Login**

<table> <tr> <td width="500px">API Method:</td> <td width="500px">POST</td> </tr> <tr> <td>Purpose:</td> <td>Authenticate a user and generate access and refresh tokens.</td> </tr> <tr> <td>Accessible via:</td> <td>/api/login</td> </tr> <tr> <td>Request "header" part:</td> <td>-</td> </tr> <tr> <td>Request structure:</td> <td> <code>{ "email": "john@example.com", "password": "Password123-" }</code> </td> </tr> <tr> <td>Response structure:</td> <td> <code>{ "success": true, "message": "Login successful", "accessToken": "access_token_value", "refreshToken": "refresh_token_value", "tokenType": "bearer", "accessExpiresIn": 3600, "refreshExpiresIn": 86400 }</code> </td> </tr> <tr> <td>Possible response codes:</td> <td> - 200 (OK): Successfully logged in.<br> - 401 (Unauthorized): Invalid credentials.<br> </td> </tr> </table> <br>

**Token Refresh**

<table> <tr> <td width="500px">API Method:</td> <td width="500px">POST</td> </tr> <tr> <td>Purpose:</td> <td>Refresh the access token using a valid refresh token.</td> </tr> <tr> <td>Accessible via:</td> <td>/api/refresh-token</td> </tr> <tr> <td>Request "header" part:</td> <td>-</td> </tr> <tr> <td>Request structure:</td> <td> <code>{ "refreshToken": "refresh_token_value" }</code> </td> </tr> <tr> <td>Response structure:</td> <td> <code>{ "message": "Token successfully refreshed", "accessToken": "new_access_token_value", "tokenType": "bearer", "expiresIn": 3600 }</code> </td> </tr> <tr> <td>Possible response codes:</td> <td> - 200 (OK): Successfully refreshed the token.<br> - 400 (Bad Request): Missing refresh token.<br> - 401 (Unauthorized): Invalid or expired refresh token.<br> - 500 (Internal Server Error): Server error while refreshing the token.<br> </td> </tr> </table> <br>

**User Logout**

<table> <tr> <td width="500px">API Method:</td> <td width="500px">POST</td> </tr> <tr> <td>Purpose:</td> <td>Logout the user by invalidating the access token.</td> </tr> <tr> <td>Accessible via:</td> <td>/api/logout</td> </tr> <tr> <td>Request "header" part:</td> <td>Authorization: Bearer {token}</td> </tr> <tr> <td>Request structure:</td> <td>-</td> </tr> <tr> <td>Response structure:</td> <td> <code>{ "message": "Successfully logged out" }</code> </td> </tr> <tr> <td>Possible response codes:</td> <td> - 200 (OK): Successfully logged out.<br> - 401 (Unauthorized): Invalid or missing token.<br> </td> </tr> </table> <br>

### 4.5 Sports Events API methods

**Get All Sports Events**

<table> <tr> <td width="500px">API Method:</td> <td width="500px">GET</td> </tr> <tr> <td>Purpose:</td> <td>Retrieve a paginated list of all sports events.</td> </tr> <tr> <td>Accessible via:</td> <td>/api/sports-events</td> </tr> <tr> <td>Request "header" part:</td> <td>-</td> </tr> <tr> <td>Request structure:</td> <td>-</td> </tr> <tr> <td>Response structure:</td> <td> <code>{ "data": [ { "id": 1, "name": "Football Match", "description": "An exciting match", "location": "Stadium A", "entry_fee": 10, "is_free": false, "start_date": "2024-12-20T10:00:00", "end_date": "2024-12-20T12:00:00", "max_participants": 100, "current_participants": 50, "users": [ ... ] } ], "links": { ... }, "meta": { ... } }</code> </td> </tr> <tr> <td>Possible response codes:</td> <td> - 200 (OK): Successfully fetched the list of sports events.<br> </td> </tr> </table> <br>

**Join a Sports Event**

<table> <tr> <td width="500px">API Method:</td> <td width="500px">POST</td> </tr> <tr> <td>Purpose:</td> <td>Join a specific sports event.</td> </tr> <tr> <td>Accessible via:</td> <td>/api/sports-events/{id}/join</td> </tr> <tr> <td>Request "header" part:</td> <td>Authorization: Bearer {token}</td> </tr> <tr> <td>Request structure:</td> <td>-</td> </tr> <tr> <td>Response structure:</td> <td> <code>{ "message": "You have successfully joined the event.", "event": { "id": 1, "name": "Football Match", "description": "An exciting match", "location": "Stadium A", "entry_fee": 10, "is_free": false, "start_date": "2024-12-20T10:00:00", "end_date": "2024-12-20T12:00:00", "max_participants": 100, "current_participants": 51, "users": [ ... ] } }</code> </td> </tr> <tr> <td>Possible response codes:</td> <td> - 200 (OK): Successfully joined the event.<br> - 400 (Bad Request): Event is already full or other issues.<br> </td> </tr> </table> <br>

**Leave a Sports Event**

<table> <tr> <td width="500px">API Method:</td> <td width="500px">POST</td> </tr> <tr> <td>Purpose:</td> <td>Leave a specific sports event.</td> </tr> <tr> <td>Accessible via:</td> <td>/api/sports-events/{id}/leave</td> </tr> <tr> <td>Request "header" part:</td> <td>Authorization: Bearer {token}</td> </tr> <tr> <td>Request structure:</td> <td>-</td> </tr> <tr> <td>Response structure:</td> <td> <code>{ "message": "You have successfully left the event.", "event": { "id": 1, "name": "Football Match", "description": "An exciting match", "location": "Stadium A", "entry_fee": 10, "is_free": false, "start_date": "2024-12-20T10:00:00", "end_date": "2024-12-20T12:00:00", "max_participants": 100, "current_participants": 49, "users": [ ... ] } }</code> </td> </tr> <tr> <td>Possible response codes:</td> <td> - 200 (OK): Successfully left the event.<br> - 400 (Bad Request): Unable to leave the event.<br> </td> </tr> </table>

### 4.5 Password Reset API methods

**Send Password Reset Link**

<table> <tr> <td width="500px">API Method:</td> <td width="500px">POST</td> </tr> <tr> <td>Purpose:</td> <td>Send a password reset link to the user's email address.</td> </tr> <tr> <td>Accessible via:</td> <td>/api/password/email</td> </tr> <tr> <td>Request "header" part:</td> <td>-</td> </tr> <tr> <td>Request structure:</td> <td> <code>{ "email": "user@example.com" }</code> </td> </tr> <tr> <td>Response structure:</td> <td> <code>{ "message": "Password reset link sent successfully" }</code> </td> </tr> <tr> <td>Possible response codes:</td> <td> - 200 (OK): Password reset link sent successfully.<br> - 400 (Bad Request): Invalid or missing email.<br> </td> </tr> </table> <br>

**Reset Password**

<table> <tr> <td width="500px">API Method:</td> <td width="500px">POST</td> </tr> <tr> <td>Purpose:</td> <td>Reset the user's password using a valid token and email.</td> </tr> <tr> <td>Accessible via:</td> <td>/api/password/reset</td> </tr> <tr> <td>Request "header" part:</td> <td>-</td> </tr> <tr> <td>Request structure:</td> <td> <code>{ "token": "reset_token", "email": "user@example.com", "password": "newpassword", "password_confirmation": "newpassword" }</code> </td> </tr> <tr> <td>Response structure:</td> <td> <code>{ "message": "Password reset successfully" }</code> </td> </tr> <tr> <td>Possible response codes:</td> <td> - 200 (OK): Password reset successfully.<br> - 400 (Bad Request): Invalid token or expired token.<br> - 404 (Not Found): User not found.<br> </td> </tr> </table>
