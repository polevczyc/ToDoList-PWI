# PROJEKT: PROGRAMOWANIE W INTERNECIE

**ToDoList**

Projekt wykonany w ramach zajęć **Programowanie W Internecie** na Politechnice Gdańskiej.

ToDoList App to prosta aplikacja webowa umożliwiająca zarządzanie codziennymi zadaniami. Użytkownicy mogą dodawać, edytować, oznaczać jako ukończone oraz usuwać zadania w przejrzystym i intuicyjnym interfejsie.

### Klonowanie repozytorium:
```
git clone https://github.com/polevczyc/ToDoList-PWI.git
cd ToDoList-PWI
```

### Instalacja zależności:
- zainicjuj projekt:
```
npm init -y
```
- zainstaluj potrzebne narzędzia:
```
npm install express mongoose body-parser cors
```
- zainstaluj [Node.js](https://nodejs.org/en/download)
- zainstaluj [MongoDBCompass](https://www.mongodb.com/try/download/compass)
- otwórz **MongoDBCompass**
- utwórz bazę danych o nazwie **todolist**
- połącz się z bazą danych klikając **connect**

### Uruchomienie
- otwórz główny folder z plikami projektu
- wpisz poniższą komendę w terminalu:
```
node server.js
```

### Funkcjonalności aplikacji: ###
**Dodawanie nowych zadań:**
- Użytkownik może dodać zadanie, które automatycznie zapisuje się w bazie MongoDB.

**Przeglądanie listy zadań:**
- Zadania są podzielone na aktywne i ukończone, z możliwością ich zarządzania.

**Oznaczanie zadania jako ukończone:**
- Zadanie można oznaczyć jako ukończone, co wizualnie je wyróżnia.

**Edytowanie istniejących zadań:**
- Możliwość edycji treści zadania z aktualizacją w bazie danych.

**Usuwanie zadań:**
- Usunięte zadania są natychmiast kasowane z bazy danych.

**Filtrowanie zadań:**
- Wyszukiwanie utworzonych zadań po przypisanym do nich wcześniej hashtagu (np. #praca).

**Tworzenie kont użytkowników:**
- Możliwość tworzenia kont użytkowników i logowania, aby przechowywać listy
przypisane do konkretnego użytkownika.

## Autorzy
- **Aleksander Piszczatyn** 192575 | [GitHub](https://github.com/apiszczatyn)
- **Jakub Polewczyk** 192562 | [GitHub](https://github.com/polevczyc)

---