# GUESS WHO? GraphQL

_Guess Who?_ is a two-player character guessing game. Your goal is to find out which character your opponent (the computer) chooses by asking yes or no questions such as "Does your person wear glasses?" etc.

This implementation can be played in the GraphQL playground (`http://localhost:4000` by default). There are nine basic questions (methods) with several attributes. Boolean question (glass, hat, beard) do not require arguments. The server can be started with `npm run v2`.

---

## Question Methods

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
  name(attr: ERIC) {
    turn
    message
    personsLeft {
      name
    }
  }
}
```

Names are enums and have to be written in all caps.

---