## Inspiration

AirBnB for workspaces. For groups and individuals who don't have their own office, there's no shortage of co-working spaces but a lot of times what those spaces lack is community. It's hard to connect with others around you if you're a programmer and they're accountants, for example.

Where the Hack is specifically tailored for the tech community. Developers, designers, digital marketers, etc. We want to build tools that bring this community together. Not just to hang out but to collaborate and learn from each other.

## What it does

Using your location, Where the Hack will find places for you to work nearby and events going on in the tech community you might want to know about. For places with limited space, you can reserve a spot through our app. Anyone can add a place so others know they can come in and work there. As a host you can manage your profile and spots available.

## How we built it

We used react and react-native to build both iOS and Android apps simultaneous. Set up a Graphcool server, using Relay and GraphQL to work with data.

## Challenges we ran into

Learn Relay and GraphQL in just under 2 weeks. We only found out about the event on Nov 04th at the Miami Facebook Developers Circle event. Building an understanding of how these technologies work by frequently reading the libraries source code.

Integrate with Facebook Login, S3 api to submit profile and place images and Google Places API for address autocompletion.

## Accomplishments

Learn GraphQL and Relay well enough to build a working product in a short timeframe.

GraphQL subscriptions are great! We have real-time data on what's going on in the community, what places are 'hot', etc.

Sharpening react-native skills and deploying on it for the first time.

## New for us

React-Native, Relay, GraphQL and it's data architecture - deploy and publish a react-native and Expo app.

## What's next for WHERE THE HACK

- Add places fee's and payments to incentivize hosts
- Directory of events the community wants to know about
- Build a ranking system to reward people as they log more hours and places as they host more people
- Integrate with other social networks like LinkedIn, GitHub and Twitter. 
- Share check-ins and invite friends
- Auto checkout based on geolocation

## Demo Instructions

Open [Where The Hack](https://expo.io/@leordev/where-the-hack) under
the Expo demo App from your iPhone or Android.

https://expo.io/@leordev/where-the-hack

## Installation instructions

Clone the repository in the root folder and run `npm install`

Now run `npm install relay-plugin` and set the correct path 
on `.babelrc`. Usually it's something like `./node_modules/babel-plugin-relay`

Create an env.js file in the root folder with the following content:

```javascript
export default {
    AWS_S3_ACCESS_KEY : 'YOUR_S3_ACCESS_KEY',
    AWS_S3_SECRET_KEY : 'YOUR_S3_SECRET_KEY',
}
```

You can also play with constants in `src/constants.js`
and the GraphQL environment in `src/Environment.js` and 
`src/GcEnvironment.js`.

Install Expo XDE on your machine and load the root folder.

Click in Device > iOS simulator or Android and have fun! :)
