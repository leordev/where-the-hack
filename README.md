## Inspiration

Everyday people get more and more connected, such as the tasks like meetings, tasks boards etc. Technologies are generating a great scenario with opportunities for remote job positions, resulting in more freelancers working on their home offices. This is really nice but in the other hand as much as people are getting connected, they also realize that they are disconnecting from physical world, missing people interactions, coffee breaks and so on. Even worse: their networking just get stuck.

So what if we adapt the Airbnb idea for home offices? Exactly! We could list our houses to bring people together to build cool stuff, improve theirselves, learn together etc. Including empowering their networking and meeting new places, motivating together to accomplish amazing things!

## What it does

It allows users to find places to work based on their geolocation, listing people and their skillset in a real-time fashion. User can reserve a spot and then checkout with review of the place. Also, from the hosts side, it allows to add and describe their places, attaching pictures and setting how many available seats.

## How I built it

We used react and react-native to build the app and compile into iOS and Android. To access and persist data we utilized Relay with GraphQL to access our Graphcool server.

## Challenges I ran into

Learn Relay and GraphQL in barely 2 weeks - yes we started the hackathon very late on Nov 04th, because of Miami Developers Circle meeting - and most of the time recur to the libraries source code itself to understand how it works.

Integrate with Facebook Login, Integrate with S3 api to submit profile and place pictures, Integrate with Google Places API for autocomplete the address upon the New Place form.

## Accomplishments that I'm proud of

Learn GraphQL and Relay in a short timeframe and be able to make an usable product! 

GraphQL Subscriptions are supercool and we could provide a real-time info for the users reservations for a place spot.

We understand that we need to refactor a lot of code and make React components more reusable, but that's what we could build in our timeframe, learning about Relay and GraphQL, also sharpening react-native skills and the very first deployment of it. 

## What I learned

React-Native, Relay, GraphQL and it's data architecture - deploy and publish a react-native app and also Expo App.

## What's next for WHERE THE HACK

- Add places fee's and payments to incentive hosts
- Keep track of Events on public places like coworking spaces and schools
- Build a ranking system to reward people and places by working time, badges to incentive people
- Integrate with other social networks like LinkedIn, GitHub and Twitter, also giving option to share Check-Ins and invite friends
- Auto checkout based on geolocation

## Installation instructions

Clone the repository and in the root folder run `npm install`

Run also `npm install relay-plugin` and put the correct path 
on `.babelrc` usually as `./node_modules/babel-plugin-relay`

Create a env.js file in the root folder of this project with
the below content:

```javascript
export default {
    AWS_S3_ACCESS_KEY : 'YOUR_S3_ACCESS_KEY',
    AWS_S3_SECRET_KEY : 'YOUR_S3_SECRET_KEY',
}
```

You can also play with some constants in `src/constants.js`. 
And also your GraphQL environment in `src/Environment.js` and 
`src/GcEnvironment.js`.

Install Expo XDE on your machine and load the root folder on it

Click in Device > iOS simulator or Android and have fun! :)