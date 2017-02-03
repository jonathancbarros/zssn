ZSSN - Zombie Survival Social Network
================

This repository contains the solution for the problem proposed as below:

## Problem Description

The world as we know it has fallen into an apocalyptic scenario. A laboratory-made virus is transforming human beings and animals into zombies, hungry for fresh flesh.

You, as a zombie resistance member (and the last survivor who knows how to code), was designated to develop a system to share resources between non-infected humans.

## Requirements

You will develop a ***REST API*** (yes, we care about architecture design even in the midst of a zombie apocalypse!), which will store information about the survivors, as well as the resources they own.

In order to accomplish this, the API must fulfill the following use cases:

- **Add survivors to the database**

  A survivor must have a *name*, *age*, *gender* and *last location (latitude, longitude)*.

  A survivor also has an inventory of resources of their own property (which you need to declare when upon the registration of the survivor).

- **Update survivor location**

  A survivor must have the ability to update their last location, storing the new latitude/longitude pair in the base (no need to track locations, just replacing the previous one is enough).

- **Flag survivor as infected**

  In a chaotic situation like that, it's inevitable that a survivor may get contaminated by the virus.  When this happens, we need to flag the survivor as infected.

  An infected survivor cannot trade with others, can't access/manipulate their inventory, nor be listed in the reports (infected people are kinda dead anyway, see the item on reports below).

  **A survivor is marked as infected when at least three other survivors report their contamination.**

  When a survivor is infected, their inventory items become inaccessible (they cannot trade with others).

- **Survivors cannot Add/Remove items from inventory**

  Their belongings must be declared when they are first registered in the system. After that they can only change their inventory by means of trading with other survivors.

  The items allowed in the inventory are described above in the first feature.

- **Trade items**:

  Survivors can trade items among themselves.

  To do that, they must respect the price table below, where the value of an item is described in terms of points.

  Both sides of the trade should offer the same amount of points. For example, 1 Water and 1 Medication (1 x 4 + 1 x 2) is worth 6 ammunition (6 x 1) or 2 Food items (2 x 3).

  The trades themselves need not to be stored, but the items must be transferred from one survivor to the other.

| Item         | Points   |
|--------------|----------|
| 1 Water      | 4 points |
| 1 Food       | 3 points |
| 1 Medication | 2 points |
| 1 Ammunition | 1 point  |

- **Reports**

  The API must offer the following reports:

    1. Percentage of infected survivors.
    1. Percentage of non-infected survivors.
    3. Average amount of each kind of resource by survivor (e.g. 5 waters per survivor)
    4. Points lost because of infected survivor.

---------------------------------------

## Setting the environment up!

First of all, you need to have Node.js, which already comes with NPM, and MongoDB installed, it was used the following versions:

```
MongoDB v3.2.10
Node.js v6.9.1
```
Then after installing those two and already got the repository on your local git, inside the project, you are gonna run the following commands:
```
npm install
npm start
```
And you are going to have it running on **http://localhost:3000**

## API Documentation

### POST /survivors

```
POST /survivors
Content-Type: "application/json"

{
  "name": 'Rick',
  "age": 40,
  "gender": 'M',
  "latitude": 38.8951100,
  "longitude": -77.0363700,
  "water": 10,
  "ammunition": 1
}
```

##### Returns:

```
200 OK
Content-Type: "application/json"

{
  "__v": 0,
  "name": "Rick",
  "age": 40,
  "gender": "M",
  "latitude": 38.89511,
  "longitude": -77.03637,
  "_id": "580e8adf451cfc0d23c236fd",
  "ammunition": {
    "amount": 1,
    "points": 1
  },
  "medication": {
    "amount": 0,
    "points": 0
  },
  "food": {
    "amount": 0,
    "points": 0
  },
  "water": {
    "amount": 10,
    "points": 40
  },
  "isInfected": false,
  "contamination_counter": 0
}
```

##### Errors:

Error | Description
----- | ------------
400   | The server couldn't save your request + (the specific validation error)

### GET /survivors

#### Returns

```
200 OK
Content-Type: "application/json"

[
  {
    "_id": "580e8adf451cfc0d23c236fd",
    "name": "Rick",
    "age": 40,
    "gender": "M",
    "latitude": 38.89511,
    "longitude": -77.03637,
    "__v": 0,
    "ammunition": {
      "amount": 1,
      "points": 1
    },
    "medication": {
      "amount": 0,
      "points": 0
    },
    "food": {
      "amount": 0,
      "points": 0
    },
    "water": {
      "amount": 10,
      "points": 40
    },
    "isInfected": false,
    "contamination_counter": 0
  },
  {
    "_id": "580e8f0d451cfc0d23c236fe",
    "name": "Carol",
    "age": 50,
    "gender": "F",
    "latitude": 9.89511,
    "longitude": -77.03637,
    "__v": 0,
    "ammunition": {
      "amount": 150,
      "points": 150
    },
    "medication": {
      "amount": 0,
      "points": 0
    },
    "food": {
      "amount": 10,
      "points": 30
    },
    "water": {
      "amount": 5,
      "points": 20
    },
    "isInfected": false,
    "contamination_counter": 0
  }
]
```


### GET /survivors/:id

Attribute | Description
----------| -----------
id    | Survivor ID

#### Returns

```
200 Ok
Content-Type: "application/json"

{
  "_id": "580e8adf451cfc0d23c236fd",
  "name": "Rick",
  "age": 40,
  "gender": "M",
  "latitude": 38.89511,
  "longitude": -77.03637,
  "__v": 0,
  "ammunition": {
    "amount": 1,
    "points": 1
  },
  "medication": {
    "amount": 0,
    "points": 0
  },
  "food": {
    "amount": 0,
    "points": 0
  },
  "water": {
    "amount": 10,
    "points": 40
  },
  "isInfected": false,
  "contamination_counter": 0
}
```

##### Errors

Error | Description
----- | ------------
404   | Survivor Not Found

### PATCH /survivors/:id

```
PATCH /survivors/:id
Content-Type: "application/json"

{
    "latitude": 1,
    "longitude": 1
}
```
Attribute | Description
----------| -----------
id    | Survivor ID

#### Returns

```
200 Ok
Content-Type: "application/json"

{
  "_id": "580e8adf451cfc0d23c236fd",
  "name": "Rick",
  "age": 40,
  "gender": "M",
  "latitude": 1,
  "longitude": 1,
  "__v": 0,
  "ammunition": {
    "amount": 1,
    "points": 1
  },
  "medication": {
    "amount": 0,
    "points": 0
  },
  "food": {
    "amount": 0,
    "points": 0
  },
  "water": {
    "amount": 10,
    "points": 40
  },
  "isInfected": false,
  "contamination_counter": 0
}
```

##### Errors

Error | Description
----- | ------------
400   | The server couldn't save your request + (the specific validation error)
404   | Survivor Not Found


### POST /survivors/report_contamination

```
POST /survivors/report_contamination
Content-Type: "application/json"

{
  "reporter_id": "580e8adf451cfc0d23c236fd",
  "reportee_id": "580e8f0d451cfc0d23c236fe"
}
```

#### Returns
```
200 Ok
Content-Type: "application/json"

{
  "message": "Contamination reported successfully"
}
```

##### Errors

Error | Description
----- | ------------
400   | You can't report yourself as infected.
400   | You can't report the same survivor twice.
404   | Reporter not found.
404   | Reportee not found.

### POST /trades

```
POST /trades
Content-Type: "application/json"

{
   "trader_1_id": "580e8adf451cfc0d23c236fd",
   "trader_2_id": "580e8f0d451cfc0d23c236fe",
   "trader_1_resources": [
        {
            "item": "ammunition",
            "amount": 1
        },
        {
            "item": "water",
            "amount": 2
        }
    ],
    "trader_2_resources": [
        {
            "item": "ammunition",
            "amount": 9
        }
    ]
}
```
#### Returns

```
200 Ok
Content-Type: "application/json"

{
  "message": "Trade completed successfully."
}
```

##### Errors

Error | Description
----- | ------------
400   | The server can't save your request + (Trade validation error)
400   | The trade requires two different survivors.
400   | Both sides of the trade should offer the same amount of points.
400   | (Trader's name) is infected, so this operation cannot be completed.
400   | (Trader's name) does not have enough resource for this trade.
404   | (Trader's id) wasn't found.

### GET /reports/infected
Percentage of infected survivors.

```
GET reports/percentage/infected
Content-Type: "application/json"
```

#### Returns

```
200 Ok
Content-Type: "application/json"

{
  "infected": "10.00%"
}
```

### GET /reports/non-infected
Percentage of non-infected survivors.

```
GET /reports/non-infected
Content-Type: "application/json"
```

#### Returns

```
200 Ok
Content-Type: "application/json"

{
  "non_infected": "90.00%"
}
```

### GET /reports/average-resources
Average amount of each kind of resource by survivor.

```
GET /reports/average-resources
Content-Type: "application/json"
```

#### Returns

```
200 Ok
Content-Type: "application/json"

{
  "water": 26.3,
  "food": 38,
  "medication": 8,
  "ammunition": 35.1
}
```

### GET /reports/lost-points
Points lost because of infected survivor.

```
GET /reports/lost-points
Content-Type: "application/json"
```

#### Returns

```
200 Ok
Content-Type: "application/json"

{
  "lost_points": 35
}
```
