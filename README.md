# GUESS WHO? GraphQL

_Guess Who?_ is a two-player character guessing game. Your goal is to find out which character your opponent (the computer) chooses by asking yes or no questions such as "Does your person wear glasses?" etc.

This implementation can be played in the GraphQL playground (`http://localhost:4000` by default). There are nine basic questions (methods) with several attributes. Boolean question (glass, hat, beard) do not require arguments. The server can be started with `npm run v2`.

---

## Question methods

```javascript
hairColor(attr: BLACK)
hairColor(attr: BLOND)
hairColor(attr: BROWN)
hairColor(attr: RED)
hairColor(attr: WHITE)
```

```javascript
hairStyle(attr: BALD)
hairStyle(attr: LONG)
hairStyle(attr: SHORT)
```

```javascript
hat
```

```javascript
nose(attr: BIG)
nose(attr: SMALL)
```

```javascript
beard
```

```javascript
gender(attr: FEMALE)
gender(attr: MALE)
gender(attr: DIVERSE)
```

```javascript
glasses
```

```javascript
eyeColor(attr: BLUE)
eyeColor(attr: BROWN)
```

```javascript
mouth(attr: BIG)
mouth(attr: SMALL)
```

---

## Return values

Every question method returns a __state object__ which consists of

* __turn__ (the number of asked questions)
* __leftPersons__ (an array of characters that have not yet been eliminated)
* __message__ (the opponent's response to the question)

It is therefore necessary to define these properties as the desired response.

---

## Gameplay example

### Request

```javascript
query {
  hairColor(attr: WHITE) {
    turn
    message
    personsLeft {
      name
      hairColor
    }
  }
}
```
_"Does your person have white hair?"_

### Response

```javascript
{
  "data": {
    "hairColor": {
      "turn": 1,
      "message": "Yes, my person has white hair.",
      "personsLeft": [
        {
          "name": "George",
          "hairColor": "WHITE"
        },
        {
          "name": "Paul",
          "hairColor": "WHITE"
        },
        {
          "name": "Peter",
          "hairColor": "WHITE"
        },
        {
          "name": "Sam",
          "hairColor": "WHITE"
        },
        {
          "name": "Susan",
          "hairColor": "WHITE"
        }
      ]
    }
  }
}
```

### Request

```javascript
query {
  glasses {
    turn
    message
    personsLeft {
      name
      glasses
    }
  }
}
```
_"Does your person wear glasses?"_

### Response

```javascript
{
  "data": {
    "glasses": {
      "turn": 2,
      "message": "No, my person does not wear glasses.",
      "personsLeft": [
        {
          "name": "George",
          "glasses": false
        },
        {
          "name": "Peter",
          "glasses": false
        },
        {
          "name": "Susan",
          "glasses": false
        }
      ]
    }
  }
}
```

### Request

```javascript
query {
  gender(attr: FEMALE) {
    turn
    message
    personsLeft {
      name
      gender
    }
  }
}
```
_"Is your person female?"_

### Response

```javascript
{
  "data": {
    "gender": {
      "turn": 3,
      "message": "No, my person is not female.",
      "personsLeft": [
        {
          "name": "George",
          "gender": "MALE"
        },
        {
          "name": "Peter",
          "gender": "MALE"
        }
      ]
    }
  }
}
```

### Request

```javascript
query {
  hat {
    turn
    message
    personsLeft {
      name
      hat
    }
  }
}
```
_"Does your person wear a hat?"_

### Response

```javascript
{
  "data": {
    "hat": {
      "turn": 4,
      "message": "Congratulations! You found out that I thought of PETER in 4 turns!",
      "personsLeft": [
        {
          "name": "Peter",
          "hat": false
        }
      ]
    }
  }
}
```

---

## Guessing

It is also possible to guess a name directly:

```javascript
query {
  name(attr: "Eric") {
    turn
    message
    personsLeft {
      name
    }
  }
}
```

---

## Restart game

### Request

```javascript
query {
  restart {
    turn
    message
    personsLeft {
      name
    }
  }
}
```
### Response

```javascript
{
  "data": {
    "restart": {
      "turn": 0,
      "message": "New game.",
      "personsLeft": [
        ...
      ]
    }
  }
}
```

---

## Adding a person

`addPerson` takes a `PersonInput` object as input. `PersonInput` consists of all person properties except `id`. All fields are required. Names must be unique.

### Request

```javascript
mutation {
  addPerson(
    attr: {
      name: "Spongebob"
      hairColor: BLACK
      hairStyle: BALD
      hat: false
      nose: SMALL
      beard: false
      gender: MALE
      glasses: false
      eyeColor: BLUE
      mouth: BIG
    }
  ) {
    id
    name
    hairColor
    hairStyle
    hat
    nose
    beard
    gender
    glasses
    eyeColor
    mouth
  }
}
```
### Response

```javascript
{
  "data": {
    "addPerson": {
      "id": 25,
      "name": "Spongebob",
      "hairColor": "BLACK",
      "hairStyle": "BALD",
      "hat": false,
      "nose": "SMALL",
      "beard": false,
      "gender": "MALE",
      "glasses": false,
      "eyeColor": "BLUE",
      "mouth": "BIG"
    }
  }
}
```

---

## Deleting a person

To get rid of an unpleasant person, the `deletePerson` method must be called with a name as input. Restarting the game does not bring the deleted person back. In this case, the server must be restarted.

### Request

```javascript
mutation {
  deletePerson(attr: "Spongebob") {
    id
    name
    hairColor
    hairStyle
    hat
    nose
    beard
    gender
    glasses
    eyeColor
    mouth
  }
}
```
### Response

```javascript
{
  "data": {
    "deletePerson": {
      "id": 29,
      "name": "Spongebob",
      "hairColor": "BLACK",
      "hairStyle": "BALD",
      "hat": false,
      "nose": "SMALL",
      "beard": false,
      "gender": "MALE",
      "glasses": false,
      "eyeColor": "BLUE",
      "mouth": "BIG"
    }
  }
}
```

---

## Using fragments

Instead of defining every single property you want the server to return every time you make a request, you can use a handy tool called 'fragments'.

```javascript
fragment personFields on Person {
  id
  name
  hairColor
  hairStyle
  hat
  nose
  beard
  gender
  glasses
  eyeColor
  mouth
}
```

Fragments contain a set of properties of a given type. They can be used like this (similar to JavaScript's spread syntax):

### Request

```javascript
mutation {
  deletePerson(attr: "Spongebob") {
    ...personFields
  }
}

fragment personFields on Person {
  id
  name
  hairColor
  hairStyle
  hat
  nose
  beard
  gender
  glasses
  eyeColor
  mouth
}
```
### Response

```javascript
{
  "data": {
    "deletePerson": {
      "id": 30,
      "name": "Spongebob",
      "hairColor": "BLACK",
      "hairStyle": "BALD",
      "hat": false,
      "nose": "SMALL",
      "beard": false,
      "gender": "MALE",
      "glasses": false,
      "eyeColor": "BLUE",
      "mouth": "BIG"
    }
  }
}
```
---

## Betting on a person (Subscription)

Anytime during the game, you can bet on a person. You're informed about the result as soon as your person is either eliminated or the last one left.

### Request

```javascript
subscription {
  betOnPerson(attr: "Claire")
}
```
### Response (right choice)

```javascript
{
  "data": {
    "betOnPerson": "It's CLAIRE! You win!"
  }
}
```

### Response (wrong choice)

```javascript
{
  "data": {
    "betOnPerson": "CLAIRE has been elimiated in round 1. You lose!"
  }
}
```